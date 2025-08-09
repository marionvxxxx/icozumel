import { createClient } from '@supabase/supabase-js';

// Admin client with service role key for bypassing RLS when needed
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Helper functions for admin operations
export async function getBusinessVerifications(status?: string) {
  let query = supabaseAdmin
    .from('business_verifications')
    .select(`
      *,
      businesses!inner(
        id,
        name,
        owner_id,
        category,
        verified_tier
      )
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch verifications: ${error.message}`);
  }
  
  return data;
}

export async function updateVerificationStatus(
  verificationId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const { data, error } = await supabaseAdmin
    .from('business_verifications')
    .update({
      status,
      notes,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', verificationId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update verification: ${error.message}`);
  }

  // If approved, update business verification tier
  if (status === 'APPROVED' && data) {
    const { error: businessError } = await supabaseAdmin
      .from('businesses')
      .update({ verified_tier: 'TIER1' })
      .eq('id', data.business_id);

    if (businessError) {
      throw new Error(`Failed to update business tier: ${businessError.message}`);
    }
  }

  return data;
}

export async function getBusinessAnalytics(businessId?: string) {
  let query = supabaseAdmin
    .from('businesses')
    .select(`
      id,
      name,
      category,
      verified_tier,
      created_at,
      bookings:bookings(count),
      reviews:reviews(count, rating),
      listings:listings(count)
    `);

  if (businessId) {
    query = query.eq('id', businessId);
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }
  
  return data;
}

export async function moderateContent(
  target_id: string,
  target_type: 'business' | 'listing' | 'review',
  action: 'approve' | 'reject' | 'flag',
  reason?: string
) {
  const { data, error } = await supabaseAdmin
    .from('compliance_checks')
    .insert({
      target_id,
      target_type,
      type: 'CONTENT_MODERATION',
      result: action === 'approve' ? 'PASSED' : 'FAILED',
      reasons: reason ? [reason] : [],
      reviewed_by: 'admin', // In real app, use actual admin user ID
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to moderate content: ${error.message}`);
  }

  return data;
}

export async function updateFeatureLock(
  business_id: string,
  feature: string,
  state: 'LOCKED' | 'UNLOCKED' | 'SUSPENDED',
  reason?: string
) {
  const { data, error } = await supabaseAdmin
    .from('feature_locks')
    .upsert({
      business_id,
      feature,
      state,
      reason,
      unlocked_at: state === 'UNLOCKED' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update feature lock: ${error.message}`);
  }

  return data;
}