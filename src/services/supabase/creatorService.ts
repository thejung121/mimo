
import { supabase } from '@/integrations/supabase/client';
import { Creator, MimoPackage, SocialLink } from '@/types/creator';
import { convertSupabaseUser } from './authService';

// Helper function to convert Json to SocialLink array
const convertJsonToSocialLinks = (jsonData: any): SocialLink[] => {
  if (!jsonData) return [];
  if (Array.isArray(jsonData)) {
    return jsonData.map(link => ({
      type: link.type as 'instagram' | 'twitter' | 'youtube' | 'website' | 'privacy',
      url: link.url || ''
    }));
  }
  return [];
};

// Helper function to prepare social links for database storage
const prepareSocialLinksForDb = (socialLinks: SocialLink[]): any[] => {
  return socialLinks.map(link => ({
    type: link.type,
    url: link.url
  }));
};

// Get creator by username
export const getCreatorByUsername = async (username: string): Promise<Creator | null> => {
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error getting creator by username:', error);
    return null;
  }
  
  // Convert to Creator type
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    avatar: data.profile_image || '/placeholder.svg',
    cover: data.cover_image || '/placeholder.svg',
    description: data.bio || '',
    coverTitle: data.thank_you_message || `Página de ${data.name}`,
    coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
    socialLinks: convertJsonToSocialLinks(data.social_links),
    about: data.bio || `Olá! Eu sou ${data.name} e esta é minha página de mimos.`
  };
};

// Get creator packages
export const getCreatorPackages = async (creatorId: string): Promise<MimoPackage[]> => {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('creator_id', creatorId)
    .eq('active', true);
  
  if (error) {
    console.error('Error getting creator packages:', error);
    return [];
  }
  
  // Convert to MimoPackage type
  return data.map(pkg => ({
    id: parseInt(pkg.id), // Convert UUID to number for compatibility
    title: pkg.title,
    price: pkg.price,
    features: pkg.description ? [pkg.description] : [],
    highlighted: false,
    media: [],
    isHidden: !pkg.active
  }));
};

// Update creator profile
export const updateCreatorProfile = async (creator: Creator): Promise<boolean> => {
  const { data, error } = await supabase
    .from('creators')
    .update({
      name: creator.name,
      username: creator.username,
      profile_image: creator.avatar,
      cover_image: creator.cover,
      bio: creator.about,
      thank_you_message: creator.coverTitle,
      social_links: prepareSocialLinksForDb(creator.socialLinks)
    })
    .eq('id', creator.id)
    .select();
  
  if (error) {
    console.error('Error updating creator profile:', error);
    return false;
  }
  
  return true;
};

// Get current user's creator profile
export const getCurrentCreator = async (): Promise<Creator | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) {
    console.error('Error getting current creator:', error);
    return null;
  }
  
  // Convert to Creator type
  return {
    id: data.id,
    name: data.name,
    username: data.username,
    avatar: data.profile_image || '/placeholder.svg',
    cover: data.cover_image || '/placeholder.svg',
    description: data.bio || '',
    coverTitle: data.thank_you_message || `Página de ${data.name}`,
    coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
    socialLinks: convertJsonToSocialLinks(data.social_links),
    about: data.bio || `Olá! Eu sou ${data.name} e esta é minha página de mimos.`
  };
};
