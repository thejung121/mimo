
-- Update creators table to match the application needs
ALTER TABLE public.creators 
ADD COLUMN IF NOT EXISTS pix_key TEXT,
ADD COLUMN IF NOT EXISTS cover_title TEXT,
ADD COLUMN IF NOT EXISTS cover_subtitle TEXT;

-- Update RLS policies for creators
DROP POLICY IF EXISTS "Public read access for creators" ON public.creators;
DROP POLICY IF EXISTS "Owner can update their profile" ON public.creators;

CREATE POLICY "Public read access for creators" ON public.creators 
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own creator profile" ON public.creators
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own creator profile" ON public.creators 
FOR UPDATE USING (auth.uid() = id);

-- Ensure username is unique
CREATE UNIQUE INDEX IF NOT EXISTS creators_username_unique ON public.creators (username);
