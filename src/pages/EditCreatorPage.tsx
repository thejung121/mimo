
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useCreatorEditor } from '@/hooks/useCreatorEditor';
import EditProfileSection from '@/components/EditProfileSection';
import EditPackagesSection from '@/components/EditPackagesSection';
import PagePreview from '@/components/PagePreview';
import { Eye, EyeOff, Save } from 'lucide-react';

const EditCreatorPage = () => {
  const {
    creator,
    mimoPackages,
    coverPreview,
    avatarPreview,
    showPreview,
    showNewPackageForm,
    newPackage,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile,
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
    setShowPreview
  } = useCreatorEditor();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Editar Página</h1>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Esconder Preview</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Mostrar Preview</span>
                  </>
                )}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full mb-8">
                  <TabsTrigger value="profile" className="flex-1">Perfil</TabsTrigger>
                  <TabsTrigger value="packages" className="flex-1">Pacotes de Mimo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <EditProfileSection 
                    creator={creator}
                    coverPreview={coverPreview}
                    avatarPreview={avatarPreview}
                    handleCreatorChange={handleCreatorChange}
                    handleSocialLinkChange={handleSocialLinkChange}
                    handleCoverChange={handleCoverChange}
                    handleAvatarChange={handleAvatarChange}
                    handleSaveProfile={handleSaveProfile}
                  />
                </TabsContent>
                
                <TabsContent value="packages">
                  <EditPackagesSection
                    mimoPackages={mimoPackages}
                    showNewPackageForm={showNewPackageForm}
                    newPackage={newPackage}
                    handleAddFeature={handleAddFeature}
                    handleFeatureChange={handleFeatureChange}
                    handleRemoveFeature={handleRemoveFeature}
                    handlePackageChange={handlePackageChange}
                    handleAddMedia={handleAddMedia}
                    handleRemoveMedia={handleRemoveMedia}
                    handleTogglePreview={handleTogglePreview}
                    handleSavePackage={handleSavePackage}
                    handleDeletePackage={handleDeletePackage}
                    handleEditPackage={handleEditPackage}
                    setShowNewPackageForm={setShowNewPackageForm}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {showPreview && (
              <div className="lg:col-span-1">
                <PagePreview username={creator.username} />
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditCreatorPage;
