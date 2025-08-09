// Business categories
export const BUSINESS_CATEGORIES = {
  RESTAURANTS: 'restaurants',
  BARS: 'bars',
  ACTIVITIES: 'activities',
  SHOPPING: 'shopping',
  SERVICES: 'services',
  ACCOMMODATION: 'accommodation',
  TRANSPORTATION: 'transportation',
  HEALTH: 'health',
  EVENTS: 'events',
} as const;

// User roles
export const USER_ROLES = {
  TOURIST: 'TOURIST',
  BUSINESS_OWNER: 'BUSINESS_OWNER',
  ADMIN: 'ADMIN',
} as const;

// Verification tiers
export const VERIFICATION_TIERS = {
  TIER0: 'TIER0', // Unverified
  TIER1: 'TIER1', // Basic verification
  TIER2: 'TIER2', // Commercial verification
} as const;

// Verification statuses
export const VERIFICATION_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED',
} as const;

// Booking statuses
export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
  NO_SHOW: 'NO_SHOW',
} as const;

// Feature lock states
export const FEATURE_LOCK_STATES = {
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
  SUSPENDED: 'SUSPENDED',
} as const;

// Supported locales
export const LOCALES = {
  EN: 'en',
  ES: 'es',
} as const;

// Supported currencies
export const CURRENCIES = {
  MXN: 'MXN',
  USD: 'USD',
} as const;

// App configuration
export const APP_CONFIG = {
  DEFAULT_LOCALE: LOCALES.ES,
  DEFAULT_CURRENCY: CURRENCIES.MXN,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  SYNC_INTERVAL: 30 * 1000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
} as const;

// Cozumel specific constants
export const COZUMEL_BOUNDS = {
  NORTH: 20.5731,
  SOUTH: 20.2886,
  EAST: -86.7739,
  WEST: -87.0647,
  CENTER: {
    latitude: 20.4230,
    longitude: -86.9223,
  },
} as const;

// Business hours format
export const BUSINESS_HOURS_FORMAT = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
} as const;

// Rating constraints
export const RATING_CONSTRAINTS = {
  MIN: 1,
  MAX: 5,
  STEP: 0.5,
} as const;

// Search and pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;