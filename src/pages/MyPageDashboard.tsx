
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, ExternalLink, Edit, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMimoPackages } from '@/hooks/useMimoPackages';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { saveMimoPackages, getMimoPackages } from '@/services/creator/packageService';
import { MimoPackage } from '@/types/creator';

const MyPageDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const packagesHook = useMimoPackages();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Force reload packages
  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        const loadedPackages = await getMimoPackages();
        packagesHook.setPackages(loadedPackages);
        console.log("MyPageDashboard loaded packages:", loadedPackages);
      } catch (error) {
        console.error("Error loading packages:", error);
        toast({
          title: "Erro",
          description: "Erro ao carregar recompensas",
          variant: "destructive"
        });
      } finally {
        setIsLoaded(true);
        setIsLoading(false);
      }
    };
    
    loadPackages();
  }, []);

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

  const togglePackageVisibility = async (id: number | string) => {
    const updatedPackages = packagesHook.packages.map(pkg => {
      if (String(pkg.id) === String(id)) {
        return { ...pkg, isHidden: !pkg.isHidden };
      }
      return pkg;
    });
    
    packagesHook.setPackages(updatedPackages);
    await saveMimoPackages(updatedPackages);
    console.log("Saved package visibility changes:", updatedPackages);

    toast({
      title: "Configuração salva",
      description: "Visibilidade da recompensa atualizada com sucesso.",
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
              <CardTitle>Recompensas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                  <p>Carregando recompensas...</p>
                </div>
              ) : !isLoaded ? (
                <div className="text-center py-4">
                  <p>Carregando recompensas...</p>
                </div>
              ) : packagesHook.packages.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">Você ainda não criou nenhuma recompensa</p>
                  <Button asChild>
                    <Link to="/dashboard/pacotes/novo">Criar Primeira Recompensa</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {packagesHook.packages.map(pkg => (
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
                            onCheckedChange={() => togglePackageVisibility(pkg.id)}
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyPageDashboard;
