/*
  # Create Cozumel Marketplace Database Schema

  1. Core Tables
    - `profiles` - User profiles extending auth.users
    - `businesses` - Business listings with verification
    - `business_verifications` - Verification process tracking
    - `feature_locks` - Feature access control

  2. Booking System
    - `categories` - Business categories
    - `listings` - Products/services
    - `bookings` - Reservations
    - `reviews` - Business reviews

  3. Security
    - Enable RLS on all tables
    - Helper functions for access control
    - Comprehensive security policies

  4. Performance
    - Strategic indexes for common queries
    - Automatic timestamp triggers
    - Geospatial optimization ready
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

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  phone text,
  role user_role DEFAULT 'TOURIST',
  locale text DEFAULT 'es',
  reputation_score real DEFAULT 0,
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
  latitude real NOT NULL,
  longitude real NOT NULL,
  address text NOT NULL,
  phone text,
  email text,
  website text,
  hours jsonb,
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  verified_tier verification_tier DEFAULT 'TIER0',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create business_verifications table
CREATE TABLE IF NOT EXISTS business_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'PENDING',
  risk_score real DEFAULT 0,
  checks jsonb DEFAULT '{}',
  documents jsonb DEFAULT '{}',
  notes text,
  reviewed_at timestamptz,
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
  order_index integer DEFAULT 0,
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
  price real,
  currency text DEFAULT 'MXN',
  images text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  stock integer,
  duration integer,
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
  duration integer,
  quantity integer DEFAULT 1,
  total_amount real NOT NULL,
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
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  images text[] DEFAULT '{}',
  helpful integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Create webhook_events table for idempotency
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  data jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  amount real NOT NULL,
  currency text DEFAULT 'MXN',
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create helper functions for RLS
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
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- RLS Policies for businesses
CREATE POLICY "Public can view verified businesses"
  ON businesses FOR SELECT
  TO anon, authenticated
  USING (verified_tier != 'TIER0' OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "Business owners can manage their businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "Authenticated users can create businesses"
  ON businesses FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- RLS Policies for business_verifications
CREATE POLICY "Admins can view all verifications"
  ON business_verifications FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Business owners can view their verification"
  ON business_verifications FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Business owners can create verification"
  ON business_verifications FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Admins can update verifications"
  ON business_verifications FOR UPDATE
  TO authenticated
  USING (is_admin());

-- RLS Policies for feature_locks
CREATE POLICY "Admins can manage feature locks"
  ON feature_locks FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Business owners can view their feature locks"
  ON feature_locks FOR SELECT
  TO authenticated
  USING (owns_business(business_id));

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for listings
CREATE POLICY "Public can view active listings from verified businesses"
  ON listings FOR SELECT
  TO anon, authenticated
  USING (
    active = true AND EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND verified_tier != 'TIER0'
    )
  );

CREATE POLICY "Business owners can manage their listings"
  ON listings FOR ALL
  TO authenticated
  USING (owns_business(business_id));

-- RLS Policies for bookings
CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR can_access_booking(id) OR is_admin());

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users and business owners can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR can_access_booking(id) OR is_admin());

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- RLS Policies for webhook_events (admin only)
CREATE POLICY "Admins can manage webhook events"
  ON webhook_events FOR ALL
  TO authenticated
  USING (is_admin());

-- RLS Policies for payments
CREATE POLICY "Users can view their payments"
  ON payments FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings 
    WHERE id = booking_id AND user_id = auth.uid()
  ) OR is_admin());

CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  TO authenticated
  USING (is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, role, locale)
  VALUES (NEW.id, NEW.email, 'TOURIST', 'es');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_business_verifications_updated_at
  BEFORE UPDATE ON business_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_feature_locks_updated_at
  BEFORE UPDATE ON feature_locks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
  ('Restaurantes', 'restaurants', 'Restaurantes y comida local', '🍽️', '#f59e0b', 1),
  ('Actividades', 'activities', 'Tours y actividades acuáticas', '🏊‍♂️', '#3b82f6', 2),
  ('Compras', 'shopping', 'Tiendas y souvenirs', '🛍️', '#8b5cf6', 3),
  ('Hoteles', 'hotels', 'Hoteles y hospedaje', '🏨', '#06b6d4', 4),
  ('Transporte', 'transport', 'Transporte y movilidad', '🚗', '#10b981', 5),
  ('Vida Nocturna', 'nightlife', 'Bares y entretenimiento nocturno', '🌙', '#ec4899', 6),
  ('Servicios', 'services', 'Servicios profesionales', '🔧', '#6b7280', 7),
  ('Salud', 'health', 'Salud y bienestar', '🏥', '#ef4444', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert restaurant subcategories
DO $$
DECLARE
  restaurant_id uuid;
BEGIN
  SELECT id INTO restaurant_id FROM categories WHERE slug = 'restaurants';
  
  IF restaurant_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, icon, parent_id, order_index) VALUES
      ('Mariscos', 'seafood', 'Restaurantes de mariscos frescos', '🦞', restaurant_id, 1),
      ('Mexicana', 'mexican', 'Comida mexicana tradicional', '🌮', restaurant_id, 2),
      ('Internacional', 'international', 'Cocina internacional', '🍝', restaurant_id, 3),
      ('Cafeterías', 'cafes', 'Cafés y desayunos', '☕', restaurant_id, 4),
      ('Comida Rápida', 'fast-food', 'Comida rápida y casual', '🍔', restaurant_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Insert activity subcategories
DO $$
DECLARE
  activity_id uuid;
BEGIN
  SELECT id INTO activity_id FROM categories WHERE slug = 'activities';
  
  IF activity_id IS NOT NULL THEN
    INSERT INTO categories (name, slug, description, icon, parent_id, order_index) VALUES
      ('Buceo', 'diving', 'Buceo y snorkel', '🤿', activity_id, 1),
      ('Tours', 'tours', 'Tours y excursiones', '🚢', activity_id, 2),
      ('Deportes Acuáticos', 'water-sports', 'Deportes acuáticos', '🏄‍♂️', activity_id, 3),
      ('Pesca', 'fishing', 'Pesca deportiva', '🎣', activity_id, 4),
      ('Eco Tours', 'eco-tours', 'Tours ecológicos', '🌿', activity_id, 5)
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;