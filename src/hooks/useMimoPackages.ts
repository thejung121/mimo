import { useState, useCallback, useEffect } from 'react';
import { MimoPackage } from '@/types/creator';
import { emptyPackage } from './mimo-packages/packageData';
import { usePackageFeatures } from './mimo-packages/usePackageFeatures';
import { usePackageMedia } from './mimo-packages/usePackageMedia';
import { usePackageCRUD } from './mimo-packages/usePackageCRUD';
import { useToast } from '@/components/ui/use-toast';
import { getMimoPackages } from '@/services/creator';

export const useMimoPackages = () => {
  const { toast } = useToast();
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({...emptyPackage});
  
  // Load saved packages
  useEffect(() => {
    setMimoPackages(getMimoPackages());
  }, []);
  
  // Memoize state updates to reduce re-renders
  const updateNewPackage = useCallback((changes: Partial<MimoPackage>) => {
    setNewPackage(prev => ({
      ...prev,
      ...changes
    }));
  }, []);

  const updateMimoPackages = useCallback((updater: (prev: MimoPackage[]) => MimoPackage[]) => {
    // Add error handling to prevent state corruption
    try {
      setMimoPackages(updater);
    } catch (error) {
      console.error("Error updating packages:", error);
      toast({
        title: "Erro ao atualizar pacotes",
        description: "Ocorreu um erro ao atualizar os pacotes. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
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
  } = usePackageMedia(mimoPackages, updateMimoPackages, newPackage, setNewPackage);

  // Import package CRUD operations
  const { 
    handlePackageChange, 
    handleSavePackage, 
    handleDeletePackage, 
    handleEditPackage 
  } = usePackageCRUD(
    mimoPackages, 
    updateMimoPackages, 
    newPackage, 
    setNewPackage,
    emptyPackage,
    setShowNewPackageForm
  );

  return {
    mimoPackages,
    showNewPackageForm,
    newPackage,
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
