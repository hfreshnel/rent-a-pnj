import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

/**
 * Triggered when a new booking is created
 * Creates chat room and sends notifications
 */
export const onBookingCreate = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snapshot, context) => {
    const booking = snapshot.data();
    const bookingId = context.params.bookingId;

    try {
      // Create chat room for this booking
      const chatData = {
        id: bookingId,
        bookingId: bookingId,
        participants: [booking.playerId, booking.pnjId],
        lastMessage: null,
        lastMessageAt: null,
        unreadCount: {
          [booking.playerId]: 0,
          [booking.pnjId]: 0,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      await db.collection('chats').doc(bookingId).set(chatData);

      // Get PNJ profile to send notification
      const pnjProfileDoc = await db.collection('pnjProfiles').doc(booking.pnjProfileId).get();
      const pnjProfile = pnjProfileDoc.data();

      if (pnjProfile) {
        // Get PNJ user for notification token
        const pnjUserDoc = await db.collection('users').doc(booking.pnjId).get();
        const pnjUser = pnjUserDoc.data();

        if (pnjUser?.fcmToken) {
          // Send push notification to PNJ
          await admin.messaging().send({
            token: pnjUser.fcmToken,
            notification: {
              title: 'Nouvelle demande de réservation !',
              body: `${booking.activity?.name || 'Une activité'} le ${formatDate(booking.date)}`,
            },
            data: {
              type: 'NEW_BOOKING',
              bookingId: bookingId,
            },
          });
        }
      }

      // Get player for notification
      const playerDoc = await db.collection('users').doc(booking.playerId).get();
      const player = playerDoc.data();

      if (player?.fcmToken) {
        // Send confirmation to player
        await admin.messaging().send({
          token: player.fcmToken,
          notification: {
            title: 'Demande envoyée !',
            body: `Ta demande de réservation a été envoyée. Tu recevras une réponse bientôt.`,
          },
          data: {
            type: 'BOOKING_SENT',
            bookingId: bookingId,
          },
        });
      }

      functions.logger.info(`Booking ${bookingId} created, chat room created and notifications sent`);

      return { success: true };
    } catch (error) {
      functions.logger.error('Error processing new booking:', error);
      return { success: false, error };
    }
  });

/**
 * Triggered when a booking is updated
 * Handles status changes and sends appropriate notifications
 */
export const onBookingUpdate = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const bookingId = context.params.bookingId;

    // Only process if status changed
    if (before.status === after.status) {
      return null;
    }

    try {
      const playerDoc = await db.collection('users').doc(after.playerId).get();
      const player = playerDoc.data();

      const pnjUserDoc = await db.collection('users').doc(after.pnjId).get();
      const pnjUser = pnjUserDoc.data();

      switch (after.status) {
        case 'confirmed':
          // PNJ accepted the booking
          if (player?.fcmToken) {
            await admin.messaging().send({
              token: player.fcmToken,
              notification: {
                title: 'Réservation acceptée !',
                body: `Ta réservation a été acceptée. Procède au paiement pour confirmer.`,
              },
              data: {
                type: 'BOOKING_CONFIRMED',
                bookingId: bookingId,
              },
            });
          }
          break;

        case 'paid':
          // Payment received
          if (pnjUser?.fcmToken) {
            await admin.messaging().send({
              token: pnjUser.fcmToken,
              notification: {
                title: 'Paiement reçu !',
                body: `Le paiement pour ta prochaine session a été reçu.`,
              },
              data: {
                type: 'BOOKING_PAID',
                bookingId: bookingId,
              },
            });
          }
          break;

        case 'completed':
          // Booking completed, update stats and award XP
          await handleBookingCompleted(bookingId, after, player, pnjUser);
          break;

        case 'cancelled':
          // Booking cancelled
          const cancelledBy = after.cancelledBy;
          const targetUser = cancelledBy === after.playerId ? pnjUser : player;
          const targetId = cancelledBy === after.playerId ? after.pnjId : after.playerId;

          if (targetUser?.fcmToken) {
            await admin.messaging().send({
              token: targetUser.fcmToken,
              notification: {
                title: 'Réservation annulée',
                body: `Une réservation a été annulée.`,
              },
              data: {
                type: 'BOOKING_CANCELLED',
                bookingId: bookingId,
              },
            });
          }
          break;

        case 'rejected':
          // PNJ rejected the booking
          if (player?.fcmToken) {
            await admin.messaging().send({
              token: player.fcmToken,
              notification: {
                title: 'Demande déclinée',
                body: `Ta demande de réservation a été déclinée.`,
              },
              data: {
                type: 'BOOKING_REJECTED',
                bookingId: bookingId,
              },
            });
          }
          break;
      }

      functions.logger.info(`Booking ${bookingId} status changed: ${before.status} -> ${after.status}`);

      return { success: true };
    } catch (error) {
      functions.logger.error('Error processing booking update:', error);
      return { success: false, error };
    }
  });

/**
 * Handle completed booking - update stats, award XP, check achievements
 */
async function handleBookingCompleted(
  bookingId: string,
  booking: FirebaseFirestore.DocumentData,
  player: FirebaseFirestore.DocumentData | undefined,
  pnjUser: FirebaseFirestore.DocumentData | undefined
) {
  const batch = db.batch();

  // Update player stats
  const playerRef = db.collection('users').doc(booking.playerId);
  batch.update(playerRef, {
    'stats.completedBookings': admin.firestore.FieldValue.increment(1),
    'stats.totalSpent': admin.firestore.FieldValue.increment(booking.totalPrice),
    xp: admin.firestore.FieldValue.increment(50), // Base XP for completing a booking
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update PNJ profile stats
  const pnjProfileRef = db.collection('pnjProfiles').doc(booking.pnjProfileId);
  batch.update(pnjProfileRef, {
    completedBookings: admin.firestore.FieldValue.increment(1),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  // Send completion notifications
  if (player?.fcmToken) {
    await admin.messaging().send({
      token: player.fcmToken,
      notification: {
        title: 'Session terminée !',
        body: `+50 XP gagné ! N'oublie pas de laisser un avis.`,
      },
      data: {
        type: 'BOOKING_COMPLETED',
        bookingId: bookingId,
      },
    });
  }

  if (pnjUser?.fcmToken) {
    await admin.messaging().send({
      token: pnjUser.fcmToken,
      notification: {
        title: 'Session terminée !',
        body: `Bravo ! Le paiement sera transféré dans 48h.`,
      },
      data: {
        type: 'BOOKING_COMPLETED',
        bookingId: bookingId,
      },
    });
  }
}

/**
 * Format Firestore timestamp to readable date
 */
function formatDate(date: admin.firestore.Timestamp | { seconds: number }): string {
  const d = 'toDate' in date ? date.toDate() : new Date(date.seconds * 1000);
  return d.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
