/*
  # Create Additional Tables

  1. New Tables
    - `listings` - Business products and services
    - `bookings` - Reservations and appointments
    - `reviews` - Business reviews and ratings
    - `categories` - Business categories hierarchy

  2. Security
    - Enable RLS on all tables
    - Appropriate access policies
*/

-- Create additional enum types
CREATE TYPE listing_type AS ENUM ('PRODUCT', 'SERVICE', 'EVENT', 'EXPERIENCE');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- Listings table
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

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  images text[] DEFAULT '{}',
  helpful integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(business_id, user_id)
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
  order_index integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Webhook events table for idempotency
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  data jsonb,
  processed_at timestamptz DEFAULT now()
);

-- Payments table for tracking
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_invoice_id text,
  amount real NOT NULL,
  currency text DEFAULT 'MXN',
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_listings_business_id ON listings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Create updated_at triggers
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for new tables

-- Listings policies
CREATE POLICY "Public can read active listings from verified businesses"
  ON listings
  FOR SELECT
  TO anon, authenticated
  USING (
    active = true AND 
    EXISTS (
      SELECT 1 FROM businesses 
      WHERE id = listing_id AND verified_tier != 'TIER0'
    )
  );

CREATE POLICY "Business owners can manage their listings"
  ON listings
  FOR ALL
  TO authenticated
  USING (owns_business(business_id));

-- Bookings policies
CREATE POLICY "Users can read their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR owns_business((SELECT business_id FROM listings WHERE id = listing_id)) OR is_admin());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Business owners and users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR owns_business((SELECT business_id FROM listings WHERE id = listing_id)) OR is_admin());

-- Reviews policies
CREATE POLICY "Public can read reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR is_admin());

-- Categories policies
CREATE POLICY "Public can read active categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Webhook events policies (admin only)
CREATE POLICY "Admins can manage webhook events"
  ON webhook_events
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Payments policies (admin and related users only)
CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (is_admin());