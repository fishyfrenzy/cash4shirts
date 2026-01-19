-- Create enum for lead status
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'purchased', 'lost');

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Contact Information
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    location TEXT NOT NULL CHECK (location IN ('indianapolis', 'florida')),

    -- Quiz Responses (JSONB for flexibility)
    quiz_responses JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Image URLs from Supabase Storage
    images TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Lead Status
    status lead_status DEFAULT 'new' NOT NULL,

    -- Optional notes for admin
    notes TEXT
);

-- Create index for faster queries on status and created_at
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_location ON leads(location);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for the quiz form)
CREATE POLICY "Allow anonymous inserts" ON leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON leads
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow authenticated updates (for status changes)
CREATE POLICY "Allow authenticated updates" ON leads
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create storage bucket for shirt images
INSERT INTO storage.buckets (id, name, public)
VALUES ('shirt-images', 'shirt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow anonymous uploads
CREATE POLICY "Allow anonymous uploads" ON storage.objects
    FOR INSERT
    TO anon
    WITH CHECK (bucket_id = 'shirt-images');

-- Storage policy: Allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
    FOR SELECT
    TO anon
    USING (bucket_id = 'shirt-images');

-- Function to notify on new lead (trigger for Edge Function)
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM net.http_post(
        url := current_setting('app.edge_function_url', true) || '/notify-new-lead',
        body := jsonb_build_object(
            'id', NEW.id,
            'full_name', NEW.full_name,
            'phone_number', NEW.phone_number,
            'location', NEW.location
        )
    );
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Don't fail the insert if notification fails
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call notify function on new lead
CREATE TRIGGER on_new_lead_created
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_lead();

-- Comment for documentation
COMMENT ON TABLE leads IS 'Stores lead information from the Cash 4 Shirts valuation quiz';
COMMENT ON COLUMN leads.quiz_responses IS 'JSONB containing: shirtType, decade, volume, condition';
COMMENT ON COLUMN leads.images IS 'Array of URLs from Supabase Storage shirt-images bucket';
