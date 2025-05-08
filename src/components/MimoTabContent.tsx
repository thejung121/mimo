
import React, { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MimoPackage } from '@/types/creator';
import { Check, Heart, Image, Video } from 'lucide-react';
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
      key={pkg.id} 
      className={cn(
        "overflow-hidden relative rounded-2xl transition-all duration-300 hover:shadow-lg flex flex-col",
        pkg.highlighted ? 
          "border-2 border-mimo-primary shadow-lg shadow-mimo-primary/20" : 
          "border border-gray-200 hover:border-mimo-primary/50"
      )}
    >
      {pkg.highlighted && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white text-xs uppercase font-bold py-1 px-3 rounded-bl-lg">
            Mais popular
          </div>
        </div>
      )}
      
      <div className="h-40 overflow-hidden relative">
        {previewMedia ? (
          <>
            <img 
              src={previewMedia.url} 
              alt={pkg.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy" // Add lazy loading for better performance
              onError={(e) => {
                // Fallback for image error
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center text-white text-sm">
                <Image className="h-4 w-4 mr-1" />
                <span>{pkg.media.filter(m => m.type === 'image').length} fotos</span>
                {pkg.media.some(m => m.type === 'video') && (
                  <>
                    <span className="mx-1">•</span>
                    <Video className="h-4 w-4 mr-1" />
                    <span>{pkg.media.filter(m => m.type === 'video').length} vídeos</span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Image className="h-10 w-10 mx-auto mb-2" />
              <p className="text-sm">Prévia não disponível</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
        <p className="text-2xl font-bold mb-4 text-mimo-primary">
          R${pkg.price}
          <span className="text-sm text-gray-500 font-normal ml-1">único</span>
        </p>
        
        <ul className="space-y-2 mb-6 flex-grow">
          {/* Limit features displayed to 5 max for performance */}
          {pkg.features.slice(0, 5).map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
          {pkg.features.length > 5 && (
            <li className="text-xs text-gray-500">
              + {pkg.features.length - 5} mais características
            </li>
          )}
        </ul>
        
        <Button 
          className={cn(
            "w-full transition-all mt-auto",
            pkg.highlighted ? 
              "bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white" : 
              "bg-white text-mimo-primary border-2 border-mimo-primary hover:bg-mimo-primary/10"
          )}
          onClick={onSelect}
        >
          <Heart className={cn("mr-1 h-4 w-4", pkg.highlighted ? "" : "text-red-500")} />
          Enviar Mimo
        </Button>
      </div>
    </Card>
  );
});

MimoPackage.displayName = 'MimoPackage';

const MimoTabContent = ({ mimoPackages, onSelectPackage }: MimoTabContentProps) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {mimoPackages.map((pkg) => (
          <MimoPackage 
            key={pkg.id} 
            pkg={pkg} 
            onSelect={() => onSelectPackage(pkg)} 
          />
        ))}
      </div>
      
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" fill="#f43f5e" />
          Como funciona
        </h3>
        <ol className="space-y-3 ml-5 list-decimal">
          <li className="text-gray-700">Escolha um pacote de mimo que deseja enviar.</li>
          <li className="text-gray-700">Crie um nome de usuário que será sua identificação e senha de acesso.</li>
          <li className="text-gray-700">Após a confirmação do pagamento via PIX, você receberá um link de acesso às recompensas.</li>
          <li className="text-gray-700">O link ficará disponível por 30 dias.</li>
          <li className="text-gray-700">Use seu nome de usuário como senha para acessar as recompensas exclusivas.</li>
        </ol>
      </div>
    </>
  );
};

export default memo(MimoTabContent);
