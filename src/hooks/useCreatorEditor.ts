import { useCreatorProfile } from './useCreatorProfile';
import { useMimoPackages } from './useMimoPackages';

export const useCreatorEditor = () => {
  const profileHook = useCreatorProfile();
  const packagesHook = useMimoPackages();

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
