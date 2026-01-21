import { Timestamp } from 'firebase/firestore';

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
  bookingStatus?: string;
  imageSize?: { w: number; h: number };
}

export interface Message {
  id: string;
  senderId: string;
  type: MessageType;
  content: string;
  metadata?: MessageMetadata;
  readBy: string[];
  createdAt: Timestamp;
}

export interface LastMessage {
  content: string;
  senderId: string;
  type: MessageType;
  timestamp: Timestamp;
}

export interface Chat {
  id: string;
  participants: string[];
  bookingId: string;
  lastMessage: LastMessage;
  unreadCount: Record<string, number>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// For display in chat list
export interface ChatPreview extends Chat {
  otherParticipant: {
    id: string;
    displayName: string;
    avatar: string;
  };
  unreadForCurrentUser: number;
}

// Input types
export interface SendMessageInput {
  chatId: string;
  type: 'text' | 'image';
  content: string;
  metadata?: MessageMetadata;
}
