
import React, { useEffect } from 'react';
import { Heart, CheckCircle2, CheckCircle, ArrowRight } from 'lucide-react';
import PurchaseFlow from "@/components/PurchaseFlow";
import LoadingState from '@/components/creator/LoadingState';
import NotFoundState from '@/components/creator/NotFoundState';
import AdminBanner from '@/components/creator/AdminBanner';
import { useCreatorPage } from '@/hooks/useCreatorPage';
import { cn } from '@/lib/utils';
import CustomMimoInput from '@/components/CustomMimoInput';

const CreatorPage = () => {
  const {
    creator,
    mimoPackages,
    isLoading,
    headerVisible,
    isOwnPage,
    selectedPackage,
    purchaseFlowOpen,
    suggestedPrices,
    handleSelectPackage,
    handleCustomAmount,
    scrollToMimoSection,
    setPurchaseFlowOpen
  } = useCreatorPage();

  useEffect(() => {
    if (creator) {
      console.log('CreatorPage loaded with creator data:', {
        name: creator.name,
        username: creator.username,
        avatar: creator.avatar,
        cover: creator.cover,
        description: creator.description,
        socialLinks: creator.socialLinks
      });
    }
    if (mimoPackages) {
      console.log('CreatorPage loaded packages:', mimoPackages);
    }
  }, [creator, mimoPackages]);

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show not found state
  if (!creator) {
    return <NotFoundState />;
  }

  // Filter to get only filled social links
  const filledSocialLinks = creator.socialLinks?.filter(link => 
    link.url && link.url.trim() !== ''
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Admin banner if this is the user's own page */}
      {isOwnPage && <AdminBanner />}
      
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={creator.cover || '/placeholder.svg'} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-5 pt-16 pb-6 text-center">
          {/* Avatar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
            <div className="rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800 w-24 h-24">
              <img 
                src={creator.avatar || '/placeholder.svg'} 
                alt={creator.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-xl font-bold flex items-center justify-center">
            {creator.name}
            <CheckCircle2 className="w-4 h-4 text-blue-500 ml-1" />
          </h1>
          
          <p className="text-slate-400 text-sm mt-1 mb-3 max-w-sm mx-auto">
            {creator.description || creator.about || 'Um perfil exclusivo com conteúdos especiais'}
          </p>

          {/* Social Links */}
          {filledSocialLinks.length > 0 && (
            <div className="flex justify-center gap-4 border-b border-slate-800 pb-4 mb-4">
              {filledSocialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {link.type === 'instagram' && <span className="text-lg">Instagram</span>}
                  {link.type === 'twitter' && <span className="text-lg">Twitter</span>}
                  {link.type === 'website' && <span className="text-lg">Website</span>}
                  {link.type === 'youtube' && <span className="text-lg">Youtube</span>}
                </a>
              ))}
            </div>
          )}
          
          <h2 className="text-center mb-4">Explore meus conteúdos</h2>
        </div>
      </div>
      
      {/* Packages Section */}
      <div className="flex-grow px-4 pb-8">
        <div className="max-w-md mx-auto space-y-6">
          {mimoPackages && mimoPackages.length > 0 ? (
            mimoPackages.map((pkg) => (
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
                      <span className="text-slate-500">Sem prévia</span>
                    </div>
                  )}
                  
                  <div className="w-2/3 p-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold">{pkg.title}</h3>
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
                    onClick={() => handleSelectPackage(pkg)}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 flex items-center text-sm"
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
                Ainda não há pacotes disponíveis.
              </p>
            </div>
          )}

          {/* Mimo section using CustomMimoInput component */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="text-center mb-4">
              <h2 className="font-medium flex items-center justify-center text-white">
                <Heart className="text-red-500 w-5 h-5 mr-2" fill="currentColor" />
                Manda um Mimo
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Você manda um mimo e ganha uma recompensa quente e exclusiva
              </p>
            </div>
            
            <CustomMimoInput 
              onSubmit={handleCustomAmount} 
              suggestedPrices={suggestedPrices} 
              minimumAmount={5}
            />
          </div>
          
          <div className="text-center text-xs text-slate-500 mt-8">
            Feito com amor pela Mimo ❤️
          </div>
        </div>
      </div>
      
      {/* Purchase Flow Component */}
      {selectedPackage && creator && (
        <PurchaseFlow
          open={purchaseFlowOpen}
          onClose={() => {
            setPurchaseFlowOpen(false);
          }}
          packageId={selectedPackage.id?.toString() || ''}
          packageTitle={selectedPackage.title}
          packagePrice={selectedPackage.price}
          creatorId={creator.id || ''}
          creatorName={creator.name}
        />
      )}
    </div>
  );
};

export default CreatorPage;
