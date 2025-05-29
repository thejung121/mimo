
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Loader2, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMimoPackages } from '@/hooks/useMimoPackages';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileEditor from '@/components/profile/ProfileEditor';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { saveMimoPackages } from '@/services/creator/packageService';

const MyPageFullDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [packageSaving, setPackageSaving] = useState(false);
  const { mimoPackages, setMimoPackages, refreshPackages } = useMimoPackages();
  const [isLoaded, setIsLoaded] = useState(false);

  // Creator profile hooks
  const {
    creator,
    coverPreview,
    avatarPreview,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile,
    isLoading: profileLoading
  } = useCreatorProfile();

  // Force reload packages
  useEffect(() => {
    const loadPackages = async () => {
      await refreshPackages();
      setIsLoaded(true);
    };
    loadPackages();
  }, [refreshPackages]);
  
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

  const copyShareLink = () => {
    if (user?.username) {
      const shareLink = `${window.location.origin}/criador/${user.username}`;
      navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copiado!",
        description: "Link de divulgação copiado para a área de transferência.",
      });
    } else {
      toast({
        title: "Nome de usuário não definido",
        description: "Configure seu nome de usuário no perfil.",
        variant: "destructive"
      });
    }
  };

  const togglePackageVisibility = (id: string | number) => {
    setPackageSaving(true);
    
    const updatedPackages = mimoPackages.map(pkg => {
      if (String(pkg.id) === String(id)) {
        return { ...pkg, isHidden: !pkg.isHidden };
      }
      return pkg;
    });
    
    setMimoPackages(updatedPackages);
    saveMimoPackages(updatedPackages);
    console.log("Saved package visibility changes:", updatedPackages);

    toast({
      title: "Configuração salva",
      description: "Visibilidade da recompensa atualizada com sucesso.",
    });
    
    setTimeout(() => {
      setPackageSaving(false);
    }, 500);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    
    try {
      console.log("Starting save process with creator:", creator);
      
      // First update the user profile in auth context if username is provided
      if (updateUserProfile && creator.username) {
        try {
          await updateUserProfile({
            name: creator.name,
            username: creator.username
          });
          console.log("Auth profile updated successfully");
        } catch (error) {
          console.error('Error updating auth profile:', error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar perfil no sistema de autenticação.",
            variant: "destructive"
          });
        }
      }
      
      // Then save the creator profile using handleSaveProfile from useCreatorProfile
      const profileSaved = await handleSaveProfile();
      console.log("Profile save result:", profileSaved);
      
      // Always save packages to ensure they're updated
      saveMimoPackages(mimoPackages);
      console.log("Saved package data to localStorage");
      
      toast({
        title: "Página salva com sucesso",
        description: "Todas as alterações foram salvas."
      });
      
      // Force reload to ensure fresh data after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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
      <div className="w-full max-w-full min-w-0 space-y-4 md:space-y-6">
        <div className="w-full">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 truncate">Minha Página</h1>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 md:mb-6">
            <Button 
              className="flex items-center gap-2 text-xs sm:text-sm" 
              variant="outline"
              onClick={copyShareLink}
              size="sm"
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="truncate">Copiar Link</span>
            </Button>
            {user?.username ? (
              <Button 
                className="flex items-center gap-2 text-xs sm:text-sm" 
                variant="outline"
                asChild
                size="sm"
              >
                <Link to={`/criador/${user.username}`} target="_blank">
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Ver Página</span>
                </Link>
              </Button>
            ) : (
              <Button
                className="flex items-center gap-2 text-xs sm:text-sm"
                variant="outline"
                disabled
                size="sm"
                title="Configure seu nome de usuário no perfil"
              >
                <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Ver Página</span>
              </Button>
            )}
            <Button 
              className="flex items-center gap-2 mimo-button text-xs sm:text-sm"
              onClick={handleSubmit}
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="truncate">Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Salvar</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="w-full max-w-full overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full max-w-full grid grid-cols-2 mb-4 md:mb-6">
                <TabsTrigger value="profile" className="text-xs sm:text-sm truncate">Perfil</TabsTrigger>
                <TabsTrigger value="packages" className="text-xs sm:text-sm truncate">Recompensas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="w-full max-w-full min-w-0">
                {profileLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="ml-2 text-muted-foreground">Carregando perfil...</p>
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    <ProfileEditor
                      creator={creator}
                      coverPreview={coverPreview}
                      avatarPreview={avatarPreview}
                      handleCreatorChange={handleCreatorChange}
                      handleSocialLinkChange={handleSocialLinkChange}
                      handleCoverChange={handleCoverChange}
                      handleAvatarChange={handleAvatarChange}
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 mt-6 border-t">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Atualize suas informações de perfil
                      </p>
                      <Button 
                        onClick={handleSubmit} 
                        className="mimo-button text-xs sm:text-sm"
                        disabled={isSaving}
                        size="sm"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Salvar Perfil
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="packages" className="w-full max-w-full min-w-0">
                <Card className="w-full">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4">
                    <CardTitle className="text-base sm:text-lg truncate">Recompensas Disponíveis</CardTitle>
                    <Button asChild size="sm" className="text-xs sm:text-sm">
                      <Link to="/dashboard/pacotes/novo">Criar Nova</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="w-full max-w-full min-w-0">
                    {!isLoaded ? (
                      <div className="text-center py-4">
                        <p className="text-sm">Carregando recompensas...</p>
                      </div>
                    ) : mimoPackages.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4 text-sm">Você ainda não criou nenhuma recompensa</p>
                        <Button asChild size="sm">
                          <Link to="/dashboard/pacotes/novo">Criar Primeira Recompensa</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3 sm:space-y-4 w-full max-w-full">
                        {mimoPackages.map(pkg => (
                          <div key={pkg.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-3 w-full min-w-0">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium flex items-center text-sm sm:text-base">
                                <span className="truncate">{pkg.title}</span>
                                {pkg.highlighted && (
                                  <span className="ml-2 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full flex-shrink-0">
                                    Destacado
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">R$ {pkg.price}</p>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                              <div className="flex items-center space-x-2">
                                <Switch 
                                  id={`package-visible-${pkg.id}`}
                                  checked={!pkg.isHidden}
                                  disabled={packageSaving}
                                  onCheckedChange={() => togglePackageVisibility(pkg.id)}
                                />
                                <Label htmlFor={`package-visible-${pkg.id}`} className="text-xs sm:text-sm">
                                  {pkg.isHidden ? 'Oculto' : 'Visível'}
                                </Label>
                              </div>
                              
                              <div className="flex items-center">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/dashboard/pacotes/editar/${pkg.id}`}>
                                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSubmit} 
                    className="mimo-button text-xs sm:text-sm"
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Bottom save button for all tabs */}
          <div className="mt-6 sm:mt-8 pt-4 border-t flex justify-center w-full">
            <Button 
              className="mimo-button w-full max-w-sm text-xs sm:text-sm" 
              onClick={handleSubmit}
              size="sm"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Salvar Todas as Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyPageFullDashboard;
