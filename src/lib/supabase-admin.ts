import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client with service role key
 * WARNING: This bypasses RLS - use only in server-side code
 */
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

/**
 * Get business verifications with proper error handling and validation
 */
export async function getBusinessVerifications(status?: string) {
  try {
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
    
    return data || [];
  } catch (error) {
    console.error('Error fetching business verifications:', error);
    throw error;
  }
}

/**
 * Update verification status with proper validation and error handling
 */
export async function updateVerificationStatus(
  verificationId: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  if (!verificationId || !status) {
    throw new Error('Missing required parameters');
  }

  try {
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
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw error;
  }
}