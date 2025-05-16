
import { useState, useEffect } from 'react';
import { MimoPackage, MediaItem } from '@/types/creator';
import { supabase } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { emptyPackage } from './mimo-packages/packageData';

interface UseMimoPackagesProps {
  creatorId?: string;
}

type SortOrder = 'asc' | 'desc';

export const useMimoPackages = (creatorId?: string) => {
  const [packages, setPackages] = useState<MimoPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showNewPackageForm, setShowNewPackageForm] = useState<boolean>(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({...emptyPackage});
  const { user } = useAuth();
  const { toast } = useToast();

  // Feature methods implementation
  const handleAddFeature = () => {
    setNewPackage(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setNewPackage(prev => {
      const updatedFeatures = [...prev.features];
      updatedFeatures[index] = value;
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  const handleRemoveFeature = (index: number) => {
    setNewPackage(prev => {
      const updatedFeatures = prev.features.filter((_, i) => i !== index);
      return {
        ...prev,
        features: updatedFeatures
      };
    });
  };

  // Media methods implementation
  const handleAddMedia = (packageId: number | string | null, media: MediaItem) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: [...prev.media, media]
      }));
    } else {
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          pkg.id === packageId 
            ? { ...pkg, media: [...pkg.media, media] } 
            : pkg
        )
      );
    }
  };

  const handleRemoveMedia = (packageId: number | string | null, mediaId: number) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
    } else {
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          pkg.id === packageId 
            ? { ...pkg, media: pkg.media.filter(m => m.id !== mediaId) } 
            : pkg
        )
      );
    }
  };

  const handleTogglePreview = (packageId: number | string | null, mediaId: number) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.map(m => 
          m.id === mediaId ? { ...m, isPreview: !m.isPreview } : m
        )
      }));
    } else {
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          pkg.id === packageId 
            ? { 
                ...pkg, 
                media: pkg.media.map(m => 
                  m.id === mediaId ? { ...m, isPreview: !m.isPreview } : m
                ) 
              } 
            : pkg
        )
      );
    }
  };

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

  const savePackage = async (packageData: MimoPackage): Promise<boolean> => {
    try {
      const newPackage = await savePackageToSupabase(packageData);
      if (newPackage) {
        setPackages(prevPackages => [...prevPackages, newPackage]);
        toast({
          title: 'Pacote salvo com sucesso!',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in savePackage:", error);
      return false;
    }
  };

  const updatePackage = async (packageData: MimoPackage): Promise<boolean> => {
    try {
      const updatedPackage = await updatePackageInSupabase(packageData);
      if (updatedPackage) {
        setPackages(prevPackages =>
          prevPackages.map(pkg => (String(pkg.id) === String(packageData.id) ? { ...pkg, ...updatedPackage } : pkg))
        );
        toast({
          title: 'Pacote atualizado com sucesso!',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in updatePackage:", error);
      return false;
    }
  };

  const deletePackage = async (id: string | number): Promise<boolean> => {
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
      return true;
    } catch (error: any) {
      console.error('Error deleting package:', error.message);
      toast({
        title: 'Erro ao remover pacote',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleFeatured = async (packageId: string | number, isHighlighted: boolean): Promise<boolean> => {
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
      return true;
    } catch (error: any) {
      console.error('Error toggling featured status:', error.message);
      toast({
        title: 'Erro ao atualizar pacote destacado',
        description: error.message,
        variant: 'destructive',
      });
      return false;
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

  // Package editing methods
  const handleEditPackage = (id: number | string): boolean => {
    console.log('Edit package requested', id);
    const packageToEdit = packages.find(p => String(p.id) === String(id));
    if (packageToEdit) {
      setNewPackage({...packageToEdit});
      setShowNewPackageForm(true);
      return true;
    }
    return false;
  };

  // Handle package changes
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save package
  const handleSavePackage = async (): Promise<boolean> => {
    if (newPackage.id) {
      return await updatePackage(newPackage);
    } else {
      return await savePackage(newPackage);
    }
  };

  // Aliases for backward compatibility
  const mimoPackages = packages;
  const setMimoPackages = setPackages;
  const handleDeletePackage = deletePackage;

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
    
    // Form state
    showNewPackageForm,
    setShowNewPackageForm,
    newPackage,
    setNewPackage,
    
    // Package handling
    handlePackageChange,
    handleSavePackage,
    handleEditPackage,
    handleDeletePackage,
    
    // Compatibility aliases
    mimoPackages,
    setMimoPackages
  };
};

export default useMimoPackages;
