import { create } from 'zustand';

export type LocationPermissionStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'restricted';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  // Current location
  currentLocation: Coordinates | null;
  lastUpdated: number | null;

  // Permission
  permissionStatus: LocationPermissionStatus;

  // Loading/Error states
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentLocation: (location: Coordinates | null) => void;
  setPermissionStatus: (status: LocationPermissionStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearLocation: () => void;

  // Helpers
  hasPermission: () => boolean;
  getDistanceTo: (target: Coordinates) => number | null;
}

// Haversine formula for calculating distance between two points
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useLocationStore = create<LocationState>((set, get) => ({
  currentLocation: null,
  lastUpdated: null,
  permissionStatus: 'undetermined',
  isLoading: false,
  error: null,

  setCurrentLocation: (location) =>
    set({
      currentLocation: location,
      lastUpdated: location ? Date.now() : null,
      error: null,
    }),

  setPermissionStatus: (status) => set({ permissionStatus: status }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error, isLoading: false }),

  clearLocation: () =>
    set({
      currentLocation: null,
      lastUpdated: null,
    }),

  hasPermission: () => get().permissionStatus === 'granted',

  getDistanceTo: (target) => {
    const current = get().currentLocation;
    if (!current) return null;
    return calculateDistance(
      current.latitude,
      current.longitude,
      target.latitude,
      target.longitude
    );
  },
}));
