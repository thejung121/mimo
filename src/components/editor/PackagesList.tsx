
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import MediaItemDisplay from '../MediaItemDisplay';
import MediaUploader from '../MediaUploader';
import { MimoPackage } from '@/types/creator';

interface PackagesListProps {
  mimoPackages: MimoPackage[];
  onEditPackage: (id: number | string) => void;
  onDeletePackage: (id: number | string) => void;
  onAddMedia: (packageId: number | string, media: any) => void;
  onRemoveMedia: (packageId: number | string, mediaId: number) => void;
  onTogglePreview: (packageId: number | string, mediaId: number) => void;
}

const PackagesList = ({ 
  mimoPackages,
  onEditPackage,
  onDeletePackage,
  onAddMedia,
  onRemoveMedia,
  onTogglePreview
}: PackagesListProps) => {
  if (mimoPackages.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Você ainda não tem nenhum pacote de mimo. Crie seu primeiro pacote!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {mimoPackages.map((pkg) => (
        <div key={pkg.id} className="border rounded-lg overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <h3 className="text-lg font-medium">{pkg.title}</h3>
                {pkg.highlighted && (
                  <span className="bg-mimo-primary/10 text-mimo-primary text-xs px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
              </div>
              
              <p className="font-bold text-lg mb-2">R${pkg.price}</p>
              
              <ul className="space-y-1">
                {pkg.features.slice(0, 5).map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <span className="mr-2 text-mimo-primary">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
                {pkg.features.length > 5 && (
                  <li className="text-xs text-muted-foreground">
                    +{pkg.features.length - 5} mais características
                  </li>
                )}
              </ul>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPackage(pkg.id)}
              >
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeletePackage(pkg.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Seção de mídia do pacote */}
          <div className="border-t bg-muted/50 p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Mídias do pacote</h4>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4">
              {pkg.media.map((media) => (
                <div key={media.id} className="w-24 md:w-auto flex-shrink-0">
                  <MediaItemDisplay
                    media={media}
                    onTogglePreview={() => onTogglePreview(pkg.id, media.id)}
                    onRemove={() => onRemoveMedia(pkg.id, media.id)}
                  />
                </div>
              ))}
              
              <div className="w-24 md:w-auto flex-shrink-0">
                <MediaUploader onMediaAdd={(media) => onAddMedia(pkg.id, media)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PackagesList;
