/*
  # ShreeAnna Connect - Initial Database Schema

  ## Overview
  This migration creates the complete database schema for ShreeAnna Connect platform,
  connecting millet farmers with consumers.

  ## New Tables

  ### 1. profiles
  Extends auth.users with role-based information
  - `id` (uuid, FK to auth.users)
  - `role` (text): 'farmer' or 'consumer'
  - `full_name` (text)
  - `phone` (text)
  - `language_preference` (text): en, hi, te, ta
  - `age` (integer): for consumer health recommendations
  - `health_preferences` (jsonb): dietary needs, conditions
  - `location` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. products
  Millet products listed by farmers
  - `id` (uuid, PK)
  - `farmer_id` (uuid, FK to profiles)
  - `millet_type` (text): foxtail, pearl, finger, little, kodo, etc.
  - `quantity_kg` (numeric)
  - `price_per_kg` (numeric)
  - `description` (text)
  - `image_url` (text)
  - `status` (text): available, sold_out
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. orders
  Purchase transactions
  - `id` (uuid, PK)
  - `consumer_id` (uuid, FK to profiles)
  - `product_id` (uuid, FK to products)
  - `quantity_kg` (numeric)
  - `total_amount` (numeric)
  - `status` (text): pending, confirmed, delivered
  - `payment_id` (text)
  - `created_at` (timestamptz)

  ### 4. farmer_adoptions
  Consumers adopting farmers
  - `id` (uuid, PK)
  - `consumer_id` (uuid, FK to profiles)
  - `farmer_id` (uuid, FK to profiles)
  - `status` (text): active, inactive
  - `created_at` (timestamptz)

  ### 5. rewards
  Points and rewards system
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `points` (integer)
  - `earned_from` (text): purchase, referral, donation
  - `description` (text)
  - `created_at` (timestamptz)

  ### 6. price_predictions
  ML-based price predictions for farmers
  - `id` (uuid, PK)
  - `millet_type` (text)
  - `predicted_price` (numeric)
  - `confidence_score` (numeric)
  - `prediction_date` (date)
  - `created_at` (timestamptz)

  ### 7. crop_advisories
  AI-generated crop recommendations
  - `id` (uuid, PK)
  - `farmer_id` (uuid, FK to profiles)
  - `crop_type` (text)
  - `advisory_text` (text)
  - `weather_data` (jsonb)
  - `created_at` (timestamptz)

  ### 8. notifications
  Alerts for users
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to profiles)
  - `title` (text)
  - `message` (text)
  - `type` (text): alert, scheme, weather
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Consumers can view public product listings
  - Farmers can manage their own products
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('farmer', 'consumer')),
  full_name text NOT NULL,
  phone text,
  language_preference text DEFAULT 'en' CHECK (language_preference IN ('en', 'hi', 'te', 'ta')),
  age integer,
  health_preferences jsonb DEFAULT '{}'::jsonb,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  millet_type text NOT NULL,
  quantity_kg numeric NOT NULL CHECK (quantity_kg > 0),
  price_per_kg numeric NOT NULL CHECK (price_per_kg > 0),
  description text,
  image_url text,
  status text DEFAULT 'available' CHECK (status IN ('available', 'sold_out')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity_kg numeric NOT NULL CHECK (quantity_kg > 0),
  total_amount numeric NOT NULL CHECK (total_amount > 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered')),
  payment_id text,
  created_at timestamptz DEFAULT now()
);

-- Create farmer_adoptions table
CREATE TABLE IF NOT EXISTS farmer_adoptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farmer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(consumer_id, farmer_id)
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points integer NOT NULL DEFAULT 0,
  earned_from text NOT NULL CHECK (earned_from IN ('purchase', 'referral', 'donation', 'tip')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create price_predictions table
CREATE TABLE IF NOT EXISTS price_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  millet_type text NOT NULL,
  predicted_price numeric NOT NULL,
  confidence_score numeric DEFAULT 0.85,
  prediction_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create crop_advisories table
CREATE TABLE IF NOT EXISTS crop_advisories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  advisory_text text NOT NULL,
  weather_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('alert', 'scheme', 'weather', 'order', 'adoption')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_adoptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO authenticated
  USING (status = 'available');

CREATE POLICY "Farmers can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = farmer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'farmer')
  );

CREATE POLICY "Farmers can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = farmer_id)
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = farmer_id);

-- RLS Policies for orders
CREATE POLICY "Consumers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = consumer_id);

CREATE POLICY "Farmers can view orders for their products"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = orders.product_id AND products.farmer_id = auth.uid()
    )
  );

CREATE POLICY "Consumers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = consumer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'consumer')
  );

CREATE POLICY "Farmers can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products WHERE products.id = orders.product_id AND products.farmer_id = auth.uid()
    )
  );

-- RLS Policies for farmer_adoptions
CREATE POLICY "Consumers can view own adoptions"
  ON farmer_adoptions FOR SELECT
  TO authenticated
  USING (auth.uid() = consumer_id);

CREATE POLICY "Farmers can view their adopters"
  ON farmer_adoptions FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

CREATE POLICY "Consumers can adopt farmers"
  ON farmer_adoptions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = consumer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'consumer')
  );

CREATE POLICY "Consumers can update own adoptions"
  ON farmer_adoptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = consumer_id)
  WITH CHECK (auth.uid() = consumer_id);

-- RLS Policies for rewards
CREATE POLICY "Users can view own rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for price_predictions
CREATE POLICY "Farmers can view price predictions"
  ON price_predictions FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'farmer')
  );

-- RLS Policies for crop_advisories
CREATE POLICY "Farmers can view own advisories"
  ON crop_advisories FOR SELECT
  TO authenticated
  USING (auth.uid() = farmer_id);

CREATE POLICY "System can insert advisories"
  ON crop_advisories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = farmer_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_orders_consumer_id ON orders(consumer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_farmer_adoptions_consumer ON farmer_adoptions(consumer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_adoptions_farmer ON farmer_adoptions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_rewards_user_id ON rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
