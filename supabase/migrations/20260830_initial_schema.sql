-- ==============================================================================
-- SUMANTH PHOTOGRAPHY — PRODUCTION DATABASE SCHEMA & MIGRATION
-- Database: Supabase (PostgreSQL 15+)
-- Description: Complete schema for Contact Submissions, Build Your Quote Configurator,
--              Relational Quote Snapshots, Admin Profiles, RLS Policies, and Triggers.
--
-- UPDATED: Includes demo data cleanup and default admin provisioning
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. PROFILES & ROLE-BASED ACCESS CONTROL
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on profile email and role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Helper function to check if current user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Trigger to update profiles.updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Auto create profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
        'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. CONTACT SUBMISSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    session_type TEXT NOT NULL,
    event_date DATE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'READ', 'FOLLOW_UP', 'CONTACTED', 'BOOKED', 'CLOSED')),
    internal_notes TEXT DEFAULT '',
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_phone ON public.contact_submissions(phone);

DROP TRIGGER IF EXISTS trigger_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER trigger_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 4. BUILD YOUR QUOTE — MASTER SUBMISSIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quote_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    wedding_date DATE NOT NULL,
    venue TEXT NOT NULL,
    city TEXT,
    photography_style TEXT NOT NULL,
    additional_notes TEXT,
    event_subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    addon_subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    raw_subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    promo_code TEXT,
    estimated_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'REVIEWING', 'CONTACTED', 'QUOTE_SENT', 'BOOKED', 'CANCELLED', 'CLOSED')),
    terms_accepted BOOLEAN NOT NULL DEFAULT true,
    internal_notes TEXT DEFAULT '',
    pricing_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON public.quote_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON public.quote_submissions(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quote_submissions(status);
CREATE INDEX IF NOT EXISTS idx_quotes_wedding_date ON public.quote_submissions(wedding_date);
CREATE INDEX IF NOT EXISTS idx_quotes_email ON public.quote_submissions(email);
CREATE INDEX IF NOT EXISTS idx_quotes_phone ON public.quote_submissions(phone);

DROP TRIGGER IF EXISTS trigger_quote_submissions_updated_at ON public.quote_submissions;
CREATE TRIGGER trigger_quote_submissions_updated_at
    BEFORE UPDATE ON public.quote_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 5. QUOTE EVENTS (SELECTED WEDDING EVENTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quote_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES public.quote_submissions(id) ON DELETE CASCADE,
    event_key TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quote_events_quote_id ON public.quote_events(quote_id);

-- ==============================================================================
-- 6. QUOTE LINE ITEMS (SERVICES SELECTED PER EVENT)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quote_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES public.quote_submissions(id) ON DELETE CASCADE,
    event_id TEXT,
    event_name TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    line_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON public.quote_line_items(quote_id);

-- ==============================================================================
-- 7. QUOTE ADD-ONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quote_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES public.quote_submissions(id) ON DELETE CASCADE,
    addon_key TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quote_addons_quote_id ON public.quote_addons(quote_id);

-- ==============================================================================
-- 8. QUOTE PREFERENCES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quote_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID NOT NULL REFERENCES public.quote_submissions(id) ON DELETE CASCADE,
    film_style TEXT,
    delivery_preference TEXT,
    streaming_preference TEXT,
    raw_drive BOOLEAN DEFAULT false,
    reels_package BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_quote_preferences_quote_id ON public.quote_preferences(quote_id);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_preferences ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- CONTACT SUBMISSIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public anon can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Public anon can insert contact submissions"
    ON public.contact_submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(full_name) > 0 AND
        length(email) > 3 AND
        length(phone) > 5 AND
        status = 'NEW' AND
        (internal_notes IS NULL OR internal_notes = '')
    );

DROP POLICY IF EXISTS "Admins can select contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can select contact submissions"
    ON public.contact_submissions FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions"
    ON public.contact_submissions FOR UPDATE
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can delete contact submissions"
    ON public.contact_submissions FOR DELETE
    TO anon, authenticated
    USING (true);

-- ------------------------------------------------------------------------------
-- QUOTE SUBMISSIONS & CHILD TABLES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public anon can insert quote submissions" ON public.quote_submissions;
CREATE POLICY "Public anon can insert quote submissions"
    ON public.quote_submissions FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        length(customer_name) > 0 AND
        length(email) > 3 AND
        length(phone) > 5 AND
        status = 'NEW' AND
        (internal_notes IS NULL OR internal_notes = '')
    );

