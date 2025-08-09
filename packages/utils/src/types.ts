import { z } from 'zod';
import { businessSchema, userSchema, bookingSchema, reviewSchema } from './validation';

// Inferred types from validation schemas
export type Business = z.infer<typeof businessSchema>;
export type User = z.infer<typeof userSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type Review = z.infer<typeof reviewSchema>;

// Utility types
export type Locale = 'en' | 'es';
export type Currency = 'MXN' | 'USD';

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Geolocation types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  location?: Coordinates;
  radius?: number; // in kilometers
  rating?: number;
  verified?: boolean;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface SortOptions {
  field: 'name' | 'rating' | 'distance' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Cache types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Feature flag types
export interface FeatureFlags {
  enableOfflineMode: boolean;
  enablePushNotifications: boolean;
  enableAdvancedSearch: boolean;
  enableBusinessVerification: boolean;
  enablePayments: boolean;
  enableAnalytics: boolean;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

// Navigation types (for type-safe navigation)
export type RootStackParamList = {
  Home: undefined;
  BusinessDetails: { businessId: string };
  BookingFlow: { listingId: string };
  Profile: undefined;
  Settings: undefined;
};

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}