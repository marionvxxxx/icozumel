/*
  # Comprehensive Row-Level Security (RLS) Policies

  This migration implements a complete security model for the Cozumel Business Marketplace:

  ## Security Model
  1. **Users**: Can only access their own data
  2. **Business Owners**: Can manage their businesses + access own data
  3. **Admins**: Full access to all data
  4. **Public**: Read access to verified businesses and public reviews

  ## Tables Covered
  1. **users**: Self-access only with admin override
  2. **businesses**: Owner access + public read for verified businesses
  3. **bookings**: User and business owner access
  4. **reviews**: Public read access, authenticated write with ownership
  5. **business_verifications**: Admin and business owner access
  6. **feature_locks**: Admin and business owner access
  7. **listings**: Public read for active listings, owner management
  8. **ad_campaigns**: Business owner access only
  9. **compliance_checks**: Admin access only
  10. **categories**: Public read access
  11. **guides**: Public read for published guides

  ## Security Features
  - Multi-tenant data isolation
  - Role-based access control
  - Verification tier-based visibility
  - Admin override capabilities
  - Public API security
*/

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

DROP POLICY IF EXISTS "Public can read verified businesses" ON businesses;
DROP POLICY IF EXISTS "Business owners can manage own business" ON businesses;
DROP POLICY IF EXISTS "Admins can manage all businesses" ON businesses;

DROP POLICY IF EXISTS "Users can read own bookings" ON bookings;
DROP POLICY IF EXISTS "Business owners can read business bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "Business owners can update business bookings" ON bookings;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON bookings;

DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON reviews;

DROP POLICY IF EXISTS "Business owners can read own verification" ON business_verifications;
DROP POLICY IF EXISTS "Admins can manage all verifications" ON business_verifications;

DROP POLICY IF EXISTS "Business owners can read own feature locks" ON feature_locks;
DROP POLICY IF EXISTS "Admins can manage all feature locks" ON feature_locks;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user owns business
CREATE OR REPLACE FUNCTION owns_business(user_id uuid, business_id text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND "ownerId" = user_id::text
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if business is verified
CREATE OR REPLACE FUNCTION is_business_verified(business_id text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND "verifiedTier" != 'TIER0'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Admins can update all users
CREATE POLICY "Admins can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Allow user registration
CREATE POLICY "Allow user registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

-- =====================================================
-- BUSINESSES TABLE POLICIES
-- =====================================================

-- Public can read verified businesses
CREATE POLICY "Public can read verified businesses"
  ON businesses
  FOR SELECT
  TO anon, authenticated
  USING ("verifiedTier" != 'TIER0');

-- Business owners can read their own businesses (including unverified)
CREATE POLICY "Business owners can read own businesses"
  ON businesses
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = "ownerId");

-- Business owners can create businesses
CREATE POLICY "Business owners can create businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "ownerId");

-- Business owners can update their own businesses
CREATE POLICY "Business owners can update own businesses"
  ON businesses
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "ownerId")
  WITH CHECK (auth.uid()::text = "ownerId");

-- Admins can manage all businesses
CREATE POLICY "Admins can manage all businesses"
  ON businesses
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- BUSINESS VERIFICATIONS TABLE POLICIES
-- =====================================================

-- Business owners can read their own verification status
CREATE POLICY "Business owners can read own verification"
  ON business_verifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_verifications."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Business owners can create verification requests
CREATE POLICY "Business owners can create verification"
  ON business_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_verifications."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Business owners can update their verification (for resubmission)
CREATE POLICY "Business owners can update own verification"
  ON business_verifications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_verifications."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_verifications."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Admins can manage all verifications
CREATE POLICY "Admins can manage all verifications"
  ON business_verifications
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- FEATURE LOCKS TABLE POLICIES
-- =====================================================

-- Business owners can read their own feature locks
CREATE POLICY "Business owners can read own feature locks"
  ON feature_locks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = feature_locks."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Admins can manage all feature locks
