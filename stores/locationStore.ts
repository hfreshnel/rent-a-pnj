import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
  // State
  location: Location.LocationObject | null;
  address: string | null;
  permissionStatus: Location.PermissionStatus | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<Location.LocationObject | null>;
  reverseGeocode: (latitude: number, longitude: number) => Promise<string | null>;
  watchLocation: () => () => void;
  setLocation: (location: Location.LocationObject | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
  // Initial state
  location: null,
  address: null,
  permissionStatus: null,
  isLoading: false,
  error: null,

  // Request location permission
  requestPermission: async () => {
    set({ isLoading: true, error: null });
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      set({ permissionStatus: status, isLoading: false });
      return status === 'granted';
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erreur de permission';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  // Get current location
  getCurrentLocation: async () => {
    const { permissionStatus } = get();

    if (permissionStatus !== 'granted') {
      const granted = await get().requestPermission();
      if (!granted) {
        set({ error: 'Permission de localisation refusée' });
        return null;
      }
    }

    set({ isLoading: true, error: null });
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      set({ location, isLoading: false });

      // Also get address
      const address = await get().reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );
      set({ address });

      return location;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erreur lors de la récupération de la position';
      set({ error: errorMessage, isLoading: false });
      return null;
    }
  },

  // Reverse geocode coordinates to address
  reverseGeocode: async (latitude, longitude) => {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const { street, city, postalCode, country } = results[0];
        const parts = [street, city, postalCode, country].filter(Boolean);
        return parts.join(', ');
      }
      return null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  },

  // Watch location changes
  watchLocation: () => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { permissionStatus } = get();

      if (permissionStatus !== 'granted') {
        const granted = await get().requestPermission();
        if (!granted) return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          set({ location });
        }
      );
    })();

    // Return cleanup function
    return () => {
      subscription?.remove();
    };
  },

  // Setters
  setLocation: (location) => set({ location }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Helper to calculate distance between two points (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
