
import { MimoPackage } from '@/types/creator';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

// Get the current authenticated user from localStorage
const getCurrentUser = () => {
  const authUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!authUser) return null;
  
  try {
    return JSON.parse(authUser);
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return null;
  }
};

// Get mimo packages with proper user association
export const getMimoPackages = (): MimoPackage[] => {
  const user = getCurrentUser();
  
  // If not logged in, return empty array
  if (!user) {
    console.log("User not logged in, returning empty package list");
    return [];
  }
  
  // Try to load stored packages data
  const packagesKey = `mimo:packages:${user.id}`;
  const storedPackages = localStorage.getItem(packagesKey);
  
  if (storedPackages) {
    try {
      const parsed = JSON.parse(storedPackages);
      console.log("Loaded packages from local storage:", parsed);
      return parsed;
    } catch (e) {
      console.error("Failed to parse packages data", e);
      // Return empty array for authenticated users
      return [];
    }
  } else {
    console.log("No packages found in localStorage for user:", user.id);
  }
  
  // If no stored packages, return empty array for new users
  return [];
};

// Save mimo packages with user ID association
export const saveMimoPackages = (packages: MimoPackage[]): void => {
  const user = getCurrentUser();
  
  if (!user) {
    // If not logged in, just update in session, not persisted
    console.warn("Attempting to save packages data without being logged in");
    return;
  }
  
  const packagesKey = `mimo:packages:${user.id}`;
  
  try {
    localStorage.setItem(packagesKey, JSON.stringify(packages));
    console.log("Saved packages to storage:", packages);
    
    // Debug to check if packages are properly saved
    const savedPackages = localStorage.getItem(packagesKey);
    if (savedPackages) {
      console.log("Verified saved packages:", JSON.parse(savedPackages));
    }
  } catch (error) {
    console.error("Error saving packages to localStorage:", error);
  }
};

// Get packages for a specific creator by username
export const getPackagesByUsername = (username: string | null | undefined): MimoPackage[] => {
  if (!username) {
    console.log("No username provided to getPackagesByUsername");
    return [];
  }
  
  // Try to find user ID from username
  const allUsers = Object.keys(localStorage)
    .filter(key => key.startsWith(LOCAL_STORAGE_KEY) || key === LOCAL_STORAGE_KEY)
    .map(key => {
      try {
        return JSON.parse(localStorage.getItem(key) || "{}");
      } catch (e) {
        return null;
      }
    })
    .filter(user => user && user.username === username);
  
  if (allUsers.length === 0) {
    console.log(`No user found with username: ${username}`);
    return [];
  }
  
  const user = allUsers[0];
  const packagesKey = `mimo:packages:${user.id}`;
  const storedPackages = localStorage.getItem(packagesKey);
  
  if (storedPackages) {
    try {
      const parsed = JSON.parse(storedPackages);
      console.log(`Loaded packages for username ${username}:`, parsed);
      // Filter out hidden packages
      return parsed.filter((pkg: MimoPackage) => !pkg.isHidden);
    } catch (e) {
      console.error(`Failed to parse packages data for username ${username}`, e);
      return [];
    }
  }
  
  return [];
};