CREATE POLICY "Admins can manage all feature locks"
  ON feature_locks
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- LISTINGS TABLE POLICIES
-- =====================================================

-- Public can read active listings from verified businesses
CREATE POLICY "Public can read active listings"
  ON listings
  FOR SELECT
  TO anon, authenticated
  USING (
    active = true AND
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = listings."businessId" 
      AND "verifiedTier" != 'TIER0'
    )
  );

-- Business owners can read their own listings
CREATE POLICY "Business owners can read own listings"
  ON listings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = listings."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Business owners can manage their own listings
CREATE POLICY "Business owners can manage own listings"
  ON listings
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = listings."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = listings."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Admins can manage all listings
CREATE POLICY "Admins can manage all listings"
  ON listings
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- BOOKINGS TABLE POLICIES
-- =====================================================

-- Users can read their own bookings
CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = "userId");

-- Business owners can read bookings for their listings
CREATE POLICY "Business owners can read business bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      JOIN businesses b ON l."businessId" = b.id
      WHERE l.id = bookings."listingId" 
      AND b."ownerId" = auth.uid()::text
    )
  );

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- Business owners can update bookings for their listings
CREATE POLICY "Business owners can update business bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      JOIN businesses b ON l."businessId" = b.id
      WHERE l.id = bookings."listingId" 
      AND b."ownerId" = auth.uid()::text
    )
  );

-- Admins can manage all bookings
CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- REVIEWS TABLE POLICIES
-- =====================================================

-- Public can read all reviews
CREATE POLICY "Public can read reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = "userId");

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- AD CAMPAIGNS TABLE POLICIES
-- =====================================================

-- Business owners can manage their own ad campaigns
CREATE POLICY "Business owners can manage own ad campaigns"
  ON ad_campaigns
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = ad_campaigns."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = ad_campaigns."businessId" 
      AND "ownerId" = auth.uid()::text
    )
  );

-- Admins can manage all ad campaigns
CREATE POLICY "Admins can manage all ad campaigns"
  ON ad_campaigns
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- COMPLIANCE CHECKS TABLE POLICIES
-- =====================================================

-- Only admins can access compliance checks
CREATE POLICY "Admins can manage all compliance checks"
  ON compliance_checks
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- GUIDES TABLE POLICIES
-- =====================================================

-- Public can read published guides
CREATE POLICY "Public can read published guides"
  ON guides
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins can manage all guides
CREATE POLICY "Admins can manage all guides"
  ON guides
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- CATEGORIES TABLE POLICIES
-- =====================================================

-- Public can read active categories
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Admins can manage all categories
CREATE POLICY "Admins can manage all categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- =====================================================
-- WEBHOOK EVENTS TABLE (for Stripe idempotency)
-- =====================================================

-- Create webhook events table for idempotency
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  processed_at timestamptz DEFAULT now(),
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Only system/service role can access webhook events
CREATE POLICY "Service role can manage webhook events"
  ON webhook_events
  FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for RLS policy performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses("ownerId");
CREATE INDEX IF NOT EXISTS idx_businesses_verified_tier ON businesses("verifiedTier");
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings("userId");
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings("listingId");
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews("businessId");
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews("userId");
CREATE INDEX IF NOT EXISTS idx_feature_locks_business_id ON feature_locks("businessId");
CREATE INDEX IF NOT EXISTS idx_listings_business_id ON listings("businessId");
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(active);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_business_id ON ad_campaigns("businessId");
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_businesses_verified_category ON businesses("verifiedTier", category) WHERE "verifiedTier" != 'TIER0';
CREATE INDEX IF NOT EXISTS idx_listings_active_business ON listings(active, "businessId") WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_bookings_status_user ON bookings(status, "userId");

-- =====================================================
-- SECURITY VALIDATION FUNCTIONS
-- =====================================================

