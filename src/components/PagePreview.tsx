
import React, { useEffect, useState } from 'react';
import { Creator, MimoPackage } from '@/types/creator';
import { getCreatorData } from '@/services/creator/profileService';
import { getPackagesByUsername } from '@/services/creator/packageService';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';
import MimoTabContent from '@/components/MimoTabContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from 'lucide-react';

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
          
          // Verify the username matches what we expect
          if (creatorData.username && creatorData.username !== username && username) {
            console.warn(`Username mismatch: ${creatorData.username} vs ${username}`);
          }
          
          setCreator(creatorData);
          setError(null);
          
          // Carregar pacotes do criador
          try {
            const packages = getPackagesByUsername(creatorData.username);
            console.log('Loaded packages for preview:', packages);
            
            // Filtrar apenas pacotes não ocultos
            const visiblePackages = packages.filter(pkg => !pkg.isHidden);
            setMimoPackages(visiblePackages);
          } catch (err) {
            console.error('Error loading packages for preview:', err);
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
    
    loadCreatorForPreview();
  }, [username]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
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

  return (
    <div className="w-full h-[600px] overflow-auto border rounded-md">
      <div className="relative h-[200px] bg-gradient-to-r from-primary-500 to-primary-700">
        {creator.cover && creator.cover !== '/placeholder.svg' && (
          <img 
            src={creator.cover} 
            alt="Capa"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute -bottom-10 left-4">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
            <img 
              src={creator.avatar || '/placeholder.svg'} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-12 px-4 pb-4">
        <h2 className="text-xl font-bold">{creator.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">@{creator.username}</p>
        
        <div className="prose prose-sm max-w-none">
          <p>{creator.description || creator.about}</p>
        </div>
        
        <div className="mt-4 flex gap-2">
          {creator.socialLinks && creator.socialLinks.filter(link => link.url).length > 0 ? (
            creator.socialLinks.filter(link => link.url).map((link, i) => (
              <div key={i} className="p-1 bg-muted rounded-md">
                {link.type}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Sem redes sociais configuradas</p>
          )}
        </div>
        
        {/* Seção de Pacotes */}
        <div className="mt-6 pt-4 border-t">
          <Tabs defaultValue="mimos" className="mb-6">
            <div className="flex justify-center">
              <TabsList className="w-[200px] mb-6">
                <TabsTrigger value="mimos" className="w-full">
                  <Heart className="mr-2 h-4 w-4" /> Mimos
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="mimos">
              <MimoTabContent 
                mimoPackages={mimoPackages} 
                onSelectPackage={() => {}} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
