import { z } from 'zod';

// Business validation schemas
export const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1, 'Category is required'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// User validation schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  role: z.enum(['TOURIST', 'BUSINESS_OWNER', 'ADMIN']),
  locale: z.enum(['en', 'es']).default('es'),
});

// Booking validation schemas
export const bookingSchema = z.object({
  listingId: z.string().uuid(),
  userId: z.string().uuid(),
  timeSlot: z.date(),
  duration: z.number().min(15).max(480), // 15 minutes to 8 hours
  quantity: z.number().min(1).max(20),
  notes: z.string().max(500).optional(),
});

// Review validation schemas
export const reviewSchema = z.object({
  businessId: z.string().uuid(),
  userId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().max(1000).optional(),
});

// Type guards
export function isValidEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function isValidPhoneNumber(phone: string): boolean {
  return z.string().regex(/^\+?[\d\s\-\(\)]+$/).safeParse(phone).success;
}

export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    z.number().min(-90).max(90).safeParse(lat).success &&
    z.number().min(-180).max(180).safeParse(lng).success
  );
}

// Validation helpers
export function validateBusiness(data: unknown) {
  return businessSchema.safeParse(data);
}

export function validateUser(data: unknown) {
  return userSchema.safeParse(data);
}

export function validateBooking(data: unknown) {
  return bookingSchema.safeParse(data);
}

export function validateReview(data: unknown) {
  return reviewSchema.safeParse(data);
}