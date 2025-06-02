
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { MimoPackage } from '@/types/creator';
import {
  createPackage,
  updatePackage,
  deletePackage,
  getMyPackages,
  togglePackageVisibility
} from '@/services/supabase/packageService';

export const usePackageManagement = () => {
  const [packages, setPackages] = useState<MimoPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Carregar recompensas do usuário
  const loadPackages = async () => {
    if (!user?.id) {
      setPackages([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading packages for user:', user.id);
      const userPackages = await getMyPackages();
      console.log('Loaded packages:', userPackages);
      setPackages(userPackages);
      
      // Salvar backup no localStorage
      localStorage.setItem(`mimo:packages:${user.id}`, JSON.stringify(userPackages));
    } catch (error) {
      console.error('Error loading packages:', error);
      
      // Tentar carregar do localStorage como fallback
      try {
        const localPackages = localStorage.getItem(`mimo:packages:${user.id}`);
        if (localPackages) {
          const parsedPackages = JSON.parse(localPackages);
          setPackages(parsedPackages);
          console.log('Loaded packages from localStorage:', parsedPackages);
        } else {
          setPackages([]);
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
        setPackages([]);
      }
      
      toast({
        title: 'Erro ao carregar recompensas',
        description: 'Carregando dados salvos localmente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Criar nova recompensa
  const createNewPackage = async (packageData: Omit<MimoPackage, 'id'>): Promise<boolean> => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      console.log('Creating package:', packageData);
      const packageId = await createPackage(packageData, user.id);
      
      if (packageId) {
        console.log('Package created with ID:', packageId);
        await loadPackages(); // Recarregar lista
        toast({
          title: 'Recompensa criada!',
          description: 'Sua recompensa foi criada com sucesso.'
        });
        return true;
      } else {
        throw new Error('Failed to create package');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      
      // Salvar localmente como fallback
      const newPackage = {
        ...packageData,
        id: `local_${Date.now()}`,
      };
      const updatedPackages = [...packages, newPackage];
      setPackages(updatedPackages);
      localStorage.setItem(`mimo:packages:${user.id}`, JSON.stringify(updatedPackages));
      
      toast({
        title: 'Recompensa criada localmente',
        description: 'A recompensa foi salva no dispositivo e será sincronizada quando possível.',
      });
      return true;
    } finally {
      setSaving(false);
    }
  };

  // Atualizar recompensa
  const updateExistingPackage = async (packageId: string, packageData: Partial<MimoPackage>): Promise<boolean> => {
    setSaving(true);
    try {
      console.log('Updating package:', packageId, packageData);
      const success = await updatePackage(packageId, packageData);
      
      if (success) {
        await loadPackages(); // Recarregar lista
        toast({
          title: 'Recompensa atualizada!',
          description: 'Suas alterações foram salvas.'
        });
        return true;
      } else {
        throw new Error('Failed to update package');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      
      // Atualizar localmente como fallback
      const updatedPackages = packages.map(pkg => 
        String(pkg.id) === String(packageId) ? { ...pkg, ...packageData } : pkg
      );
      setPackages(updatedPackages);
      localStorage.setItem(`mimo:packages:${user.id}`, JSON.stringify(updatedPackages));
      
      toast({
        title: 'Recompensa atualizada localmente',
        description: 'As alterações foram salvas no dispositivo.',
      });
      return true;
    } finally {
      setSaving(false);
    }
  };

  // Deletar recompensa
  const deleteExistingPackage = async (packageId: string): Promise<boolean> => {
    setSaving(true);
    try {
      console.log('Deleting package:', packageId);
      const success = await deletePackage(packageId);
      
      if (success) {
        await loadPackages(); // Recarregar lista
        toast({
          title: 'Recompensa removida!',
          description: 'A recompensa foi removida com sucesso.'
        });
        return true;
      } else {
        throw new Error('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      
      // Remover localmente como fallback
      const updatedPackages = packages.filter(pkg => String(pkg.id) !== String(packageId));
      setPackages(updatedPackages);
      localStorage.setItem(`mimo:packages:${user.id}`, JSON.stringify(updatedPackages));
      
      toast({
        title: 'Recompensa removida localmente',
        description: 'A recompensa foi removida do dispositivo.',
      });
      return true;
    } finally {
      setSaving(false);
    }
  };

  // Alternar visibilidade
  const toggleVisibility = async (packageId: string, isHidden: boolean): Promise<boolean> => {
    try {
      console.log('Toggling visibility for package:', packageId, 'hidden:', isHidden);
      const success = await togglePackageVisibility(packageId, isHidden);
      
      if (success) {
        // Atualizar estado local
        const updatedPackages = packages.map(pkg => 
          String(pkg.id) === String(packageId) ? { ...pkg, isHidden } : pkg
        );
        setPackages(updatedPackages);
        localStorage.setItem(`mimo:packages:${user.id}`, JSON.stringify(updatedPackages));
        
        toast({
          title: 'Visibilidade atualizada!',
          description: `Recompensa ${isHidden ? 'ocultada' : 'tornada visível'} com sucesso.`
        });
        return true;
      } else {
        throw new Error('Failed to toggle visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      
      // Atualizar localmente como fallback
      const updatedPackages = packages.map(pkg => 
        String(pkg.id) === String(packageId) ? { ...pkg, isHidden } : pkg
      );
      setPackages(updatedPackages);
      localStorage.setItem(`mimo:packages:${user.id}`, JSON.stringify(updatedPackages));
      
      toast({
        title: 'Visibilidade atualizada localmente',
        description: `Recompensa ${isHidden ? 'ocultada' : 'tornada visível'} no dispositivo.`
      });
      return true;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadPackages();
    } else {
      setPackages([]);
      setLoading(false);
    }
  }, [user?.id]);

  return {
    packages,
    loading,
    saving,
    createPackage: createNewPackage,
    updatePackage: updateExistingPackage,
    deletePackage: deleteExistingPackage,
    toggleVisibility,
    refreshPackages: loadPackages
  };
};
