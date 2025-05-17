import React, { useEffect, useState } from 'react';
import { Creator, MimoPackage } from '@/types/creator';
import { getCreatorData } from '@/services/creator/profileService';
import { getMimoPackages } from '@/services/creator/packageService';
import { Loader2, Heart, Image, Video, CheckCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface PagePreviewProps {
  username: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);

  useEffect(() => {
    const loadCreatorForPreview = async () => {
      try {
        setIsLoading(true);
        
        // Get creator data from localStorage directly
        const creatorData = getCreatorData();
        
        if (creatorData) {
          console.log('PagePreview loaded creator data:', creatorData);
          setCreator(creatorData);
          setError(null);
          
          // Load the current user's packages directly from localStorage
          try {
            // This will get all packages for the current user
            const packages = await getMimoPackages();
            console.log('Loaded packages for preview:', packages);
            
            // Filter only packages that are not hidden
            const visiblePackages = packages.filter(pkg => !pkg.isHidden);
            console.log('Visible packages for preview:', visiblePackages);
            setMimoPackages(visiblePackages);
          } catch (err) {
            console.error('Error loading packages for preview:', err);
            setMimoPackages([]);
          }
        } else {
          setError("Nenhum dado de criador encontrado. Configure seu perfil primeiro.");
        }
      } catch (error) {
        console.error('Error loading preview:', error);
        setError("Falha ao carregar prévia");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load immediately to make sure data is refreshed
    loadCreatorForPreview();
  }, [username]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Carregando prévia...</p>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar prévia: {error || 'Dados do criador não encontrados'}</p>
      </div>
    );
  }

  // Count media items
  const countMediaByType = (packages: MimoPackage[], type: string) => {
    return packages.reduce((count, pkg) => {
      return count + pkg.media.filter(media => media.type === type).length;
    }, 0);
  };

  const videoCount = countMediaByType(mimoPackages, 'video');
  const imageCount = countMediaByType(mimoPackages, 'image');
  const subscriberCount = 525; // Placeholder value

  return (
    <div className="w-full h-[600px] overflow-auto bg-slate-900 text-white rounded-md">
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
        
        <p className="text-slate-400 text-sm mt-1 mb-3">
          {creator.description || creator.about || 'Um perfil exclusivo com conteúdos especiais'}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="font-bold">{videoCount}</span> Vídeos
          </div>
          <div>
            <span className="font-bold">{imageCount}</span> Fotos
          </div>
          <div>
            <span className="font-bold">{subscriberCount}</span> assinantes
          </div>
        </div>
        
        <h2 className="text-center mb-4">Explore meus conteúdos</h2>
      </div>
      
      {/* Packages */}
      <div className="px-4 pb-8">
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
              {[7, 15, 50].map((price) => (
                <button
                  key={price}
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

export default PagePreview;
