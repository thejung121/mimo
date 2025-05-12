
import { Creator } from '@/types/creator';
import { updateCreatorProfile } from '@/services/supabase/creatorService';
import { useToast } from '@/components/ui/use-toast';
import { saveCreatorData } from '@/services/creator/profileService';

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
  const { toast } = useToast();

  // Handler to save the creator's profile
  const handleSaveProfile = async () => {
    try {
      let updatedCreator = {...creator};
      
      // Upload files if they exist
      if (coverFile) {
        const coverUrl = await uploadFile(coverFile, 'user_uploads', 'covers');
        if (coverUrl) {
          updatedCreator.cover = coverUrl;
        }
      }
      
      if (avatarFile) {
        const avatarUrl = await uploadFile(avatarFile, 'user_uploads', 'avatars');
        if (avatarUrl) {
          updatedCreator.avatar = avatarUrl;
        }
      }
      
      // Update local state with the updated URLs
      setCreator(updatedCreator);
      
      // Save to localStorage first (this will always work)
      saveCreatorData(updatedCreator);
      
      // Try to save to Supabase
      console.log('Saving creator profile:', updatedCreator);
      let success = true;
      
      try {
        if (updatedCreator.id) {
          success = await updateCreatorProfile(updatedCreator);
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        // Even if Supabase fails, we've already saved to localStorage
        // so we consider this a success but log the error
      }
      
      toast({
        title: "Perfil salvo com sucesso!",
        description: "As alterações no seu perfil foram salvas.",
      });
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erro ao salvar perfil",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleSaveProfile
  };
};
