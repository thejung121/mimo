import { useState, useEffect } from 'react';
import { Creator, SocialLink } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';
import { getCreatorData } from '@/services/creator';

export const useCreatorProfile = () => {
  const { toast } = useToast();
  
  const [creator, setCreator] = useState<Creator>(getCreatorData());
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(creator.cover);
  const [avatarPreview, setAvatarPreview] = useState(creator.avatar);

  // Handler for updating the creator
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreator(prev => ({ ...prev, [name]: value }));
  };

  // Handlers for social links
  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedSocialLinks = [...creator.socialLinks] as SocialLink[];
    
    // Ensure we're only updating allowed fields with correct types
    if (field === 'url') {
      updatedSocialLinks[index] = { 
        ...updatedSocialLinks[index], 
        url: value 
      };
    } else if (field === 'type' && (value === 'instagram' || value === 'twitter' || value === 'website' || value === 'privacy')) {
      updatedSocialLinks[index] = { 
        ...updatedSocialLinks[index], 
        type: value as 'instagram' | 'twitter' | 'website' | 'privacy'
      };
    }
    
    setCreator(prev => ({ ...prev, socialLinks: updatedSocialLinks }));
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
        setCreator(prev => ({ ...prev, cover: result }));
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
        setCreator(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler to save the creator's profile
  const handleSaveProfile = () => {
    // Here you would implement logic to save to the backend
    console.log("Saving profile:", creator);
    console.log("Files to upload:", { cover: coverFile, avatar: avatarFile });
    
    toast({
      title: "Perfil salvo com sucesso!",
      description: "As alterações no seu perfil foram salvas.",
    });
  };

  return {
    creator,
    coverPreview,
    avatarPreview,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile
  };
};
