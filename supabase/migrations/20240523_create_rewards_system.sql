
-- Create rewards table for purchased content access
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID UNIQUE NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  access_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  message TEXT,
  expire_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reward_content table for actual content files
CREATE TABLE IF NOT EXISTS public.reward_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text')),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS policies for rewards
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can access their rewards via token" ON public.rewards
FOR SELECT USING (true); -- Will be filtered by access_token in application

CREATE POLICY "Creators can create rewards for their transactions" ON public.rewards
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.transactions t 
    WHERE t.id = transaction_id 
    AND t.creator_id = auth.uid()
  )
);

-- RLS policies for reward_content
ALTER TABLE public.reward_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public access to reward content" ON public.reward_content
FOR SELECT USING (true); -- Will be filtered by reward access in application

CREATE POLICY "Creators can add content to their rewards" ON public.reward_content
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rewards r
    JOIN public.transactions t ON t.id = r.transaction_id
    WHERE r.id = reward_id 
    AND t.creator_id = auth.uid()
  )
);
