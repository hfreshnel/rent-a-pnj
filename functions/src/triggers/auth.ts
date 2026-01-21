import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * Triggered when a new user is created in Firebase Auth
 * Creates user document and Stripe customer
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  try {
    // Create Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email: email || undefined,
      name: displayName || undefined,
      metadata: {
        firebaseUID: uid,
      },
    });

    // Create user document in Firestore
    const userDoc: Record<string, unknown> = {
      id: uid,
      email: email || null,
      displayName: displayName || null,
      avatar: photoURL || null,
      role: null, // Will be set during onboarding
      stripeCustomerId: stripeCustomer.id,
      xp: 0,
      level: 1,
      stats: {
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0,
        uniquePNJsMet: 0,
        favoriteClass: null,
      },
      missions: {
        daily: [],
        weekly: [],
        dailyLastReset: admin.firestore.FieldValue.serverTimestamp(),
        weeklyLastReset: admin.firestore.FieldValue.serverTimestamp(),
      },
      souvenirs: [],
      favorites: [],
      blockedUsers: [],
      settings: {
        notifications: {
          bookings: true,
          messages: true,
          missions: true,
          marketing: false,
        },
        privacy: {
          showOnlineStatus: true,
          showLastSeen: true,
        },
        language: 'fr',
      },
      onboardingCompleted: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(uid).set(userDoc);

    functions.logger.info(`User ${uid} created with Stripe customer ${stripeCustomer.id}`);

    return { success: true };
  } catch (error) {
    functions.logger.error('Error creating user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user');
  }
});

/**
 * Triggered when a user is deleted from Firebase Auth
 * Cleans up user data and Stripe customer
 */
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;

  try {
    // Get user document to retrieve Stripe customer ID
    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.data();

    if (userData?.stripeCustomerId) {
      // Delete Stripe customer
      await stripe.customers.del(userData.stripeCustomerId);
    }

    // Delete user document
    await db.collection('users').doc(uid).delete();

    // Delete PNJ profile if exists
    const pnjSnapshot = await db.collection('pnjProfiles').where('userId', '==', uid).get();
    if (!pnjSnapshot.empty) {
      const batch = db.batch();
      pnjSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }

    // Note: In production, you might want to:
    // - Cancel active bookings
    // - Archive chat messages
    // - Remove from other users' favorites
    // - Delete uploaded files from Storage

    functions.logger.info(`User ${uid} deleted`);

    return { success: true };
  } catch (error) {
    functions.logger.error('Error deleting user:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user');
  }
});
