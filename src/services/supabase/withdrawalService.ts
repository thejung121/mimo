
import { supabase, useDemo } from './supabaseClient';
import { getWithdrawals } from '../creatorDataService';

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
