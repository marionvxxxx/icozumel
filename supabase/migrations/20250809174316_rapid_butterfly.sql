/*
  # Create Cozumel Marketplace Database Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
    - `businesses` - Business listings with verification
    - `business_verifications` - Verification process tracking
    - `feature_locks` - Feature access control
    - `listings` - Products/services offered
    - `bookings` - Reservations and appointments
    - `reviews` - Business reviews and ratings
    - `categories` - Business categories
    - `payments` - Payment tracking
    - `webhook_events` - Webhook idempotency

  2. Security
    - Enable RLS on all tables
    - Create helper functions for access control
    - Add policies for multi-tenant data isolation
    - Admin override capabilities

  3. Performance
    - Strategic indexes for common queries
    - Automatic timestamp triggers
    - Geospatial optimization ready
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id uuid REFERENCES businesses(id) ON DELETE CASCADE,
  feature text NOT NULL,
  state feature_lock_state DEFAULT 'LOCKED',
  reason text,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, feature)
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id text,
  stripe_invoice_id text,
  amount real NOT NULL,
  currency text DEFAULT 'MXN',
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  data jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_verified_tier ON businesses(verified_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- Create function to automatically create profile
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_business_verifications_updated_at BEFORE UPDATE ON business_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_feature_locks_updated_at BEFORE UPDATE ON feature_locks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper functions for RLS
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

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = auth.uid() OR is_admin());

-- Businesses policies
CREATE POLICY "Anyone can read verified businesses" ON businesses FOR SELECT USING (verified_tier != 'TIER0' OR owner_id = auth.uid() OR is_admin());
CREATE POLICY "Business owners can insert businesses" ON businesses FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Business owners can update own businesses" ON businesses FOR UPDATE USING (owner_id = auth.uid() OR is_admin());
CREATE POLICY "Business owners can delete own businesses" ON businesses FOR DELETE USING (owner_id = auth.uid() OR is_admin());

-- Business verifications policies
CREATE POLICY "Admins can read all verifications" ON business_verifications FOR SELECT USING (is_admin() OR owns_business(business_id));
CREATE POLICY "Business owners can insert verifications" ON business_verifications FOR INSERT WITH CHECK (owns_business(business_id));
CREATE POLICY "Admins can update verifications" ON business_verifications FOR UPDATE USING (is_admin());

-- Feature locks policies
CREATE POLICY "Business owners can read own feature locks" ON feature_locks FOR SELECT USING (owns_business(business_id) OR is_admin());
CREATE POLICY "Admins can manage feature locks" ON feature_locks FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update feature locks" ON feature_locks FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete feature locks" ON feature_locks FOR DELETE USING (is_admin());

-- Listings policies
CREATE POLICY "Anyone can read active listings" ON listings FOR SELECT USING (active = true OR owns_business(business_id) OR is_admin());
CREATE POLICY "Business owners can insert listings" ON listings FOR INSERT WITH CHECK (owns_business(business_id));
CREATE POLICY "Business owners can update own listings" ON listings FOR UPDATE USING (owns_business(business_id) OR is_admin());
CREATE POLICY "Business owners can delete own listings" ON listings FOR DELETE USING (owns_business(business_id) OR is_admin());

-- Bookings policies
CREATE POLICY "Users can read own bookings" ON bookings FOR SELECT USING (user_id = auth.uid() OR can_access_booking(id) OR is_admin());
CREATE POLICY "Authenticated users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (user_id = auth.uid() OR can_access_booking(id) OR is_admin());

-- Reviews policies
CREATE POLICY "Anyone can read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (user_id = auth.uid() OR is_admin());
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (user_id = auth.uid() OR is_admin());

-- Categories policies
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (active = true OR is_admin());
CREATE POLICY "Admins can manage categories" ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update categories" ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete categories" ON categories FOR DELETE USING (is_admin());

-- Payments policies
CREATE POLICY "Users can read own payments" ON payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM bookings b 
    WHERE b.id = payments.booking_id 
    AND (b.user_id = auth.uid() OR can_access_booking(b.id))
  ) OR is_admin()
);

-- Webhook events policies (admin only)
CREATE POLICY "Admins can read webhook events" ON webhook_events FOR SELECT USING (is_admin());
CREATE POLICY "System can insert webhook events" ON webhook_events FOR INSERT WITH CHECK (true);

-- Insert initial categories
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Restaurantes', 'restaurants', 'Restaurantes y comida local', '🍽️', '#f59e0b', 1),
('Actividades', 'activities', 'Tours, buceo y actividades acuáticas', '🏊‍♂️', '#3b82f6', 2),
('Compras', 'shopping', 'Tiendas y souvenirs', '🛍️', '#8b5cf6', 3),
('Hoteles', 'hotels', 'Hoteles y hospedaje', '🏨', '#06b6d4', 4),
('Transporte', 'transport', 'Taxis, rentadoras y transporte', '🚗', '#10b981', 5),
('Vida Nocturna', 'nightlife', 'Bares y entretenimiento nocturno', '🌙', '#ec4899', 6),
('Servicios', 'services', 'Servicios profesionales', '🔧', '#6b7280', 7),
('Salud y Belleza', 'health', 'Spas, salones y servicios de salud', '💆‍♀️', '#f97316', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert restaurant subcategories
INSERT INTO categories (name, slug, description, parent_id, order_index) VALUES
('Mariscos', 'seafood', 'Restaurantes de mariscos frescos', (SELECT id FROM categories WHERE slug = 'restaurants'), 1),
('Mexicana', 'mexican', 'Comida mexicana tradicional', (SELECT id FROM categories WHERE slug = 'restaurants'), 2),
('Internacional', 'international', 'Cocina internacional', (SELECT id FROM categories WHERE slug = 'restaurants'), 3),
('Casual', 'casual', 'Restaurantes casuales', (SELECT id FROM categories WHERE slug = 'restaurants'), 4),
('Fine Dining', 'fine-dining', 'Restaurantes de alta cocina', (SELECT id FROM categories WHERE slug = 'restaurants'), 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert activity subcategories
INSERT INTO categories (name, slug, description, parent_id, order_index) VALUES
('Buceo', 'diving', 'Buceo y snorkel', (SELECT id FROM categories WHERE slug = 'activities'), 1),
('Tours', 'tours', 'Tours y excursiones', (SELECT id FROM categories WHERE slug = 'activities'), 2),
('Deportes Acuáticos', 'water-sports', 'Deportes acuáticos', (SELECT id FROM categories WHERE slug = 'activities'), 3),
('Pesca', 'fishing', 'Pesca deportiva', (SELECT id FROM categories WHERE slug = 'activities'), 4),
('Cultura', 'culture', 'Sitios culturales y museos', (SELECT id FROM categories WHERE slug = 'activities'), 5)
ON CONFLICT (slug) DO NOTHING;