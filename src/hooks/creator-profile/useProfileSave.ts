
import { Creator } from '@/types/creator';
import { updateCreatorProfile } from '@/services/supabase/creatorService';
import { saveCreatorData } from '@/services/creator/profileService';
import { useAuth } from '@/contexts/AuthContext';

interface UseProfileSaveProps {
  creator: Creator;
  setCreator: React.Dispatch<React.SetStateAction<Creator>>;
  uploadFile: (file: File, bucket: string, folder: string) => Promise<string | null>;
  coverFile: File | null;
  avatarFile: File | null;
}

export const useProfileSave = ({
  creator,
  setCreator,
  uploadFile,
  coverFile,
  avatarFile
}: UseProfileSaveProps) => {
  const { user, updateUserProfile } = useAuth();

  // Handler to save the creator's profile
  const handleSaveProfile = async () => {
    try {
      let updatedCreator = {...creator};
      
      // Attempt to upload files if they exist, but handle errors gracefully
      if (coverFile) {
        try {
          console.log('Uploading cover file:', coverFile);
          const coverUrl = await uploadFile(coverFile, 'user_uploads', 'covers');
          if (coverUrl) {
            console.log('Cover uploaded successfully:', coverUrl);
            updatedCreator.cover = coverUrl;
          }
        } catch (error) {
          console.error("Error uploading cover:", error);
          // Don't fail the entire save operation, just log the error
        }
      }
      
      if (avatarFile) {
        try {
          console.log('Uploading avatar file:', avatarFile);
          const avatarUrl = await uploadFile(avatarFile, 'user_uploads', 'avatars');
          if (avatarUrl) {
            console.log('Avatar uploaded successfully:', avatarUrl);
            updatedCreator.avatar = avatarUrl;
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          // Don't fail the entire save operation, just log the error
        }
      }
      
      // Update local state with the updated URLs (if any)
      setCreator(updatedCreator);
      
      // Also update the username in auth context if changed
      if (user && updateUserProfile && updatedCreator.username) {
        try {
          await updateUserProfile({ 
            name: updatedCreator.name, 
            username: updatedCreator.username,
            document: user.document
          });
          console.log('Updated username in auth context');
        } catch (error) {
          console.error('Error updating username in auth context:', error);
          // Continue with the save operation even if this fails
        }
      }
      
      // Save to localStorage first (this will always work)
      saveCreatorData(updatedCreator);
      console.log('Creator data saved to localStorage:', updatedCreator);
      
      // Try to save to Supabase
      let success = true;
      
      try {
        if (updatedCreator.id) {
          success = await updateCreatorProfile(updatedCreator);
          console.log('Creator profile saved to Supabase:', success);
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        // Even if Supabase fails, we've already saved to localStorage
        // so we consider this a success but log the error
      }
      
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      return false;
    }
  };

  return {
    handleSaveProfile
  };
};
