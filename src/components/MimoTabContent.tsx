
import React from 'react';
import { MimoPackage } from '@/types/creator';
import { Loader2, Heart, Image, Video, CheckCircle, ArrowRight } from 'lucide-react';
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
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="px-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">
          {hasPackages ? (
            packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="bg-slate-800 rounded-lg overflow-hidden"
              >
                {/* Package Preview Image */}
                <div className="flex">
                  {pkg.media && pkg.media.length > 0 && pkg.media.some(m => m.isPreview) ? (
                    <div className="w-1/3">
                      <img 
                        src={pkg.media.find(m => m.isPreview)?.url || pkg.media[0]?.url || '/placeholder.svg'} 
                        alt={pkg.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="w-1/3 h-32 bg-slate-700 flex items-center justify-center">
                      <Image className="w-8 h-8 text-slate-500" />
                    </div>
                  )}
                  
                  <div className="w-2/3 p-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold">{pkg.title}</h3>
                      <div className="flex gap-1 text-xs text-slate-400">
                        <div className="flex items-center">
                          <Image className="w-3 h-3 mr-1" />
                          {pkg.media?.filter(m => m.type === 'image').length || 0} fotos
                        </div>
                        <div className="flex items-center ml-2">
                          <Video className="w-3 h-3 mr-1" />
                          {pkg.media?.filter(m => m.type === 'video').length || 0} vídeos
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-400 mt-1 mb-2">
                      {pkg.features?.[0] || 'Conteúdo exclusivo e personalizado'}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-1">
                      {pkg.features?.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <CheckCircle className="w-3 h-3 text-red-500 mr-2" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Price and Action Button */}
                <div className="bg-slate-800 px-3 py-2 flex items-center justify-between">
                  <div className="text-blue-400 font-medium">
                    R$ {pkg.price.toFixed(2)} - Acesso Vitalício
                  </div>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 flex items-center text-sm"
                    onClick={() => onSelectPackage(pkg)}
                  >
                    Acessar Agora
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-6 bg-slate-800/50 rounded-lg">
              <p className="text-slate-400">
                Este criador ainda não configurou nenhuma recompensa visível.
              </p>
            </div>
          )}
          
          {/* Mimo section */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="text-center mb-4">
              <h2 className="font-medium flex items-center justify-center">
                <Heart className="text-red-500 w-5 h-5 mr-2" fill="currentColor" />
                Manda um Mimo
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Você manda um mimo e ganha uma recompensa quente e exclusiva
              </p>
            </div>
            
            <div className="space-y-3">
              {suggestedPrices.map((price) => (
                <button
                  key={price}
                  onClick={() => onCustomAmount(price)}
                  className={`w-full rounded-full border border-blue-400 py-2 flex items-center justify-center gap-2 ${
                    price === 50 ? "bg-blue-600 border-blue-600" : "bg-transparent"
                  }`}
                >
                  <Heart className="w-5 h-5" fill={price === 50 ? "currentColor" : "none"} />
                  Mimar com R$ {price.toFixed(2)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center text-xs text-slate-500 mt-8">
            Feito com amor pela Mimo ❤️
          </div>
        </div>
      </div>
    </div>
  );
};

export default MimoTabContent;
