import { useState, useEffect } from 'react';
import { MimoPackage } from '@/types/creator';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

interface UseMimoPackagesProps {
  creatorId?: string;
}

type SortOrder = 'asc' | 'desc';

export const useMimoPackages = (creatorId?: string) => {
  const [packages, setPackages] = useState<MimoPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('creator_id', creatorId || user?.id)
        .order('price', { ascending: sortOrder === 'asc' });

      if (error) {
        setError(error);
        toast({
          title: 'Erro ao carregar pacotes',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setPackages(data || []);
      }
    } catch (err: any) {
      setError(err);
      toast({
        title: 'Erro inesperado',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePackage = async (packageData: MimoPackage) => {
    const newPackage = await savePackageToSupabase(packageData);
    if (newPackage) {
      setPackages(prevPackages => [...prevPackages, newPackage]);
      toast({
        title: 'Pacote salvo com sucesso!',
      });
    }
  };

  const updatePackage = async (packageData: MimoPackage) => {
    const updatedPackage = await updatePackageInSupabase(packageData);
    if (updatedPackage) {
      setPackages(prevPackages =>
        prevPackages.map(pkg => (pkg.id === packageData.id ? { ...pkg, ...updatedPackage } : pkg))
      );
      toast({
        title: 'Pacote atualizado com sucesso!',
      });
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== id));
      toast({
        title: 'Pacote removido com sucesso!',
      });
    } catch (error: any) {
      console.error('Error deleting package:', error.message);
      toast({
        title: 'Erro ao remover pacote',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (packageId: string, isHighlighted: boolean) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ highlighted: !isHighlighted })
        .eq('id', packageId)
        .select();

      if (error) {
        throw error;
      }

      setPackages(prevPackages =>
        prevPackages.map(pkg =>
          pkg.id === packageId ? { ...pkg, highlighted: !isHighlighted } : pkg
        )
      );
      toast({
        title: 'Pacote destacado atualizado!',
      });
    } catch (error: any) {
      console.error('Error toggling featured status:', error.message);
      toast({
        title: 'Erro ao atualizar pacote destacado',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const savePackageToSupabase = async (packageData: MimoPackage) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([{ 
          ...packageData, 
          creator_id: creatorId || user?.id 
        }])
        .select();
        
      if (error) throw error;
      
      return data?.[0];
    } catch (error: any) {
      console.error('Error saving package:', error.message);
      toast({
        title: 'Erro ao salvar pacote',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updatePackageInSupabase = async (packageData: MimoPackage) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ 
          title: packageData.title,
          price: packageData.price,
          description: packageData.description,
          features: packageData.features,
          highlighted: packageData.highlighted,
          isHidden: packageData.isHidden,
          updated_at: new Date().toISOString()
        })
        .eq('id', packageData.id)
        .select();
        
      if (error) throw error;
      
      return data?.[0];
    } catch (error: any) {
      console.error('Error updating package:', error.message);
      toast({
        title: 'Erro ao atualizar pacote',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    if (creatorId || user?.id) {
      fetchPackages();
    }
  }, [creatorId, user?.id]);

  return {
    packages,
    loading,
    error,
    savePackage,
    updatePackage,
    deletePackage,
    setSortOrder,
    sortOrder,
    toggleFeatured
  };
};

export default useMimoPackages;
