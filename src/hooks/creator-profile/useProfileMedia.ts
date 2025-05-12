
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useProfileMedia = () => {
  const { toast } = useToast();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('/placeholder.svg');
  const [avatarPreview, setAvatarPreview] = useState('/placeholder.svg');

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

  // Initialize preview images when creator data is loaded
  const initializeImagePreviews = (cover: string, avatar: string) => {
    setCoverPreview(cover);
    setAvatarPreview(avatar);
  };

  return {
    coverFile,
    avatarFile,
    coverPreview,
    avatarPreview,
    uploadFile,
    handleCoverChange,
    handleAvatarChange,
    initializeImagePreviews
  };
};
