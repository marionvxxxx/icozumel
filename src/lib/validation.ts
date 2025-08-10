import { z } from 'zod';

// API validation schemas
export const businessVerificationSchema = z.object({
  businessId: z.string().uuid('Invalid business ID'),
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().optional(),
});

export const pushNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  body: z.string().min(1, 'Body is required').max(500, 'Body too long'),
  audience: z.enum(['all', 'tourists', 'business_owners']),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    radius: z.number().min(0).max(50), // km
  }).optional(),
  language: z.enum(['en', 'es']).optional(),
  data: z.record(z.string()).optional(),
});

export const businessUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().min(1).optional(),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email address').optional(),
  website: z.string().url('Invalid website URL').optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Type inference
export type BusinessVerificationRequest = z.infer<typeof businessVerificationSchema>;
export type PushNotificationRequest = z.infer<typeof pushNotificationSchema>;
export type BusinessUpdateRequest = z.infer<typeof businessUpdateSchema>;

// Validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}