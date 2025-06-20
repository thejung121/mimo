
-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  buyer_alias TEXT NOT NULL,
  buyer_email TEXT,
  buyer_whatsapp TEXT,
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL DEFAULT 0,
  creator_amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create withdrawals table  
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')) DEFAULT 'pending',
  pix_key TEXT NOT NULL,
  request_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their transactions" ON public.transactions
FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "System can insert transactions" ON public.transactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update transactions" ON public.transactions
FOR UPDATE USING (true);

-- RLS policies for withdrawals
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view their withdrawals" ON public.withdrawals
FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can create withdrawal requests" ON public.withdrawals
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "System can update withdrawals" ON public.withdrawals
FOR UPDATE USING (true);
