
import { useCreatorProfile } from './useCreatorProfile';
import { useMimoPackages } from './useMimoPackages';

export const useCreatorEditor = () => {
  const profileHook = useCreatorProfile();
  const packagesHook = useMimoPackages();

  return {
    // Creator profile states and handlers
    creator: profileHook.creator,
    coverPreview: profileHook.coverPreview,
    avatarPreview: profileHook.avatarPreview,
    handleCreatorChange: profileHook.handleCreatorChange,
    handleSocialLinkChange: profileHook.handleSocialLinkChange,
    handleCoverChange: profileHook.handleCoverChange,
    handleAvatarChange: profileHook.handleAvatarChange,
    handleSaveProfile: profileHook.handleSaveProfile,
    
    // Mimo packages states and handlers
    mimoPackages: packagesHook.mimoPackages,
    showNewPackageForm: packagesHook.showNewPackageForm,
    newPackage: packagesHook.newPackage,
    handleAddFeature: packagesHook.handleAddFeature,
    handleFeatureChange: packagesHook.handleFeatureChange,
    handleRemoveFeature: packagesHook.handleRemoveFeature,
    handlePackageChange: packagesHook.handlePackageChange,
    handleAddMedia: packagesHook.handleAddMedia,
    handleRemoveMedia: packagesHook.handleRemoveMedia,
    handleTogglePreview: packagesHook.handleTogglePreview,
    handleSavePackage: packagesHook.handleSavePackage,
    handleDeletePackage: packagesHook.handleDeletePackage,
    handleEditPackage: packagesHook.handleEditPackage,
    setShowNewPackageForm: packagesHook.setShowNewPackageForm,
  };
};
