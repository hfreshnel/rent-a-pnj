import {
  Booking,
  BookingStatus,
  CreateBookingInput,
  BookingWithDetails,
  PLATFORM_FEE_PERCENTAGE,
} from '@/types';
import { PNJProfile } from '@/types/pnj';
import {
  COLLECTIONS,
  getDocument,
  setDocument,
  updateDocument,
  queryDocuments,
  subscribeToDocument,
  Timestamp,
  serverTimestamp,
  createGeoPoint,
  where,
  orderBy,
  limit,
} from '@/services/firebase/firestore';
import { getPNJProfile } from './pnj';
import { getUser } from './users';

// Get booking by ID
export async function getBooking(bookingId: string): Promise<Booking | null> {
  return getDocument<Booking>(COLLECTIONS.BOOKINGS, bookingId);
}

// Get booking with participant details
export async function getBookingWithDetails(
  bookingId: string
): Promise<BookingWithDetails | null> {
  const booking = await getBooking(bookingId);
  if (!booking) return null;

  const [player, pnj] = await Promise.all([
    getUser(booking.playerId),
    getPNJProfile(booking.pnjId),
  ]);

  return {
    ...booking,
    player: player
      ? { displayName: player.displayName, avatar: player.avatar }
      : undefined,
    pnj: pnj
      ? { displayName: pnj.displayName, avatar: pnj.avatar, class: pnj.class }
      : undefined,
  };
}

// Create booking
export async function createBooking(
  playerId: string,
  input: CreateBookingInput
): Promise<Booking> {
  // Get PNJ profile to get hourly rate
  const pnjProfile = await getPNJProfile(input.pnjId);
  if (!pnjProfile) {
    throw new Error('PNJ profile not found');
  }

  const now = Timestamp.now();
  const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const chatId = `chat_${bookingId}`;

  // Calculate prices
  const hourlyRate = pnjProfile.hourlyRate;
  const totalPrice = hourlyRate * (input.duration / 60);
  const platformFee = totalPrice * PLATFORM_FEE_PERCENTAGE;
  const pnjEarnings = totalPrice - platformFee;

  // Calculate end time
  const [startHour, startMin] = input.startTime.split(':').map(Number);
  const endMinutes = startHour * 60 + startMin + input.duration;
  const endHour = Math.floor(endMinutes / 60);
  const endMin = endMinutes % 60;
  const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

  const booking: Omit<Booking, 'id'> = {
    playerId,
    pnjId: input.pnjId,
    activity: input.activity,
    location: {
      name: input.location.name,
      address: input.location.address,
      coordinates: createGeoPoint(input.location.latitude, input.location.longitude),
      placeId: input.location.placeId,
    },
    date: Timestamp.fromDate(input.date),
    startTime: input.startTime,
    duration: input.duration,
    endTime,
    hourlyRate,
    totalPrice,
    platformFee,
    pnjEarnings,
    status: 'pending',
    chatId,
    createdAt: now,
    updatedAt: now,
  };

  await setDocument(COLLECTIONS.BOOKINGS, bookingId, booking);

  // Create chat for this booking
  await setDocument(COLLECTIONS.CHATS, chatId, {
    participants: [playerId, pnjProfile.userId],
    bookingId,
    lastMessage: {
      content: 'Conversation créée',
      senderId: 'system',
      type: 'system_booking_created',
      timestamp: now,
    },
    unreadCount: {
      [playerId]: 0,
      [pnjProfile.userId]: 0,
    },
    createdAt: now,
    updatedAt: now,
  });

  return { id: bookingId, ...booking };
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  additionalData?: Partial<Booking>
): Promise<void> {
  const updateData: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
    ...additionalData,
  };

  // Add timestamps for specific statuses
  if (status === 'confirmed') {
    updateData.confirmedAt = serverTimestamp();
  } else if (status === 'completed') {
    updateData.completedAt = serverTimestamp();
  }

  await updateDocument(COLLECTIONS.BOOKINGS, bookingId, updateData);
}

// Accept booking (PNJ)
export async function acceptBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'confirmed');
}

// Reject booking (PNJ)
export async function rejectBooking(bookingId: string): Promise<void> {
  await updateBookingStatus(bookingId, 'cancelled', {
    cancelReason: 'rejected',
    cancelledBy: 'pnj',
    cancelledAt: Timestamp.now(),
  });
}

// Cancel booking
export async function cancelBooking(
  bookingId: string,
  cancelledBy: 'player' | 'pnj' | 'system',
  reason: 'player_cancel' | 'pnj_cancel' | 'no_payment' | 'no_show' | 'emergency'
): Promise<void> {
  await updateBookingStatus(bookingId, 'cancelled', {
    cancelReason: reason,
    cancelledBy,
    cancelledAt: Timestamp.now(),
  });
}

// Check in
export async function checkIn(
  bookingId: string,
  by: 'player' | 'pnj',
  latitude: number,
  longitude: number
): Promise<void> {
  await updateDocument(COLLECTIONS.BOOKINGS, bookingId, {
    status: 'ongoing',
    checkIn: {
      time: serverTimestamp(),
      location: createGeoPoint(latitude, longitude),
      by,
    },
    updatedAt: serverTimestamp(),
  });
}

// Check out
export async function checkOut(
  bookingId: string,
  by: 'player' | 'pnj'
): Promise<void> {
  await updateDocument(COLLECTIONS.BOOKINGS, bookingId, {
    status: 'completed',
    completedAt: serverTimestamp(),
    checkOut: {
      time: serverTimestamp(),
      by,
    },
    updatedAt: serverTimestamp(),
  });
}

// Get bookings for player
export async function getPlayerBookings(
  playerId: string,
  status?: BookingStatus[]
): Promise<Booking[]> {
  const constraints = [
    where('playerId', '==', playerId),
    orderBy('date', 'desc'),
    limit(50),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  return queryDocuments<Booking>(COLLECTIONS.BOOKINGS, constraints);
}

// Get bookings for PNJ
export async function getPNJBookings(
  pnjId: string,
  status?: BookingStatus[]
): Promise<Booking[]> {
  const constraints = [
    where('pnjId', '==', pnjId),
    orderBy('date', 'desc'),
    limit(50),
  ];

  if (status && status.length > 0) {
    constraints.push(where('status', 'in', status));
  }

  return queryDocuments<Booking>(COLLECTIONS.BOOKINGS, constraints);
}

// Get pending bookings for PNJ (requests)
export async function getPNJPendingBookings(pnjId: string): Promise<Booking[]> {
  return queryDocuments<Booking>(COLLECTIONS.BOOKINGS, [
    where('pnjId', '==', pnjId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
  ]);
}

// Subscribe to booking updates
export function subscribeToBooking(
  bookingId: string,
  callback: (booking: Booking | null) => void
): () => void {
  return subscribeToDocument<Booking>(COLLECTIONS.BOOKINGS, bookingId, callback);
}

// Get upcoming bookings
export async function getUpcomingBookings(
  userId: string,
  isPNJ: boolean
): Promise<Booking[]> {
  const field = isPNJ ? 'pnjId' : 'playerId';
  const now = Timestamp.now();

  return queryDocuments<Booking>(COLLECTIONS.BOOKINGS, [
    where(field, '==', userId),
    where('status', 'in', ['confirmed', 'paid']),
    where('date', '>=', now),
    orderBy('date', 'asc'),
    limit(10),
  ]);
}
