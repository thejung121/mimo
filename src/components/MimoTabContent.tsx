import React, { memo, useState } from 'react';
import type { MimoPackage } from '@/types/creator';
import { Heart, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MimoTabContentProps {
  mimoPackages: MimoPackage[];
  onSelectPackage: (pkg: MimoPackage) => void;
  onCustomValue?: (value: number) => void;
}

// Clean, simplified package card component
const PackageCard = memo(({ pkg, onSelect }: { pkg: MimoPackage, onSelect: () => void }) => {
  // Find preview image
  const previewMedia = pkg.media.find(m => m.isPreview);
  
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-sm border ${pkg.highlighted ? 'border-primary' : 'border-gray-100'} transition-all hover:shadow-md`}>
      {/* Preview image */}
      {previewMedia ? (
        <div className="h-32 overflow-hidden">
          <img 
            src={previewMedia.url} 
            alt={pkg.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-32 bg-gray-50"></div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{pkg.title}</h3>
          {pkg.highlighted && (
            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
              Popular
            </span>
          )}
        </div>
        
        <ul className="space-y-1 mb-4 text-sm">
          {pkg.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary flex-shrink-0" />
              <span className="text-gray-600 line-clamp-1">{feature}</span>
            </li>
          ))}
          {pkg.features.length > 3 && (
            <li className="text-xs text-gray-400 pl-4">
              + {pkg.features.length - 3} características
            </li>
          )}
        </ul>
        
        <Button 
          className={`w-full ${pkg.highlighted ? 'bg-primary hover:bg-primary/90' : 'bg-white text-primary border border-primary hover:bg-primary/5'} rounded-full`}
          onClick={onSelect}
          size="sm"
        >
          <Heart className="mr-1 h-3.5 w-3.5" />
          Enviar R${pkg.price} de Mimo
        </Button>
      </div>
    </div>
  );
});

PackageCard.displayName = 'PackageCard';

// New custom value component
const CustomValueMimo = ({ onSubmit }: { onSubmit: (value: number) => void }) => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const handleSubmit = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError('Por favor, digite um valor válido');
      return;
    }
    
    onSubmit(numValue);
    setValue('');
    setError('');
  };
  
  return (
    <div className="bg-gradient-to-r from-primary/5 to-transparent p-5 rounded-lg border border-primary/20">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="h-5 w-5 text-primary" />
        <h3 className="font-medium">Envie um valor personalizado</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">Quanto maior o mimo, maior a recompensa!</p>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="custom-value">Valor do mimo (R$)</Label>
          <div className="flex items-center">
            <span className="bg-muted rounded-l-md border border-r-0 border-border px-3 py-2 text-muted-foreground">R$</span>
            <Input 
              id="custom-value"
              type="number"
              placeholder="Valor personalizado"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              className="rounded-l-none"
              min="5"
            />
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={!value || parseFloat(value) <= 0}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Heart className="mr-2 h-4 w-4" />
          Enviar Mimo Personalizado
        </Button>
      </div>
    </div>
  );
};

const MimoTabContent = ({ mimoPackages, onSelectPackage, onCustomValue }: MimoTabContentProps) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  const handleCustomValue = (value: number) => {
    // Create a temporary package with the custom value
    const customPackage: MimoPackage = {
      id: 0,
      title: "Mimo Personalizado",
      price: value,
      features: ["Valor personalizado", "Mensagem exclusiva"],
      highlighted: false,
      media: []
    };
    
    onSelectPackage(customPackage);
  };
  
  if (mimoPackages.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
        <Heart className="mx-auto h-10 w-10 text-gray-200 mb-3" />
        <p className="text-gray-500 text-sm">Nenhum pacote disponível no momento</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mimoPackages.map((pkg) => (
          <PackageCard 
            key={pkg.id} 
            pkg={pkg} 
            onSelect={() => onSelectPackage(pkg)} 
          />
        ))}
      </div>
      
      <div className="pt-6 border-t border-dashed border-gray-200">
        {showCustomForm ? (
          <CustomValueMimo onSubmit={handleCustomValue} />
        ) : (
          <Button 
            variant="ghost" 
            onClick={() => setShowCustomForm(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <Gift className="h-4 w-4 text-primary" />
            <span>Quero enviar outro valor</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default memo(MimoTabContent);
