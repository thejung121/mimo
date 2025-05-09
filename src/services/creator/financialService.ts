
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

// Get the current authenticated user from localStorage
const getCurrentUser = () => {
  const authUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  return authUser ? JSON.parse(authUser) : null;
};

// Get transactions for the current user
export const getTransactions = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return []; // No transactions for unauthenticated users
  }
  
  const transactionsKey = `mimo:transactions:${user.id}`;
  const storedTransactions = localStorage.getItem(transactionsKey);
  
  if (storedTransactions) {
    try {
      return JSON.parse(storedTransactions);
    } catch (e) {
      console.error("Failed to parse transactions data", e);
      return [];
    }
  }
  
  return []; // New users have no transactions
};

// Get withdrawals for the current user
export const getWithdrawals = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return []; // No withdrawals for unauthenticated users
  }
  
  const withdrawalsKey = `mimo:withdrawals:${user.id}`;
  const storedWithdrawals = localStorage.getItem(withdrawalsKey);
  
  if (storedWithdrawals) {
    try {
      return JSON.parse(storedWithdrawals);
    } catch (e) {
      console.error("Failed to parse withdrawals data", e);
      return [];
    }
  }
  
  return []; // New users have no withdrawals
};

// Get available balance for the current user
export const getAvailableBalanceFromLocal = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return 0; // No balance for unauthenticated users
  }
  
  const balanceKey = `mimo:balance:${user.id}`;
  const storedBalance = localStorage.getItem(balanceKey);
  
  if (storedBalance) {
    try {
      return parseFloat(storedBalance);
    } catch (e) {
      console.error("Failed to parse balance data", e);
      return 0;
    }
  }
  
  return 0; // New users have no balance
};

// Save transactions data
export const saveTransactions = (transactions: any[]): void => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save transactions data without being logged in");
    return;
  }
  
  const transactionsKey = `mimo:transactions:${user.id}`;
  localStorage.setItem(transactionsKey, JSON.stringify(transactions));
};

// Save withdrawals data
export const saveWithdrawals = (withdrawals: any[]): void => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save withdrawals data without being logged in");
    return;
  }
  
  const withdrawalsKey = `mimo:withdrawals:${user.id}`;
  localStorage.setItem(withdrawalsKey, JSON.stringify(withdrawals));
};

// Save balance data
export const saveBalance = (balance: number): void => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save balance data without being logged in");
    return;
  }
  
  const balanceKey = `mimo:balance:${user.id}`;
  localStorage.setItem(balanceKey, balance.toString());
};
