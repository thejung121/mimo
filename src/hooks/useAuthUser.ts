
import { useState, useEffect } from 'react';
import { AuthUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { convertSupabaseUser } from '@/services/supabase/authService';

export const useAuthUser = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // First set up the auth state listener to react to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        // Update user state based on session
        if (currentSession?.user) {
          const authUser = convertSupabaseUser(currentSession.user);
          setUser(authUser);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Then check for existing session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          console.log('Initial session check:', data);
          setSession(data.session);
          
          if (data.session?.user) {
            const authUser = convertSupabaseUser(data.session.user);
            setUser(authUser);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setIsLoading(false);
      }
    };
    
    getInitialSession();
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return {
    user,
    setUser,
    isLoading,
  };
};
