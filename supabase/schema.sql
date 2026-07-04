-- =============================================
-- AURA STREET — Supabase Database Schema
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (linked to auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL DEFAULT '',
  role       TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('super_admin', 'admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 2. PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price       NUMERIC(10, 2) NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('Hoodies', 'Jackets', 'Pants', 'Sneakers', 'Accessories')),
  stock       INTEGER NOT NULL DEFAULT 0,
  images      TEXT[] NOT NULL DEFAULT '{}',
  material    TEXT NOT NULL DEFAULT '',
  colorways   INTEGER NOT NULL DEFAULT 1,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 3. ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code       TEXT NOT NULL UNIQUE,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
  total            NUMERIC(10, 2) NOT NULL,
  items            JSONB NOT NULL DEFAULT '[]',
  shipping_address TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-increment order code
CREATE SEQUENCE IF NOT EXISTS order_code_seq START 8900;
CREATE OR REPLACE FUNCTION generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_code IS NULL OR NEW.order_code = '' THEN
    NEW.order_code := 'ORD-' || NEXTVAL('order_code_seq')::TEXT;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_code ON public.orders;
CREATE TRIGGER set_order_code
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_code();

-- =============================================
-- 4. ANALYTICS EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event      TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id   UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile; admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Products: anyone authenticated can read; only admin+ can write
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Orders: all authenticated staff can read; admins can update
CREATE POLICY "Authenticated users can view orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage orders" ON public.orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- Analytics: only admins+
CREATE POLICY "Admins can view analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- =============================================
-- 6. SEED DATA — Products
-- =============================================
INSERT INTO public.products (name, description, price, category, stock, material, colorways, images) VALUES
  ('Essential Hoodie', '450GSM heavy fleece, garment-dyed in jet black.', 245, 'Hoodies', 45, '450GSM Heavy Fleece', 3, ARRAY['/moto-jacket.png']),
  ('Shadow Hoodie II', '480GSM French Terry, oversized drape silhouette.', 265, 'Hoodies', 30, '480GSM French Terry', 2, ARRAY['/hero-editorial.png']),
  ('Moto Jacket', 'Premium calf leather, YKK Excella hardware.', 680, 'Jackets', 12, 'Premium Calf Leather', 1, ARRAY['/moto-jacket.png']),
  ('Tech Shell Jacket', 'Gore-Tex Pro, waterproof to 20,000mm.', 520, 'Jackets', 18, 'Gore-Tex Pro', 2, ARRAY['/collections-banner.png']),
  ('Tech Cargo Pants', 'Ripstop nylon, 8 functional pockets.', 320, 'Pants', 25, 'Ripstop Nylon', 3, ARRAY['/tech-cargos.png']),
  ('Tailored Jogger', 'Ponte Roma knit, tapered fit.', 195, 'Pants', 40, 'Ponte Roma Knit', 4, ARRAY['/editorial-spread.png']),
  ('Street Runner', 'Full-grain leather, gum sole.', 410, 'Sneakers', 20, 'Full-Grain Leather', 5, ARRAY['/street-sneaker.png']),
  ('Aura Beanie', 'Merino wool, ribbed construction.', 65, 'Accessories', 80, 'Merino Wool', 6, ARRAY['/hero-editorial.png'])
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. SEED DATA — Orders
-- =============================================
INSERT INTO public.orders (order_code, customer_name, customer_email, status, total, items) VALUES
  ('ORD-8924', 'Alex Chen', 'alex@example.com', 'Pending', 680.00, '[{"product_name":"Moto Jacket","quantity":1,"unit_price":680}]'),
  ('ORD-8923', 'Sarah Miller', 'sarah@example.com', 'Shipped', 245.00, '[{"product_name":"Essential Hoodie","quantity":1,"unit_price":245}]'),
  ('ORD-8922', 'David Kim', 'david@example.com', 'Delivered', 520.00, '[{"product_name":"Tech Shell Jacket","quantity":1,"unit_price":520}]'),
  ('ORD-8921', 'Emma Wilson', 'emma@example.com', 'Cancelled', 1200.00, '[{"product_name":"Multiple items","quantity":3,"unit_price":400}]'),
  ('ORD-8920', 'James Lee', 'james@example.com', 'Delivered', 265.00, '[{"product_name":"Shadow Hoodie II","quantity":1,"unit_price":265}]'),
  ('ORD-8919', 'Maria Garcia', 'maria@example.com', 'Shipped', 410.00, '[{"product_name":"Street Runner","quantity":1,"unit_price":410}]')
ON CONFLICT (order_code) DO NOTHING;

-- =============================================
-- 8. HELPER VIEWS for Analytics
-- =============================================

-- Revenue by month
CREATE OR REPLACE VIEW public.monthly_revenue AS
  SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(total) AS revenue,
    COUNT(*) AS order_count
  FROM public.orders
  WHERE status != 'Cancelled'
  GROUP BY month
  ORDER BY month DESC;

-- Revenue by day (last 7 days)
CREATE OR REPLACE VIEW public.daily_revenue_7d AS
  SELECT
    DATE(created_at) AS day,
    SUM(total) AS revenue,
    COUNT(*) AS order_count
  FROM public.orders
  WHERE status != 'Cancelled'
    AND created_at >= NOW() - INTERVAL '7 days'
  GROUP BY day
  ORDER BY day;

-- Orders by status
CREATE OR REPLACE VIEW public.orders_by_status AS
  SELECT status, COUNT(*) AS count
  FROM public.orders
  GROUP BY status;

-- =============================================
-- DONE! All tables, triggers, RLS, and seed data are ready.
-- =============================================
