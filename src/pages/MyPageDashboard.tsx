
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Edit, Eye, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMimoPackages } from '@/hooks/useMimoPackages';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import PagePreview from '@/components/PagePreview';
import { saveMimoPackages, getMimoPackages } from '@/services/creator/packageService';

const MyPageDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { mimoPackages, setMimoPackages } = useMimoPackages();
  const [isLoaded, setIsLoaded] = useState(false);

  // Force reload packages
  useEffect(() => {
    const loadedPackages = getMimoPackages();
    setMimoPackages(loadedPackages);
    setIsLoaded(true);
    console.log("MyPageDashboard loaded packages:", loadedPackages);
  }, [setMimoPackages]);

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

  const togglePackageVisibility = (id: number) => {
    const updatedPackages = mimoPackages.map(pkg => {
      if (pkg.id === id) {
        return { ...pkg, isHidden: !pkg.isHidden };
      }
      return pkg;
    });
    
    setMimoPackages(updatedPackages);
    saveMimoPackages(updatedPackages);
    console.log("Saved package visibility changes:", updatedPackages);

    toast({
      title: "Configuração salva",
      description: "Visibilidade do pacote atualizada com sucesso.",
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Minha Página</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  className="flex items-center gap-2" 
                  variant="outline"
                  onClick={copyShareLink}
                >
                  <Copy className="h-4 w-4" />
                  Copiar Link de Divulgação
                </Button>
                {user?.username ? (
                  <Button 
                    className="flex items-center gap-2" 
                    variant="outline"
                    asChild
                  >
                    <Link to={`/criador/${user.username}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                      Ver Página Atualizada
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="flex items-center gap-2"
                    variant="outline"
                    disabled
                    title="Configure seu nome de usuário no perfil"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Página Atualizada
                  </Button>
                )}
                <Button 
                  className="flex items-center gap-2 mimo-button" 
                  asChild
                >
                  <Link to="/editar-pagina">
                    <Edit className="h-4 w-4" />
                    Editar Página
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pacotes Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {!isLoaded ? (
                <div className="text-center py-4">
                  <p>Carregando pacotes...</p>
                </div>
              ) : mimoPackages.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Você ainda não criou nenhum pacote</p>
                  <Button asChild>
                    <Link to="/dashboard/pacotes/novo">Criar Primeiro Pacote</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {mimoPackages.map(pkg => (
                    <div key={pkg.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {pkg.title}
                          {pkg.highlighted && (
                            <span className="ml-2 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                              Destacado
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">R$ {pkg.price}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`package-visible-${pkg.id}`}
                            checked={!pkg.isHidden}
                            onCheckedChange={() => togglePackageVisibility(pkg.id!)}
                          />
                          <Label htmlFor={`package-visible-${pkg.id}`}>
                            {pkg.isHidden ? 'Oculto' : 'Visível'}
                          </Label>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/dashboard/pacotes/editar/${pkg.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pré-visualização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg shadow-sm overflow-hidden">
                {user?.username ? (
                  <PagePreview username={user.username} />
                ) : (
                  <div className="p-8 text-center">
                    <p>Configure um nome de usuário para visualizar sua página</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => document.getElementById('open-profile-dialog')?.click()}
                    >
                      Configurar Nome de Usuário
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyPageDashboard;
