
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePackageManagement } from '@/hooks/usePackageManagement';
import { useState } from 'react';

const PackagesPage = () => {
  const {
    packages,
    loading,
    deletePackage,
    toggleVisibility
  } = usePackageManagement();
  
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const editPackage = (id: string | number) => {
    navigate(`/dashboard/pacotes/editar/${id}`);
  };

  const handleDeletePackage = async (id: string | number) => {
    if (window.confirm("Tem certeza que deseja excluir esta recompensa?")) {
      const pkgId = String(id);
      setActionLoading(pkgId);
      await deletePackage(pkgId);
      setActionLoading(null);
    }
  };

  const handleToggleVisibility = async (id: string | number, currentlyHidden: boolean) => {
    const pkgId = String(id);
    setActionLoading(pkgId);
    await toggleVisibility(pkgId, !currentlyHidden);
    setActionLoading(null);
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
        
        {packages.length === 0 ? (
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
            {packages.map((pkg) => {
              const pkgId = String(pkg.id);
              return (
                <PackageCard 
                  key={pkg.id} 
                  package={pkg}
                  onToggle={() => handleToggleVisibility(pkg.id, pkg.isHidden)}
                  onEdit={() => editPackage(pkg.id)}
                  onDelete={() => handleDeletePackage(pkg.id)}
                  isLoading={actionLoading === pkgId}
                />
              );
            })}
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
  isLoading: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onToggle,
  onEdit,
  onDelete,
  isLoading
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
            {pkg.isHidden && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded">Oculto</span>
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
              checked={!pkg.isHidden}
              disabled={isLoading}
              onCheckedChange={onToggle}
            />
            <Label htmlFor={`package-status-${pkg.id}`} className="cursor-pointer">
              {pkg.isHidden ? 'Oculto' : 'Visível'}
            </Label>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onEdit} disabled={isLoading}>
              <Edit className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:ml-2">Editar</span>
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={onDelete} disabled={isLoading}>
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
