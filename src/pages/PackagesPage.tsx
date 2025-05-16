
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useMimoPackages } from '@/hooks/useMimoPackages';
import { useToast } from '@/components/ui/use-toast';
import { saveMimoPackages } from '@/services/creator/packageService';

const PackagesPage = () => {
  const {
    packages,
    setPackages,
    handleDeletePackage,
    loading,
    refreshPackages
  } = useMimoPackages();
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packagesState, setPackagesState] = useState(packages.map(pkg => ({
    ...pkg,
    isActive: pkg.isHidden !== true
  })));
  
  // Update local state when packages changes
  useEffect(() => {
    setPackagesState(packages.map(pkg => ({
      ...pkg,
      isActive: pkg.isHidden !== true
    })));
  }, [packages]);

  // Initial data loading
  useEffect(() => {
    refreshPackages();
  }, []);

  const togglePackageStatus = (id: number | string) => {
    // Update local state
    const updatedPackagesState = packagesState.map(pkg => {
      if (String(pkg.id) === String(id)) {
        return { ...pkg, isActive: !pkg.isActive };
      }
      return pkg;
    });
    setPackagesState(updatedPackagesState);
    
    // Update global state with isHidden property
    const updatedGlobalPackages = packages.map(pkg => {
      if (String(pkg.id) === String(id)) {
        return { ...pkg, isHidden: !updatedPackagesState.find(p => String(p.id) === String(id))?.isActive };
      }
      return pkg;
    });
    
    setPackages(updatedGlobalPackages);
    saveMimoPackages(updatedGlobalPackages);
    
    toast({
      title: "Configuração salva",
      description: "Visibilidade da recompensa atualizada com sucesso.",
    });
  };

  const editPackage = (id: number | string) => {
    navigate(`/dashboard/pacotes/editar/${id}`);
  };

  const handleDeletePackageWithConfirmation = (id: number | string) => {
    if (window.confirm("Tem certeza que deseja excluir esta recompensa?")) {
      handleDeletePackage(id);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6 flex items-center justify-center" style={{minHeight: '400px'}}>
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p>Carregando recompensas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciar Recompensas</h1>
          <Button asChild>
            <Link to="/dashboard/pacotes/novo" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Recompensa
            </Link>
          </Button>
        </div>
        
        {packagesState.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-lg font-medium mb-2">Nenhuma recompensa encontrada</h2>
            <p className="text-muted-foreground mb-6">Você ainda não criou nenhuma recompensa para seus fãs</p>
            <Button asChild>
              <Link to="/dashboard/pacotes/novo" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Criar Primeira Recompensa
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {packagesState.map((pkg) => (
              <PackageCard 
                key={pkg.id} 
                package={pkg}
                onToggle={() => togglePackageStatus(pkg.id!)}
                onEdit={() => editPackage(pkg.id!)}
                onDelete={() => handleDeletePackageWithConfirmation(pkg.id!)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

interface PackageCardProps {
  package: any;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onToggle,
  onEdit,
  onDelete
}) => {
  return (
    <Card className={`border-l-4 ${pkg.highlighted ? 'border-l-primary' : 'border-l-muted'}`}>
      <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">{pkg.title}</h3>
            {pkg.highlighted && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">Destacado</span>
            )}
            {!pkg.isActive && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">Inativo</span>
            )}
          </div>
          
          <div className="flex items-center gap-1 mb-2">
            <strong className="text-lg">R$ {pkg.price}</strong>
            <span className="text-muted-foreground text-sm">/mimo</span>
          </div>
          
          <div className="hidden md:block">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                <li key={idx} className="flex items-center">
                  <span className="text-primary mr-1">•</span> {feature}
                </li>
              ))}
              {pkg.features.length > 3 && (
                <li className="text-muted-foreground">+{pkg.features.length - 3} mais</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Switch 
              id={`package-status-${pkg.id}`}
              checked={pkg.isActive}
              onCheckedChange={onToggle}
            />
            <Label htmlFor={`package-status-${pkg.id}`} className="cursor-pointer">
              {pkg.isActive ? 'Ativo' : 'Inativo'}
            </Label>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Editar</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Excluir</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackagesPage;
