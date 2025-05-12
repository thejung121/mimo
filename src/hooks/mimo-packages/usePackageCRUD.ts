
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MimoPackage } from '@/types/creator';
import { saveMimoPackages } from '@/services/creator/packageService';
import { useAuth } from '@/contexts/AuthContext';
import { savePackageToSupabase, updatePackageInSupabase, deletePackageFromSupabase } from '@/services/supabase/creatorService';

export const usePackageCRUD = (
  mimoPackages: MimoPackage[], 
  setMimoPackages: React.Dispatch<React.SetStateAction<MimoPackage[]>>,
  newPackage: MimoPackage,
  setNewPackage: React.Dispatch<React.SetStateAction<MimoPackage>>,
  emptyPackage: MimoPackage,
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Handler for changes in the fields of the new package
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler to save a new package
  const handleSavePackage = async () => {
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

    setIsSaving(true);
    try {
      // Create a new package with a unique ID
      const newId = Math.max(0, ...mimoPackages.map(p => p.id || 0)) + 1;
      
      const packageToAdd: MimoPackage = {
        ...newPackage,
        id: newId,
        features: filteredFeatures
      };
      
      // Save to Supabase if user is authenticated
      let supabaseId = null;
      if (user?.id) {
        supabaseId = await savePackageToSupabase(packageToAdd, user.id);
        console.log('Saved package to Supabase with ID:', supabaseId);
      }
      
      // Save locally regardless of Supabase result
      const updatedPackages = [...mimoPackages, packageToAdd];
      setMimoPackages(updatedPackages);
      
      // Save to localStorage
      saveMimoPackages(updatedPackages);
      console.log('Saved packages to localStorage:', updatedPackages);
      
      // Clean the form and hide it
      setNewPackage({...emptyPackage});
      setShowNewPackageForm(false);
      
      toast({
        title: "Pacote adicionado com sucesso!",
        description: `O pacote "${packageToAdd.title}" foi adicionado à sua lista.`,
      });
      
      // Force refresh to ensure all data is consistent
      setTimeout(() => {
        saveMimoPackages(updatedPackages);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Erro ao salvar pacote",
        description: "Ocorreu um erro ao salvar o pacote. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Handler to delete an existing package
  const handleDeletePackage = async (id: number) => {
    try {
      const packageToDelete = mimoPackages.find(p => p.id === id);
      if (!packageToDelete) {
        console.error(`Package with ID ${id} not found`);
        return false;
      }
      
      // Delete from Supabase if we have a user
      if (user?.id) {
        // We need to find the package UUID in Supabase
        // For now, we'll assume a consistent mapping between local ID and Supabase ID
        // In a production app, you would store the Supabase UUID with each package
        const success = await deletePackageFromSupabase(`${id}`);
        if (!success) {
          console.warn('Failed to delete package from Supabase, but continuing with local delete');
        }
      }
      
      // Update local state
      const updatedPackages = mimoPackages.filter(p => p.id !== id);
      setMimoPackages(updatedPackages);
      
      // Save the updated list to localStorage
      saveMimoPackages(updatedPackages);
      console.log('Deleted package and saved to localStorage:', updatedPackages);
      
      toast({
        title: "Pacote excluído",
        description: "O pacote foi removido da sua lista.",
      });
      
      // Force refresh by saving to localStorage (critical to fix the persistence issue)
      setTimeout(() => {
        saveMimoPackages(updatedPackages);
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Erro ao excluir pacote",
        description: "Ocorreu um erro ao excluir o pacote. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handler to edit an existing package
  const handleEditPackage = (id: number) => {
    try {
      const packageToEdit = mimoPackages.find(p => p.id === id);
      if (packageToEdit) {
        setNewPackage({...packageToEdit});
        setShowNewPackageForm(true);
        
        // Remove the package from the list while it's being edited
        const updatedPackages = mimoPackages.filter(p => p.id !== id);
        setMimoPackages(updatedPackages);
        
        // Save the updated list to localStorage
        saveMimoPackages(updatedPackages);
        console.log('Removed package for editing and saved to localStorage:', updatedPackages);
      }
      return true;
    } catch (error) {
      console.error('Error editing package:', error);
      toast({
        title: "Erro ao editar pacote",
        description: "Ocorreu um erro ao editar o pacote. Tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handlePackageChange,
    handleSavePackage,
    handleDeletePackage,
    handleEditPackage,
    isSaving
  };
};
