-- ============================================================================
-- Cash4Shirts — FULL SCHEMA (one-shot rebuild)
-- ============================================================================
-- Use this ONLY if you had to create a brand-new Supabase project (e.g. the old
-- one was deleted after being paused >90 days). Paste the whole file into the
-- Supabase SQL Editor and click Run. It builds the final state of everything in
-- one go, so you do NOT need to run the numbered migrations 001–006 separately.
--
-- If your old project simply RESTORED, do not run this — your tables already
-- exist. Just run migrations/006_drop_notify_trigger.sql instead.
-- ============================================================================

-- ---------- Leads ----------
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'purchased', 'lost');

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    location TEXT NOT NULL,                       -- state code (e.g. "IN") or free text
    quiz_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    status lead_status DEFAULT 'new' NOT NULL,
    user_comments TEXT,                           -- details the seller typed
    admin_notes TEXT                              -- internal notes
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_location ON leads(location);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON leads
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON leads
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated updates" ON leads
    FOR UPDATE TO authenticated USING (true);

-- NOTE: no notification trigger here on purpose — notifications now happen in the
-- Next.js /api/leads route (Twilio + Resend), so the old DB trigger is omitted.

-- ---------- Storage bucket for shirt photos ----------
INSERT INTO storage.buckets (id, name, public)
VALUES ('shirt-images', 'shirt-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Allow anonymous uploads" ON storage.objects
    FOR INSERT TO anon WITH CHECK (bucket_id = 'shirt-images');
CREATE POLICY "Allow public reads" ON storage.objects
    FOR SELECT TO anon, authenticated USING (bucket_id = 'shirt-images');
CREATE POLICY "Allow authenticated full access" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'shirt-images')
    WITH CHECK (bucket_id = 'shirt-images');

-- ---------- Recent buys (Hall of Fame) ----------
CREATE TABLE recent_buys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    price_paid NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    technical_details JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE recent_buys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on recent_buys" ON recent_buys
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated full access on recent_buys" ON recent_buys
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
