
import React from 'react';
import MimoPackage from './MimoPackage';
import CustomMimoInput from './CustomMimoInput';
import { MimoPackage as MimoPackageType } from '@/types/creator';

interface MimoTabContentProps {
  mimoPackages: MimoPackageType[];
  onSelectPackage: (pkg: MimoPackageType) => void;
  onCustomAmount?: (amount: number) => void;
  suggestedPrices?: number[];
}

const MimoTabContent = ({ 
  mimoPackages, 
  onSelectPackage, 
  onCustomAmount,
  suggestedPrices = [10, 15, 25, 50]
}: MimoTabContentProps) => {
  // Sort packages by price
  const sortedPackages = [...mimoPackages].sort((a, b) => a.price - b.price);
  
  // Find the highlighted package (middle one if 3 or more packages)
  const highlightedIndex = sortedPackages.length >= 3 
    ? Math.floor(sortedPackages.length / 2) 
    : (sortedPackages.findIndex(pkg => pkg.highlighted) !== -1 
      ? sortedPackages.findIndex(pkg => pkg.highlighted) 
      : -1);
  
  return (
    <div className="space-y-8">
      {sortedPackages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-white">
            Este criador ainda não configurou nenhum pacote de mimo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedPackages.map((pkg, index) => (
            <MimoPackage
              key={pkg.id}
              title={pkg.title}
              price={pkg.price}
              features={pkg.features || []}
              highlighed={index === highlightedIndex}
              previewImageUrl={pkg.media && pkg.media.length > 0 
                ? pkg.media.find(m => m.isPreview)?.url || pkg.media[0].url 
                : undefined}
              onClick={() => onSelectPackage(pkg)}
            />
          ))}
        </div>
      )}
      
      {/* Add custom amount input only if the handler exists */}
      {onCustomAmount && (
        <div className="mt-8">
          <div className="text-center mb-4">
            <h2 className="font-medium flex items-center justify-center text-white">
              <span className="text-red-500 mr-2">❤</span>
              Manda um Mimo
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Você manda um mimo e ganha uma recompensa quente e exclusiva
            </p>
          </div>
          <CustomMimoInput 
            onSubmit={onCustomAmount}
            minimumAmount={10}
            suggestedPrices={suggestedPrices}
          />
        </div>
      )}
    </div>
  );
};

export default MimoTabContent;
