
import React, { useEffect } from 'react';
import { Heart, CheckCircle2, CheckCircle, ArrowRight, Instagram, Twitter, Twitch, Globe, Lock, Play, Image as ImageIcon } from 'lucide-react';
import PurchaseFlow from "@/components/PurchaseFlow";
import LoadingState from '@/components/creator/LoadingState';
import NotFoundState from '@/components/creator/NotFoundState';
import AdminBanner from '@/components/creator/AdminBanner';
import { useCreatorPage } from '@/hooks/useCreatorPage';
import { cn } from '@/lib/utils';
import CustomMimoInput from '@/components/CustomMimoInput';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const isMobile = useIsMobile();

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

  // Get social media icon based on type
  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'twitch':
        return <Twitch className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'onlyfans':
        return <Globe className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'privacy':
        return <Lock className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <Globe className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  // Filter to get only filled social links
  const filledSocialLinks = creator.socialLinks?.filter(link => 
    link.url && link.url.trim() !== ''
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Admin banner if this is the user's own page */}
      {isOwnPage && <AdminBanner />}
      
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="w-full h-32 sm:h-40 md:h-48 overflow-hidden">
          <img 
            src={creator.cover || '/placeholder.svg'} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="relative px-4 sm:px-5 pt-12 sm:pt-16 pb-4 sm:pb-6 text-center">
          {/* Avatar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 sm:-top-12">
            <div className="rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
              <img 
                src={creator.avatar || '/placeholder.svg'} 
                alt={creator.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-lg sm:text-xl font-bold flex items-center justify-center">
            {creator.name}
            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 ml-1" />
          </h1>
          
          <p className="text-slate-400 text-xs sm:text-sm mt-1 mb-3 max-w-xs sm:max-w-sm mx-auto px-2">
            {creator.description || creator.about || 'Um perfil exclusivo com conteúdos especiais'}
          </p>

          {/* Social Links with Icons */}
          {filledSocialLinks.length > 0 && (
            <div className="flex justify-center gap-3 sm:gap-4 border-b border-slate-800 pb-3 sm:pb-4 mb-3 sm:mb-4">
              {filledSocialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 sm:p-2"
                  aria-label={link.type}
                >
                  {getSocialIcon(link.type)}
                </a>
              ))}
            </div>
          )}
          
          <h2 className="text-center mb-3 sm:mb-4 text-sm sm:text-base">Explore meus conteúdos</h2>
        </div>
      </div>
      
      {/* Packages Section */}
      <div className="flex-grow px-3 sm:px-4 pb-6 sm:pb-8">
        <div className="max-w-md mx-auto space-y-3 sm:space-y-4">
          {mimoPackages && mimoPackages.length > 0 ? (
            mimoPackages.map((pkg) => {
              // Find preview image or use first media item
              const previewMedia = pkg.media?.find(m => m.isPreview) || pkg.media?.[0];
              const imageCount = pkg.media?.filter(m => m.type === 'image').length || 0;
              const videoCount = pkg.media?.filter(m => m.type === 'video').length || 0;
              
              return (
                <div 
                  key={pkg.id} 
                  className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg sm:rounded-xl overflow-hidden shadow-xl border border-slate-600/30 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Package Header with Image */}
                  <div className="relative">
                    <div className="h-32 sm:h-36 md:h-40 overflow-hidden bg-slate-700">
                      {previewMedia ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={previewMedia.url} 
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Failed to load image:', previewMedia.url);
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const nextElement = target.nextElementSibling as HTMLElement;
                              if (nextElement) {
                                nextElement.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ display: 'none' }}>
                            {previewMedia.type === 'video' ? (
                              <Play className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="currentColor" />
                            ) : (
                              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                            )}
                          </div>
                          {/* Content Stats Overlay */}
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2 text-xs">
                            {imageCount > 0 && (
                              <span className="bg-black/60 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                                <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {imageCount}
                              </span>
                            )}
                            {videoCount > 0 && (
                              <span className="bg-black/60 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center gap-1">
                                <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {videoCount}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-600">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-slate-400 mx-auto mb-1 sm:mb-2" />
                            <span className="text-slate-400 text-xs sm:text-sm">Sem prévia disponível</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Highlight Badge */}
                    {pkg.highlighted && (
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span className="bg-gradient-to-r from-[#F54040] to-[#E03030] text-white text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium shadow-lg">
                          ⭐ Destaque
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Package Content */}
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-1">{pkg.title}</h3>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        {pkg.features?.[0] || 'Conteúdo exclusivo e personalizado'}
                      </p>
                    </div>
                    
                    {/* Features */}
                    {pkg.features && pkg.features.length > 1 && (
                      <div className="space-y-1">
                        {pkg.features.slice(1, isMobile ? 2 : 4).map((feature, idx) => (
                          <div key={idx} className="flex items-start text-xs sm:text-sm text-slate-300">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F54040] mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {pkg.features.length > (isMobile ? 2 : 4) && (
                          <div className="text-xs text-slate-400 pl-4 sm:pl-6">
                            +{pkg.features.length - (isMobile ? 2 : 4)} recursos adicionais
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Price and Action Section */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-600/30 px-3 sm:px-4 py-2.5 sm:py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[#F54040] font-bold text-base sm:text-lg">
                          R$ {pkg.price.toFixed(2)}
                        </div>
                        <div className="text-slate-400 text-xs">
                          Acesso Vitalício
                        </div>
                      </div>
                      <button 
                        onClick={() => handleSelectPackage(pkg)}
                        className="bg-gradient-to-r from-[#F54040] to-[#E03030] hover:from-[#E03030] hover:to-[#D02020] text-white rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 flex items-center font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                      >
                        Acessar Agora
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-6 sm:p-8 bg-slate-800/50 rounded-lg sm:rounded-xl border border-slate-600/30">
              <div className="mb-4">
                <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-medium text-slate-300 mb-2">Nenhum conteúdo disponível</h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Este criador ainda não publicou nenhuma recompensa.
                </p>
              </div>
            </div>
          )}

          {/* Mimo section using CustomMimoInput component */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700">
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold flex items-center justify-center text-white mb-2">
                <Heart className="text-[#F54040] w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" />
                Manda um Mimo
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-2">
                Envie um mimo personalizado e ganhe uma recompensa exclusiva
              </p>
            </div>
            
            <CustomMimoInput 
              onSubmit={handleCustomAmount} 
              suggestedPrices={suggestedPrices} 
              minimumAmount={5}
            />
          </div>
          
          <div className="text-center text-xs text-slate-500 mt-6 sm:mt-8 pb-4">
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
