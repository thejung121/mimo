
-- Create a bucket for user uploads (avatars, covers, etc)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_uploads', 'user_uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the user_uploads bucket
CREATE POLICY "Users can upload files to user_uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user_uploads');

CREATE POLICY "Users can update their own files in user_uploads"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'user_uploads' AND auth.uid() = owner);

CREATE POLICY "Anyone can download from user_uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'user_uploads');
