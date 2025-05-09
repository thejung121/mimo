
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// User-related functions
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
};

// Creator-related functions
export const getCreatorByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from('creators')
    .select('*, social_links(*)')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error getting creator:', error);
    return null;
  }
  
  return data;
};

export const getCreatorPackages = async (creatorId: string) => {
  const { data, error } = await supabase
    .from('mimo_packages')
    .select('*, package_features(*), package_media(*)')
    .eq('creator_id', creatorId)
    .eq('is_hidden', false);
  
  if (error) {
    console.error('Error getting creator packages:', error);
    return [];
  }
  
  return data;
};

// Transaction-related functions
export const getCreatorTransactions = async (creatorId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, rewards(*)')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting creator transactions:', error);
    return [];
  }
  
  return data;
};

// Reward-related functions
export const getRewardByToken = async (token: string) => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*, transactions!inner(*, creators(*)), reward_content(*)')
    .eq('access_token', token)
    .single();
  
  if (error) {
    console.error('Error getting reward:', error);
    return null;
  }
  
  return data;
};

export const createRewardContent = async (rewardId: string, contents: Array<{ type: string; url: string; caption?: string; }>) => {
  const { error } = await supabase
    .from('reward_content')
    .insert(
      contents.map(content => ({
        reward_id: rewardId,
        type: content.type,
        url: content.url,
        caption: content.caption,
      }))
    );
  
  if (error) {
    console.error('Error creating reward content:', error);
    throw error;
  }
};

// Withdrawal-related functions
export const createWithdrawalRequest = async (creatorId: string, amount: number, pixKey: string) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .insert({
      creator_id: creatorId,
      amount,
      status: 'pending',
      pix_key: pixKey,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating withdrawal request:', error);
    throw error;
  }
  
  return data;
};

export const getCreatorWithdrawals = async (creatorId: string) => {
  const { data, error } = await supabase
    .from('withdrawals')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting creator withdrawals:', error);
    return [];
  }
  
  return data;
};

export const getAvailableBalance = async (creatorId: string) => {
  // Get total amount from completed transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('creator_amount')
    .eq('creator_id', creatorId)
    .eq('status', 'completed');
  
  if (transactionsError) {
    console.error('Error getting transactions:', transactionsError);
    return 0;
  }
  
  // Get total amount from completed withdrawals
  const { data: withdrawals, error: withdrawalsError } = await supabase
    .from('withdrawals')
    .select('amount')
    .eq('creator_id', creatorId)
    .eq('status', 'completed');
  
  if (withdrawalsError) {
    console.error('Error getting withdrawals:', withdrawalsError);
    return 0;
  }
  
  // Calculate available balance
  const totalEarned = transactions.reduce((sum, tx) => sum + tx.creator_amount, 0);
  const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
  
  return totalEarned - totalWithdrawn;
};
