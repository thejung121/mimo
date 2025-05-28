
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
    } catch (error) {
      console.error('Error loading packages:', error);
      toast({
        title: 'Erro ao carregar recompensas',
        description: 'Não foi possível carregar suas recompensas.',
        variant: 'destructive'
      });
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova recompensa
  const createNewPackage = async (packageData: Omit<MimoPackage, 'id'>): Promise<boolean> => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      const packageId = await createPackage(packageData, user.id);
      
      if (packageId) {
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
      toast({
        title: 'Erro ao criar recompensa',
        description: 'Não foi possível criar a recompensa.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Atualizar recompensa
  const updateExistingPackage = async (packageId: string, packageData: Partial<MimoPackage>): Promise<boolean> => {
    setSaving(true);
    try {
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
      toast({
        title: 'Erro ao atualizar recompensa',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Deletar recompensa
  const deleteExistingPackage = async (packageId: string): Promise<boolean> => {
    setSaving(true);
    try {
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
      toast({
        title: 'Erro ao remover recompensa',
        description: 'Não foi possível remover a recompensa.',
        variant: 'destructive'
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Alternar visibilidade
  const toggleVisibility = async (packageId: string, isHidden: boolean): Promise<boolean> => {
    try {
      const success = await togglePackageVisibility(packageId, isHidden);
      
      if (success) {
        // Atualizar estado local
        setPackages(prev => prev.map(pkg => 
          pkg.id === packageId ? { ...pkg, isHidden } : pkg
        ));
        
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
      toast({
        title: 'Erro ao alterar visibilidade',
        description: 'Não foi possível alterar a visibilidade da recompensa.',
        variant: 'destructive'
      });
      return false;
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
