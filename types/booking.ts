import { Timestamp, GeoPoint } from 'firebase/firestore';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export type CancelReason =
  | 'rejected'
  | 'player_cancel'
  | 'pnj_cancel'
  | 'no_payment'
  | 'no_show'
  | 'emergency';

export interface BookingActivity {
  id: string;
  name: string;
  category: string;
}

export interface BookingLocation {
  name: string;
  address: string;
  coordinates: GeoPoint;
  placeId?: string;
}

export interface CheckInOut {
  time: Timestamp;
  location?: GeoPoint;
  by: 'player' | 'pnj';
}

export interface Booking {
  id: string;

  // Participants
  playerId: string;
  pnjId: string;

  // Activité
  activity: BookingActivity;

  // Lieu
  location: BookingLocation;

  // Timing
  date: Timestamp;
  startTime: string;
  duration: number;
  endTime: string;

  // Prix
  hourlyRate: number;
  totalPrice: number;
  platformFee: number;
  pnjEarnings: number;

  // Status
  status: BookingStatus;
  cancelReason?: CancelReason;
  cancelledBy?: 'player' | 'pnj' | 'system';
  cancelledAt?: Timestamp;

  // Check-in/out
  checkIn?: CheckInOut;
  checkOut?: CheckInOut;

  // Paiement
  stripePaymentIntentId?: string;
  paidAt?: Timestamp;
  refundedAt?: Timestamp;
  refundAmount?: number;

  // Gamification
  missionId?: string;
  xpAwarded?: number;

  // Chat
  chatId: string;

  // Reviews
  playerReviewId?: string;
  pnjReviewId?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
}

// Form types
export interface CreateBookingInput {
  pnjId: string;
  activity: BookingActivity;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    placeId?: string;
  };
  date: Date;
  startTime: string;
  duration: number;
}

// For display
export interface BookingWithDetails extends Booking {
  player?: {
    displayName: string;
    avatar: string;
  };
  pnj?: {
    displayName: string;
    avatar: string;
    class: string;
  };
}

// Duration options in minutes
export const BOOKING_DURATIONS = [60, 120, 180, 240] as const;
export type BookingDuration = (typeof BOOKING_DURATIONS)[number];

// Platform fee percentage
export const PLATFORM_FEE_PERCENTAGE = 0.2; // 20%
