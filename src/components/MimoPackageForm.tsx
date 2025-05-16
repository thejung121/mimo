import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import MediaUploader from './MediaUploader';
import MediaItemDisplay from './MediaItemDisplay';
import { MediaItem } from '@/types/creator';

interface MimoPackage {
  id?: number | string;
  title: string;
  price: number;
  features: string[];
  highlighted: boolean;
  media: MediaItem[];
  isHidden: boolean;
  description?: string;
}

interface MimoPackageFormProps {
  packageData: MimoPackage;
  onChange: (field: string, value: any) => void;
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddMedia: (media: MediaItem) => void;
  onRemoveMedia: (mediaId: number) => void;
  onTogglePreview: (mediaId: number) => void;
}

const MimoPackageForm = ({
  packageData,
  onChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onSave,
  onCancel,
  onAddMedia,
  onRemoveMedia,
  onTogglePreview
}: MimoPackageFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onChange(name, type === 'checkbox' ? checked : name === 'price' ? Number(value) : value);
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{packageData.id ? 'Editar' : 'Novo'} Pacote de Mimo</CardTitle>
        <CardDescription>
          Defina as características e preço do seu pacote.
        </CardDescription>
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
              onChange={handleChange}
              placeholder="ex: Mimo Básico"
              className="mimo-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Preço (R$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="number"
                name="price"
                value={packageData.price}
                onChange={handleChange}
                className="pl-10 mimo-input"
                min={1}
              />
            </div>
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
              onClick={onAddFeature}
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
                onChange={(e) => onFeatureChange(index, e.target.value)}
                placeholder="ex: Foto exclusiva"
                className="mimo-input"
              />
              
              {packageData.features.length > 1 && (
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemoveFeature(index)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {/* Seção para upload de mídia */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Imagens, vídeos e áudios do pacote
          </label>
          <p className="text-xs text-muted-foreground mb-2">
            Adicione mídias que serão entregues aos seus fãs. Marque algumas como "Preview" para que apareçam na página de venda.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {packageData.media.map((media) => (
              <MediaItemDisplay 
                key={media.id}
                media={media}
                onTogglePreview={() => onTogglePreview(media.id)}
                onRemove={() => onRemoveMedia(media.id)}
              />
            ))}
            
            <MediaUploader onMediaAdd={onAddMedia} />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="highlighted"
            name="highlighted"
            checked={packageData.highlighted}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="highlighted" className="text-sm">
            Destacar este pacote na lista (recomendado)
          </label>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="mimo-button"
            onClick={onSave}
          >
            {packageData.id ? 'Atualizar' : 'Salvar'} Pacote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MimoPackageForm;
