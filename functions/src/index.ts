import * as admin from 'firebase-admin';

admin.initializeApp();

// Auth triggers
export { onUserCreate, onUserDelete } from './triggers/auth';

// Booking triggers
export { onBookingCreate, onBookingUpdate } from './triggers/bookings';

// Stripe webhooks
export { stripeWebhook } from './webhooks/stripe';

// Scheduled functions
export { assignDailyMissions, resetWeeklyMissions } from './scheduled/missions';

// Callable functions
export { createStripeConnectAccount, createPaymentIntent } from './callable/payments';
