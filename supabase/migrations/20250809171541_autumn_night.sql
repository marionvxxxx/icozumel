/*
  # Create Initial Database Schema for Cozumel Mobile Marketplace

  1. New Tables
    - `users` - User accounts with roles and reputation
    - `businesses` - Business listings with verification tiers
    - `business_verifications` - Verification process tracking
    - `feature_locks` - Feature access control per business
    - `listings` - Products/services offered by businesses
    - `bookings` - Reservations and appointments
    - `reviews` - Business reviews and ratings
    - `ad_campaigns` - Advertising campaigns
    - `compliance_checks` - Content moderation and compliance
    - `guides` - Travel guides and content
    - `categories` - Business categories hierarchy
    - `webhook_events` - Webhook processing tracking
    - `payments` - Payment transaction records

  2. Security
    - Enable RLS on all tables
    - Create comprehensive access policies
    - Role-based access control
    - Data isolation between users

  3. Performance
    - Add indexes for common queries
    - Geospatial indexing for location-based searches
    - Optimized foreign key constraints
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('TOURIST', 'BUSINESS_OWNER', 'ADMIN');
CREATE TYPE verification_tier AS ENUM ('TIER0', 'TIER1', 'TIER2');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE feature_lock_state AS ENUM ('LOCKED', 'UNLOCKED', 'SUSPENDED');
CREATE TYPE listing_type AS ENUM ('PRODUCT', 'SERVICE', 'EVENT', 'EXPERIENCE');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
CREATE TYPE ad_campaign_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'REJECTED');
CREATE TYPE ad_module AS ENUM ('SPONSORED_PIN', 'TOP_SEARCH', 'DROPS', 'MOMENT_ADS', 'GUIDE_SPONSORSHIP', 'COUPON_BOOST');
CREATE TYPE compliance_check_type AS ENUM ('CONTENT_MODERATION', 'PRICE_VALIDATION', 'DUPLICATE_DETECTION', 'SPAM_CHECK');
CREATE TYPE compliance_result AS ENUM ('PASSED', 'FAILED', 'NEEDS_REVIEW');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  role user_role DEFAULT 'TOURIST' NOT NULL,
  locale text DEFAULT 'es' NOT NULL,
  reputation_score real DEFAULT 0 NOT NULL,
  badges text[] DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  subcategory text,
  geohash text,
  latitude real NOT NULL,
  longitude real NOT NULL,
  address text NOT NULL,
  phone text,
  email text,
  website text,
  hours jsonb,
  tags text[] DEFAULT '{}' NOT NULL,
  images text[] DEFAULT '{}' NOT NULL,
  verified_tier verification_tier DEFAULT 'TIER0' NOT NULL,
  featured boolean DEFAULT false NOT NULL,
  stripe_customer_id text,
  subscription_status text,
  subscription_id text,
  subscription_current_period_end timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Business verifications table
CREATE TABLE IF NOT EXISTS business_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'PENDING' NOT NULL,
  risk_score real DEFAULT 0 NOT NULL,
  checks jsonb DEFAULT '{}' NOT NULL,
  documents jsonb DEFAULT '{}' NOT NULL,
  notes text,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES users(id),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Feature locks table
CREATE TABLE IF NOT EXISTS feature_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  feature text NOT NULL,
  state feature_lock_state DEFAULT 'LOCKED' NOT NULL,
  reason text,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(business_id, feature)
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type listing_type NOT NULL,
  title text NOT NULL,
  description text,
  price real,
  currency text DEFAULT 'MXN' NOT NULL,
  images text[] DEFAULT '{}' NOT NULL,
  tags text[] DEFAULT '{}' NOT NULL,
  stock integer,
  duration integer,
  schedule jsonb,
  active boolean DEFAULT true NOT NULL,
  featured boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'PENDING' NOT NULL,
  time_slot timestamptz,
  duration integer,
  quantity integer DEFAULT 1 NOT NULL,
  total_amount real NOT NULL,
  currency text DEFAULT 'MXN' NOT NULL,
  payment_intent_id text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  images text[] DEFAULT '{}' NOT NULL,
  helpful integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(business_id, user_id)
);

-- Ad campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  module ad_module NOT NULL,
  title text NOT NULL,
  description text,
  targeting jsonb DEFAULT '{}' NOT NULL,
  budget jsonb DEFAULT '{}' NOT NULL,
  creative jsonb DEFAULT '{}' NOT NULL,
  status ad_campaign_status DEFAULT 'DRAFT' NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  metrics jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Compliance checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid NOT NULL,
  target_type text NOT NULL,
  type compliance_check_type NOT NULL,
  result compliance_result NOT NULL,
  reasons text[] DEFAULT '{}' NOT NULL,
  confidence real,
  reviewed_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content jsonb DEFAULT '{}' NOT NULL,
  images text[] DEFAULT '{}' NOT NULL,
  tags text[] DEFAULT '{}' NOT NULL,
  category text NOT NULL,
  featured boolean DEFAULT false NOT NULL,
  published boolean DEFAULT false NOT NULL,
  views integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  parent_id uuid REFERENCES categories(id),
  order_index integer DEFAULT 0 NOT NULL,
  active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Webhook events table (for idempotency)
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  processed_at timestamptz DEFAULT now() NOT NULL,
  data jsonb DEFAULT '{}' NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  amount real NOT NULL,
  currency text DEFAULT 'MXN' NOT NULL,
  status text NOT NULL,
  booking_id uuid REFERENCES bookings(id),
  business_id uuid REFERENCES businesses(id),
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses USING GIST (ST_Point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_verified_tier ON businesses(verified_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_locks_business_id ON feature_locks(business_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_target ON compliance_checks(target_id, target_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_id ON webhook_events(stripe_event_id);

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
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

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
CREATE OR REPLACE FUNCTION owns_business(user_id uuid, business_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND owner_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can access booking
CREATE OR REPLACE FUNCTION can_access_booking(user_id uuid, booking_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN businesses bus ON l.business_id = bus.id
    WHERE b.id = booking_id 
    AND (b.user_id = user_id OR bus.owner_id = user_id)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin(auth.uid()));

CREATE POLICY "Anyone can create user account"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for businesses table
CREATE POLICY "Public can read verified businesses"
  ON businesses FOR SELECT
  TO authenticated, anon
  USING (verified_tier != 'TIER0' OR owner_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Business owners can manage their businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (owner_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Authenticated users can create businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- RLS Policies for business_verifications table
CREATE POLICY "Business owners and admins can read verifications"
  ON business_verifications FOR SELECT
  TO authenticated
  USING (
    owns_business(auth.uid(), business_id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Business owners can create verifications"
  ON business_verifications FOR INSERT
  TO authenticated
  WITH CHECK (owns_business(auth.uid(), business_id));

CREATE POLICY "Business owners can update their verifications"
  ON business_verifications FOR UPDATE
  TO authenticated
  USING (
    owns_business(auth.uid(), business_id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage all verifications"
  ON business_verifications FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for feature_locks table
CREATE POLICY "Business owners can read their feature locks"
  ON feature_locks FOR SELECT
  TO authenticated
  USING (
    owns_business(auth.uid(), business_id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage feature locks"
  ON feature_locks FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for listings table
CREATE POLICY "Public can read active listings from verified businesses"
  ON listings FOR SELECT
  TO authenticated, anon
  USING (
    active = true AND EXISTS (
      SELECT 1 FROM businesses b 
      WHERE b.id = business_id 
      AND (b.verified_tier != 'TIER0' OR b.owner_id = auth.uid())
    )
  );

CREATE POLICY "Business owners can manage their listings"
  ON listings FOR ALL
  TO authenticated
  USING (
    owns_business(auth.uid(), business_id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Business owners can create listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (owns_business(auth.uid(), business_id));

-- RLS Policies for bookings table
CREATE POLICY "Users and business owners can read relevant bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    can_access_booking(auth.uid(), id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and business owners can update relevant bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    can_access_booking(auth.uid(), id) OR 
    is_admin(auth.uid())
  );

-- RLS Policies for reviews table
CREATE POLICY "Public can read reviews"
  ON reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR is_admin(auth.uid()));

CREATE POLICY "Users and admins can delete reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid() OR is_admin(auth.uid()));

-- RLS Policies for ad_campaigns table
CREATE POLICY "Business owners can manage their ad campaigns"
  ON ad_campaigns FOR ALL
  TO authenticated
  USING (
    owns_business(auth.uid(), business_id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Business owners can create ad campaigns"
  ON ad_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (owns_business(auth.uid(), business_id));

-- RLS Policies for compliance_checks table
CREATE POLICY "Admins can manage compliance checks"
  ON compliance_checks FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Business owners can read their compliance checks"
  ON compliance_checks FOR SELECT
  TO authenticated
  USING (
    (target_type = 'business' AND owns_business(auth.uid(), target_id::uuid)) OR
    (target_type = 'listing' AND EXISTS (
      SELECT 1 FROM listings l 
      WHERE l.id = target_id::uuid 
      AND owns_business(auth.uid(), l.business_id)
    )) OR
    (target_type = 'ad_campaign' AND EXISTS (
      SELECT 1 FROM ad_campaigns ac 
      WHERE ac.id = target_id::uuid 
      AND owns_business(auth.uid(), ac.business_id)
    )) OR
    is_admin(auth.uid())
  );

-- RLS Policies for guides table
CREATE POLICY "Public can read published guides"
  ON guides FOR SELECT
  TO authenticated, anon
  USING (published = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage guides"
  ON guides FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for categories table
CREATE POLICY "Public can read active categories"
  ON categories FOR SELECT
  TO authenticated, anon
  USING (active = true OR is_admin(auth.uid()));

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for webhook_events table
CREATE POLICY "Admins can manage webhook events"
  ON webhook_events FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- RLS Policies for payments table
CREATE POLICY "Users can read their payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    owns_business(auth.uid(), business_id) OR 
    is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_verifications_updated_at BEFORE UPDATE ON business_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_locks_updated_at BEFORE UPDATE ON feature_locks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON ad_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();