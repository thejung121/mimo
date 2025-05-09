
import { supabase, useDemo } from './supabaseClient';
import { getTransactions, getAvailableBalanceFromLocal } from '../creatorDataService';

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

export const getAvailableBalance = async (creatorId: string) => {
  if (useDemo) {
    // Use local storage data in demo mode
    return getAvailableBalanceFromLocal();
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
