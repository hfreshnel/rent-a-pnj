import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Stripe webhook handler for payment events
 */
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).send('Missing stripe-signature header');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    functions.logger.error('Webhook signature verification failed:', err);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'account.updated':
        await handleConnectAccountUpdated(event.data.object as Stripe.Account);
        break;

      case 'transfer.created':
        await handleTransferCreated(event.data.object as Stripe.Transfer);
        break;

      default:
        functions.logger.info(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    functions.logger.error('Error processing webhook:', error);
    res.status(500).send('Webhook processing failed');
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;

  if (!bookingId) {
    functions.logger.warn('PaymentIntent without bookingId:', paymentIntent.id);
    return;
  }

  // Update booking status to paid
  await db.collection('bookings').doc(bookingId).update({
    status: 'paid',
    paymentIntentId: paymentIntent.id,
    paidAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Create transaction record
  const booking = (await db.collection('bookings').doc(bookingId).get()).data();

  if (booking) {
    await db.collection('transactions').add({
      bookingId: bookingId,
      playerId: booking.playerId,
      pnjId: booking.pnjId,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      platformFee: Math.round((paymentIntent.amount * 0.20) / 100), // 20% platform fee
      pnjPayout: Math.round((paymentIntent.amount * 0.80) / 100), // 80% to PNJ
      status: 'completed',
      stripePaymentIntentId: paymentIntent.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  functions.logger.info(`Payment succeeded for booking ${bookingId}`);
}

/**
 * Handle failed payment
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId;

  if (!bookingId) {
    return;
  }

  // Update booking with payment failure info
  await db.collection('bookings').doc(bookingId).update({
    paymentError: paymentIntent.last_payment_error?.message || 'Payment failed',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Get player to send notification
  const booking = (await db.collection('bookings').doc(bookingId).get()).data();

  if (booking) {
    const playerDoc = await db.collection('users').doc(booking.playerId).get();
    const player = playerDoc.data();

    if (player?.fcmToken) {
      await admin.messaging().send({
        token: player.fcmToken,
        notification: {
          title: 'Paiement échoué',
          body: 'Le paiement n\'a pas pu être traité. Réessaie avec un autre moyen de paiement.',
        },
        data: {
          type: 'PAYMENT_FAILED',
          bookingId: bookingId,
        },
      });
    }
  }

  functions.logger.info(`Payment failed for booking ${bookingId}`);
}

/**
 * Handle refund
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId = charge.payment_intent as string;

  // Find booking by payment intent
  const bookingsSnapshot = await db
    .collection('bookings')
    .where('paymentIntentId', '==', paymentIntentId)
    .limit(1)
    .get();

  if (bookingsSnapshot.empty) {
    return;
  }

  const bookingDoc = bookingsSnapshot.docs[0];
  const booking = bookingDoc.data();

  // Update booking status
  await bookingDoc.ref.update({
    status: 'refunded',
    refundedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Update transaction record
  const transactionsSnapshot = await db
    .collection('transactions')
    .where('bookingId', '==', bookingDoc.id)
    .limit(1)
    .get();

  if (!transactionsSnapshot.empty) {
    await transactionsSnapshot.docs[0].ref.update({
      status: 'refunded',
      refundedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  functions.logger.info(`Charge refunded for booking ${bookingDoc.id}`);
}

/**
 * Handle Connect account updates (for PNJ payouts)
 */
async function handleConnectAccountUpdated(account: Stripe.Account) {
  const userId = account.metadata?.firebaseUID;

  if (!userId) {
    return;
  }

  // Find PNJ profile by userId
  const pnjSnapshot = await db
    .collection('pnjProfiles')
    .where('userId', '==', userId)
    .limit(1)
    .get();

  if (pnjSnapshot.empty) {
    return;
  }

  const pnjDoc = pnjSnapshot.docs[0];

  // Update PNJ profile with Stripe status
  await pnjDoc.ref.update({
    stripeAccountStatus: account.charges_enabled ? 'active' : 'pending',
    stripePayoutsEnabled: account.payouts_enabled,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  functions.logger.info(`Connect account updated for PNJ ${pnjDoc.id}`);
}

/**
 * Handle transfer to PNJ (payout)
 */
async function handleTransferCreated(transfer: Stripe.Transfer) {
  const bookingId = transfer.metadata?.bookingId;

  if (!bookingId) {
    return;
  }

  // Update transaction with transfer info
  const transactionsSnapshot = await db
    .collection('transactions')
    .where('bookingId', '==', bookingId)
    .limit(1)
    .get();

  if (!transactionsSnapshot.empty) {
    await transactionsSnapshot.docs[0].ref.update({
      stripeTransferId: transfer.id,
      transferredAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  functions.logger.info(`Transfer created for booking ${bookingId}`);
}
