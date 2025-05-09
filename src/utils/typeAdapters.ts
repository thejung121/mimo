
import { Creator, MimoPackage, SocialLink, MediaItem } from '@/types/creator';

// Convert Supabase creator data to our app Creator type
export const adaptCreator = (creatorData: any): Creator => {
  if (!creatorData) return null;
  
  return {
    id: creatorData.id || '',
    username: creatorData.username || '',
    name: creatorData.name || '',
    avatar: creatorData.avatar || '',
    cover: creatorData.cover || '',
    description: creatorData.description || '',
    coverTitle: creatorData.coverTitle || creatorData.cover_title || '',
    coverSubtitle: creatorData.coverSubtitle || creatorData.cover_subtitle || '',
    about: creatorData.about || '',
    socialLinks: adaptSocialLinks(creatorData.social_links || [])
  };
};

// Convert Supabase social links to app SocialLinks
const adaptSocialLinks = (dbSocialLinks: any[]): SocialLink[] => {
  return dbSocialLinks.map(link => ({
    type: link.type as 'instagram' | 'twitter' | 'youtube' | 'website' | 'privacy',
    url: link.url
  }));
};

// Convert Supabase package data to our app MimoPackage type
export const adaptMimoPackage = (packageData: any): MimoPackage => {
  if (!packageData) return null;
  
  return {
    id: packageData.id ? Number(packageData.id) : undefined,
    title: packageData.title || '',
    price: packageData.price || 0,
    features: adaptPackageFeatures(packageData.package_features || []),
    highlighted: packageData.highlighted || false,
    media: adaptPackageMedia(packageData.package_media || []),
    isHidden: packageData.is_hidden || false
  };
};

// Helper for adapting package features
const adaptPackageFeatures = (dbFeatures: any[]): string[] => {
  return dbFeatures.map(feature => feature.feature || '');
};

// Helper for adapting package media
const adaptPackageMedia = (dbMedia: any[]): MediaItem[] => {
  return dbMedia.map(media => ({
    id: typeof media.id === 'string' ? parseInt(media.id, 10) : media.id || 0,
    type: media.type as 'image' | 'video' | 'audio',
    url: media.url || '',
    caption: media.caption || '',
    isPreview: media.is_preview || false
  }));
};

// Function to get user metadata or handle if it doesn't exist
export const getUserMetadata = (user: any): any => {
  return user?.user_metadata || user?.metadata || {};
};
