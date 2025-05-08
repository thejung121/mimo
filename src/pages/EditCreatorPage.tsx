
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Heart, Eye } from 'lucide-react';
import EditProfileSection from '@/components/EditProfileSection';
import EditPackagesSection from '@/components/EditPackagesSection';
import PagePreview from '@/components/PagePreview';
import { useCreatorEditor } from '@/hooks/useCreatorEditor';

const EditCreatorPage = () => {
  const { toast } = useToast();
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
        <div className="mimo-container max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Editar Minha Página</h1>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
              </Button>
              
              <Button 
                className="mimo-button"
                onClick={handleSaveAll}
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
          
          {showPreview ? (
            <div className="mb-8">
              <PagePreview username={creator.username} />
            </div>
          ) : (
            <Tabs defaultValue="profile" className="mb-8">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" /> Perfil
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" /> Pacotes de Mimo
                </TabsTrigger>
              </TabsList>
              
              {/* Tab de Perfil */}
              <TabsContent value="profile" className="space-y-6">
                <EditProfileSection 
                  creator={creator}
                  coverPreview={coverPreview}
                  avatarPreview={avatarPreview}
                  onCreatorChange={handleCreatorChange}
                  onSocialLinkChange={handleSocialLinkChange}
                  onCoverChange={handleCoverChange}
                  onAvatarChange={handleAvatarChange}
                  onSaveProfile={handleSaveProfile}
                />
              </TabsContent>
              
              {/* Tab de Pacotes de Mimo */}
              <TabsContent value="packages" className="space-y-6">
                <EditPackagesSection 
                  mimoPackages={mimoPackages}
                  showNewPackageForm={showNewPackageForm}
                  newPackage={newPackage}
                  onAddPackage={() => setShowNewPackageForm(true)}
                  onCancelAddPackage={() => {
                    setShowNewPackageForm(false);
                    setNewPackage({
                      title: '',
                      price: 0,
                      features: [''],
                      highlighted: false,
                      media: []
                    });
                  }}
                  onDeletePackage={handleDeletePackage}
                  onEditPackage={handleEditPackage}
                  onSaveAll={handleSaveAll}
                  onPackageChange={handlePackageChange}
                  onFeatureChange={handleFeatureChange}
                  onAddFeature={handleAddFeature}
                  onRemoveFeature={handleRemoveFeature}
                  onSavePackage={handleSavePackage}
                  onAddMedia={handleAddMedia}
                  onRemoveMedia={handleRemoveMedia}
                  onTogglePreview={handleTogglePreview}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditCreatorPage;
