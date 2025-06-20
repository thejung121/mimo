
-- Create indexes for better performance

-- Creators table indexes
CREATE INDEX IF NOT EXISTS idx_creators_username ON public.creators (username);
CREATE INDEX IF NOT EXISTS idx_creators_created_at ON public.creators (created_at);

-- Packages table indexes  
CREATE INDEX IF NOT EXISTS idx_packages_creator_id ON public.packages (creator_id);
CREATE INDEX IF NOT EXISTS idx_packages_is_hidden ON public.packages (is_hidden);
CREATE INDEX IF NOT EXISTS idx_packages_highlighted ON public.packages (highlighted);

-- Transactions table indexes
CREATE INDEX IF NOT EXISTS idx_transactions_creator_id ON public.transactions (creator_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions (status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions (created_at);

-- Withdrawals table indexes
CREATE INDEX IF NOT EXISTS idx_withdrawals_creator_id ON public.withdrawals (creator_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals (status);

-- Rewards table indexes
CREATE INDEX IF NOT EXISTS idx_rewards_access_token ON public.rewards (access_token);
CREATE INDEX IF NOT EXISTS idx_rewards_transaction_id ON public.rewards (transaction_id);

-- Package features and media indexes
CREATE INDEX IF NOT EXISTS idx_package_features_package_id ON public.package_features (package_id);
CREATE INDEX IF NOT EXISTS idx_package_media_package_id ON public.package_media (package_id);
