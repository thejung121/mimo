
import React from 'react';
import { MimoPackage } from '@/types/creator';
import MimoPackageComponent from './MimoPackage';

interface MimoTabContentProps {
  creator: any;
  packages: MimoPackage[];
  suggestedPrices: number[];
  onSelectPackage: (pkg: MimoPackage) => void;
  onCustomAmount: (amount: number) => void;
}

const MimoTabContent = ({ creator, packages, suggestedPrices, onSelectPackage, onCustomAmount }: MimoTabContentProps) => {
  const hasPackages = packages && packages.length > 0;
  
  return (
    <div className="space-y-6">
      {hasPackages ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages
            .filter(pkg => !pkg.isHidden) // Filter out hidden packages
            .map(pkg => (
              <MimoPackageComponent
                key={pkg.id}
                title={pkg.title}
                price={pkg.price}
                features={pkg.features}
                highlighted={pkg.highlighted} // Fixed typo: highlighted instead of highlighed
                onSelect={() => onSelectPackage(pkg)}
              />
            ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Ainda não há pacotes disponíveis.</p>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Ou envie um valor personalizado</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedPrices.map(price => (
            <button
              key={price}
              onClick={() => onCustomAmount(price)}
              className="px-4 py-2 border rounded-md bg-transparent text-foreground hover:bg-[#F54040] hover:text-white hover:border-[#F54040] focus:outline-none focus:ring-2 focus:ring-[#F54040] focus:ring-opacity-50"
            >
              R$ {price}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MimoTabContent;
