
import { useState, useEffect, useCallback } from 'react';
import { Creator, MimoPackage, MediaItem, SocialLink } from '@/types/creator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useCreatorProfile } from './useCreatorProfile';
import { usePackageManagement } from './usePackageManagement';

export const useCreatorEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use the creator profile hook
  const {
    creator,
    coverPreview,
    avatarPreview,
    isLoading,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile
  } = useCreatorProfile();

  // Use the package management hook
  const {
    packages: mimoPackages,
    loading: packagesLoading,
    createPackage,
    updatePackage,
    deletePackage,
    refreshPackages
  } = usePackageManagement();

  // Local state for new package form
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({
    id: '',
    title: '',
    price: 0,
    features: [''],
    highlighted: false,
    isHidden: false,
    media: []
  });

  // Load packages when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      console.log('Loading packages for user:', user.id);
      refreshPackages();
    }
  }, [user?.id, refreshPackages]);

  // Package feature handlers
  const handleAddFeature = () => {
    setNewPackage(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setNewPackage(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const handleRemoveFeature = (index: number) => {
    if (newPackage.features.length > 1) {
      setNewPackage(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  // Package handlers
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Media handlers
  const handleAddMedia = (packageId: number | string | null, media: MediaItem) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: [...prev.media, media]
      }));
    }
  };

  const handleRemoveMedia = (packageId: number | string | null, mediaId: number | string) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
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
    }
  };

  // Save package
  const handleSavePackage = async () => {
    try {
      console.log('Saving package:', newPackage);
      
      // Validate package data
      if (!newPackage.title.trim()) {
        toast({
          title: 'Título obrigatório',
          description: 'Por favor, insira um título para o pacote.',
          variant: 'destructive'
        });
        return;
      }

      if (newPackage.price <= 0) {
        toast({
          title: 'Preço inválido',
          description: 'Por favor, insira um preço válido maior que zero.',
          variant: 'destructive'
        });
        return;
      }

      // Filter empty features
      const filteredFeatures = newPackage.features.filter(feature => feature.trim());
      if (filteredFeatures.length === 0) {
        toast({
          title: 'Características obrigatórias',
          description: 'Por favor, insira ao menos uma característica para o pacote.',
          variant: 'destructive'
        });
        return;
      }

      const packageToSave = {
        ...newPackage,
        features: filteredFeatures
      };

      let success = false;
      
      if (newPackage.id && newPackage.id !== '') {
        // Update existing package
        success = await updatePackage(newPackage.id, packageToSave);
      } else {
        // Create new package
        success = await createPackage(packageToSave);
      }

      if (success) {
        // Reset form
        setNewPackage({
          id: '',
          title: '',
          price: 0,
          features: [''],
          highlighted: false,
          isHidden: false,
          media: []
        });
        setShowNewPackageForm(false);
        
        // Refresh packages list
        await refreshPackages();
        
        toast({
          title: 'Pacote salvo com sucesso!',
          description: 'Seu pacote foi criado/atualizado com sucesso.'
        });
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: 'Erro ao salvar pacote',
        description: 'Ocorreu um erro ao salvar o pacote. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  // Delete package
  const handleDeletePackage = async (id: number | string) => {
    try {
      console.log('Deleting package:', id);
      const success = await deletePackage(String(id));
      
      if (success) {
        await refreshPackages();
        toast({
          title: 'Pacote removido!',
          description: 'O pacote foi removido com sucesso.'
        });
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: 'Erro ao remover pacote',
        description: 'Ocorreu um erro ao remover o pacote. Tente novamente.',
        variant: 'destructive'
      });
    }
  };

  // Edit package
  const handleEditPackage = (id: number | string) => {
    const packageToEdit = mimoPackages.find(p => String(p.id) === String(id));
    if (packageToEdit) {
      setNewPackage(packageToEdit);
      setShowNewPackageForm(true);
    }
  };

  // Set mimo packages function for compatibility
  const setMimoPackages = useCallback((packages: MimoPackage[] | ((prev: MimoPackage[]) => MimoPackage[])) => {
    // This is handled by the package management hook
    console.log('setMimoPackages called with:', packages);
  }, []);

  return {
    creator,
    mimoPackages,
    setMimoPackages,
    coverPreview,
    avatarPreview,
    newPackage,
    showNewPackageForm,
    isLoading: isLoading || packagesLoading,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
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
    handleSaveProfile,
    setShowNewPackageForm
  };
};
