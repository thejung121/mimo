
import React, { useEffect, useState } from 'react';
import { Creator } from '@/types/creator';
import { getCreatorData } from '@/services/creator/profileService';
import { getCurrentUser } from '@/services/supabase/authService';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

interface PagePreviewProps {
  username: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creator, setCreator] = useState<Creator | null>(null);

  useEffect(() => {
    const loadCreatorForPreview = async () => {
      try {
        setIsLoading(true);
        
        // Try to get user data from localStorage
        const userData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!userData) {
          setError("No user data found");
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Check if the loaded user has the requested username
        if (user.username !== username) {
          setError(`Username mismatch: ${user.username} vs ${username}`);
          return;
        }
        
        // Get creator data from localStorage
        const creatorData = getCreatorData();
        if (creatorData) {
          console.log('PagePreview loaded creator data:', creatorData);
          setCreator(creatorData);
        } else {
          setError("No creator data found");
        }
      } catch (error) {
        console.error('Error loading preview:', error);
        setError("Failed to load preview");
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
    <div className="w-full h-[400px] overflow-auto border rounded-md">
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
      </div>
    </div>
  );
};

export default PagePreview;
