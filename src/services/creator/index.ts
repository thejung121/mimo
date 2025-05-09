
// Re-export all creator services
import { Creator, MimoPackage } from '@/types/creator';

// Re-export from profile service
export { 
  getCreatorData,
  saveCreatorData,
  createDefaultCreator
} from './profileService';

// Re-export from package service
export { 
  getMimoPackages,
  saveMimoPackages
} from './packageService';

// Re-export from financial service
export {
  getTransactions,
  getWithdrawals,
  getAvailableBalanceFromLocal,
  saveTransactions,
  saveWithdrawals,
  saveBalance
} from './financialService';

// Combined save function
export const saveAllData = (creator: Creator, packages: MimoPackage[]): void => {
  // Import the functions to use them within this function
  // This resolves the "Cannot find name" errors
  const { saveCreatorData } = require('./profileService');
  const { saveMimoPackages } = require('./packageService');
  
  saveCreatorData(creator);
  saveMimoPackages(packages);
};
