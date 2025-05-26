
import React from 'react';
import { MimoPackage } from '@/types/creator';
import MimoPackageComponent from './MimoPackage';
import { Loader2 } from 'lucide-react';
import { usePublicPackages } from '@/hooks/usePublicPackages';

interface MimoTabContentProps {
  creator: any;
  suggestedPrices: number[];
  onSelectPackage: (pkg: MimoPackage) => void;
  onCustomAmount: (amount: number) => void;
}

const MimoTabContent = ({ 
  creator, 
  suggestedPrices, 
  onSelectPackage, 
  onCustomAmount 
}: MimoTabContentProps) => {
  const { packages, loading } = usePublicPackages(creator?.username);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Carregando recompensas...</p>
        </div>
      </div>
    );
  }
  
  const hasPackages = packages && packages.length > 0;
  
  return (
    <div className="space-y-6">
      {hasPackages ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map(pkg => (
            <MimoPackageComponent
              key={pkg.id}
              title={pkg.title}
              price={pkg.price}
              features={pkg.features}
              highlighted={pkg.highlighted}
              previewImageUrl={pkg.media?.find(m => m.isPreview)?.url}
              onClick={() => onSelectPackage(pkg)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">Ainda não há recompensas disponíveis.</p>
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
