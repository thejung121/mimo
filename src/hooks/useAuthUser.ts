
import { useState, useEffect } from 'react';
import { AuthUser } from '@/types/auth';
import { LOCAL_STORAGE_KEY, getItemFromStorage } from '@/utils/storage';
import { getCurrentUser } from '@/services/supabase';

export const useAuthUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      
      // First try to get user from Supabase
      const supabaseUser = await getCurrentUser();
      
      if (supabaseUser) {
        // If we have a Supabase user, use that
        const authUser: AuthUser = {
          id: supabaseUser.id,
          name: supabaseUser.user_metadata?.name || 'User',
          email: supabaseUser.email || '',
          username: supabaseUser.user_metadata?.username || '',
          avatar: supabaseUser.user_metadata?.avatar || ''
        };
        setUser(authUser);
        setIsLoading(false);
        return;
      }
      
      // Fallback to localStorage
      const storedUser = getItemFromStorage<AuthUser>(LOCAL_STORAGE_KEY);
      if (storedUser) {
        setUser(storedUser);
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);
  
  return {
    user,
    setUser,
    isLoading,
  };
};
