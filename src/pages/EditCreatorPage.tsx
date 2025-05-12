
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { useCreatorEditor } from '@/hooks/useCreatorEditor';
import { Save, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { updateCreatorProfile } from '@/services/supabase/creatorService';
import { saveCreatorData, saveMimoPackages } from '@/services/creator';
// Importing a new component that will contain all editor sections in one view
import UnifiedEditorSection from '@/components/UnifiedEditorSection';

const EditCreatorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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

  // Enhanced save function that explicitly updates the profile and packages
  const handleSaveAll = async () => {
    try {
      // First save the profile
      const profileSaved = await handleSaveProfile();
      
      if (profileSaved) {
        // Also save packages explicitly
        saveMimoPackages(mimoPackages);
        
        toast({
          title: "Alterações salvas com sucesso!",
          description: "Todas as suas alterações foram salvas.",
        });
        
        // Navigate to the creator page to see the changes
        const username = user?.username || creator.username;
        if (username) {
          // Prefetch the user's page to ensure it loads correctly
          setTimeout(() => {
            navigate(`/criador/${username}`);
          }, 100);
        } else {
          navigate('/dashboard');
          toast({
            title: "Nome de usuário não definido",
            description: "Configure seu nome de usuário no perfil para ver sua página.",
            variant: "destructive"  // Changed from "warning" to "destructive"
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Editar Página</h1>
            <div className="flex items-center gap-3">
              {user?.username || creator.username ? (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  asChild
                >
                  <Link to={`/criador/${user?.username || creator.username}`} target="_blank">
                    <Eye className="h-4 w-4" />
                    Ver Minha Página
                  </Link>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  disabled
                  title="Configure seu nome de usuário no perfil"
                >
                  <Eye className="h-4 w-4" />
                  Ver Minha Página
                </Button>
              )}
              <Button 
                className="mimo-button" 
                onClick={handleSaveAll}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
          
          <UnifiedEditorSection 
            creator={creator}
            mimoPackages={mimoPackages}
            coverPreview={coverPreview}
            avatarPreview={avatarPreview}
            showNewPackageForm={showNewPackageForm}
            newPackage={newPackage}
            onCreatorChange={handleCreatorChange}
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
          
          {/* Bottom save button */}
          <div className="mt-8 pt-4 border-t flex justify-center">
            <Button 
              className="mimo-button w-full max-w-md" 
              onClick={handleSaveAll}
              size="lg"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Todas as Alterações
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditCreatorPage;
