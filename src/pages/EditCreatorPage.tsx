
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { useCreatorEditor } from '@/hooks/useCreatorEditor';
import { Save, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Importing a new component that will contain all editor sections in one view
import UnifiedEditorSection from '@/components/UnifiedEditorSection';

const EditCreatorPage = () => {
  const { user } = useAuth();
  
  const {
    creator,
    mimoPackages,
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
    handleSaveAll,
    setShowNewPackageForm,
  } = useCreatorEditor();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Editar Página</h1>
            <div className="flex items-center gap-3">
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
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditCreatorPage;
