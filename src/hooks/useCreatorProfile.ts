
import { useProfileData } from './creator-profile/useProfileData';
import { useProfileMedia } from './creator-profile/useProfileMedia';
import { useProfileSave } from './creator-profile/useProfileSave';
import { useEffect } from 'react';

export const useCreatorProfile = () => {
  const { 
    creator, 
    setCreator, 
    isLoading, 
    handleCreatorChange, 
    handleSocialLinkChange 
  } = useProfileData();

  const { 
    coverFile, 
    avatarFile, 
    coverPreview, 
    avatarPreview, 
    uploadFile, 
    handleCoverChange, 
    handleAvatarChange, 
    initializeImagePreviews,
    isUploading
  } = useProfileMedia();

  const { handleSaveProfile } = useProfileSave({
    creator,
    setCreator,
    uploadFile,
    coverFile,
    avatarFile
  });

  // Initialize image previews whenever creator data changes
  useEffect(() => {
    if (creator) {
      console.log("Initializing image previews with:", creator.cover, creator.avatar);
      initializeImagePreviews(creator.cover, creator.avatar);
    }
  }, [creator]);

  return {
    creator,
    coverPreview,
    avatarPreview,
    isLoading: isLoading || isUploading,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile
  };
};
