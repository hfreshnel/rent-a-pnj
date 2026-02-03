import { Timestamp, GeoPoint } from 'firebase/firestore';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export type CancelReason =
  | 'rejected'        // PNJ a refusé
  | 'player_cancel'   // Joueur a annulé
  | 'pnj_cancel'      // PNJ a annulé
  | 'no_payment'      // Pas de paiement dans les délais
  | 'no_show'         // Absent au RDV
  | 'emergency';      // Urgence signalée

export interface BookingActivity {
  id: string;
  name: string;
  category: string;
}

export interface BookingLocation {
  name: string;           // "Café des Arts"
  address: string;        // "12 rue de la Paix, 75001 Paris"
  coordinates: GeoPoint;
  placeId?: string;       // Google Places ID
}

export interface CheckInOut {
  time: Timestamp;
  location: GeoPoint;
  by: 'player' | 'pnj';
}

export interface Booking {
  id: string;

  // Participants
  playerId: string;
  pnjId: string;

  // Player info (denormalized for display)
  playerName: string;
  playerAvatar?: string;

  // PNJ info (denormalized for display)
  pnjName: string;
  pnjAvatar?: string;
  pnjClass: string;

  // Activité
  activity: BookingActivity;

  // Lieu
  location: BookingLocation;

  // Timing
  date: Timestamp;          // Date du RDV
  startTime: string;        // "14:00"
  duration: number;         // En minutes (60, 120, 180, 240)
  endTime: string;          // Calculé

  // Prix
  hourlyRate: number;       // Tarif PNJ au moment du booking
  totalPrice: number;       // hourlyRate * (duration/60)
  platformFee: number;      // Commission (20%)
  pnjEarnings: number;      // totalPrice - platformFee

  // Status
  status: BookingStatus;
  cancelReason?: CancelReason;
  cancelledBy?: 'player' | 'pnj' | 'system';
  cancelledAt?: Timestamp;

  // Check-in/out
  checkIn?: CheckInOut;
  checkOut?: {
    time: Timestamp;
    by: 'player' | 'pnj';
  };

  // Paiement
  stripePaymentIntentId?: string;
  paidAt?: Timestamp;
  refundedAt?: Timestamp;
  refundAmount?: number;

  // Gamification
  missionId?: string;       // Si booking lié à une mission
  xpAwarded?: number;       // XP donné à la complétion

  // Chat
  chatId: string;           // Référence vers le chat

  // Reviews
  playerReviewId?: string;
  pnjReviewId?: string;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
}

// Create booking payload
export interface CreateBookingPayload {
  pnjId: string;
  activity: BookingActivity;
  location: {
    name: string;
    address: string;
    coordinates: { latitude: number; longitude: number };
    placeId?: string;
  };
  date: Date;
  startTime: string;
  duration: number;
}

// Booking duration options
export const BOOKING_DURATIONS = [
  { value: 60, label: '1 heure' },
  { value: 120, label: '2 heures' },
  { value: 180, label: '3 heures' },
  { value: 240, label: '4 heures' },
];

// Platform fee percentage
export const PLATFORM_FEE_PERCENTAGE = 0.20; // 20%

// Calculate booking price
export const calculateBookingPrice = (hourlyRate: number, durationMinutes: number) => {
  const totalPrice = hourlyRate * (durationMinutes / 60);
  const platformFee = totalPrice * PLATFORM_FEE_PERCENTAGE;
  const pnjEarnings = totalPrice - platformFee;
  return { totalPrice, platformFee, pnjEarnings };
};

// Booking status display info
export const BOOKING_STATUS_INFO: Record<BookingStatus, { label: string; color: string }> = {
  pending: { label: 'En attente', color: 'warning' },
  confirmed: { label: 'Confirmé', color: 'info' },
  paid: { label: 'Payé', color: 'success' },
  ongoing: { label: 'En cours', color: 'primary' },
  completed: { label: 'Terminé', color: 'success' },
  cancelled: { label: 'Annulé', color: 'danger' },
};
