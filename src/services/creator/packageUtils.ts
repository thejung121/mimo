
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

// Get the current authenticated user from localStorage
export const getCurrentUser = () => {
  const authUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!authUser) return null;
  
  try {
    return JSON.parse(authUser);
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return null;
  }
};

// Helper for UUID validation
export const isUUID = (id: string | number): boolean => {
  if (typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Helper for safely parsing numeric IDs
export const safeParseInt = (value: string | number): number => {
  if (typeof value === 'number') return value;
  const parsed = parseInt(value, 10);
  return !isNaN(parsed) ? parsed : 0;
};
