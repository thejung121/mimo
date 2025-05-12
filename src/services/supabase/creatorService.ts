
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
    avatar: data.avatar || data.profile_image || '/placeholder.svg',
    cover: data.cover || data.cover_image || '/placeholder.svg',
    description: data.description || data.bio || '',
    coverTitle: data.thank_you_message || `Página de ${data.name}`,
    coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
    socialLinks: convertJsonToSocialLinks(data.social_links),
    about: data.about || data.bio || `Olá! Eu sou ${data.name} e esta é minha página de mimos.`
  };
};

// Get creator packages
export const getCreatorPackages = async (creatorId: string): Promise<MimoPackage[]> => {
  // First get the packages
  const { data: packagesData, error: packagesError } = await supabase
    .from('packages')
    .select('*')
    .eq('creator_id', creatorId);
  
  if (packagesError) {
    console.error('Error getting creator packages:', packagesError);
    return [];
  }

  // Get features for each package
  const packages: MimoPackage[] = [];
  
  for (const pkg of packagesData) {
    // Get features for this package
    const { data: featuresData, error: featuresError } = await supabase
      .from('package_features')
      .select('feature')
      .eq('package_id', pkg.id);
      
    if (featuresError) {
      console.error(`Error getting features for package ${pkg.id}:`, featuresError);
    }
    
    // Get media for this package
    const { data: mediaData, error: mediaError } = await supabase
      .from('package_media')
      .select('*')
      .eq('package_id', pkg.id);
      
    if (mediaError) {
      console.error(`Error getting media for package ${pkg.id}:`, mediaError);
    }
    
    // Build the package object
    packages.push({
      id: parseInt(pkg.id.slice(0, 8), 16) || packages.length + 1, // Convert UUID to number or use array index
      title: pkg.title,
      price: pkg.price,
      features: (featuresData || []).map(f => f.feature),
      highlighted: pkg.highlighted || false,
      media: (mediaData || []).map(m => ({
        id: parseInt(m.id.slice(0, 8), 16) || 0,
        type: m.type as 'image' | 'video' | 'audio',
        url: m.url,
        caption: m.caption || '',
        isPreview: m.is_preview || false
      })),
      isHidden: pkg.is_hidden || false
    });
  }
  
  return packages;
};

// Save package to Supabase
export const savePackageToSupabase = async (pkg: MimoPackage, userId: string): Promise<string | null> => {
  try {
    // First, check if package exists (for update)
    let packageId: string | null = null;
    
    // Insert or update the package
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert({
        creator_id: userId,
        title: pkg.title,
        price: pkg.price,
        highlighted: pkg.highlighted,
        is_hidden: pkg.isHidden || false
      })
      .select()
      .single();
      
    if (packageError) {
      console.error('Error saving package:', packageError);
      return null;
    }
    
    packageId = packageData.id;
    
    // Add features
    if (pkg.features && pkg.features.length > 0) {
      const featuresForDb = pkg.features.map(feature => ({
        package_id: packageId,
        feature
      }));
      
      const { error: featuresError } = await supabase
        .from('package_features')
        .insert(featuresForDb);
        
      if (featuresError) {
        console.error('Error saving package features:', featuresError);
      }
    }
    
    // Add media
    if (pkg.media && pkg.media.length > 0) {
      const mediaForDb = pkg.media.map(media => ({
        package_id: packageId,
        type: media.type,
        url: media.url,
        caption: media.caption || null,
        is_preview: media.isPreview
      }));
      
      const { error: mediaError } = await supabase
        .from('package_media')
        .insert(mediaForDb);
        
      if (mediaError) {
        console.error('Error saving package media:', mediaError);
      }
    }
    
    return packageId;
  } catch (error) {
    console.error('Exception in savePackageToSupabase:', error);
    return null;
  }
};

// Update package in Supabase
export const updatePackageInSupabase = async (pkg: MimoPackage, packageId: string): Promise<boolean> => {
  try {
    // Update the package main record
    const { error: packageError } = await supabase
      .from('packages')
      .update({
        title: pkg.title,
        price: pkg.price,
        highlighted: pkg.highlighted,
        is_hidden: pkg.isHidden || false
      })
      .eq('id', packageId);
      
    if (packageError) {
      console.error('Error updating package:', packageError);
      return false;
    }
    
    // Delete existing features and add new ones
    const { error: deleteFeatureError } = await supabase
      .from('package_features')
      .delete()
      .eq('package_id', packageId);
      
    if (deleteFeatureError) {
      console.error('Error deleting package features:', deleteFeatureError);
    }
    
    // Add features
    if (pkg.features && pkg.features.length > 0) {
      const featuresForDb = pkg.features.map(feature => ({
        package_id: packageId,
        feature
      }));
      
      const { error: featuresError } = await supabase
        .from('package_features')
        .insert(featuresForDb);
        
      if (featuresError) {
        console.error('Error saving updated package features:', featuresError);
      }
    }
    
    // Handle media updates if needed
    // (This could be more complex depending on your requirements)
    
    return true;
  } catch (error) {
    console.error('Exception in updatePackageInSupabase:', error);
    return false;
  }
};

// Delete package in Supabase
export const deletePackageFromSupabase = async (packageId: string): Promise<boolean> => {
  try {
    // Delete the package (cascades to features and media through foreign key)
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', packageId);
      
    if (error) {
      console.error('Error deleting package:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception in deletePackageFromSupabase:', error);
    return false;
  }
};

// Update creator profile
export const updateCreatorProfile = async (creator: Creator): Promise<boolean> => {
  try {
    console.log('Updating creator profile with data:', creator);
    
    const { data, error } = await supabase
      .from('creators')
      .update({
        name: creator.name,
        username: creator.username,
        avatar: creator.avatar,
        profile_image: creator.avatar, // For backward compatibility
        cover: creator.cover,
        cover_image: creator.cover, // For backward compatibility
        bio: creator.description || creator.about,
        about: creator.about || creator.description,
        description: creator.description || creator.about,
        thank_you_message: creator.coverTitle,
        social_links: prepareSocialLinksForDb(creator.socialLinks)
      })
      .eq('id', creator.id)
      .select();
    
    if (error) {
      console.error('Error updating creator profile:', error);
      return false;
    }
    
    console.log('Creator profile updated successfully:', data);
    return true;
  } catch (error) {
    console.error('Exception in updateCreatorProfile:', error);
    return false;
  }
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
    avatar: data.avatar || data.profile_image || '/placeholder.svg',
    cover: data.cover || data.cover_image || '/placeholder.svg',
    description: data.description || data.bio || '',
    coverTitle: data.thank_you_message || `Página de ${data.name}`,
    coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
    socialLinks: convertJsonToSocialLinks(data.social_links),
    about: data.about || data.bio || `Olá! Eu sou ${data.name} e esta é minha página de mimos.`
  };
};
