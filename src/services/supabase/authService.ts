
import { supabase, useDemo } from './supabaseClient';

export const getCurrentUser = async () => {
  if (useDemo) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
};
