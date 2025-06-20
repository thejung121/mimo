
-- Create creators table
CREATE TABLE public.creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  cover TEXT,
  description TEXT,
  cover_title TEXT,
  cover_subtitle TEXT,
  about TEXT,
  pix_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create packages table (renamed from mimo_packages to match the code)
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  highlighted BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create package_features table
CREATE TABLE public.package_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create package_media table
CREATE TABLE public.package_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.packages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create donations table (for AdminDashboard)
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  fan_username TEXT NOT NULL,
  package_id UUID REFERENCES public.packages(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  access_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID,
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id),
  buyer_alias TEXT NOT NULL,
  buyer_email TEXT,
  buyer_whatsapp TEXT,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  creator_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  reward_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create withdrawals table
CREATE TABLE public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  pix_key TEXT NOT NULL,
  request_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rewards table
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  message TEXT,
  access_token TEXT UNIQUE NOT NULL,
  expire_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reward_content table
CREATE TABLE public.reward_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create social_links table
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creators(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creators
CREATE POLICY "Public read access for creators" ON public.creators FOR SELECT USING (true);
CREATE POLICY "Users can insert their own creator profile" ON public.creators FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own creator profile" ON public.creators FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for packages
CREATE POLICY "Public read access for visible packages" ON public.packages FOR SELECT USING (is_hidden = false OR auth.uid() = creator_id);
CREATE POLICY "Creators can insert packages" ON public.packages FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their packages" ON public.packages FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their packages" ON public.packages FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for package features
CREATE POLICY "Public read access for package features" ON public.package_features FOR SELECT USING (true);
CREATE POLICY "Package owners can insert features" ON public.package_features FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.packages WHERE packages.id = package_features.package_id AND packages.creator_id = auth.uid())
);
CREATE POLICY "Package owners can update features" ON public.package_features FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.packages WHERE packages.id = package_features.package_id AND packages.creator_id = auth.uid())
);
CREATE POLICY "Package owners can delete features" ON public.package_features FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.packages WHERE packages.id = package_features.package_id AND packages.creator_id = auth.uid())
);

-- RLS Policies for package media
CREATE POLICY "Public read access for package media" ON public.package_media FOR SELECT USING (true);
CREATE POLICY "Package owners can insert media" ON public.package_media FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.packages WHERE packages.id = package_media.package_id AND packages.creator_id = auth.uid())
);
CREATE POLICY "Package owners can update media" ON public.package_media FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.packages WHERE packages.id = package_media.package_id AND packages.creator_id = auth.uid())
);
CREATE POLICY "Package owners can delete media" ON public.package_media FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.packages WHERE packages.id = package_media.package_id AND packages.creator_id = auth.uid())
);

-- RLS Policies for donations
CREATE POLICY "Creators can view their donations" ON public.donations FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Anyone can create donations" ON public.donations FOR INSERT WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Creators can view their transactions" ON public.transactions FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Anyone can create transactions" ON public.transactions FOR INSERT WITH CHECK (true);

-- RLS Policies for withdrawals
CREATE POLICY "Creators can view their withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Creators can create withdrawals" ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- RLS Policies for rewards
CREATE POLICY "Public can view rewards with valid token" ON public.rewards FOR SELECT USING (true);
CREATE POLICY "Anyone can create rewards" ON public.rewards FOR INSERT WITH CHECK (true);

-- RLS Policies for reward content
CREATE POLICY "Public can view reward content" ON public.reward_content FOR SELECT USING (true);
CREATE POLICY "Anyone can create reward content" ON public.reward_content FOR INSERT WITH CHECK (true);

-- RLS Policies for social links
CREATE POLICY "Public can view social links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Creators can manage their social links" ON public.social_links FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Creators can update their social links" ON public.social_links FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Creators can delete their social links" ON public.social_links FOR DELETE USING (auth.uid() = creator_id);

-- RLS Policies for user profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Create storage buckets
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
FOR INSERT WITH CHECK (bucket_id = 'user_uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own files in user_uploads" ON storage.objects
FOR UPDATE USING (bucket_id = 'user_uploads' AND auth.uid()::text = owner::text);

CREATE POLICY "Anyone can download from user_uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'user_uploads');
