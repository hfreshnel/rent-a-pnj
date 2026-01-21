import { create } from 'zustand';
import { PNJClass } from '@/types/pnj';

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance';

interface FilterState {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Classes filter
  selectedClasses: PNJClass[];
  toggleClass: (pnjClass: PNJClass) => void;
  setClasses: (classes: PNJClass[]) => void;
  clearClasses: () => void;

  // Activities filter
  selectedActivities: string[];
  toggleActivity: (activityId: string) => void;
  setActivities: (activities: string[]) => void;
  clearActivities: () => void;

  // Price filter
  minPrice: number | null;
  maxPrice: number | null;
  setPriceRange: (min: number | null, max: number | null) => void;
  clearPriceRange: () => void;

  // Rating filter
  minRating: number | null;
  setMinRating: (rating: number | null) => void;

  // Distance filter
  maxDistance: number | null;
  setMaxDistance: (distance: number | null) => void;

  // Availability filter
  availableDate: Date | null;
  availableTime: string | null;
  setAvailability: (date: Date | null, time: string | null) => void;
  clearAvailability: () => void;

  // Sort
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  // View mode
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;

  // Utilities
  hasActiveFilters: () => boolean;
  clearAllFilters: () => void;
  getFilterCount: () => number;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Classes
  selectedClasses: [],
  toggleClass: (pnjClass) => {
    const { selectedClasses } = get();
    if (selectedClasses.includes(pnjClass)) {
      set({ selectedClasses: selectedClasses.filter((c) => c !== pnjClass) });
    } else {
      set({ selectedClasses: [...selectedClasses, pnjClass] });
    }
  },
  setClasses: (classes) => set({ selectedClasses: classes }),
  clearClasses: () => set({ selectedClasses: [] }),

  // Activities
  selectedActivities: [],
  toggleActivity: (activityId) => {
    const { selectedActivities } = get();
    if (selectedActivities.includes(activityId)) {
      set({
        selectedActivities: selectedActivities.filter((a) => a !== activityId),
      });
    } else {
      set({ selectedActivities: [...selectedActivities, activityId] });
    }
  },
  setActivities: (activities) => set({ selectedActivities: activities }),
  clearActivities: () => set({ selectedActivities: [] }),

  // Price
  minPrice: null,
  maxPrice: null,
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
  clearPriceRange: () => set({ minPrice: null, maxPrice: null }),

  // Rating
  minRating: null,
  setMinRating: (rating) => set({ minRating: rating }),

  // Distance
  maxDistance: null,
  setMaxDistance: (distance) => set({ maxDistance: distance }),

  // Availability
  availableDate: null,
  availableTime: null,
  setAvailability: (date, time) =>
    set({ availableDate: date, availableTime: time }),
  clearAvailability: () => set({ availableDate: null, availableTime: null }),

  // Sort
  sortBy: 'relevance',
  setSortBy: (sort) => set({ sortBy: sort }),

  // View mode
  viewMode: 'list',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Utilities
  hasActiveFilters: () => {
    const state = get();
    return (
      state.searchQuery.length > 0 ||
      state.selectedClasses.length > 0 ||
      state.selectedActivities.length > 0 ||
      state.minPrice !== null ||
      state.maxPrice !== null ||
      state.minRating !== null ||
      state.maxDistance !== null ||
      state.availableDate !== null
    );
  },

  clearAllFilters: () => {
    set({
      searchQuery: '',
      selectedClasses: [],
      selectedActivities: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      maxDistance: null,
      availableDate: null,
      availableTime: null,
      sortBy: 'relevance',
    });
  },

  getFilterCount: () => {
    const state = get();
    let count = 0;

    if (state.selectedClasses.length > 0) count++;
    if (state.selectedActivities.length > 0) count++;
    if (state.minPrice !== null || state.maxPrice !== null) count++;
    if (state.minRating !== null) count++;
    if (state.maxDistance !== null) count++;
    if (state.availableDate !== null) count++;

    return count;
  },
}));
