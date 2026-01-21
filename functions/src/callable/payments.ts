import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * Create a Stripe Connect account for a PNJ
 */
export const createStripeConnectAccount = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    // Get user document
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();

    if (!user) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    // Check if user is a PNJ
    if (user.role !== 'pnj' && user.role !== 'both') {
      throw new functions.https.HttpsError('permission-denied', 'Only PNJs can create Connect accounts');
    }

    // Get PNJ profile
    const pnjSnapshot = await db
      .collection('pnjProfiles')
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (pnjSnapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'PNJ profile not found');
    }

    const pnjDoc = pnjSnapshot.docs[0];
    const pnjProfile = pnjDoc.data();

    // Check if already has a Connect account
    if (pnjProfile.stripeConnectAccountId) {
      // Create account link for existing account
      const accountLink = await stripe.accountLinks.create({
        account: pnjProfile.stripeConnectAccountId,
        refresh_url: `${process.env.APP_URL}/pnj/earnings?refresh=true`,
        return_url: `${process.env.APP_URL}/pnj/earnings?success=true`,
        type: 'account_onboarding',
      });

      return { url: accountLink.url, accountId: pnjProfile.stripeConnectAccountId };
    }

    // Create new Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: user.email,
      business_type: 'individual',
      metadata: {
        firebaseUID: userId,
        pnjProfileId: pnjDoc.id,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Update PNJ profile with Connect account ID
    await pnjDoc.ref.update({
      stripeConnectAccountId: account.id,
      stripeAccountStatus: 'pending',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.APP_URL}/pnj/earnings?refresh=true`,
      return_url: `${process.env.APP_URL}/pnj/earnings?success=true`,
      type: 'account_onboarding',
    });

    functions.logger.info(`Stripe Connect account created for PNJ ${pnjDoc.id}`);

    return { url: accountLink.url, accountId: account.id };
  } catch (error) {
    functions.logger.error('Error creating Connect account:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Failed to create Connect account');
  }
});

/**
 * Create a PaymentIntent for a booking
 */
export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { bookingId } = data;

  if (!bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Booking ID is required');
  }

  const userId = context.auth.uid;

  try {
    // Get booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    const booking = bookingDoc.data();

    if (!booking) {
      throw new functions.https.HttpsError('not-found', 'Booking not found');
    }

    // Verify the user is the player
    if (booking.playerId !== userId) {
      throw new functions.https.HttpsError('permission-denied', 'Only the booking player can pay');
    }

    // Check booking status
    if (booking.status !== 'confirmed') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Booking must be confirmed before payment'
      );
    }

    // Get user for Stripe customer ID
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();

    if (!user?.stripeCustomerId) {
      throw new functions.https.HttpsError('failed-precondition', 'User has no Stripe customer');
    }

    // Get PNJ profile for Connect account
    const pnjProfileDoc = await db.collection('pnjProfiles').doc(booking.pnjProfileId).get();
    const pnjProfile = pnjProfileDoc.data();

    if (!pnjProfile?.stripeConnectAccountId) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'PNJ has not set up payments'
      );
    }

    // Calculate amounts
    const totalAmount = Math.round(booking.totalPrice * 100); // Convert to cents
    const platformFee = Math.round(totalAmount * 0.20); // 20% platform fee

    // Create PaymentIntent with transfer to Connect account
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'eur',
      customer: user.stripeCustomerId,
      automatic_payment_methods: {
        enabled: true,
      },
      transfer_data: {
        destination: pnjProfile.stripeConnectAccountId,
      },
      application_fee_amount: platformFee,
      metadata: {
        bookingId: bookingId,
        playerId: userId,
        pnjId: booking.pnjId,
        pnjProfileId: booking.pnjProfileId,
      },
      description: `PNJ Premium - ${booking.activity?.name || 'Session'}`,
    });

    // Update booking with payment intent
    await bookingDoc.ref.update({
      paymentIntentId: paymentIntent.id,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`PaymentIntent created for booking ${bookingId}`);

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      platformFee: platformFee,
    };
  } catch (error) {
    functions.logger.error('Error creating PaymentIntent:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Failed to create payment');
  }
});
