
import { supabase, useDemo } from './supabaseClient';

export const getCreatorByUsername = async (username: string) => {
  if (useDemo) return null;
  
  const { data, error } = await supabase
    .from('creators')
    .select('*, social_links(*)')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error('Error getting creator:', error);
    return null;
  }
  
  return data;
};

export const getCreatorPackages = async (creatorId: string) => {
  if (useDemo) {
    // Use local storage data in demo mode
    return [];
  }
  
  const { data, error } = await supabase
    .from('mimo_packages')
    .select('*, package_features(*), package_media(*)')
    .eq('creator_id', creatorId)
    .eq('is_hidden', false);
  
  if (error) {
    console.error('Error getting creator packages:', error);
    return [];
  }
  
  return data;
};
