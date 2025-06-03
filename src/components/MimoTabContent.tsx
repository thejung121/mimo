
import React, { useState } from 'react';
import { MimoPackage } from '@/types/creator';
import { Loader2, Heart, Image, Video, CheckCircle, ArrowRight } from 'lucide-react';
import { usePublicPackages } from '@/hooks/usePublicPackages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const [customAmount, setCustomAmount] = useState('');
  
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

  const handleCustomSubmit = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      onCustomAmount(amount);
      setCustomAmount('');
    }
  };

  const getPreviewImage = (pkg: MimoPackage) => {
    // First try to find a preview image
    const previewMedia = pkg.media?.find(m => m.isPreview);
    if (previewMedia) return previewMedia.url;
    
    // If no preview, use the first image
    const firstImage = pkg.media?.find(m => m.type === 'image');
    if (firstImage) return firstImage.url;
    
    // Fallback to placeholder
    return '/placeholder.svg';
  };
  
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      <div className="px-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">
          {hasPackages ? (
            packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700"
              >
                {/* Package Header with Image */}
                <div className="relative">
                  <div className="h-48 bg-slate-700 overflow-hidden">
                    <img 
                      src={getPreviewImage(pkg)} 
                      alt={pkg.title}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="flex gap-3 text-xs text-white">
                      <div className="flex items-center">
                        <Image className="w-3 h-3 mr-1" />
                        {pkg.media?.filter(m => m.type === 'image').length || 0}
                      </div>
                      <div className="flex items-center">
                        <Video className="w-3 h-3 mr-1" />
                        {pkg.media?.filter(m => m.type === 'video').length || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Package Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {pkg.features?.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">
                        R$ {pkg.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">Acesso Vitalício</div>
                    </div>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 flex items-center text-sm font-medium transition-colors"
                      onClick={() => onSelectPackage(pkg)}
                    >
                      Acessar
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
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
          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold flex items-center justify-center mb-2">
                <Heart className="text-red-500 w-6 h-6 mr-2" fill="currentColor" />
                Manda um Mimo
              </h2>
              <p className="text-sm text-slate-400">
                Você manda um mimo e ganha uma recompensa quente e exclusiva
              </p>
            </div>
            
            {/* Preset amounts */}
            <div className="space-y-3 mb-4">
              {suggestedPrices.map((price, index) => (
                <button
                  key={price}
                  onClick={() => onCustomAmount(price)}
                  className={`w-full rounded-full border py-3 flex items-center justify-center gap-2 transition-all ${
                    index === 2 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "bg-transparent border-blue-400 text-blue-400 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
                  }`}
                >
                  <Heart className="w-5 h-5" fill={index === 2 ? "currentColor" : "none"} />
                  Mimar com R$ {price.toFixed(2)}
                </button>
              ))}
            </div>
            
            {/* Custom amount input */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium mb-2">Valor personalizado:</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">R$</span>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0,00"
                    className="pl-8 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                  />
                </div>
                <Button
                  onClick={handleCustomSubmit}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                  className="bg-red-500 hover:bg-red-600 text-white px-6"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Enviar
                </Button>
              </div>
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
