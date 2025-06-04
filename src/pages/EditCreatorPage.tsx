import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from "@/components/ui/button";
import { useCreatorEditor } from '@/hooks/useCreatorEditor';
import { Save, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { saveMimoPackages } from '@/services/creator';
import { useUsernameSync } from '@/hooks/useUsernameSync';
import UnifiedEditorSection from '@/components/UnifiedEditorSection';

const EditCreatorPage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const syncedUsername = useUsernameSync();
  
  const {
    creator,
    mimoPackages,
    setMimoPackages,
    coverPreview,
    avatarPreview,
    newPackage,
    showNewPackageForm,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleAddFeature,
    handleFeatureChange,
    handleRemoveFeature,
    handlePackageChange,
    handleAddMedia,
    handleRemoveMedia,
    handleTogglePreview,
    handleSavePackage,
    handleDeletePackage,
    handleEditPackage,
    handleSaveProfile,
    setShowNewPackageForm
  } = useCreatorEditor();

  const handleSaveAll = async () => {
    try {
      // Save profile and update username in auth context
      const profileSaved = await handleSaveProfile();
      
      if (profileSaved && creator.username && updateUserProfile) {
        // Update username in auth context
        await updateUserProfile({
          name: creator.name,
          username: creator.username
        });
        
        // Dispatch username update event
        window.dispatchEvent(new CustomEvent('usernameUpdated', { 
          detail: { username: creator.username } 
        }));
      }
      
      if (profileSaved) {
        saveMimoPackages(mimoPackages);
        
        toast({
          title: "Alterações salvas com sucesso!",
          description: "Todas as suas alterações foram salvas.",
        });
        
        const currentUsername = creator.username || syncedUsername;
        if (currentUsername) {
          setTimeout(() => {
            navigate(`/criador/${currentUsername}`);
          }, 100);
        } else {
          navigate('/dashboard');
          toast({
            title: "Nome de usuário não definido",
            description: "Configure seu nome de usuário no perfil para ver sua página.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Erro ao salvar alterações",
        description: "Ocorreu um erro ao salvar suas alterações. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Create a wrapper function that converts field/value to the expected signature
  const handleCreatorFieldChange = (field: string, value: string) => {
    // Create a synthetic event-like object that matches what handleCreatorChange expects
    const syntheticEvent = {
      target: {
        name: field,
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
    
    handleCreatorChange(syntheticEvent);
  };

  const currentUsername = creator.username || syncedUsername;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Editar Página</h1>
            <p className="text-sm sm:text-base text-muted-foreground truncate">
              Configure sua página de criador
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {currentUsername ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                asChild
                size="sm"
              >
                <Link to={`/criador/${currentUsername}`} target="_blank">
                  <Eye className="h-4 w-4" />
                  <span>Ver Minha Página</span>
                </Link>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full sm:w-auto justify-center"
                size="sm"
                disabled
                title="Configure seu nome de usuário no perfil"
              >
                <Eye className="h-4 w-4" />
                <span>Ver Minha Página</span>
              </Button>
            )}
            <Button 
              className="mimo-button w-full sm:w-auto flex items-center gap-2 justify-center" 
              onClick={handleSaveAll}
              size="sm"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Alterações</span>
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-full min-w-0">
          <UnifiedEditorSection 
            creator={creator}
            mimoPackages={mimoPackages}
            coverPreview={coverPreview}
            avatarPreview={avatarPreview}
            showNewPackageForm={showNewPackageForm}
            newPackage={newPackage}
            onCreatorChange={handleCreatorFieldChange}
            onSocialLinkChange={handleSocialLinkChange}
            onCoverChange={handleCoverChange}
            onAvatarChange={handleAvatarChange}
            onAddFeature={handleAddFeature}
            onFeatureChange={handleFeatureChange}
            onRemoveFeature={handleRemoveFeature}
            onPackageChange={handlePackageChange}
            onAddMedia={handleAddMedia}
            onRemoveMedia={handleRemoveMedia}
            onTogglePreview={handleTogglePreview}
            onSavePackage={handleSavePackage}
            onDeletePackage={handleDeletePackage}
            onEditPackage={handleEditPackage}
            setShowNewPackageForm={setShowNewPackageForm}
          />
        </div>
        
        <div className="w-full border-t pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="mimo-button w-full sm:w-auto max-w-md flex items-center gap-2 justify-center" 
              onClick={handleSaveAll}
              size="lg"
            >
              <Save className="h-4 w-4" />
              <span>Salvar Todas as Alterações</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditCreatorPage;
