
import { useState, useEffect } from 'react';
import { Creator } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentCreator } from '@/services/supabase/creatorService';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileData = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [creator, setCreator] = useState<Creator>({
    name: '',
    username: '',
    coverTitle: '',
    coverSubtitle: '',
    about: '',
    avatar: '/placeholder.svg',
    cover: '/placeholder.svg',
    description: '',
    socialLinks: [
      { type: 'instagram', url: '' },
      { type: 'twitter', url: '' },
      { type: 'twitch', url: '' },
      { type: 'onlyfans', url: '' },
      { type: 'privacy', url: '' }
    ]
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCreator = async () => {
      setIsLoading(true);
      
      try {
        const creatorData = await getCurrentCreator();
        
        if (creatorData) {
          console.log('Loaded creator data:', creatorData);
          
          // Ensure we have all required social links
          const requiredTypes = ['instagram', 'twitter', 'twitch', 'onlyfans', 'privacy'];
          const socialLinks = [...(creatorData.socialLinks || [])];
          
          // Add missing social link types
          requiredTypes.forEach(type => {
            if (!socialLinks.some(link => link.type === type)) {
              socialLinks.push({ 
                type: type as 'instagram' | 'twitter' | 'twitch' | 'onlyfans' | 'privacy', 
                url: '' 
              });
            }
          });
          
          setCreator({
            ...creatorData,
            socialLinks
          });
        } else {
          console.error('No creator data found');
          toast({
            title: "Erro ao carregar dados",
            description: "Não foi possível carregar os dados do seu perfil",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading creator data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar seu perfil. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user?.id) {
      loadCreator();
    }
  }, [user, toast]);

  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreator(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedSocialLinks = [...creator.socialLinks];
    
    if (field === 'url') {
      updatedSocialLinks[index] = { 
        ...updatedSocialLinks[index], 
        url: value 
      };
    } else if (field === 'type' && (
      value === 'instagram' || 
      value === 'twitter' || 
      value === 'twitch' || 
      value === 'onlyfans' || 
      value === 'privacy'
    )) {
      updatedSocialLinks[index] = { 
        ...updatedSocialLinks[index], 
        type: value as 'instagram' | 'twitter' | 'twitch' | 'onlyfans' | 'privacy'
      };
    }
    
    setCreator(prev => ({ ...prev, socialLinks: updatedSocialLinks }));
  };

  return {
    creator,
    setCreator,
    isLoading,
    handleCreatorChange,
    handleSocialLinkChange
  };
};
