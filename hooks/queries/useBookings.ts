import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Booking,
  BookingStatus,
  CreateBookingInput,
  BookingWithDetails,
} from '@/types';
import {
  getBooking,
  getBookingWithDetails,
  createBooking,
  getPlayerBookings,
  getPNJBookings,
  getPNJPendingBookings,
  getUpcomingBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
  checkIn,
  checkOut,
  subscribeToBooking,
} from '@/services/api/bookings';
import { useAuthStore } from '@/stores';

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  listPlayer: (playerId: string, status?: BookingStatus[]) =>
    [...bookingKeys.lists(), 'player', playerId, status] as const,
  listPNJ: (pnjId: string, status?: BookingStatus[]) =>
    [...bookingKeys.lists(), 'pnj', pnjId, status] as const,
  pending: (pnjId: string) => [...bookingKeys.lists(), 'pending', pnjId] as const,
  upcoming: (userId: string, isPNJ: boolean) =>
    [...bookingKeys.lists(), 'upcoming', userId, isPNJ] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

// Get booking by ID
export function useBooking(bookingId: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId || ''),
    queryFn: () => getBookingWithDetails(bookingId!),
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000,
  });
}

// Subscribe to booking updates (real-time)
export function useBookingSubscription(
  bookingId: string | undefined,
  onUpdate?: (booking: Booking | null) => void
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!bookingId) return;

    const unsubscribe = subscribeToBooking(bookingId, (booking) => {
      queryClient.setQueryData(bookingKeys.detail(bookingId), booking);
      onUpdate?.(booking);
    });

    return unsubscribe;
  }, [bookingId, queryClient, onUpdate]);
}

// Get player bookings
export function usePlayerBookings(status?: BookingStatus[]) {
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useQuery({
    queryKey: bookingKeys.listPlayer(firebaseUser?.uid || '', status),
    queryFn: () => getPlayerBookings(firebaseUser!.uid, status),
    enabled: !!firebaseUser,
    staleTime: 1 * 60 * 1000,
  });
}

// Get PNJ bookings
export function usePNJBookings(pnjId: string | undefined, status?: BookingStatus[]) {
  return useQuery({
    queryKey: bookingKeys.listPNJ(pnjId || '', status),
    queryFn: () => getPNJBookings(pnjId!, status),
    enabled: !!pnjId,
    staleTime: 1 * 60 * 1000,
  });
}

// Get PNJ pending bookings (requests)
export function usePNJPendingBookings(pnjId: string | undefined) {
  return useQuery({
    queryKey: bookingKeys.pending(pnjId || ''),
    queryFn: () => getPNJPendingBookings(pnjId!),
    enabled: !!pnjId,
    staleTime: 30 * 1000, // 30 seconds for pending requests
  });
}

// Get upcoming bookings
export function useUpcomingBookings(isPNJ = false) {
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useQuery({
    queryKey: bookingKeys.upcoming(firebaseUser?.uid || '', isPNJ),
    queryFn: () => getUpcomingBookings(firebaseUser!.uid, isPNJ),
    enabled: !!firebaseUser,
    staleTime: 1 * 60 * 1000,
  });
}

// Create booking mutation
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!firebaseUser) throw new Error('Not authenticated');
      return createBooking(firebaseUser.uid, input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(bookingKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

// Accept booking mutation
export function useAcceptBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptBooking,
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

// Reject booking mutation
export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectBooking,
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

// Cancel booking mutation
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      cancelledBy,
      reason,
    }: {
      bookingId: string;
      cancelledBy: 'player' | 'pnj';
      reason: 'player_cancel' | 'pnj_cancel';
    }) => {
      await cancelBooking(bookingId, cancelledBy, reason);
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

// Check in mutation
export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      by,
      latitude,
      longitude,
    }: {
      bookingId: string;
      by: 'player' | 'pnj';
      latitude: number;
      longitude: number;
    }) => {
      await checkIn(bookingId, by, latitude, longitude);
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}

// Check out mutation
export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookingId,
      by,
    }: {
      bookingId: string;
      by: 'player' | 'pnj';
    }) => {
      await checkOut(bookingId, by);
    },
    onSuccess: (_, { bookingId }) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
}
