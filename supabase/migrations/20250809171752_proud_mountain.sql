/*
  # Create Core Tables

  1. New Tables
    - `users` - User profiles and authentication
    - `businesses` - Business listings and information
    - `business_verifications` - Business verification process
    - `feature_locks` - Feature access control

  2. Security
    - Enable RLS on all tables
    - Basic policies for authenticated access
*/

-- Create enum types first
CREATE TYPE user_role AS ENUM ('TOURIST', 'BUSINESS_OWNER', 'ADMIN');
CREATE TYPE verification_tier AS ENUM ('TIER0', 'TIER1', 'TIER2');
CREATE TYPE verification_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE feature_lock_state AS ENUM ('LOCKED', 'UNLOCKED', 'SUSPENDED');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  phone text,
  role user_role DEFAULT 'TOURIST',
  locale text DEFAULT 'es',
  reputation_score real DEFAULT 0,
  badges text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  verified_tier verification_tier DEFAULT 'TIER0',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Business verifications table
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

-- Feature locks table
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

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_locks ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_verified_tier ON businesses(verified_tier);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_business_verifications_status ON business_verifications(status);
CREATE INDEX IF NOT EXISTS idx_feature_locks_business_feature ON feature_locks(business_id, feature);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_verifications_updated_at BEFORE UPDATE ON business_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_locks_updated_at BEFORE UPDATE ON feature_locks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();