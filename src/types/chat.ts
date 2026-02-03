import { Timestamp } from 'firebase/firestore';
import { BookingStatus } from './booking';

export type MessageType =
  | 'text'
  | 'image'
  | 'system_booking_created'
  | 'system_booking_confirmed'
  | 'system_booking_paid'
  | 'system_booking_reminder'
  | 'system_booking_checkin'
  | 'system_booking_completed'
  | 'system_booking_cancelled';

export interface MessageMetadata {
  bookingStatus?: BookingStatus;
  imageSize?: { w: number; h: number };
}

export interface Message {
  id: string;
  senderId: string;         // 'system' pour messages auto
  type: MessageType;
  content: string;          // Texte ou URL image
  metadata?: MessageMetadata;
  readBy: string[];         // UIDs qui ont lu
  createdAt: Timestamp;
}

export interface ChatLastMessage {
  content: string;
  senderId: string;
  type: MessageType;
  timestamp: Timestamp;
}

export interface ChatUnreadCount {
  [userId: string]: number;
}

export interface Chat {
  id: string;
  participants: string[];           // [playerId, pnjId]
  bookingId: string;

  lastMessage: ChatLastMessage;

  unreadCount: ChatUnreadCount;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Chat list item (for display)
export interface ChatListItem {
  id: string;
  bookingId: string;
  otherParticipant: {
    id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    type: MessageType;
    timestamp: Date;
    isOwn: boolean;
  };
  unreadCount: number;
}

// Send message payload
export interface SendMessagePayload {
  chatId: string;
  content: string;
  type: 'text' | 'image';
}

// System message templates
export const SYSTEM_MESSAGE_TEMPLATES: Record<string, string> = {
  system_booking_created: 'Nouvelle demande de réservation',
  system_booking_confirmed: 'Réservation confirmée ! 🎉',
  system_booking_paid: 'Paiement reçu',
  system_booking_reminder: 'Rappel : votre rendez-vous est prévu demain',
  system_booking_checkin: 'Check-in effectué. Bonne rencontre ! 🎮',
  system_booking_completed: 'Rencontre terminée. Merci pour cette aventure ! ✨',
  system_booking_cancelled: 'Réservation annulée',
};

// Check if message is system message
export const isSystemMessage = (type: MessageType): boolean => {
  return type.startsWith('system_');
};

// Format message preview (for chat list)
export const formatMessagePreview = (message: ChatLastMessage): string => {
  if (isSystemMessage(message.type)) {
    return SYSTEM_MESSAGE_TEMPLATES[message.type] || 'Message système';
  }
  if (message.type === 'image') {
    return '📷 Photo';
  }
  return message.content;
};
