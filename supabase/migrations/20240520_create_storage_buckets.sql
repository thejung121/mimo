
-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('media', 'media', true, 52428800, ARRAY['image/*', 'video/*', 'audio/*']),
  ('user_uploads', 'user_uploads', true, 52428800, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for media bucket
CREATE POLICY "Allow authenticated users to upload media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public access to media" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Allow users to delete own media" ON storage.objects
FOR DELETE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for user_uploads bucket  
CREATE POLICY "Users can upload files to user_uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'user_uploads');

CREATE POLICY "Users can update their own files in user_uploads" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'user_uploads' AND auth.uid()::text = owner::text);

CREATE POLICY "Anyone can download from user_uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'user_uploads');
