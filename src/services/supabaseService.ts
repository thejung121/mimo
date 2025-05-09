
// This file is kept for backwards compatibility
// It re-exports all services from the new modular structure

export {
  supabase,
  useDemo,
  getCurrentUser,
  getCreatorByUsername,
  getCreatorPackages,
  getCreatorTransactions,
  getRewardByToken,
  createRewardContent,
  createWithdrawalRequest,
  getCreatorWithdrawals,
  getAvailableBalance
} from './supabase';
