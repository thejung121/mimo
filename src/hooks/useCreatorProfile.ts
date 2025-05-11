
import { useState, useEffect } from 'react';
import { Creator, SocialLink } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentCreator, updateCreatorProfile } from '@/services/supabase/creatorService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useCreatorProfile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [creator, setCreator] = useState<Creator>({
    name: '',
    username: '',
    coverTitle: '',
    coverSubtitle: '',
    about: '',
    avatar: '/placeholder.svg',
    cover: '/placeholder.svg',
    description: '',
    socialLinks: []
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('/placeholder.svg');
  const [avatarPreview, setAvatarPreview] = useState('/placeholder.svg');
  const [isLoading, setIsLoading] = useState(true);

  // Load creator data
  useEffect(() => {
    const loadCreator = async () => {
      setIsLoading(true);
      
      try {
        const creatorData = await getCurrentCreator();
        
        if (creatorData) {
          console.log('Loaded creator data:', creatorData);
          setCreator(creatorData);
          setCoverPreview(creatorData.cover);
          setAvatarPreview(creatorData.avatar);
        } else {
          console.error('No creator data found');
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os dados do seu perfil",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading creator data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar seu perfil. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      loadCreator();
    }
  }, [user, toast]);

  // Handler for updating the creator
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreator(prev => ({ ...prev, [name]: value }));
  };

  // Handlers for social links
  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedSocialLinks = [...creator.socialLinks] as SocialLink[];
    
    if (field === 'url') {
      updatedSocialLinks[index] = { 
        ...updatedSocialLinks[index], 
        url: value 
      };
    } else if (field === 'type' && (value === 'instagram' || value === 'twitter' || value === 'youtube' || value === 'website' || value === 'privacy')) {
      updatedSocialLinks[index] = { 
        ...updatedSocialLinks[index], 
        type: value as 'instagram' | 'twitter' | 'youtube' | 'website' | 'privacy'
      };
    }
    
    setCreator(prev => ({ ...prev, socialLinks: updatedSocialLinks }));
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
  
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
  
      if (error) {
        console.error(`Error uploading ${folder}:`, error);
        toast({
          title: `Error uploading ${folder}`,
          description: error.message,
          variant: "destructive"
        });
        return null;
      }
  
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
  
      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error in uploadFile:`, error);
      return null;
    }
  };

  // Handler for the upload of cover image
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      
      // Preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCoverPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for the upload of avatar image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

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
      
      // Save to Supabase
      console.log('Saving creator profile:', updatedCreator);
      const success = await updateCreatorProfile(updatedCreator);
      
      if (success) {
        toast({
          title: "Perfil salvo com sucesso!",
          description: "As alterações no seu perfil foram salvas.",
        });
        return true;
      } else {
        toast({
          title: "Erro ao salvar perfil",
          description: "Ocorreu um erro ao salvar seu perfil.",
          variant: "destructive"
        });
        return false;
      }
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
    creator,
    coverPreview,
    avatarPreview,
    isLoading,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile
  };
};
