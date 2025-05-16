
import { useCreatorProfile } from './useCreatorProfile';
import { useMimoPackages } from './useMimoPackages';
import { useState } from 'react';
import { MimoPackage, MediaItem } from '@/types/creator';

// Mock default package state for editing
const defaultPackage: MimoPackage = {
  id: 0,
  title: '',
  price: 0,
  features: [''],
  highlighted: false,
  media: [],
  isHidden: false
};

export const useCreatorEditor = () => {
  const profileHook = useCreatorProfile();
  const packagesHook = useMimoPackages();
  const [showNewPackageForm, setShowNewPackageForm] = useState<boolean>(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({...defaultPackage});

  // Format username by replacing spaces with dashes
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // If the field is username, replace spaces with dashes
    if (name === 'username') {
      const formattedValue = value.replace(/\s+/g, '-');
      const modifiedEvent = {
        ...e,
        target: { ...e.target, value: formattedValue }
      } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
      
      return profileHook.handleCreatorChange(modifiedEvent);
    }
    
    // Otherwise, use the normal handler
    return profileHook.handleCreatorChange(e);
  };

  // Package feature handlers
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

  // Package field change handler
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Media handlers
  const handleAddMedia = (packageId: number | null, media: MediaItem) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: [...prev.media, media]
      }));
    } else {
      // Handle adding media to existing package
    }
  };

  const handleRemoveMedia = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
    } else {
      // Handle removing media from existing package
    }
  };

  const handleTogglePreview = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.map(m => 
          m.id === mediaId ? { ...m, isPreview: !m.isPreview } : m
        )
      }));
    } else {
      // Handle toggling preview for existing package
    }
  };

  // Save package handler
  const handleSavePackage = async () => {
    const result = await packagesHook.savePackage(newPackage);
    if (result) {
      setNewPackage({...defaultPackage});
      setShowNewPackageForm(false);
      return true;
    }
    return false;
  };

  // Edit package handler
  const handleEditPackage = (id: number) => {
    const packageToEdit = packagesHook.packages.find(p => p.id === id);
    if (packageToEdit) {
      setNewPackage({...packageToEdit});
      setShowNewPackageForm(true);
      return true;
    }
    return false;
  };

  return {
    // Creator profile states and handlers
    creator: profileHook.creator,
    coverPreview: profileHook.coverPreview,
    avatarPreview: profileHook.avatarPreview,
    handleCreatorChange,
    handleSocialLinkChange: profileHook.handleSocialLinkChange,
    handleCoverChange: profileHook.handleCoverChange,
    handleAvatarChange: profileHook.handleAvatarChange,
    handleSaveProfile: profileHook.handleSaveProfile,
    
    // Mimo packages states and handlers
    mimoPackages: packagesHook.packages,
    setMimoPackages: packagesHook.setPackages, 
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
    handleDeletePackage: packagesHook.deletePackage,
    handleEditPackage,
    setShowNewPackageForm,
  };
};