-- Function to validate business ownership for complex operations
CREATE OR REPLACE FUNCTION validate_business_access(business_id text, required_tier text DEFAULT 'TIER0')
RETURNS boolean AS $$
DECLARE
  business_record businesses%ROWTYPE;
BEGIN
  -- Get business record
  SELECT * INTO business_record 
  FROM businesses 
  WHERE id = business_id;
  
  -- Check if business exists
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Admin always has access
  IF is_admin(auth.uid()) THEN
    RETURN true;
  END IF;
  
  -- Check ownership
  IF business_record."ownerId" != auth.uid()::text THEN
    RETURN false;
  END IF;
  
  -- Check verification tier if required
  IF required_tier != 'TIER0' AND business_record."verifiedTier" = 'TIER0' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access booking
CREATE OR REPLACE FUNCTION can_access_booking(booking_id text)
RETURNS boolean AS $$
DECLARE
  booking_record bookings%ROWTYPE;
BEGIN
  -- Get booking record
  SELECT * INTO booking_record 
  FROM bookings 
  WHERE id = booking_id;
  
  -- Check if booking exists
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Admin always has access
  IF is_admin(auth.uid()) THEN
    RETURN true;
  END IF;
  
  -- User who made the booking
  IF booking_record."userId" = auth.uid()::text THEN
    RETURN true;
  END IF;
  
  -- Business owner of the listing
  IF EXISTS (
    SELECT 1 FROM listings l
    JOIN businesses b ON l."businessId" = b.id
    WHERE l.id = booking_record."listingId" 
    AND b."ownerId" = auth.uid()::text
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUDIT TRIGGERS (Optional - for compliance tracking)
-- =====================================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id text NOT NULL,
  action text NOT NULL, -- INSERT, UPDATE, DELETE
  old_values jsonb,
  new_values jsonb,
  user_id text,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

-- Function to log changes to sensitive tables
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS trigger AS $$
BEGIN
  -- Only log changes to sensitive tables
  IF TG_TABLE_NAME IN ('business_verifications', 'feature_locks', 'compliance_checks') THEN
    INSERT INTO audit_logs (
      table_name,
      record_id,
      action,
      old_values,
      new_values,
      user_id
    ) VALUES (
      TG_TABLE_NAME,
      COALESCE(NEW.id::text, OLD.id::text),
      TG_OP,
      CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
      auth.uid()::text
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for sensitive tables
DROP TRIGGER IF EXISTS audit_business_verifications ON business_verifications;
CREATE TRIGGER audit_business_verifications
  AFTER INSERT OR UPDATE OR DELETE ON business_verifications
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

DROP TRIGGER IF EXISTS audit_feature_locks ON feature_locks;
CREATE TRIGGER audit_feature_locks
  AFTER INSERT OR UPDATE OR DELETE ON feature_locks
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

DROP TRIGGER IF EXISTS audit_compliance_checks ON compliance_checks;
CREATE TRIGGER audit_compliance_checks
  AFTER INSERT OR UPDATE OR DELETE ON compliance_checks
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- =====================================================
-- PERFORMANCE OPTIMIZATIONS
-- =====================================================

-- Enable query plan caching for RLS functions
ALTER FUNCTION is_admin(uuid) SET search_path = public;
ALTER FUNCTION owns_business(uuid, text) SET search_path = public;
ALTER FUNCTION is_business_verified(text) SET search_path = public;
ALTER FUNCTION validate_business_access(text, text) SET search_path = public;
ALTER FUNCTION can_access_booking(text) SET search_path = public;

-- Set function costs for query planner optimization
ALTER FUNCTION is_admin(uuid) COST 10;
ALTER FUNCTION owns_business(uuid, text) COST 10;
ALTER FUNCTION is_business_verified(text) COST 5;
ALTER FUNCTION validate_business_access(text, text) COST 15;
ALTER FUNCTION can_access_booking(text) COST 20;