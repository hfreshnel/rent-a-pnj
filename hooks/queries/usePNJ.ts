import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import {
  PNJProfile,
  CreatePNJProfileInput,
  UpdatePNJProfileInput,
  PNJCardData,
} from '@/types';
import {
  getPNJProfile,
  getPNJProfileByUserId,
  createPNJProfile,
  updatePNJProfile,
  searchPNJProfiles,
  getNearbyPNJProfiles,
  SearchPNJFilters,
} from '@/services/api/pnj';
import { useAuthStore, useFilterStore, useLocationStore } from '@/stores';

// Query keys
export const pnjKeys = {
  all: ['pnj'] as const,
  lists: () => [...pnjKeys.all, 'list'] as const,
  list: (filters: SearchPNJFilters) => [...pnjKeys.lists(), filters] as const,
  nearby: (lat: number, lng: number, distance: number) =>
    [...pnjKeys.all, 'nearby', lat, lng, distance] as const,
  details: () => [...pnjKeys.all, 'detail'] as const,
  detail: (id: string) => [...pnjKeys.details(), id] as const,
  byUser: (userId: string) => [...pnjKeys.all, 'user', userId] as const,
  current: () => [...pnjKeys.all, 'current'] as const,
};

// Get PNJ profile by ID
export function usePNJProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: pnjKeys.detail(profileId || ''),
    queryFn: () => getPNJProfile(profileId!),
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get current user's PNJ profile
export function useCurrentPNJProfile() {
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useQuery({
    queryKey: pnjKeys.current(),
    queryFn: () => getPNJProfileByUserId(firebaseUser!.uid),
    enabled: !!firebaseUser,
    staleTime: 5 * 60 * 1000,
  });
}

// Search PNJ profiles with filters
export function usePNJSearch() {
  const filters = useFilterStore();

  const searchFilters: SearchPNJFilters = {
    classes: filters.selectedClasses.length > 0 ? filters.selectedClasses : undefined,
    activities:
      filters.selectedActivities.length > 0 ? filters.selectedActivities : undefined,
    minPrice: filters.minPrice || undefined,
    maxPrice: filters.maxPrice || undefined,
    minRating: filters.minRating || undefined,
  };

  return useQuery({
    queryKey: pnjKeys.list(searchFilters),
    queryFn: () => searchPNJProfiles(searchFilters),
    staleTime: 2 * 60 * 1000,
  });
}

// Get nearby PNJ profiles
export function useNearbyPNJ(maxDistanceKm = 50) {
  const location = useLocationStore((state) => state.location);

  return useQuery({
    queryKey: pnjKeys.nearby(
      location?.coords.latitude || 0,
      location?.coords.longitude || 0,
      maxDistanceKm
    ),
    queryFn: () =>
      getNearbyPNJProfiles(
        location!.coords.latitude,
        location!.coords.longitude,
        maxDistanceKm
      ),
    enabled: !!location,
    staleTime: 2 * 60 * 1000,
  });
}

// Create PNJ profile mutation
export function useCreatePNJProfile() {
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useMutation({
    mutationFn: async (input: CreatePNJProfileInput) => {
      if (!firebaseUser) throw new Error('Not authenticated');
      return createPNJProfile(firebaseUser.uid, input);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(pnjKeys.detail(data.id), data);
      queryClient.setQueryData(pnjKeys.current(), data);
      queryClient.invalidateQueries({ queryKey: pnjKeys.lists() });
    },
  });
}

// Update PNJ profile mutation
export function useUpdatePNJProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      input,
    }: {
      profileId: string;
      input: UpdatePNJProfileInput;
    }) => {
      await updatePNJProfile(profileId, input);
      return getPNJProfile(profileId);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(pnjKeys.detail(data.id), data);
        queryClient.setQueryData(pnjKeys.current(), data);
        queryClient.invalidateQueries({ queryKey: pnjKeys.lists() });
      }
    },
  });
}

// Get featured/suggested PNJ (for home page)
export function useSuggestedPNJ(limitCount = 5) {
  return useQuery({
    queryKey: [...pnjKeys.lists(), 'suggested', limitCount],
    queryFn: () =>
      searchPNJProfiles({ verified: true, minRating: 4 }, limitCount),
    staleTime: 5 * 60 * 1000,
  });
}
