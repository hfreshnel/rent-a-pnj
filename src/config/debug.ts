/**
 * Debug Configuration
 *
 * Set OFFLINE_MODE to true to disable all external connections
 * and run the app with mock data for UI debugging.
 *
 * Mock data is centralized in src/mocks/
 */
export const DEBUG_CONFIG = {
  // Set to true to disable Firebase, Stripe, and other external services
  OFFLINE_MODE: true,

  // Set to true to start with a logged-in mock user
  // Set to false to test the auth flow
  START_AUTHENTICATED: true,

  // Which role to use for the mock user ('player' | 'pnj' | 'both')
  MOCK_USER_ROLE: 'player' as const,
};
