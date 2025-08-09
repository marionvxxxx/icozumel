/*
  # Complete Cozumel Mobile Marketplace Database Schema

  1. Core Tables
    - `profiles` - User profiles extending auth.users
    - `businesses` - Business listings with verification
    - `business_verifications` - Verification process tracking
    - `feature_locks` - Feature access control
    - `categories` - Business categories hierarchy

  2. Booking System
    - `listings` - Products/services offered by businesses
    - `bookings` - Reservations and appointments
    - `reviews` - Business reviews and ratings

  3. Additional Features
    - `ad_campaigns` - Advertising campaigns
    - `compliance_checks` - Content moderation
    - `guides` - Travel guides
    - `payments` - Payment tracking
    - `webhook_events` - Stripe webhook idempotency

  4. Security
    - Enable RLS on all tables
    - Helper functions for access control
    - Comprehensive policies for multi-tenant access
    - Admin override capabilities

  5. Performance
    - Optimized indexes for common queries
    - Automatic timestamp triggers
    - Geospatial indexing ready
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
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

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  role user_role DEFAULT 'TOURIST',
  locale text DEFAULT 'es',
  reputation_score float DEFAULT 0,
  badges text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  category text NOT NULL,
  subcategory text,
  geohash text,
  latitude float NOT NULL,
  longitude float NOT NULL,
  address text NOT NULL,
  phone text,
  email text,
  website text,
  hours jsonb,
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  verified_tier verification_tier DEFAULT 'TIER0',
  featured boolean DEFAULT false,
  stripe_customer_id text,
  subscription_status text,
  subscription_id text,
  subscription_current_period_end timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_verifications table
CREATE TABLE IF NOT EXISTS business_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'PENDING',
  risk_score float DEFAULT 0,
  checks jsonb DEFAULT '{}',
  documents jsonb DEFAULT '{}',
  notes text,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create feature_locks table
CREATE TABLE IF NOT EXISTS feature_locks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  feature text NOT NULL,
  state feature_lock_state DEFAULT 'LOCKED',
  reason text,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, feature)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text,
  parent_id uuid REFERENCES categories(id),
  order_index int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type listing_type NOT NULL,
  title text NOT NULL,
  description text,
  price float,
  currency text DEFAULT 'MXN',
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  stock int,
  duration int,
  schedule jsonb,
  active boolean DEFAULT true,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'PENDING',
  time_slot timestamptz,
  duration int,
  quantity int DEFAULT 1,
  total_amount float NOT NULL,
  currency text DEFAULT 'MXN',
  payment_intent_id text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  images text[] DEFAULT '{}',
  helpful int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Create ad_campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  module ad_module NOT NULL,
  title text NOT NULL,
  description text,
  targeting jsonb DEFAULT '{}',
  budget jsonb DEFAULT '{}',
  creative jsonb DEFAULT '{}',
  status ad_campaign_status DEFAULT 'DRAFT',
  start_date timestamptz,
  end_date timestamptz,
  metrics jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create compliance_checks table
CREATE TABLE IF NOT EXISTS compliance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_id uuid NOT NULL,
  target_type text NOT NULL,
  type compliance_check_type NOT NULL,
  result compliance_result NOT NULL,
  reasons text[] DEFAULT '{}',
  confidence float,
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  category text NOT NULL,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  views int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  amount float NOT NULL,
  currency text DEFAULT 'MXN',
  status text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create webhook_events table for idempotency
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  data jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_verified_tier ON businesses(verified_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_locks_business_id ON feature_locks(business_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role, locale)
  VALUES (NEW.id, NEW.email, 'TOURIST', 'es');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_profile_for_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_verifications_updated_at BEFORE UPDATE ON business_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_locks_updated_at BEFORE UPDATE ON feature_locks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON ad_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS policies
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION owns_business(business_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION can_access_booking(booking_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings b
    JOIN listings l ON b.listing_id = l.id
    JOIN businesses bus ON l.business_id = bus.id
    WHERE b.id = booking_id 
    AND (b.user_id = auth.uid() OR bus.owner_id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for businesses
CREATE POLICY "Public can view verified businesses"
  ON businesses FOR SELECT
  TO anon, authenticated
  USING (verified_tier != 'TIER0');

CREATE POLICY "Owners can manage their businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for business_verifications
CREATE POLICY "Owners can view their verification"
  ON business_verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can create verification"
  ON business_verifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all verifications"
  ON business_verifications FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for feature_locks
CREATE POLICY "Owners can view their feature locks"
  ON feature_locks FOR SELECT
  TO authenticated
  USING (owns_business(business_id));

CREATE POLICY "Admins can manage all feature locks"
  ON feature_locks FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for listings
CREATE POLICY "Public can view active listings"
  ON listings FOR SELECT
  TO anon, authenticated
  USING (
    active = true AND
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND verified_tier != 'TIER0'
    )
  );

CREATE POLICY "Owners can manage their listings"
  ON listings FOR ALL
  TO authenticated
  USING (owns_business(business_id));

CREATE POLICY "Admins can manage all listings"
  ON listings FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for bookings
CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Business owners can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM listings l
      JOIN businesses b ON l.business_id = b.id
      WHERE l.id = listing_id AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and business owners can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (can_access_booking(id));

CREATE POLICY "Admins can manage all bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for reviews
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reviews"
  ON reviews FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for ad_campaigns
CREATE POLICY "Owners can manage their campaigns"
  ON ad_campaigns FOR ALL
  TO authenticated
  USING (owns_business(business_id));

CREATE POLICY "Admins can manage all campaigns"
  ON ad_campaigns FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for compliance_checks
CREATE POLICY "Admins can manage compliance checks"
  ON compliance_checks FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for guides
CREATE POLICY "Public can view published guides"
  ON guides FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins can manage all guides"
  ON guides FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "System can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- RLS Policies for webhook_events
CREATE POLICY "System can manage webhook events"
  ON webhook_events FOR ALL
  TO authenticated
  USING (is_admin());

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Restaurantes', 'restaurants', 'Restaurantes y comida local', '🍽️', '#f59e0b', 1),
('Bares y Vida Nocturna', 'bars', 'Bares, discotecas y entretenimiento nocturno', '🍹', '#8b5cf6', 2),
('Actividades', 'activities', 'Tours, deportes acuáticos y aventuras', '🏊‍♂️', '#06b6d4', 3),
('Compras', 'shopping', 'Tiendas, souvenirs y artesanías', '🛍️', '#ec4899', 4),
('Servicios', 'services', 'Servicios profesionales y personales', '🔧', '#10b981', 5),
('Hoteles y Hospedaje', 'accommodation', 'Hoteles, resorts y alojamiento', '🏨', '#f97316', 6),
('Transporte', 'transportation', 'Taxis, tours y transporte', '🚗', '#6366f1', 7),
('Salud y Belleza', 'health', 'Spas, salones y servicios de salud', '💆‍♀️', '#84cc16', 8),
('Eventos', 'events', 'Eventos especiales y celebraciones', '🎉', '#ef4444', 9)
ON CONFLICT (slug) DO NOTHING;

-- Insert restaurant subcategories
INSERT INTO categories (name, slug, description, icon, color, parent_id, order_index) 
SELECT 
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  subcategory.icon,
  subcategory.color,
  c.id,
  subcategory.order_index
FROM categories c,
(VALUES
  ('Comida Mexicana', 'mexican-food', 'Cocina tradicional mexicana', '🌮', '#f59e0b', 1),
  ('Mariscos', 'seafood', 'Pescados y mariscos frescos', '🦐', '#06b6d4', 2),
  ('Internacional', 'international', 'Cocina internacional', '🌍', '#8b5cf6', 3),
  ('Comida Rápida', 'fast-food', 'Comida rápida y casual', '🍔', '#ef4444', 4),
  ('Vegetariano', 'vegetarian', 'Opciones vegetarianas y veganas', '🥗', '#10b981', 5)
) AS subcategory(name, slug, description, icon, color, order_index)
WHERE c.slug = 'restaurants'
ON CONFLICT (slug) DO NOTHING;

-- Insert activity subcategories
INSERT INTO categories (name, slug, description, icon, color, parent_id, order_index)
SELECT 
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  subcategory.icon,
  subcategory.color,
  c.id,
  subcategory.order_index
FROM categories c,
(VALUES
  ('Buceo', 'diving', 'Buceo y snorkel', '🤿', '#06b6d4', 1),
  ('Pesca', 'fishing', 'Pesca deportiva y tours', '🎣', '#0ea5e9', 2),
  ('Tours en Barco', 'boat-tours', 'Excursiones en barco', '⛵', '#3b82f6', 3),
  ('Deportes Acuáticos', 'water-sports', 'Jet ski, parasailing, etc.', '🏄‍♂️', '#06b6d4', 4),
  ('Cenotes', 'cenotes', 'Tours a cenotes', '🏊‍♀️', '#14b8a6', 5)
) AS subcategory(name, slug, description, icon, color, order_index)
WHERE c.slug = 'activities'
ON CONFLICT (slug) DO NOTHING;