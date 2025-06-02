
import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { usePackageManagement } from '@/hooks/usePackageManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import MediaUploader from '@/components/MediaUploader';
import MediaItemDisplay from '@/components/MediaItemDisplay';
import { useToast } from '@/components/ui/use-toast';
import { MimoPackage, MediaItem } from '@/types/creator';

const PackageFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id !== 'novo';
  
  const {
    packages,
    loading,
    createPackage,
    updatePackage: updateExistingPackage
  } = usePackageManagement();

  const [packageData, setPackageData] = useState<Omit<MimoPackage, 'id'>>({
    title: '',
    price: 0,
    features: [''],
    highlighted: false,
    isHidden: false,
    media: []
  });

  // If we're editing, load the package data
  useEffect(() => {
    if (isEditing && id && packages.length > 0) {
      const packageToEdit = packages.find(p => String(p.id) === id);
      
      if (packageToEdit) {
        setPackageData({
          title: packageToEdit.title,
          price: packageToEdit.price,
          features: packageToEdit.features,
          highlighted: packageToEdit.highlighted,
          isHidden: packageToEdit.isHidden,
          media: packageToEdit.media
        });
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
  }, [isEditing, id, packages, navigate, toast]);

  const handleFormSubmit = async () => {
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

    const packageToSave = {
      ...packageData,
      features: filteredFeatures
    };

    let success = false;
    
    if (isEditing && id) {
      success = await updateExistingPackage(id, packageToSave);
    } else {
      success = await createPackage(packageToSave);
    }

    if (success) {
      navigate('/dashboard/pacotes');
    }
  };

  const addFeature = () => {
    setPackageData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setPackageData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };

  const removeFeature = (index: number) => {
    if (packageData.features.length > 1) {
      setPackageData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const addMedia = (media: MediaItem) => {
    setPackageData(prev => ({
      ...prev,
      media: [...prev.media, media]
    }));
  };

  const removeMedia = (mediaId: number | string) => {
    setPackageData(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== mediaId)
    }));
  };

  const togglePreview = (mediaId: number | string) => {
    setPackageData(prev => ({
      ...prev,
      media: prev.media.map(m => 
        m.id === mediaId ? { ...m, isPreview: !m.isPreview } : m
      )
    }));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6 flex items-center justify-center" style={{minHeight: '400px'}}>
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

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
                    value={packageData.title}
                    onChange={(e) => setPackageData(prev => ({...prev, title: e.target.value}))}
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
                    value={packageData.price}
                    onChange={(e) => setPackageData(prev => ({...prev, price: Number(e.target.value)}))}
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
                    onClick={addFeature}
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
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="ex: Foto exclusiva"
                      className="mimo-input"
                    />
                    
                    {packageData.features.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFeature(index)}
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
                  checked={packageData.highlighted}
                  onChange={(e) => setPackageData(prev => ({...prev, highlighted: e.target.checked}))}
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
                    onTogglePreview={() => togglePreview(media.id)}
                    onRemove={() => removeMedia(media.id)}
                  />
                ))}
                
                <MediaUploader onMediaAdd={addMedia} />
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
