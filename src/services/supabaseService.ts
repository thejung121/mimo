
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { getTransactions, getWithdrawals, getAvailableBalance } from './creatorDataService';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In development or when environment variables are not set,
// use demo values to prevent the app from crashing
const useDemo = !supabaseUrl || !supabaseAnonKey;

if (useDemo) {
  console.warn(
    'Supabase environment variables are missing. Using demo mode with limited functionality. ' +
    'Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Create Supabase client - use demo settings if needed
// Make sure to use a valid URL format for the demo
export const supabase = createClient<Database>(
  useDemo ? 'https://example.supabase.co' : supabaseUrl,
  useDemo ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.magsCuCyBc1-NOQ6F_Vz2A' : supabaseAnonKey
);

// User-related functions
export const getCurrentUser = async () => {
  if (useDemo) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
};

// Creator-related functions
export const getCreatorByUsername = async (username: string) => {
  if (useDemo) return null;
  
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
  if (useDemo) {
    // Use local storage data in demo mode
    return [];
  }
  
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
  if (useDemo) {
    // Use local storage data in demo mode
    return getTransactions();
  }
  
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
  if (useDemo) return null;
  
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
  if (useDemo) return;
  
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
  if (useDemo) {
    // Simulated withdrawal in demo mode
    const withdrawal = {
      id: Date.now().toString(),
      creator_id: creatorId,
      amount,
      status: 'pending',
      pix_key: pixKey,
      request_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to local storage
    const withdrawals = getWithdrawals();
    withdrawals.push(withdrawal);
    
    const user = localStorage.getItem('mimo:auth');
    if (user) {
      const parsedUser = JSON.parse(user);
      const withdrawalsKey = `mimo:withdrawals:${parsedUser.id}`;
      localStorage.setItem(withdrawalsKey, JSON.stringify(withdrawals));
    }
    
    return withdrawal;
  }
  
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
  if (useDemo) {
    // Use local storage data in demo mode
    return getWithdrawals();
  }
  
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
  if (useDemo) {
    // Use local storage data in demo mode
    return getAvailableBalance();
  }
  
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
