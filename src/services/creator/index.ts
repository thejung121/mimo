
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
  saveCreatorData(creator);
  saveMimoPackages(packages);
};
