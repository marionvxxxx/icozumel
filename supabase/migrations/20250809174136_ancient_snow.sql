/*
  # Create Cozumel Marketplace Database Schema

  1. Core Tables
    - `profiles` - User profiles extending auth.users
    - `businesses` - Business listings with verification
    - `business_verifications` - Verification process tracking
    - `feature_locks` - Feature access control
    - `categories` - Business categories
    - `listings` - Products/services
    - `bookings` - Reservations
    - `reviews` - Business reviews

  2. Security
    - Enable RLS on all tables
    - Helper functions for access control
    - Policies for multi-tenant data isolation
    - Admin override capabilities
    - Public read for verified businesses

  3. Performance
    - Strategic indexes for common queries
    - Automatic timestamp triggers
    - Geospatial optimization ready
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enums
CREATE TYPE user_role AS ENUM ('TOURIST', 'BUSINESS_OWNER', 'ADMIN');
CREATE TYPE verification_tier AS ENUM ('TIER0', 'TIER1', 'TIER2');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE feature_lock_state AS ENUM ('LOCKED', 'UNLOCKED', 'SUSPENDED');
CREATE TYPE listing_type AS ENUM ('PRODUCT', 'SERVICE', 'EVENT', 'EXPERIENCE');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
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
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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
  business_id uuid UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
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
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
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
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
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
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  images text[] DEFAULT '{}',
  helpful integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id text UNIQUE,
  stripe_invoice_id text,
  amount integer NOT NULL,
  currency text DEFAULT 'mxn',
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
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_feature_locks_business ON feature_locks(business_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_verifications_updated_at BEFORE UPDATE ON business_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_locks_updated_at BEFORE UPDATE ON feature_locks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, locale)
  VALUES (new.id, new.email, 'TOURIST', 'es');
  RETURN new;
END;
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
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
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for businesses
CREATE POLICY "Public can view verified businesses"
  ON businesses FOR SELECT
  USING (verified_tier != 'TIER0' OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "Business owners can manage their businesses"
  ON businesses FOR ALL
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "Authenticated users can create businesses"
  ON businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- RLS Policies for business_verifications
CREATE POLICY "Admins can view all verifications"
  ON business_verifications FOR SELECT
  USING (is_admin());

CREATE POLICY "Business owners can view their verification"
  ON business_verifications FOR SELECT
  USING (owns_business(business_id));

CREATE POLICY "Admins can manage verifications"
  ON business_verifications FOR ALL
  USING (is_admin());

CREATE POLICY "Business owners can create verification"
  ON business_verifications FOR INSERT
  WITH CHECK (owns_business(business_id));

-- RLS Policies for feature_locks
CREATE POLICY "Admins can manage feature locks"
  ON feature_locks FOR ALL
  USING (is_admin());

CREATE POLICY "Business owners can view their locks"
  ON feature_locks FOR SELECT
  USING (owns_business(business_id));

-- RLS Policies for categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- RLS Policies for listings
CREATE POLICY "Public can view active listings from verified businesses"
  ON listings FOR SELECT
  USING (
    active = true AND EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = business_id AND verified_tier != 'TIER0'
    )
  );

CREATE POLICY "Business owners can manage their listings"
  ON listings FOR ALL
  USING (owns_business(business_id));

CREATE POLICY "Authenticated users can create listings for their business"
  ON listings FOR INSERT
  WITH CHECK (owns_business(business_id));

-- RLS Policies for bookings
CREATE POLICY "Users can view their bookings"
  ON bookings FOR SELECT
  USING (user_id = auth.uid() OR can_access_booking(id) OR is_admin());

CREATE POLICY "Users can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and business owners can update bookings"
  ON bookings FOR UPDATE
  USING (user_id = auth.uid() OR can_access_booking(id) OR is_admin());

-- RLS Policies for reviews
CREATE POLICY "Public can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id OR is_admin());

-- RLS Policies for payments (admin only)
CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  USING (is_admin());

-- RLS Policies for webhook_events (admin only)
CREATE POLICY "Admins can manage webhook events"
  ON webhook_events FOR ALL
  USING (is_admin());

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Restaurantes', 'restaurants', 'Restaurantes y comida local', '🍽️', '#f59e0b', 1),
('Actividades', 'activities', 'Tours, buceo y actividades', '🏊‍♂️', '#3b82f6', 2),
('Bares', 'bars', 'Bares y vida nocturna', '🍹', '#8b5cf6', 3),
('Compras', 'shopping', 'Tiendas y souvenirs', '🛍️', '#ec4899', 4),
('Hoteles', 'hotels', 'Hoteles y hospedaje', '🏨', '#10b981', 5),
('Transporte', 'transport', 'Taxis y transporte', '🚗', '#f97316', 6),
('Servicios', 'services', 'Servicios profesionales', '🔧', '#6b7280', 7),
('Salud', 'health', 'Salud y bienestar', '💊', '#ef4444', 8);

-- Insert restaurant subcategories
INSERT INTO categories (name, slug, description, parent_id, order_index) 
SELECT 
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  restaurants.id,
  subcategory.order_index
FROM categories restaurants,
(VALUES 
  ('Mexicana', 'mexican', 'Comida mexicana tradicional', 1),
  ('Mariscos', 'seafood', 'Restaurantes de mariscos', 2),
  ('Internacional', 'international', 'Cocina internacional', 3),
  ('Casual', 'casual', 'Comida rápida y casual', 4),
  ('Fine Dining', 'fine-dining', 'Restaurantes de alta cocina', 5)
) AS subcategory(name, slug, description, order_index)
WHERE restaurants.slug = 'restaurants';

-- Insert activity subcategories
INSERT INTO categories (name, slug, description, parent_id, order_index)
SELECT 
  subcategory.name,
  subcategory.slug,
  subcategory.description,
  activities.id,
  subcategory.order_index
FROM categories activities,
(VALUES 
  ('Buceo', 'diving', 'Buceo y snorkel', 1),
  ('Tours', 'tours', 'Tours y excursiones', 2),
  ('Deportes Acuáticos', 'water-sports', 'Deportes acuáticos', 3),
  ('Pesca', 'fishing', 'Pesca deportiva', 4),
  ('Cultura', 'culture', 'Sitios culturales', 5)
) AS subcategory(name, slug, description, order_index)
WHERE activities.slug = 'activities';