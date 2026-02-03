import { Message } from '../types/chat';
import { MOCK_IDS } from './ids';

// ──────────────────────────────────────
// Chat participant (chat/[id].tsx header)
// ──────────────────────────────────────

export interface MockChatParticipant {
  id: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
}

export const MOCK_CHAT_PARTICIPANT: MockChatParticipant = {
  id: MOCK_IDS.users.player_marie,
  name: 'Marie',
  avatar: null,
  isOnline: true,
};

// ──────────────────────────────────────
// Chat messages
// Uses the Message type as consumed by components
// (chatId, Date-based createdAt, read boolean)
// TODO: Align with formal src/types/chat.ts Message type
// ──────────────────────────────────────

export const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    chatId: MOCK_IDS.chats.chat_marie,
    senderId: 'system',
    content: 'Conversation démarrée',
    type: 'system',
    createdAt: new Date('2024-01-24T10:00:00'),
    read: true,
  },
  {
    id: '2',
    chatId: MOCK_IDS.chats.chat_marie,
    senderId: MOCK_IDS.users.player_marie,
    content: 'Salut ! J\'ai vu ton profil et j\'aimerais réserver une randonnée avec toi 🥾',
    type: 'text',
    createdAt: new Date('2024-01-24T10:02:00'),
    read: true,
  },
  {
    id: '3',
    chatId: MOCK_IDS.chats.chat_marie,
    senderId: 'me',
    content: 'Hey ! Avec plaisir, tu veux faire ça quand ?',
    type: 'text',
    createdAt: new Date('2024-01-24T10:05:00'),
    read: true,
  },
  {
    id: '4',
    chatId: MOCK_IDS.chats.chat_marie,
    senderId: MOCK_IDS.users.player_marie,
    content: 'Je pensais à demain après-midi si tu es dispo ?',
    type: 'text',
    createdAt: new Date('2024-01-24T10:08:00'),
    read: true,
  },
  {
    id: '5',
    chatId: MOCK_IDS.chats.chat_marie,
    senderId: 'me',
    content: 'Demain ça me va ! On dit 14h au départ du sentier du Bois de Vincennes ?',
    type: 'text',
    createdAt: new Date('2024-01-24T10:10:00'),
    read: true,
  },
  {
    id: '6',
    chatId: MOCK_IDS.chats.chat_marie,
    senderId: MOCK_IDS.users.player_marie,
    content: 'Super, à demain alors ! 👋',
    type: 'text',
    createdAt: new Date('2024-01-24T14:32:00'),
    read: false,
  },
] as unknown as Message[];

// ──────────────────────────────────────
// Chat list (chats/index.tsx)
// ──────────────────────────────────────

export interface MockChatListItem {
  id: string;
  participantName: string;
  participantAvatar: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

export const MOCK_CHAT_LIST: MockChatListItem[] = [
  {
    id: MOCK_IDS.chats.chat_marie,
    participantName: 'Marie',
    participantAvatar: null,
    lastMessage: 'Super, à demain alors ! 👋',
    lastMessageTime: '14:32',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: MOCK_IDS.chats.chat_thomas,
    participantName: 'Thomas',
    participantAvatar: null,
    lastMessage: 'Tu es disponible samedi ?',
    lastMessageTime: 'Hier',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: MOCK_IDS.chats.chat_sophie,
    participantName: 'Sophie',
    participantAvatar: null,
    lastMessage: 'Merci pour cette super session !',
    lastMessageTime: 'Lun',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: MOCK_IDS.chats.chat_lucas,
    participantName: 'Lucas',
    participantAvatar: null,
    lastMessage: 'D\'accord, je te confirme rapidement',
    lastMessageTime: '20 Jan',
    unreadCount: 0,
    isOnline: false,
  },
];
