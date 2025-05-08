
import { useState } from 'react';
import { MimoPackage } from '@/types/creator';
import { initialMimoPackages, emptyPackage } from './mimo-packages/packageData';
import { usePackageFeatures } from './mimo-packages/usePackageFeatures';
import { usePackageMedia } from './mimo-packages/usePackageMedia';
import { usePackageCRUD } from './mimo-packages/usePackageCRUD';

export const useMimoPackages = () => {
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>(initialMimoPackages);
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({...emptyPackage});
  
  // Import feature management functionality
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
    handleEditPackage 
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