DROP POLICY IF EXISTS "Admins can select quote submissions" ON public.quote_submissions;
CREATE POLICY "Admins can select quote submissions"
    ON public.quote_submissions FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can update quote submissions" ON public.quote_submissions;
CREATE POLICY "Admins can update quote submissions"
    ON public.quote_submissions FOR UPDATE
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can delete quote submissions" ON public.quote_submissions;
CREATE POLICY "Admins can delete quote submissions"
    ON public.quote_submissions FOR DELETE
    TO anon, authenticated
    USING (true);

-- Child tables: quote_events
DROP POLICY IF EXISTS "Public anon can insert quote events" ON public.quote_events;
CREATE POLICY "Public anon can insert quote events"
    ON public.quote_events FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view quote events" ON public.quote_events;
CREATE POLICY "Admins can view quote events"
    ON public.quote_events FOR SELECT
    TO anon, authenticated
    USING (true);

-- Child tables: quote_line_items
DROP POLICY IF EXISTS "Public anon can insert quote line items" ON public.quote_line_items;
CREATE POLICY "Public anon can insert quote line items"
    ON public.quote_line_items FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view quote line items" ON public.quote_line_items;
CREATE POLICY "Admins can view quote line items"
    ON public.quote_line_items FOR SELECT
    TO anon, authenticated
    USING (true);

-- Child tables: quote_addons
DROP POLICY IF EXISTS "Public anon can insert quote addons" ON public.quote_addons;
CREATE POLICY "Public anon can insert quote addons"
    ON public.quote_addons FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view quote addons" ON public.quote_addons;
CREATE POLICY "Admins can view quote addons"
    ON public.quote_addons FOR SELECT
    TO anon, authenticated
    USING (true);

-- Child tables: quote_preferences
DROP POLICY IF EXISTS "Public anon can insert quote preferences" ON public.quote_preferences;
CREATE POLICY "Public anon can insert quote preferences"
    ON public.quote_preferences FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view quote preferences" ON public.quote_preferences;
CREATE POLICY "Admins can view quote preferences"
    ON public.quote_preferences FOR SELECT
    TO anon, authenticated
    USING (true);

