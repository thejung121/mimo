import { useState, useCallback, useEffect } from 'react';
import { MimoPackage } from '@/types/creator';
import { emptyPackage } from './mimo-packages/packageData';
import { usePackageFeatures } from './mimo-packages/usePackageFeatures';
import { usePackageMedia } from './mimo-packages/usePackageMedia';
import { usePackageCRUD } from './mimo-packages/usePackageCRUD';
import { useToast } from '@/components/ui/use-toast';
import { getMimoPackages, saveMimoPackages } from '@/services/creator/packageService';
import { getCreatorPackages } from '@/services/supabase/creatorService';
import { useAuth } from '@/contexts/AuthContext';

export const useMimoPackages = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [mimoPackages, setMimoPackagesState] = useState<MimoPackage[]>([]);
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({...emptyPackage});
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        // First try to load from Supabase if user is authenticated
        if (user?.id) {
          const supabasePackages = await getCreatorPackages(user.id);
          if (supabasePackages && supabasePackages.length > 0) {
            console.log("Loaded packages from Supabase:", supabasePackages);
            setMimoPackagesState(supabasePackages);
            // Also save to localStorage for faster access next time
            saveMimoPackages(supabasePackages);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to local storage
        const localPackages = getMimoPackages();
        console.log("Loaded packages from local storage:", localPackages);
        setMimoPackagesState(localPackages);
      } catch (error) {
        console.error("Error loading packages:", error);
        setMimoPackagesState([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPackages();
  }, [user]);
  
  // Save packages whenever they change - this ensures immediate saving
  useEffect(() => {
    if (!isLoading) {
      console.log("Auto-saving packages to storage:", mimoPackages);
      saveMimoPackages(mimoPackages);
    }
  }, [mimoPackages, isLoading]);
  
  // Memoize state updates to reduce re-renders
  const updateNewPackage = useCallback((changes: Partial<MimoPackage>) => {
    setNewPackage(prev => ({
      ...prev,
      ...changes
    }));
  }, []);

  // Enhanced setMimoPackages function that can handle both direct arrays and updater functions
  const setMimoPackages = useCallback((updater: MimoPackage[] | ((prev: MimoPackage[]) => MimoPackage[])) => {
    // Add error handling to prevent state corruption
    try {
      setMimoPackagesState(prevPackages => {
        const newPackages = typeof updater === 'function' ? updater(prevPackages) : updater;
        
        // Immediately save to localStorage to ensure packages are persisted
        saveMimoPackages(newPackages);
        
        // Also save to Supabase if user is authenticated
        if (user?.id && newPackages && newPackages.length > 0) {
          // This is asynchronous but we don't need to wait for it to complete
          newPackages.forEach(pkg => {
            if (pkg.id) {
              updatePackageInSupabase(pkg, pkg.id?.toString());
            } else {
              savePackageToSupabase(pkg, user.id);
            }
          });
        }
        
        return newPackages;
      });
    } catch (error) {
      console.error("Error updating packages:", error);
      toast({
        title: "Erro ao atualizar pacotes",
        description: "Ocorreu um erro ao atualizar os pacotes. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  }, [toast, user]);
  
  // Import feature management functionality with memoization
  const { 
    handleAddFeature, 
    handleFeatureChange, 
    handleRemoveFeature 
  } = usePackageFeatures(newPackage, setNewPackage);
  
  // Import media management functionality
  const { 
    handleAddMedia, 
    handleRemoveMedia, 
    handleTogglePreview 
  } = usePackageMedia(mimoPackages, setMimoPackages, newPackage, setNewPackage);

  // Import package CRUD operations
  const { 
    handlePackageChange, 
    handleSavePackage, 
    handleDeletePackage, 
    handleEditPackage,
    isSaving
  } = usePackageCRUD(
    mimoPackages, 
    setMimoPackages, 
    newPackage, 
    setNewPackage,
    emptyPackage,
    setShowNewPackageForm
  );

  return {
    mimoPackages,
    setMimoPackages,
    showNewPackageForm,
    newPackage,
    isLoading,
    isSaving,
    handleAddFeature,
    handleFeatureChange,
    handleRemoveFeature,
    handlePackageChange,
    handleAddMedia,
    handleRemoveMedia,
    handleTogglePreview,
    handleSavePackage,
    handleDeletePackage,
    handleEditPackage,
    setShowNewPackageForm
  };
};
