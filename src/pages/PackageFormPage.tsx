
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useMimoPackages } from '@/hooks/useMimoPackages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import MediaUploader from '@/components/MediaUploader';
import MediaItemDisplay from '@/components/MediaItemDisplay';
import { useToast } from '@/components/ui/use-toast';
import { saveMimoPackages } from '@/services/creator/packageService';
import { MimoPackage } from '@/types/creator';
import { emptyPackage } from '@/hooks/mimo-packages/packageData';

const PackageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id !== 'novo';
  
  const {
    mimoPackages,
    setMimoPackages,
    handleAddFeature,
    handleFeatureChange,
    handleRemoveFeature,
    handleAddMedia,
    handleRemoveMedia,
    handleTogglePreview,
  } = useMimoPackages();

  // Local state for form data to prevent modifying the global state directly
  const [packageData, setPackageData] = useState<MimoPackage>({...emptyPackage});
  
  // If we're editing, load the package data
  useEffect(() => {
    if (isEditing && id) {
      const packageId = parseInt(id);
      const packageToEdit = mimoPackages.find(p => p.id === packageId);
      
      if (packageToEdit) {
        setPackageData({...packageToEdit});
      } else {
        // Package not found, redirect back to packages page
        toast({
          title: "Pacote não encontrado",
          description: "O pacote que você está tentando editar não existe.",
          variant: "destructive"
        });
        navigate('/dashboard/pacotes');
      }
    }
  }, [isEditing, id, mimoPackages, navigate, toast]);

  const handlePackageChange = (field: string, value: any) => {
    setPackageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = () => {
    // Basic validations
    if (!packageData.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o pacote.",
        variant: "destructive"
      });
      return;
    }

    if (packageData.price <= 0) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um preço válido maior que zero.",
        variant: "destructive"
      });
      return;
    }

    // Filter empty features
    const filteredFeatures = packageData.features.filter(feature => feature.trim());
    if (filteredFeatures.length === 0) {
      toast({
        title: "Características obrigatórias",
        description: "Por favor, insira ao menos uma característica para o pacote.",
        variant: "destructive"
      });
      return;
    }

    // Create a new package with a unique ID or use existing ID if editing
    const packageId = isEditing && id ? parseInt(id) : Math.max(0, ...mimoPackages.map(p => p.id || 0)) + 1;
    
    const packageToSave = {
      ...packageData,
      id: packageId,
      features: filteredFeatures
    };

    // Remove existing package with same ID if it exists (should only happen when editing)
    const filteredPackages = mimoPackages.filter(p => p.id !== packageId);
    
    // Update the packages list
    const updatedPackages = [...filteredPackages, packageToSave];
    setMimoPackages(updatedPackages);
    
    // Save to localStorage
    saveMimoPackages(updatedPackages);

    // Navigate back to packages page
    navigate('/dashboard/pacotes');
    
    toast({
      title: isEditing ? "Pacote atualizado" : "Pacote criado",
      description: `O pacote foi ${isEditing ? 'atualizado' : 'criado'} com sucesso.`
    });
  };

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditing ? 'Editar Pacote' : 'Novo Pacote'}
        </h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título do pacote
                  </label>
                  <Input
                    name="title"
                    value={packageData.title}
                    onChange={(e) => handlePackageChange('title', e.target.value)}
                    placeholder="ex: Mimo Básico"
                    className="mimo-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Preço (R$)
                  </label>
                  <Input
                    type="number"
                    name="price"
                    value={packageData.price}
                    onChange={(e) => handlePackageChange('price', Number(e.target.value))}
                    className="mimo-input"
                    min={1}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    Características do pacote
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPackageData(prev => ({
                      ...prev, 
                      features: [...prev.features, '']
                    }))}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Adicionar
                  </Button>
                </div>
                
                {packageData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...packageData.features];
                        newFeatures[index] = e.target.value;
                        setPackageData(prev => ({...prev, features: newFeatures}));
                      }}
                      placeholder="ex: Foto exclusiva"
                      className="mimo-input"
                    />
                    
                    {packageData.features.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newFeatures = packageData.features.filter((_, i) => i !== index);
                          setPackageData(prev => ({...prev, features: newFeatures}));
                        }}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="space-x-2">
                <input
                  type="checkbox"
                  id="highlighted"
                  name="highlighted"
                  checked={packageData.highlighted}
                  onChange={(e) => handlePackageChange('highlighted', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="highlighted" className="text-sm">
                  Destacar este pacote na lista (recomendado)
                </label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mídias do Pacote</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Adicione imagens, vídeos ou áudios que serão entregues aos seus fãs. Marque algumas como "Preview" para que apareçam na página de venda.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {packageData.media.map((media) => (
                  <MediaItemDisplay 
                    key={media.id}
                    media={media}
                    onTogglePreview={() => {
                      const newMedia = packageData.media.map(m => 
                        m.id === media.id ? {...m, isPreview: !m.isPreview} : m);
                      setPackageData(prev => ({...prev, media: newMedia}));
                    }}
                    onRemove={() => {
                      const newMedia = packageData.media.filter(m => m.id !== media.id);
                      setPackageData(prev => ({...prev, media: newMedia}));
                    }}
                  />
                ))}
                
                <MediaUploader onMediaAdd={(media) => {
                  setPackageData(prev => ({
                    ...prev, 
                    media: [...prev.media, media]
                  }));
                }} />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/pacotes')}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFormSubmit}
            >
              {isEditing ? 'Atualizar' : 'Criar'} Pacote
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PackageFormPage;
