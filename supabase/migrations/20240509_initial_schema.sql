
-- Create tables for the core functionality

-- Users table extension (extends auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Creators table
CREATE TABLE IF NOT EXISTS public.creators (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  cover TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_title TEXT,
  cover_subtitle TEXT,
  about TEXT,
  pix_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Social links for creators
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mimo packages offered by creators
CREATE TABLE IF NOT EXISTS public.mimo_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Features for Mimo packages
CREATE TABLE IF NOT EXISTS public.package_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.mimo_packages(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Media items for packages
CREATE TABLE IF NOT EXISTS public.package_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID NOT NULL REFERENCES public.mimo_packages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio')),
  url TEXT NOT NULL,
  caption TEXT,
  is_preview BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions table to track all purchases
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id),
  creator_id UUID NOT NULL REFERENCES public.creators(id),
  package_id UUID NOT NULL REFERENCES public.mimo_packages(id),
  buyer_alias TEXT NOT NULL,
  buyer_email TEXT,
  buyer_whatsapp TEXT,
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  creator_amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  reward_id UUID UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rewards table for tracking content sent to buyers
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID UNIQUE NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  message TEXT,
  access_token TEXT UNIQUE NOT NULL,
  expire_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reward content items
CREATE TABLE IF NOT EXISTS public.reward_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text')),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Withdrawals table to track money transfers to creators
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  pix_key TEXT NOT NULL,
  request_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Apply RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mimo_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded as needed)
CREATE POLICY "Public read access for creators" ON public.creators FOR SELECT USING (true);
CREATE POLICY "Owner can update their profile" ON public.creators FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public read access for mimo_packages" ON public.mimo_packages FOR SELECT USING (NOT is_hidden);
CREATE POLICY "Owner can CRUD their packages" ON public.mimo_packages FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Public read access for package_features" ON public.package_features FOR SELECT USING (true);
CREATE POLICY "Public read access for package_media" ON public.package_media FOR SELECT USING (true);

CREATE POLICY "Creator can see their transactions" ON public.transactions FOR SELECT USING (auth.uid() = creator_id);
CREATE POLICY "Buyer can see their transactions" ON public.transactions FOR SELECT USING (auth.uid() = buyer_id OR buyer_email = auth.email());

CREATE POLICY "Buyer can read their rewards" ON public.rewards 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.transactions t 
      WHERE t.id = transaction_id 
      AND (t.buyer_id = auth.uid() OR t.buyer_email = auth.email())
    )
  );

CREATE POLICY "Creator can see their withdrawals" ON public.withdrawals FOR SELECT USING (auth.uid() = creator_id);
