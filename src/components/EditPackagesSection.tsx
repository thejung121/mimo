
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye } from 'lucide-react';
import MimoPackageForm from './MimoPackageForm';
import MediaUploader from './MediaUploader';
import { MimoPackage, MediaItem } from '@/types/creator';

interface EditPackagesSectionProps {
  mimoPackages: MimoPackage[];
  showNewPackageForm: boolean;
  newPackage: MimoPackage;
  onAddPackage: () => void;
  onCancelAddPackage: () => void;
  onDeletePackage: (id: number) => void;
  onEditPackage: (id: number) => void;
  onSaveAll: () => void;
  onPackageChange: (field: string, value: any) => void;
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onSavePackage: () => void;
  onAddMedia: (packageId: number | null, media: MediaItem) => void;
  onRemoveMedia: (packageId: number | null, mediaId: number) => void;
  onTogglePreview: (packageId: number | null, mediaId: number) => void;
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPackagesSection: React.FC<EditPackagesSectionProps> = ({
  mimoPackages,
  showNewPackageForm,
  newPackage,
  onAddPackage,
  onCancelAddPackage,
  onDeletePackage,
  onEditPackage,
  onSaveAll,
  onPackageChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onSavePackage,
  onAddMedia,
  onRemoveMedia,
  onTogglePreview,
  setShowNewPackageForm
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Seus Pacotes de Mimo</CardTitle>
          <CardDescription>
            Gerencie os pacotes que seus fãs podem adquirir para te enviar mimos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lista de pacotes existentes */}
          <div className="space-y-6">
            {mimoPackages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não tem nenhum pacote de mimo. Crie seu primeiro pacote!
              </p>
            )}
            
            {mimoPackages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">{pkg.title}</h3>
                      {pkg.highlighted && (
                        <span className="bg-mimo-primary/10 text-mimo-primary text-xs px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                    </div>
                    
                    <p className="font-bold text-lg mb-2">R${pkg.price}</p>
                    
                    <ul className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="mr-2 text-mimo-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPackage(pkg.id!)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePackage(pkg.id!)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Seção de mídia do pacote */}
                <div className="border-t bg-muted/50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Imagens e vídeos</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {pkg.media.map((media) => (
                      <div 
                        key={media.id} 
                        className={`relative rounded-md overflow-hidden border ${media.isPreview ? 'border-mimo-primary' : 'border-border'}`}
                      >
                        <img 
                          src={media.url} 
                          alt={`Mídia ${media.id}`}
                          className="w-full h-24 object-cover"
                        />
                        <div className="absolute top-1 right-1 flex space-x-1">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 bg-white/80 hover:bg-white border"
                            onClick={() => onTogglePreview(pkg.id!, media.id)}
                            title={media.isPreview ? "Remover do preview" : "Adicionar ao preview"}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-6 w-6 bg-white/80 hover:bg-white border text-destructive"
                            onClick={() => onRemoveMedia(pkg.id!, media.id)}
                            title="Remover mídia"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {media.isPreview && (
                          <div className="absolute bottom-0 left-0 right-0 bg-mimo-primary text-white text-[10px] py-0.5 px-2 text-center">
                            Preview
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <MediaUploader onMediaAdd={(media) => onAddMedia(pkg.id!, media)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Formulário para adicionar novo pacote */}
          {!showNewPackageForm ? (
            <div className="flex justify-center">
              <Button
                onClick={onAddPackage}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Novo Pacote
              </Button>
            </div>
          ) : (
            <MimoPackageForm
              packageData={newPackage}
              onChange={onPackageChange}
              onFeatureChange={onFeatureChange}
              onAddFeature={onAddFeature}
              onRemoveFeature={onRemoveFeature}
              onSave={onSavePackage}
              onCancel={onCancelAddPackage}
              onAddMedia={(media) => onAddMedia(null, media)}
              onRemoveMedia={(mediaId) => onRemoveMedia(null, mediaId)}
              onTogglePreview={(mediaId) => onTogglePreview(null, mediaId)}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          className="mimo-button"
          onClick={onSaveAll}
        >
          Salvar Todos os Pacotes
        </Button>
      </div>
    </>
  );
};

export default EditPackagesSection;
