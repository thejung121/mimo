
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import { usePackageManagement } from '@/hooks/usePackageManagement';
import { Link } from 'react-router-dom';

const ContentPage = () => {
  const { packages, loading, deletePackage } = usePackageManagement();

  const handleDeletePackage = async (id: string | number) => {
    if (window.confirm("Tem certeza que deseja excluir esta recompensa?")) {
      await deletePackage(String(id));
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Recompensas</h1>
            <p className="text-sm sm:text-base text-muted-foreground truncate">
              Gerencie suas recompensas e conteúdos exclusivos
            </p>
          </div>
          <Button asChild className="mimo-button w-full sm:w-auto flex-shrink-0">
            <Link to="/dashboard/pacotes/novo">
              <Plus className="h-4 w-4 mr-2" />
              Nova Recompensa
            </Link>
          </Button>
        </div>

        {packages.length === 0 ? (
          <Card className="w-full max-w-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Nenhuma recompensa criada</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-md px-4">
                Crie sua primeira recompensa para começar a receber mimos dos seus fãs
              </p>
              <Button asChild className="mimo-button">
                <Link to="/dashboard/pacotes/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Recompensa
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 w-full max-w-full">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="w-full max-w-full">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 w-full min-w-0">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg sm:text-xl truncate">{pkg.title}</CardTitle>
                      <CardDescription className="text-sm sm:text-base">
                        R$ {pkg.price.toFixed(2)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/dashboard/pacotes/editar/${pkg.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="hidden sm:inline ml-2">Editar</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline ml-2">Excluir</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="w-full max-w-full min-w-0">
                  <div className="space-y-3">
                    {pkg.features && pkg.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Características:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {pkg.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="truncate">• {feature}</li>
                          ))}
                          {pkg.features.length > 3 && (
                            <li className="italic">+{pkg.features.length - 3} mais</li>
                          )}
                        </ul>
                      </div>
                    )}
                    {pkg.media && pkg.media.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {pkg.media.length} arquivo{pkg.media.length > 1 ? 's' : ''} de mídia
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentPage;
