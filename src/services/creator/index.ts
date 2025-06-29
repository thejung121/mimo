
// Re-export all creator services
import { Creator, MimoPackage } from '@/types/creator';
import { updateCreatorProfile } from '@/services/supabase/creatorService';
import { saveCreatorData } from './profileService';
import { saveMimoPackages } from './packageSave';

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

// Combined save function - fix signature to accept optional force parameter
export const saveAllData = async (creator: Creator, packages?: MimoPackage[], force?: boolean): Promise<boolean> => {
  try {
    console.log('Saving all data to Supabase and local storage');
    
    // Try to save to Supabase first
    let success = false;
    try {
      if (creator.id) {
        success = await updateCreatorProfile(creator);
      }
    } catch (error) {
      console.error('Failed to save to Supabase:', error);
    }
    
    // Also save to local storage regardless of Supabase result
    saveCreatorData(creator, force);
    if (packages) {
      saveMimoPackages(packages);
    }
    
    console.log('Data saved successfully to local storage');
    return true;
  } catch (error) {
    console.error('Error in saveAllData:', error);
    return false;
  }
};
