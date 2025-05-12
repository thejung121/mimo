
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditor from '@/components/profile/ProfileEditor';

const ProfilePage = () => {
  const {
    creator,
    coverPreview,
    avatarPreview,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile
  } = useCreatorProfile();
  
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();

  // Sync creator username with auth user username
  useEffect(() => {
    if (user?.username && !creator.username) {
      handleCreatorChange({
        target: {
          name: 'username',
          value: user.username
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [user, creator, handleCreatorChange]);

  const handleSubmit = async () => {
    // First update the user profile in auth context
    if (updateUserProfile && creator.username) {
      try {
        await updateUserProfile({
          name: creator.name,
          username: creator.username
        });
      } catch (error) {
        console.error('Error updating auth profile:', error);
      }
    }
    
    // Then save the creator profile data
    const success = await handleSaveProfile();
    
    if (success) {
      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso."
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        
        <ProfileEditor
          creator={creator}
          coverPreview={coverPreview}
          avatarPreview={avatarPreview}
          handleCreatorChange={handleCreatorChange}
          handleSocialLinkChange={handleSocialLinkChange}
          handleCoverChange={handleCoverChange}
          handleAvatarChange={handleAvatarChange}
        />
        
        <div className="flex justify-between items-center pt-4">
          <p className="text-sm text-muted-foreground">
            Atualize suas informações de perfil
          </p>
          <Button onClick={handleSubmit} className="mimo-button">
            Salvar Alterações
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
