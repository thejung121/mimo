
-- Update packages RLS policies for better security
DROP POLICY IF EXISTS "Public read access for mimo_packages" ON public.packages;
DROP POLICY IF EXISTS "Owner can CRUD their packages" ON public.packages;

-- Public can only see visible packages
CREATE POLICY "Public read access for visible packages" ON public.packages
FOR SELECT USING (NOT is_hidden);

-- Creators can see all their own packages
CREATE POLICY "Creators can view their own packages" ON public.packages
FOR SELECT USING (auth.uid() = creator_id);

-- Creators can create their own packages
CREATE POLICY "Creators can create packages" ON public.packages
FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own packages
CREATE POLICY "Creators can update their packages" ON public.packages
FOR UPDATE USING (auth.uid() = creator_id);

-- Creators can delete their own packages
CREATE POLICY "Creators can delete their packages" ON public.packages
FOR DELETE USING (auth.uid() = creator_id);

-- Update package_features policies
DROP POLICY IF EXISTS "Public read access for package_features" ON public.package_features;

CREATE POLICY "Public read access for package features" ON public.package_features
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.packages p 
    WHERE p.id = package_id 
    AND NOT p.is_hidden
  )
);

CREATE POLICY "Creators can manage their package features" ON public.package_features
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.packages p 
    WHERE p.id = package_id 
    AND p.creator_id = auth.uid()
  )
);

-- Update package_media policies
DROP POLICY IF EXISTS "Public read access for package_media" ON public.package_media;

CREATE POLICY "Public read access for package media" ON public.package_media
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.packages p 
    WHERE p.id = package_id 
    AND NOT p.is_hidden
  )
);

CREATE POLICY "Creators can manage their package media" ON public.package_media
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.packages p 
    WHERE p.id = package_id 
    AND p.creator_id = auth.uid()
  )
);
