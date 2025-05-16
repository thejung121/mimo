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
        prevPackages.map(pkg => (String(pkg.id) === String(packageData.id) ? { ...pkg, ...updatedPackage } : pkg))
      );
      toast({
        title: 'Pacote atualizado com sucesso!',
      });
    }
  };

  const deletePackage = async (id: string | number) => {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', String(id));

      if (error) {
        throw error;
      }

      setPackages(prevPackages => prevPackages.filter(pkg => String(pkg.id) !== String(id)));
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

  const toggleFeatured = async (packageId: string | number, isHighlighted: boolean) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ highlighted: !isHighlighted })
        .eq('id', String(packageId))
        .select();

      if (error) {
        throw error;
      }

      setPackages(prevPackages =>
        prevPackages.map(pkg =>
          String(pkg.id) === String(packageId) ? { ...pkg, highlighted: !isHighlighted } : pkg
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
          description: packageData.description || '', 
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
          description: packageData.description || '', 
          features: packageData.features,
          highlighted: packageData.highlighted,
          isHidden: packageData.isHidden,
          updated_at: new Date().toISOString()
        })
        .eq('id', String(packageData.id))
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

  // Add these methods for package feature and media management
  const handleAddFeature = () => {
    // Implementation will be delegated to usePackageFeatures
    console.log('Feature add requested');
  };

  const handleFeatureChange = (index: number, value: string) => {
    // Implementation will be delegated to usePackageFeatures
    console.log('Feature change requested', index, value);
  };

  const handleRemoveFeature = (index: number) => {
    // Implementation will be delegated to usePackageFeatures
    console.log('Feature remove requested', index);
  };

  const handleAddMedia = (packageId: number | null, media: any) => {
    // Implementation will be delegated to usePackageMedia
    console.log('Media add requested', packageId, media);
  };

  const handleRemoveMedia = (packageId: number | null, mediaId: number) => {
    // Implementation will be delegated to usePackageMedia
    console.log('Media remove requested', packageId, mediaId);
  };

  const handleTogglePreview = (packageId: number | null, mediaId: number) => {
    // Implementation will be delegated to usePackageMedia
    console.log('Toggle preview requested', packageId, mediaId);
  };

  // Aliases to keep compatibility with existing code
  const mimoPackages = packages;
  const setMimoPackages = setPackages;
  const handleDeletePackage = deletePackage;
  const handleSavePackage = savePackage;
  const handleEditPackage = (id: number) => {
    console.log('Edit package requested', id);
    return true;
  };
  const setShowNewPackageForm = (show: boolean) => {
    console.log('Show new package form', show);
  };

  return {
    packages,
    loading,
    error,
    savePackage,
    updatePackage,
    deletePackage,
    setSortOrder,
    sortOrder,
    toggleFeatured,
    setPackages,
    // Feature methods
    handleAddFeature,
    handleFeatureChange,
    handleRemoveFeature,
    // Media methods
    handleAddMedia,
    handleRemoveMedia,
    handleTogglePreview,
    // Extra methods
    handleSavePackage,
    handleEditPackage,
    handleDeletePackage,
    setShowNewPackageForm,
    // Compatibility aliases
    mimoPackages,
    setMimoPackages
  };
};

export default useMimoPackages;
