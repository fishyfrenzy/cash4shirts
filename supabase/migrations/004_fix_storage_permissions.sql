-- Ensure the storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('shirt-images', 'shirt-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Storage policy: Allow anonymous uploads (Crucial for the public quiz)
CREATE POLICY "Allow anonymous uploads" ON storage.objects
    FOR INSERT
    TO anon
    WITH CHECK (bucket_id = 'shirt-images');

-- Storage policy: Allow public reads
CREATE POLICY "Allow public reads" ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'shirt-images');

-- Optional: Allow authenticated users (like admin) to manage files
CREATE POLICY "Allow authenticated full access" ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'shirt-images')
    WITH CHECK (bucket_id = 'shirt-images');
