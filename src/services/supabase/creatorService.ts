
import { supabase } from '@/integrations/supabase/client';
import { CreatorData, Creator } from '@/types/creator';

// Get creator data by username
export const getCreatorByUsername = async (username: string): Promise<CreatorData | null> => {
  try {
    console.log("Fetching creator data for username:", username);
    
    const { data, error } = await supabase
      .from('creators')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching creator:", error);
      return null;
    }
    
    if (!data) {
      console.log("No creator found for username:", username);
      return null;
    }
    
    // Transform to match CreatorData interface
    const creator: CreatorData = {
      id: data.id,
      name: data.name,
      avatar: data.avatar || '/placeholder.svg',
      cover: data.cover || '/placeholder.svg',
      description: data.description || '',
      cover_title: data.cover_title || null,
      cover_subtitle: data.cover_subtitle || null,
      about: data.about || null,
      pix_key: data.pix_key || null,
      username: data.username || ''
    };
    
    console.log("Creator data retrieved:", creator);
    return creator;
  } catch (error) {
    console.error("Exception in getCreatorByUsername:", error);
    return null;
  }
};

// Get current user's creator profile
export const getCurrentCreator = async (): Promise<Creator | null> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log("No authenticated user found");
      return null;
    }

    const { data, error } = await supabase
      .from('creators')
      .select('*, social_links(*)')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching current creator:", error);
      return null;
    }
    
    if (!data) {
      console.log("No creator profile found for current user");
      return null;
    }
    
    // Transform to match Creator interface
    const creator: Creator = {
      id: data.id,
      name: data.name,
      username: data.username,
      avatar: data.avatar || '/placeholder.svg',
      cover: data.cover || '/placeholder.svg',
      description: data.description || '',
      coverTitle: data.cover_title || '',
      coverSubtitle: data.cover_subtitle || '',
      about: data.about || '',
      socialLinks: data.social_links ? data.social_links.map((link: any) => ({
        type: link.type,
        url: link.url
      })) : []
    };
    
    console.log("Current creator data retrieved:", creator);
    return creator;
  } catch (error) {
    console.error("Exception in getCurrentCreator:", error);
    return null;
  }
};

// Get creator packages by creator ID
export const getCreatorPackages = async (creatorId: string) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*, package_features(feature), package_media(id, url, type, caption, is_preview)')
      .eq('creator_id', creatorId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching creator packages:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getCreatorPackages:", error);
    return [];
  }
};

// Create or update creator profile
export const createCreatorProfile = async (creatorData: Partial<CreatorData>): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('creators')
      .upsert(creatorData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating/updating creator:", error);
      return false;
    }
    
    console.log("Creator profile created/updated:", data);
    return true;
  } catch (error) {
    console.error("Exception in createCreatorProfile:", error);
    return false;
  }
};

// Update creator profile - fix signature to match expected usage
export const updateCreatorProfile = async (creator: Creator | Partial<CreatorData>): Promise<boolean> => {
  try {
    // Handle both Creator and CreatorData interfaces
    const updates = 'id' in creator && creator.id ? {
      id: creator.id,
      name: creator.name,
      username: 'username' in creator ? creator.username : '',
      avatar: creator.avatar || '/placeholder.svg',
      cover: creator.cover || '/placeholder.svg',
      description: creator.description || '',
      cover_title: 'coverTitle' in creator ? creator.coverTitle : creator.cover_title,
      cover_subtitle: 'coverSubtitle' in creator ? creator.coverSubtitle : creator.cover_subtitle,
      about: creator.about,
      pix_key: 'pix_key' in creator ? creator.pix_key : null
    } : creator;

    const { error } = await supabase
      .from('creators')
      .upsert(updates)
      .eq('id', creator.id || '');
    
    if (error) {
      console.error("Error updating creator profile:", error);
      return false;
    }
    
    console.log("Creator profile updated successfully");
    return true;
  } catch (error) {
    console.error("Exception in updateCreatorProfile:", error);
    return false;
  }
};
