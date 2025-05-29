
import { MimoPackage } from '@/types/creator';

export const saveMimoPackages = (packages: MimoPackage[]): boolean => {
  try {
    const userId = JSON.parse(localStorage.getItem('mimo:user') || '{}').id;
    if (!userId) {
      console.warn('No user ID found for saving packages');
      return false;
    }
    
    localStorage.setItem(`mimo:packages:${userId}`, JSON.stringify(packages));
    console.log('Packages saved to localStorage:', packages);
    return true;
  } catch (error) {
    console.error('Error saving packages to localStorage:', error);
    return false;
  }
};

export const savePackageToLocalStorage = (packages: MimoPackage[], userId: string): void => {
  try {
    localStorage.setItem(`mimo:packages:${userId}`, JSON.stringify(packages));
    console.log('Packages saved to localStorage:', packages);
  } catch (error) {
    console.error('Error saving packages to localStorage:', error);
  }
};

export const loadPackagesFromLocalStorage = (userId: string): MimoPackage[] => {
  try {
    const stored = localStorage.getItem(`mimo:packages:${userId}`);
    if (stored) {
      const packages = JSON.parse(stored);
      console.log('Packages loaded from localStorage:', packages);
      return packages;
    }
  } catch (error) {
    console.error('Error loading packages from localStorage:', error);
  }
  return [];
};
