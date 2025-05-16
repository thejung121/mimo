import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

// Add phone to user interface
interface UserData {
  id: string;
  name?: string;
  email?: string;
  username?: string;
  document?: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: UserData | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData?: { name?: string; username?: string }) => Promise<{ error: Error | null, data: any | null }>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserProfile?: (userData: { name?: string; username?: string; document?: string; phone?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  logout: async () => { },
  loading: false,
  updateUserProfile: async () => true,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserFromLocalStorage = () => {
      const storedAuth = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAuth) {
        try {
          const authData = JSON.parse(storedAuth);
          setUser(authData);
        } catch (error) {
          console.error('Failed to parse auth data from localStorage', error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
      setLoading(false);
    };

    loadUserFromLocalStorage();

    // Listen for auth state changes from Supabase
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const supabaseUser = session?.user;
        if (supabaseUser) {
          const convertedUser = convertSupabaseUser(supabaseUser);
          setUser(convertedUser);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(convertedUser));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    });
  }, []);

  const convertSupabaseUser = (user: any): UserData | null => {
    if (!user) return null;
    
    return {
      id: user.id,
      name: user.user_metadata?.name || null,
      email: user.email,
      username: user.user_metadata?.username || null,
      document: user.user_metadata?.document || null,
      avatar: user.user_metadata?.avatar || null,
      phone: user.user_metadata?.phone || null,
    };
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign-in error:', error);
        return { error };
      }

      const convertedUser = convertSupabaseUser(data.user);
      setUser(convertedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(convertedUser));
      return { error: null };
    } catch (error: any) {
      console.error('Unexpected sign-in error:', error);
      return { error: new Error(error.message || 'An unexpected error occurred') };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: { name?: string; username?: string }): Promise<{ error: Error | null, data: any | null }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
          },
        },
      });

      if (error) {
        console.error('Sign-up error:', error);
        return { error, data: null };
      }
      
      const convertedUser = convertSupabaseUser(data.user);
      setUser(convertedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(convertedUser));
      return { error: null, data };
    } catch (error: any) {
      console.error('Unexpected sign-up error:', error);
      return { error: new Error(error.message || 'An unexpected error occurred'), data: null };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update the updateUserProfile function to include phone
  const updateUserProfile = async (userData: { name?: string; username?: string; document?: string; phone?: string }): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          username: userData.username,
          document: userData.document,
          phone: userData.phone,
        }
      });

      if (error) {
        console.error('Error updating user profile:', error);
        return false;
      }

      // Update local user state with new information
      if (user) {
        setUser({
          ...user,
          name: userData.name !== undefined ? userData.name : user.name,
          username: userData.username !== undefined ? userData.username : user.username,
          document: userData.document !== undefined ? userData.document : user.document,
          phone: userData.phone !== undefined ? userData.phone : user.phone,
        });
      }

      // Update auth state in local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        ...JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}'),
        name: userData.name,
        username: userData.username,
        document: userData.document,
        phone: userData.phone,
      }));

      return true;
    } catch (error) {
      console.error('Exception in updateUserProfile:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logout, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
