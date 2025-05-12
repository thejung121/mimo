
import { Creator } from '@/types/creator';
import { updateCreatorProfile } from '@/services/supabase/creatorService';
import { saveCreatorData } from '@/services/creator/profileService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

  // Handler to save the creator's profile
  const handleSaveProfile = async () => {
    try {
      let updatedCreator = {...creator};
      let uploadSuccessful = false;
      
      // Attempt to upload files if they exist, but handle errors gracefully
      if (coverFile) {
        try {
          console.log('Uploading cover file:', coverFile);
          const coverUrl = await uploadFile(coverFile, 'user_uploads', 'covers');
          if (coverUrl) {
            console.log('Cover uploaded successfully:', coverUrl);
            updatedCreator.cover = coverUrl;
            uploadSuccessful = true;
          }
        } catch (error) {
          console.error("Error uploading cover:", error);
          toast({
            title: "Erro ao fazer upload da capa",
            description: "Ocorreu um erro ao fazer upload da imagem de capa.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      if (avatarFile) {
        try {
          console.log('Uploading avatar file:', avatarFile);
          const avatarUrl = await uploadFile(avatarFile, 'user_uploads', 'avatars');
          if (avatarUrl) {
            console.log('Avatar uploaded successfully:', avatarUrl);
            updatedCreator.avatar = avatarUrl;
            uploadSuccessful = true;
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast({
            title: "Erro ao fazer upload do avatar",
            description: "Ocorreu um erro ao fazer upload da imagem de perfil.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      // Update local state with the updated URLs (if any)
      setCreator(updatedCreator);
      
      // Save to localStorage with force refresh to ensure data is updated
      saveCreatorData(updatedCreator, true);
      console.log('Creator data saved to localStorage with force refresh:', updatedCreator);
      
      // Try to save to Supabase
      let supabaseSuccess = false;
      
      try {
        if (updatedCreator.id) {
          supabaseSuccess = await updateCreatorProfile(updatedCreator);
          console.log('Creator profile saved to Supabase:', supabaseSuccess);
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        toast({
          title: "Erro ao salvar no banco de dados",
          description: "Suas informações foram salvas localmente, mas não foi possível salvá-las no banco de dados.",
          variant: "destructive"
        });
        return true; // Return true since we saved to localStorage successfully
      }
      
      // Show success toast
      if (uploadSuccessful || supabaseSuccess) {
        toast({
          title: "Perfil atualizado com sucesso!",
          description: "Suas informações foram atualizadas e salvas."
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erro ao salvar perfil",
        description: "Ocorreu um erro inesperado ao salvar seu perfil.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleSaveProfile
  };
};
