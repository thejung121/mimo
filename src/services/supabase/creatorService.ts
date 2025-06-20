
import { supabase } from '@/integrations/supabase/client';
import { CreatorData } from '@/types/creator';

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

// Update creator profile
export const updateCreatorProfile = async (id: string, updates: Partial<CreatorData>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('creators')
      .update(updates)
      .eq('id', id);
    
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
