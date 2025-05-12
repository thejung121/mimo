
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MimoPackage } from '@/types/creator';
import { saveMimoPackages } from '@/services/creator/packageService';

export const usePackageCRUD = (
  mimoPackages: MimoPackage[], 
  setMimoPackages: React.Dispatch<React.SetStateAction<MimoPackage[]>>,
  newPackage: MimoPackage,
  setNewPackage: React.Dispatch<React.SetStateAction<MimoPackage>>,
  emptyPackage: MimoPackage,
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();

  // Handler for changes in the fields of the new package
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler to save a new package
  const handleSavePackage = () => {
    // Basic validations
    if (!newPackage.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o pacote.",
        variant: "destructive"
      });
      return;
    }

    if (newPackage.price <= 0) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um preço válido maior que zero.",
        variant: "destructive"
      });
      return;
    }

    // Filter empty features
    const filteredFeatures = newPackage.features.filter(feature => feature.trim());
    if (filteredFeatures.length === 0) {
      toast({
        title: "Características obrigatórias",
        description: "Por favor, insira ao menos uma característica para o pacote.",
        variant: "destructive"
      });
      return;
    }

    // Create a new package with a unique ID
    const newId = Math.max(0, ...mimoPackages.map(p => p.id || 0)) + 1;
    const packageToAdd = {
      ...newPackage,
      id: newId,
      features: filteredFeatures
    };

    // Add the new package to the list
    const updatedPackages = [...mimoPackages, packageToAdd];
    setMimoPackages(updatedPackages);
    
    // Save the updated packages to localStorage
    saveMimoPackages(updatedPackages);
    
    // Clean the form and hide it
    setNewPackage({...emptyPackage});
    setShowNewPackageForm(false);
    
    toast({
      title: "Pacote adicionado com sucesso!",
      description: `O pacote "${packageToAdd.title}" foi adicionado à sua lista.`,
    });
    
    // Force refresh by saving to localStorage (critical to fix the persistence issue)
    setTimeout(() => {
      saveMimoPackages(updatedPackages);
    }, 100);
    
    return true;
  };

  // Handler to delete an existing package
  const handleDeletePackage = (id: number) => {
    const updatedPackages = mimoPackages.filter(p => p.id !== id);
    setMimoPackages(updatedPackages);
    
    // Save the updated list to localStorage
    saveMimoPackages(updatedPackages);
    
    toast({
      title: "Pacote excluído",
      description: "O pacote foi removido da sua lista.",
    });
    
    // Force refresh by saving to localStorage (critical to fix the persistence issue)
    setTimeout(() => {
      saveMimoPackages(updatedPackages);
    }, 100);
    
    return true;
  };

  // Handler to edit an existing package
  const handleEditPackage = (id: number) => {
    const packageToEdit = mimoPackages.find(p => p.id === id);
    if (packageToEdit) {
      setNewPackage({...packageToEdit});
      setShowNewPackageForm(true);
      
      // Remove the package from the list while it's being edited
      const updatedPackages = mimoPackages.filter(p => p.id !== id);
      setMimoPackages(updatedPackages);
      
      // Save the updated list to localStorage
      saveMimoPackages(updatedPackages);
    }
  };

  return {
    handlePackageChange,
    handleSavePackage,
    handleDeletePackage,
    handleEditPackage
  };
};
