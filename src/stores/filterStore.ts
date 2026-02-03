import { create } from 'zustand';
import { PNJClass } from '../theme/types';

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'distance' | 'rating';

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  // Search
  searchQuery: string;

  // Filters
  selectedClasses: PNJClass[];
  priceRange: PriceRange;
  minRating: number;
  maxDistance: number | null; // in km, null = no limit
  availableDate: string | null; // ISO date string
  availableTimeSlot: string | null; // "HH:mm-HH:mm"
  selectedActivities: string[];

  // Sorting
  sortBy: SortOption;

  // View
  viewMode: 'list' | 'map';

  // Actions
  setSearchQuery: (query: string) => void;
  toggleClass: (pnjClass: PNJClass) => void;
  setClasses: (classes: PNJClass[]) => void;
  setPriceRange: (range: PriceRange) => void;
  setMinRating: (rating: number) => void;
  setMaxDistance: (distance: number | null) => void;
  setAvailableDate: (date: string | null) => void;
  setAvailableTimeSlot: (slot: string | null) => void;
  toggleActivity: (activityId: string) => void;
  setActivities: (activities: string[]) => void;
  setSortBy: (sort: SortOption) => void;
  setViewMode: (mode: 'list' | 'map') => void;
  resetFilters: () => void;

  // Computed
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
}

const defaultFilters = {
  searchQuery: '',
  selectedClasses: [] as PNJClass[],
  priceRange: { min: 15, max: 100 },
  minRating: 0,
  maxDistance: null,
  availableDate: null,
  availableTimeSlot: null,
  selectedActivities: [] as string[],
  sortBy: 'relevance' as SortOption,
  viewMode: 'list' as const,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...defaultFilters,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleClass: (pnjClass) =>
    set((state) => ({
      selectedClasses: state.selectedClasses.includes(pnjClass)
        ? state.selectedClasses.filter((c) => c !== pnjClass)
        : [...state.selectedClasses, pnjClass],
    })),

  setClasses: (classes) => set({ selectedClasses: classes }),

  setPriceRange: (range) => set({ priceRange: range }),

  setMinRating: (rating) => set({ minRating: rating }),

  setMaxDistance: (distance) => set({ maxDistance: distance }),

  setAvailableDate: (date) => set({ availableDate: date }),

  setAvailableTimeSlot: (slot) => set({ availableTimeSlot: slot }),

  toggleActivity: (activityId) =>
    set((state) => ({
      selectedActivities: state.selectedActivities.includes(activityId)
        ? state.selectedActivities.filter((a) => a !== activityId)
        : [...state.selectedActivities, activityId],
    })),

  setActivities: (activities) => set({ selectedActivities: activities }),

  setSortBy: (sort) => set({ sortBy: sort }),

  setViewMode: (mode) => set({ viewMode: mode }),

  resetFilters: () => set(defaultFilters),

  hasActiveFilters: () => {
    const state = get();
    return (
      state.searchQuery !== '' ||
      state.selectedClasses.length > 0 ||
      state.priceRange.min !== 15 ||
      state.priceRange.max !== 100 ||
      state.minRating > 0 ||
      state.maxDistance !== null ||
      state.availableDate !== null ||
      state.selectedActivities.length > 0
    );
  },

  getActiveFilterCount: () => {
    const state = get();
    let count = 0;
    if (state.searchQuery) count++;
    if (state.selectedClasses.length > 0) count++;
    if (state.priceRange.min !== 15 || state.priceRange.max !== 100) count++;
    if (state.minRating > 0) count++;
    if (state.maxDistance !== null) count++;
    if (state.availableDate !== null) count++;
    if (state.selectedActivities.length > 0) count++;
    return count;
  },
}));
