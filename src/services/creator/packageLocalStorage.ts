
import { MimoPackage } from '@/types/creator';

// Helper for localStorage fallback
export const getLocalPackages = (userId: string): MimoPackage[] => {
  try {
    const packagesKey = `mimo:packages:${userId}`;
    const storedPackages = localStorage.getItem(packagesKey);
    
    if (storedPackages) {
      const parsed = JSON.parse(storedPackages);
      console.log("Loaded packages from local storage:", parsed);
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse packages data from localStorage", e);
  }
  
  return [];
};

// Save local backup of packages
export const saveLocalPackages = (userId: string, packages: MimoPackage[]): void => {
  try {
    const packagesKey = `mimo:packages:${userId}`;
    localStorage.setItem(packagesKey, JSON.stringify(packages));
    console.log("Saved packages to localStorage as backup:", packages);
  } catch (error) {
    console.error("Error saving packages to localStorage:", error);
  }
};
