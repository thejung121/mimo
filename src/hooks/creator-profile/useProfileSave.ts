
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
  const { user } = useAuth();
  const { toast } = useToast();

  // Handler to save the creator's profile
  const handleSaveProfile = async () => {
    try {
      let updatedCreator = {...creator};
      
      // Ensure the creator has an ID
      if (!updatedCreator.id && user) {
        updatedCreator.id = user.id;
        console.log('Added user ID to creator profile:', updatedCreator.id);
      }
      
      let uploadSuccessful = false;
      
      // Upload cover image if available
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
      
      // Upload avatar image if available
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
      
      // Save to Supabase first
      let supabaseSuccess = false;
      
      try {
        if (updatedCreator.id) {
          console.log("Attempting to save creator to Supabase:", updatedCreator);
          supabaseSuccess = await updateCreatorProfile(updatedCreator);
          console.log('Creator profile saved to Supabase:', supabaseSuccess);
          
          if (!supabaseSuccess) {
            console.error("Failed to save to Supabase");
            toast({
              title: "Erro ao salvar no banco de dados",
              description: "Não foi possível salvar suas informações no banco de dados.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        toast({
          title: "Erro ao salvar no banco de dados",
          description: "Suas informações foram salvas localmente, mas não foi possível salvá-las no banco de dados.",
          variant: "destructive"
        });
      }
      
      // Always update local state with the updated URLs (if any)
      setCreator(updatedCreator);
      
      // Always save to localStorage to ensure data is available locally
      // Force refresh to ensure clean data
      saveCreatorData(updatedCreator, true);
      console.log('Creator data saved to localStorage with force refresh:', updatedCreator);
      
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
