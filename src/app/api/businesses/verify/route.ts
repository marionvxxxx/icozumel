import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { handleApiError } from '@/lib/error-handler';
import { validateRequest, businessVerificationSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, status, notes } = validateRequest(businessVerificationSchema, body);

    // Update verification status
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from('business_verifications')
      .update({
        status,
        notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('business_id', businessId)
      .select()
      .single();

    if (verificationError) {
      throw new Error(`Failed to update verification: ${verificationError.message}`);
    }

    // Update business tier if approved
    if (status === 'APPROVED') {
      const { error: businessError } = await supabaseAdmin
        .from('businesses')
        .update({ verified_tier: 'TIER1' })
        .eq('id', businessId);

      if (businessError) {
        throw new Error(`Failed to update business tier: ${businessError.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: verification,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('business_verifications')
      .select(`
        *,
        business:businesses!inner(
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

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}