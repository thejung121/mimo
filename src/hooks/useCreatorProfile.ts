
import { useState } from 'react';
import { Creator, SocialLink } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';

// Initial creator data
const initialCreator: Creator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter', url: 'https://twitter.com/mariafernanda' },
    { type: 'website', url: 'https://onlyfans.com/mariafernanda' },
    { type: 'privacy', url: 'https://privacy.com/mariafernanda' }
  ]
};

export const useCreatorProfile = () => {
  const { toast } = useToast();
  
  const [creator, setCreator] = useState<Creator>(initialCreator);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initialCreator.cover);
  const [avatarPreview, setAvatarPreview] = useState(initialCreator.avatar);

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
        type: value 
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
        setCoverPreview(reader.result as string);
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
        setAvatarPreview(reader.result as string);
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
