
import { useState, useEffect } from 'react';
import { MimoPackage, MediaItem } from '@/types/creator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';
import { emptyPackage } from './mimo-packages/packageData';
import { getMimoPackages, saveMimoPackages, getPackagesByUsername } from '@/services/creator/packageService';

interface UseMimoPackagesProps {
  creatorId?: string;
  username?: string;
}

type SortOrder = 'asc' | 'desc';

export const useMimoPackages = (props?: UseMimoPackagesProps) => {
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
          String(pkg.id) === String(packageId) 
            ? { ...pkg, media: [...pkg.media, media] } 
            : pkg
        )
      );
    }
  };

  const handleRemoveMedia = (packageId: number | string | null, mediaId: number | string) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
    } else {
      setPackages(prevPackages => 
        prevPackages.map(pkg => 
          String(pkg.id) === String(packageId) 
            ? { ...pkg, media: pkg.media.filter(m => m.id !== mediaId) } 
            : pkg
        )
      );
    }
  };

  const handleTogglePreview = (packageId: number | string | null, mediaId: number | string) => {
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
          String(pkg.id) === String(packageId) 
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
      let fetchedPackages: MimoPackage[] = [];
      
      if (props?.username) {
        // Fetch packages for a specific creator by username
        fetchedPackages = await getPackagesByUsername(props.username);
      } else {
        // Fetch packages for the current user
        fetchedPackages = await getMimoPackages();
      }
      
      // Sort packages if needed
      if (sortOrder === 'asc') {
        fetchedPackages.sort((a, b) => a.price - b.price);
      } else {
        fetchedPackages.sort((a, b) => b.price - a.price);
      }
      
      setPackages(fetchedPackages);
      console.log("Packages fetched successfully:", fetchedPackages);
    } catch (err: any) {
      console.error("Error fetching packages:", err);
      setError(err);
      toast({
        title: 'Erro inesperado',
        description: err.message || "Erro ao carregar recompensas",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePackage = async (packageData: MimoPackage): Promise<boolean> => {
    try {
      const updatedPackages = [...packages, packageData];
      const saved = await saveMimoPackages(updatedPackages);
      
      if (saved) {
        setPackages(updatedPackages);
        toast({
          title: 'Recompensa salva com sucesso!',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error in savePackage:", error);
      toast({
        title: 'Erro ao salvar recompensa',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updatePackage = async (packageData: MimoPackage): Promise<boolean> => {
    try {
      const updatedPackages = packages.map(pkg => 
        String(pkg.id) === String(packageData.id) ? packageData : pkg
      );
      
      const saved = await saveMimoPackages(updatedPackages);
      
      if (saved) {
        setPackages(updatedPackages);
        toast({
          title: 'Recompensa atualizada com sucesso!',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error in updatePackage:", error);
      toast({
        title: 'Erro ao atualizar recompensa',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deletePackage = async (id: string | number): Promise<boolean> => {
    try {
      const updatedPackages = packages.filter(pkg => String(pkg.id) !== String(id));
      await saveMimoPackages(updatedPackages);
      
      setPackages(updatedPackages);
      toast({
        title: 'Recompensa removida com sucesso!',
      });
      return true;
    } catch (error: any) {
      console.error('Error deleting package:', error);
      toast({
        title: 'Erro ao remover recompensa',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleFeatured = async (packageId: string | number, isHighlighted: boolean): Promise<boolean> => {
    try {
      const updatedPackages = packages.map(pkg => 
        String(pkg.id) === String(packageId) 
          ? { ...pkg, highlighted: !isHighlighted } 
          : pkg
      );
      
      const saved = await saveMimoPackages(updatedPackages);
      
      if (saved) {
        setPackages(updatedPackages);
        toast({
          title: 'Status de destaque atualizado!',
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error toggling featured status:', error);
      toast({
        title: 'Erro ao atualizar status de destaque',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [props?.username, props?.creatorId, user?.id]);

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
  
  // Force refresh packages
  const refreshPackages = () => {
    fetchPackages();
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
    refreshPackages,
    
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
