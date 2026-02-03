/**
 * Centralized mock IDs for cross-referencing consistency.
 * All mock data files import IDs from here to ensure
 * the same entity is referenced consistently everywhere.
 */
export const MOCK_IDS = {
  users: {
    currentUser: 'mock-user-123',
    player_marie: 'mock-player-marie',
    player_thomas: 'mock-player-thomas',
    player_sophie: 'mock-player-sophie',
    player_lucas: 'mock-player-lucas',
    player_emma: 'mock-player-emma',
  },
  pnjs: {
    alex: 'mock-pnj-alex',
    marie_sage: 'mock-pnj-marie-sage',
    lucas_geek: 'mock-pnj-lucas-geek',
    emma_foodie: 'mock-pnj-emma-foodie',
    thomas_bard: 'mock-pnj-thomas-bard',
  },
  bookings: {
    hiking_with_marie: 'mock-booking-1',
    climbing_with_thomas: 'mock-booking-2',
    vtt_with_sophie: 'mock-booking-3',
  },
  chats: {
    chat_marie: 'mock-chat-1',
    chat_thomas: 'mock-chat-2',
    chat_sophie: 'mock-chat-3',
    chat_lucas: 'mock-chat-4',
  },
} as const;
