
import React from 'react';
import MimoPackage from './MimoPackage';
import CustomMimoInput from './CustomMimoInput';
import { MimoPackage as MimoPackageType } from '@/types/creator';

interface MimoTabContentProps {
  mimoPackages: MimoPackageType[];
  onSelectPackage: (pkg: MimoPackageType) => void;
  onCustomAmount?: (amount: number) => void;
}

const MimoTabContent = ({ mimoPackages, onSelectPackage, onCustomAmount }: MimoTabContentProps) => {
  // Sort packages by price
  const sortedPackages = [...mimoPackages].sort((a, b) => a.price - b.price);
  
  // Find the highlighted package (middle one if 3 or more packages)
  const highlightedIndex = sortedPackages.length >= 3 
    ? Math.floor(sortedPackages.length / 2) 
    : -1;
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {sortedPackages.map((pkg, index) => (
          <MimoPackage
            key={pkg.id}
            title={pkg.title}
            price={pkg.price}
            features={pkg.features || []}
            highlighed={index === highlightedIndex}
            previewImageUrl={pkg.media && pkg.media.length > 0 ? pkg.media[0].url : undefined}
            onClick={() => onSelectPackage(pkg)}
          />
        ))}
        
        {/* Add custom amount input only if the handler exists */}
        {onCustomAmount && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <CustomMimoInput 
              onSubmit={onCustomAmount}
              minimumAmount={10}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MimoTabContent;
