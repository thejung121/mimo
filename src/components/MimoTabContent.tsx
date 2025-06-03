
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

  const handleSuggestedPriceClick = (price: number) => {
    setCustomAmount(price.toString());
  };

  const getPreviewImage = (pkg: MimoPackage) => {
    // First try to find a preview image
    const previewMedia = pkg.media?.find(m => m.isPreview);
    if (previewMedia) return previewMedia.url;
    
    // If no preview, use the first image
    const firstImage = pkg.media?.find(m => m.type === 'image');
    if (firstImage) return firstImage.url;
    
    // If no images at all, try to get any media
    const anyMedia = pkg.media?.[0];
    if (anyMedia) return anyMedia.url;
    
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
                className="bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-slate-700/50"
              >
                {/* Package Header with Image */}
                <div className="relative">
                  <div className="h-56 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                    <img 
                      src={getPreviewImage(pkg)} 
                      alt={pkg.title}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex gap-4 text-sm text-white">
                      <div className="flex items-center">
                        <Image className="w-4 h-4 mr-1" />
                        {pkg.media?.filter(m => m.type === 'image').length || 0}
                      </div>
                      <div className="flex items-center">
                        <Video className="w-4 h-4 mr-1" />
                        {pkg.media?.filter(m => m.type === 'video').length || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Package Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{pkg.title}</h3>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {pkg.features?.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div>
                      <div className="text-3xl font-bold text-blue-400">
                        R$ {pkg.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-400">Acesso Vitalício</div>
                    </div>
                    <button 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-8 py-3 flex items-center text-sm font-bold transition-all transform hover:scale-105 shadow-lg"
                      onClick={() => onSelectPackage(pkg)}
                    >
                      Acessar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700/50">
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
            
            {/* Preset amounts as quick select buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {suggestedPrices.map((price, index) => (
                <button
                  key={price}
                  onClick={() => handleSuggestedPriceClick(price)}
                  className={`py-3 px-4 rounded-lg border transition-all text-sm font-medium ${
                    customAmount === price.toString()
                      ? "bg-red-500 border-red-500 text-white" 
                      : "bg-transparent border-slate-600 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50"
                  }`}
                >
                  R$ {price.toFixed(2)}
                </button>
              ))}
            </div>
            
            {/* Custom amount input */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <label className="block text-sm font-medium mb-3">Valor personalizado:</label>
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
