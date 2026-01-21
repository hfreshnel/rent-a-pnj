// Re-export all types
export * from './user';
export * from './pnj';
export * from './booking';
export * from './chat';
export * from './mission';
export * from './review';
export * from './activity';
export * from './navigation';

// Common utility types
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PaginatedResponse<T> {
  data: T[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Filter types for search
export interface PNJSearchFilters {
  query?: string;
  classes?: string[];
  activities?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  maxDistance?: number;
  availableDate?: Date;
  availableTime?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'distance';
}

// Location type
export interface Location {
  latitude: number;
  longitude: number;
}
