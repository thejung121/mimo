
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MimoPackage } from '@/types/creator';
import { Check, Heart, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MimoTabContentProps {
  mimoPackages: MimoPackage[];
  onSelectPackage: (pkg: MimoPackage) => void;
}

// Using React.memo to prevent unnecessary re-renders
const MimoPackage = memo(({ pkg, onSelect }: { pkg: MimoPackage, onSelect: () => void }) => {
  // Find preview image safely
  const previewMedia = pkg.media.find(m => m.isPreview);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden relative rounded-lg transition-all duration-200 h-full flex flex-col",
        pkg.highlighted ? 
          "border-2 border-mimo-primary shadow-md" : 
          "border border-gray-200 hover:border-mimo-primary/30"
      )}
    >
      {pkg.highlighted && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-mimo-primary text-white text-xs uppercase font-bold py-1 px-2 rounded-full">
            Popular
          </div>
        </div>
      )}
      
      <div className="h-40 overflow-hidden relative">
        {previewMedia ? (
          <img 
            src={previewMedia.url} 
            alt={pkg.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="h-40 bg-gray-50 flex items-center justify-center">
            <Image className="h-10 w-10 text-gray-300" />
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-medium mb-2">{pkg.title}</h3>
        <p className="text-xl font-bold mb-3 text-mimo-primary">
          R${pkg.price}
        </p>
        
        <ul className="space-y-2 mb-4 flex-grow">
          {pkg.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
          {pkg.features.length > 3 && (
            <li className="text-xs text-gray-500">
              + {pkg.features.length - 3} outras características
            </li>
          )}
        </ul>
        
        <Button 
          className={cn(
            "w-full transition-colors",
            pkg.highlighted ? 
              "bg-mimo-primary hover:bg-mimo-primary/90 text-white" : 
              "bg-white text-mimo-primary border border-mimo-primary hover:bg-mimo-primary/5"
          )}
          onClick={onSelect}
        >
          <Heart className="mr-1 h-4 w-4" />
          Enviar Mimo
        </Button>
      </div>
    </Card>
  );
});

MimoPackage.displayName = 'MimoPackage';

const MimoTabContent = ({ mimoPackages, onSelectPackage }: MimoTabContentProps) => {
  if (mimoPackages.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500">Nenhum pacote disponível no momento</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mimoPackages.map((pkg) => (
        <MimoPackage 
          key={pkg.id} 
          pkg={pkg} 
          onSelect={() => onSelectPackage(pkg)} 
        />
      ))}
    </div>
  );
};

export default memo(MimoTabContent);
