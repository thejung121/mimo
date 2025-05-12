
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
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}.${fileExt}`;
      
      console.log(`Uploading ${folder} file with extension ${fileExt}`);
  
      // Check if storage bucket exists, if not create it
      const { data: bucketData, error: bucketError } = await supabase.storage
        .listBuckets();
        
      if (bucketError) {
        console.error('Error checking buckets:', bucketError);
        throw bucketError;
      } else {
        const bucketExists = bucketData.find(b => b.name === bucket);
        if (!bucketExists) {
          // Try to create the bucket
          const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
          
          if (createError) {
            console.error(`Error creating bucket ${bucket}:`, createError);
            toast({
              title: `Erro ao criar bucket de storage`,
              description: createError.message,
              variant: "destructive"
            });
            setIsUploading(false);
            throw createError;
          }
          
          console.log(`Created storage bucket: ${bucket}`);
        }
      }
      
      // Proceed with upload
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
        throw error;
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
      throw error;
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

  // Initialize preview images when creator data is loaded (memoized)
  const initializeImagePreviews = useCallback((cover: string, avatar: string) => {
    if (cover && cover !== '/placeholder.svg') {
      setCoverPreview(cover);
      console.log('Cover preview initialized:', cover);
    }
    if (avatar && avatar !== '/placeholder.svg') {
      setAvatarPreview(avatar);
      console.log('Avatar preview initialized:', avatar);
    }
    console.log('Previews initialized:', { cover, avatar });
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
