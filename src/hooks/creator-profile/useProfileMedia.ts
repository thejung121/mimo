
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useProfileMedia = () => {
  const { toast } = useToast();
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('/placeholder.svg');
  const [avatarPreview, setAvatarPreview] = useState('/placeholder.svg');
  const [isUploading, setIsUploading] = useState(false);

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string | null> => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
      
      console.log(`Starting upload to ${bucket}/${fileName}`);
      
      // Verify bucket exists before upload
      const { data: bucketsList, error: listError } = await supabase.storage
        .listBuckets();
      
      if (listError) {
        console.error('Error checking buckets:', listError);
        toast({
          title: "Erro ao verificar buckets",
          description: listError.message,
          variant: "destructive"
        });
        setIsUploading(false);
        return null;
      }
      
      const bucketExists = bucketsList.some(b => b.name === bucket);
      if (!bucketExists) {
        toast({
          title: "Bucket não encontrado",
          description: `O bucket ${bucket} não existe no storage.`,
          variant: "destructive"
        });
        console.error(`Bucket ${bucket} doesn't exist`);
        setIsUploading(false);
        return null;
      }
      
      // Proceed with upload to existing bucket
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
  
      if (error) {
        console.error(`Error uploading ${folder}:`, error);
        toast({
          title: `Erro ao fazer upload`,
          description: error.message,
          variant: "destructive"
        });
        setIsUploading(false);
        return null;
      }
      
      console.log(`${folder} uploaded successfully:`, data);
  
      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);
  
      console.log(`Public URL for ${folder}:`, urlData.publicUrl);
      setIsUploading(false);
      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error in uploadFile:`, error);
      setIsUploading(false);
      return null;
    }
  };

  // Handler for the upload of cover image
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Cover file selected:', file.name, file.type, file.size);
      setCoverFile(file);
      
      // Preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCoverPreview(result);
        console.log('Cover preview set');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for the upload of avatar image
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Avatar file selected:', file.name, file.type, file.size);
      setAvatarFile(file);
      
      // Preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        console.log('Avatar preview set');
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize preview images when creator data is loaded
  const initializeImagePreviews = useCallback((cover: string, avatar: string) => {
    if (cover && cover !== '/placeholder.svg') {
      setCoverPreview(cover);
      console.log('Cover preview initialized:', cover);
    }
    if (avatar && avatar !== '/placeholder.svg') {
      setAvatarPreview(avatar);
      console.log('Avatar preview initialized:', avatar);
    }
  }, []);

  return {
    coverFile,
    avatarFile,
    coverPreview,
    avatarPreview,
    uploadFile,
    handleCoverChange,
    handleAvatarChange,
    initializeImagePreviews,
    isUploading
  };
};