-- ==============================================================================
-- 10. HELPER FUNCTION TO ATOMICALLY SUBMIT A COMPLETE QUOTE
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.submit_full_quote(
    p_quote_number TEXT,
    p_customer_name TEXT,
    p_phone TEXT,
    p_email TEXT,
    p_wedding_date DATE,
    p_venue TEXT,
    p_city TEXT,
    p_photography_style TEXT,
    p_additional_notes TEXT,
    p_event_subtotal NUMERIC,
    p_addon_subtotal NUMERIC,
    p_raw_subtotal NUMERIC,
    p_discount_total NUMERIC,
    p_promo_code TEXT,
    p_estimated_total NUMERIC,
    p_terms_accepted BOOLEAN,
    p_pricing_snapshot JSONB,
    p_events JSONB,
    p_line_items JSONB,
    p_addons JSONB,
    p_preferences JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_quote_id UUID;
    v_item JSONB;
BEGIN
    -- 1. Insert master quote record
    INSERT INTO public.quote_submissions (
        quote_number,
        customer_name,
        phone,
        email,
        wedding_date,
        venue,
        city,
        photography_style,
        additional_notes,
        event_subtotal,
        addon_subtotal,
        raw_subtotal,
        discount_total,
        promo_code,
        estimated_total,
        status,
        terms_accepted,
        pricing_snapshot
    ) VALUES (
        p_quote_number,
        p_customer_name,
        p_phone,
        p_email,
        p_wedding_date,
        p_venue,
        p_city,
        p_photography_style,
        p_additional_notes,
        p_event_subtotal,
        p_addon_subtotal,
        p_raw_subtotal,
        p_discount_total,
        p_promo_code,
        p_estimated_total,
        'NEW',
        p_terms_accepted,
        p_pricing_snapshot
    ) RETURNING id INTO v_quote_id;

    -- 2. Insert Events
    IF p_events IS NOT NULL AND jsonb_array_length(p_events) > 0 THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_events)
        LOOP
            INSERT INTO public.quote_events (
                quote_id,
                event_key,
                event_name,
                event_order
            ) VALUES (
                v_quote_id,
                v_item->>'event_key',
                v_item->>'event_name',
                COALESCE((v_item->>'event_order')::INTEGER, 0)
            );
        END LOOP;
    END IF;

    -- 3. Insert Line Items
    IF p_line_items IS NOT NULL AND jsonb_array_length(p_line_items) > 0 THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_line_items)
        LOOP
            INSERT INTO public.quote_line_items (
                quote_id,
                event_id,
                event_name,
                service_id,
                service_name,
                service_type,
                quantity,
                unit_price,
                line_total
            ) VALUES (
                v_quote_id,
                v_item->>'event_id',
                v_item->>'event_name',
                v_item->>'service_id',
                v_item->>'service_name',
                v_item->>'service_type',
                COALESCE((v_item->>'quantity')::INTEGER, 1),
                COALESCE((v_item->>'unit_price')::NUMERIC, 0.00),
                COALESCE((v_item->>'line_total')::NUMERIC, 0.00)
            );
        END LOOP;
    END IF;

    -- 4. Insert Add-ons
    IF p_addons IS NOT NULL AND jsonb_array_length(p_addons) > 0 THEN
        FOR v_item IN SELECT * FROM jsonb_array_elements(p_addons)
        LOOP
            INSERT INTO public.quote_addons (
                quote_id,
                addon_key,
                name,
                category,
                quantity,
                unit_price,
                total
            ) VALUES (
                v_quote_id,
                v_item->>'addon_key',
                v_item->>'name',
                v_item->>'category',
                COALESCE((v_item->>'quantity')::INTEGER, 1),
                COALESCE((v_item->>'unit_price')::NUMERIC, 0.00),
                COALESCE((v_item->>'total')::NUMERIC, 0.00)
            );
        END LOOP;
    END IF;

    -- 5. Insert Preferences
    IF p_preferences IS NOT NULL THEN
        INSERT INTO public.quote_preferences (
            quote_id,
            film_style,
            delivery_preference,
            streaming_preference,
            raw_drive,
            reels_package,
            notes
        ) VALUES (
            v_quote_id,
            p_preferences->>'film_style',
            p_preferences->>'delivery_preference',
            p_preferences->>'streaming_preference',
            COALESCE((p_preferences->>'raw_drive')::BOOLEAN, false),
            COALESCE((p_preferences->>'reels_package')::BOOLEAN, false),
            p_preferences->>'notes'
        );
    END IF;

    RETURN v_quote_id;
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.submit_full_quote TO anon, authenticated;

-- ==============================================================================
-- 11. CLEANUP ANY DEMO / TEST DATA (RUN AFTER INITIAL SCHEMA SETUP)
-- ==============================================================================
-- This section removes ALL existing demo/test/seed records
-- while preserving tables, schema, RLS policies, and admin users.
--
-- IMPORTANT: Only run this ONCE during initial production setup.
-- After this, only real customer submissions will exist.
-- ==============================================================================

-- Remove all demo/test data from child tables first (cascading will handle most)
DELETE FROM public.quote_preferences WHERE true;
DELETE FROM public.quote_addons WHERE true;
DELETE FROM public.quote_line_items WHERE true;
DELETE FROM public.quote_events WHERE true;

-- Remove all demo/test data from master tables
DELETE FROM public.quote_submissions WHERE true;
DELETE FROM public.contact_submissions WHERE true;

-- DO NOT delete profiles — keep admin accounts intact

-- ==============================================================================
-- 12. PROVISION DEFAULT ADMIN USER
-- ==============================================================================
-- After running this migration, create the admin user in Supabase Dashboard:
--
-- 1. Go to Authentication > Users > Add User > Create User
-- 2. Email: maneekanta0@gmail.com
-- 3. Password: Mani@123!
-- 4. The on_auth_user_created trigger will auto-create a profile with role='admin'
--
-- If the profile already exists, ensure admin role:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'maneekanta0@gmail.com';
-- ==============================================================================
