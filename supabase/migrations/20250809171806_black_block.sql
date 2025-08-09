/*
  # Create RLS Security Policies

  1. Security Policies
    - Users: Self-access only with admin override
    - Businesses: Public read for verified + owner management
    - Verifications: Admin and owner access
    - Feature Locks: Admin control with owner visibility

  2. Helper Functions
    - is_admin() - Check if user is admin
    - owns_business() - Check business ownership
*/

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check business ownership
CREATE OR REPLACE FUNCTION owns_business(business_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM businesses 
    WHERE id = business_id AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Public can read verified businesses"
  ON businesses
  FOR SELECT
  TO anon, authenticated
  USING (verified_tier != 'TIER0' OR owner_id = auth.uid() OR is_admin());

CREATE POLICY "Business owners can manage their businesses"
  ON businesses
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid() OR is_admin());

CREATE POLICY "Authenticated users can create businesses"
  ON businesses
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Business verifications policies
CREATE POLICY "Admins can read all verifications"
  ON business_verifications
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Business owners can read own verifications"
  ON business_verifications
  FOR SELECT
  TO authenticated
  USING (owns_business(business_id));

CREATE POLICY "Business owners can create verifications"
  ON business_verifications
  FOR INSERT
  TO authenticated
  WITH CHECK (owns_business(business_id));

CREATE POLICY "Admins can update verifications"
  ON business_verifications
  FOR UPDATE
  TO authenticated
  USING (is_admin());

-- Feature locks policies
CREATE POLICY "Admins can manage all feature locks"
  ON feature_locks
  FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Business owners can read own feature locks"
  ON feature_locks
  FOR SELECT
  TO authenticated
  USING (owns_business(business_id));