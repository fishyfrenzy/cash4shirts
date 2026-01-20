-- Create the recent_buys table
CREATE TABLE recent_buys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    price_paid NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    technical_details JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE recent_buys ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to view recent buys
CREATE POLICY "Allow public select on recent_buys" ON recent_buys
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Allow authenticated users (admins) to manage recent buys
CREATE POLICY "Allow authenticated full access on recent_buys" ON recent_buys
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Comment for documentation
COMMENT ON TABLE recent_buys IS 'Showcases high-value vintage t-shirt purchases to build trust and authority.';
