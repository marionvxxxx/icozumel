import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for mobile app operations
export async function getVerifiedBusinesses(filters?: {
  category?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}) {
  let query = supabase
    .from('businesses')
    .select(`
      id,
      name,
      description,
      category,
      latitude,
      longitude,
      address,
      phone,
      website,
      hours,
      tags,
      images,
      verifiedTier,
      featured,
      reviews:reviews(rating)
    `)
    .neq('verifiedTier', 'TIER0')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  // Note: Geographic filtering would be implemented with PostGIS functions
  // For now, we'll fetch all and filter client-side for simplicity

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch businesses: ${error.message}`);
  }
  
  return data?.map(business => ({
    ...business,
    rating: business.reviews.length > 0 
      ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length 
      : 0,
  })) || [];
}

export async function getUserBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      status,
      timeSlot,
      duration,
      quantity,
      totalAmount,
      currency,
      notes,
      createdAt,
      listing:listings(
        id,
        title,
        type,
        business:businesses(
          id,
          name,
          category,
          images
        )
      )
    `)
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }
  
  return data || [];
}

export async function createBooking(bookingData: {
  listingId: string;
  timeSlot?: string;
  duration?: number;
  quantity: number;
  totalAmount: number;
  notes?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create booking');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingData,
      userId: user.id,
      status: 'PENDING',
      currency: 'MXN',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
  
  return data;
}

export async function createReview(reviewData: {
  businessId: string;
  rating: number;
  title?: string;
  content?: string;
  images?: string[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create review');
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...reviewData,
      userId: user.id,
      images: reviewData.images || [],
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create review: ${error.message}`);
  }
  
  return data;
}

export async function getBusinessReviews(businessId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      title,
      content,
      images,
      helpful,
      createdAt,
      user:users(id, email)
    `)
    .eq('businessId', businessId)
    .order('createdAt', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch reviews: ${error.message}`);
  }
  
  return data || [];
}

export async function submitBusinessVerification(businessId: string, documents: {
  rfc?: string;
  id?: string;
  proofOfAddress?: string;
  storefrontPhoto?: string;
  businessLicense?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated');
  }

  // Check if user owns the business
  const { data: business } = await supabase
    .from('businesses')
    .select('ownerId')
    .eq('id', businessId)
    .single();

  if (!business || business.ownerId !== user.id) {
    throw new Error('Unauthorized: You can only verify your own business');
  }

  const { data, error } = await supabase
    .from('business_verifications')
    .upsert({
      businessId,
      status: 'PENDING',
      documents,
      checks: {},
      riskScore: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit verification: ${error.message}`);
  }
  
  return data;
}

// Real-time subscriptions with proper cleanup
export function subscribeToBusinessUpdates(
  businessId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`business-${businessId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'businesses',
        filter: `id=eq.${businessId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}

export function subscribeToBookingUpdates(
  userId: string,
  callback: (payload: any) => void
) {
  const subscription = supabase
    .channel(`user-bookings-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `userId=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}