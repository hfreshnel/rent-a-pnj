/**
 * Stripe Integration Service
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Stripe account: https://dashboard.stripe.com/register
 * 2. Enable Stripe Connect for marketplace functionality
 * 3. Get your publishable key from the Stripe Dashboard
 * 4. Install @stripe/stripe-react-native (requires native setup)
 *
 * For React Native/Expo:
 * - Run: npx expo install @stripe/stripe-react-native
 * - Follow the setup guide: https://docs.stripe.com/payments/accept-a-payment?platform=react-native
 *
 * Note: Stripe requires native module configuration for iOS and Android
 * This file provides placeholder functions and types
 */

// Stripe configuration from environment variables
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_CONNECT_CLIENT_ID = process.env.STRIPE_CONNECT_CLIENT_ID || '';

// Platform fee percentage (20%)
export const PLATFORM_FEE_PERCENTAGE = 0.20;

// Check if Stripe is configured
export const isStripeConfigured = Boolean(STRIPE_PUBLISHABLE_KEY);

/**
 * Payment Intent types
 */
export interface CreatePaymentIntentParams {
  amount: number; // In cents
  currency: string;
  customerId?: string;
  pnjConnectAccountId: string; // Stripe Connect account
  bookingId: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Connect Account types
 */
export interface CreateConnectAccountParams {
  email: string;
  userId: string;
  country?: string;
}

export interface ConnectAccountResult {
  accountId: string;
  onboardingUrl: string;
}

/**
 * Create a payment intent (requires Cloud Function)
 *
 * This should call your Firebase Cloud Function that creates
 * the payment intent on the server side with the secret key.
 *
 * Example Cloud Function:
 * ```typescript
 * exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 *
 *   const paymentIntent = await stripe.paymentIntents.create({
 *     amount: data.amount,
 *     currency: data.currency,
 *     customer: data.customerId,
 *     application_fee_amount: Math.round(data.amount * 0.20),
 *     transfer_data: {
 *       destination: data.pnjConnectAccountId,
 *     },
 *     metadata: {
 *       bookingId: data.bookingId,
 *     },
 *   });
 *
 *   return {
 *     clientSecret: paymentIntent.client_secret,
 *     paymentIntentId: paymentIntent.id,
 *   };
 * });
 * ```
 */
export const createPaymentIntent = async (
  _params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> => {
  if (!isStripeConfigured) {
    throw new Error('Stripe is not configured. Please update the publishable key.');
  }

  // TODO: Call your Cloud Function here
  // const result = await functions().httpsCallable('createPaymentIntent')(params);
  // return result.data;

  throw new Error('createPaymentIntent: Cloud Function not implemented');
};

/**
 * Create a Stripe Connect account for PNJ (requires Cloud Function)
 *
 * Example Cloud Function:
 * ```typescript
 * exports.createConnectAccount = functions.https.onCall(async (data, context) => {
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 *
 *   const account = await stripe.accounts.create({
 *     type: 'express',
 *     email: data.email,
 *     capabilities: {
 *       card_payments: { requested: true },
 *       transfers: { requested: true },
 *     },
 *     metadata: {
 *       userId: data.userId,
 *     },
 *   });
 *
 *   const accountLink = await stripe.accountLinks.create({
 *     account: account.id,
 *     refresh_url: 'your-app://stripe-refresh',
 *     return_url: 'your-app://stripe-return',
 *     type: 'account_onboarding',
 *   });
 *
 *   return {
 *     accountId: account.id,
 *     onboardingUrl: accountLink.url,
 *   };
 * });
 * ```
 */
export const createConnectAccount = async (
  _params: CreateConnectAccountParams
): Promise<ConnectAccountResult> => {
  if (!isStripeConfigured) {
    throw new Error('Stripe is not configured. Please update the publishable key.');
  }

  // TODO: Call your Cloud Function here
  // const result = await functions().httpsCallable('createConnectAccount')(params);
  // return result.data;

  throw new Error('createConnectAccount: Cloud Function not implemented');
};

/**
 * Refund a payment (requires Cloud Function)
 */
export const refundPayment = async (
  _paymentIntentId: string,
  _amount?: number // Partial refund amount in cents
): Promise<void> => {
  if (!isStripeConfigured) {
    throw new Error('Stripe is not configured');
  }

  // TODO: Call your Cloud Function here
  throw new Error('refundPayment: Cloud Function not implemented');
};

/**
 * Calculate payment breakdown
 */
export const calculatePaymentBreakdown = (totalPrice: number) => {
  const platformFee = Math.round(totalPrice * PLATFORM_FEE_PERCENTAGE);
  const pnjEarnings = totalPrice - platformFee;

  return {
    totalPrice,
    platformFee,
    pnjEarnings,
    // Convert to cents for Stripe
    totalPriceCents: totalPrice * 100,
    platformFeeCents: platformFee * 100,
    pnjEarningsCents: pnjEarnings * 100,
  };
};

/**
 * Format price for display
 */
export const formatPrice = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
};
