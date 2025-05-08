
import React, { memo } from 'react';
import type { MimoPackage } from '@/types/creator';
import { Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MimoTabContentProps {
  mimoPackages: MimoPackage[];
  onSelectPackage: (pkg: MimoPackage) => void;
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
        
        <p className="text-lg font-semibold mb-3">
          R${pkg.price}
        </p>
        
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
          Enviar Mimo
        </Button>
      </div>
    </div>
  );
});

PackageCard.displayName = 'PackageCard';

const MimoTabContent = ({ mimoPackages, onSelectPackage }: MimoTabContentProps) => {
  if (mimoPackages.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-100">
        <Heart className="mx-auto h-10 w-10 text-gray-200 mb-3" />
        <p className="text-gray-500 text-sm">Nenhum pacote disponível no momento</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {mimoPackages.map((pkg) => (
        <PackageCard 
          key={pkg.id} 
          pkg={pkg} 
          onSelect={() => onSelectPackage(pkg)} 
        />
      ))}
    </div>
  );
};

export default memo(MimoTabContent);
