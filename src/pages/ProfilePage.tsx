
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import ProfileEditor from '@/components/profile/ProfileEditor';
import PagePreview from '@/components/PagePreview';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const {
    creator,
    coverPreview,
    avatarPreview,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile,
    isLoading
  } = useCreatorProfile();
  
  const { toast } = useToast();
  const { user, updateUserProfile } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);

  // Sync creator username with auth user username
  React.useEffect(() => {
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
    setIsSaving(true);
    
    try {
      // First update the user profile in auth context
      if (updateUserProfile && creator.username) {
        try {
          await updateUserProfile({
            name: creator.name,
            username: creator.username
          });
        } catch (error) {
          console.error('Error updating auth profile:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar perfil no sistema de autenticação.",
            variant: "destructive"
          });
          setIsSaving(false);
          return;
        }
      }
      
      // Then save the creator profile data
      const success = await handleSaveProfile();
      
      if (success) {
        toast({
          title: "Perfil salvo com sucesso",
          description: "Todas as alterações foram salvas."
        });
        
        // Force refresh of the page after a short delay
        // This ensures we reload from storage and see the changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: "Erro ao salvar",
          description: "Ocorreu um problema ao salvar seu perfil.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in submit handler:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado ao processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-background rounded-lg border shadow-sm p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-muted-foreground">Carregando perfil...</p>
            </div>
          ) : (
            <>
              <ProfileEditor
                creator={creator}
                coverPreview={coverPreview}
                avatarPreview={avatarPreview}
                handleCreatorChange={handleCreatorChange}
                handleSocialLinkChange={handleSocialLinkChange}
                handleCoverChange={handleCoverChange}
                handleAvatarChange={handleAvatarChange}
              />
              
              <div className="flex justify-between items-center pt-4 mt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Atualize suas informações de perfil
                </p>
                <Button 
                  onClick={handleSubmit} 
                  className="mimo-button"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Salvando...
                    </>
                  ) : "Salvar Alterações"}
                </Button>
              </div>
            </>
          )}
        </div>
        
        <div className="md:col-span-1 bg-background rounded-lg border shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Prévia da página</h2>
          <PagePreview username={creator.username || ''} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
