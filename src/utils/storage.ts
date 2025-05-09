
// Local storage keys
export const LOCAL_STORAGE_KEY = 'mimo:auth';
export const USERS_STORAGE_KEY = 'mimo:users';

// Get item from local storage
export const getItemFromStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (!item) return null;
  
  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to parse item from storage with key ${key}`, error);
    localStorage.removeItem(key);
    return null;
  }
};

// Set item to local storage
export const setItemToStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Remove item from local storage
export const removeItemFromStorage = (key: string): void => {
  localStorage.removeItem(key);
};
