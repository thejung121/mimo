
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { AuthUser, UserData } from '@/types/auth';

export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, username: string, document: string) => Promise<boolean>;
  updateUserProfile?: (userData: { name?: string; document?: string; username?: string; phone?: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  updateUserProfile: async () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener to react to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.name || '',
          username: session.user.user_metadata.username || '',
          document: session.user.user_metadata.document || '',
          avatar_url: session.user.user_metadata.avatar_url || '',
          phone: session.user.user_metadata.phone || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Then fetch the current session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        setIsLoading(false);
        return;
      }
      
      if (data && data.session && data.session.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.user_metadata.name || '',
          username: data.session.user.user_metadata.username || '',
          document: data.session.user.user_metadata.document || '',
          avatar_url: data.session.user.user_metadata.avatar_url || '',
          phone: data.session.user.user_metadata.phone || '',
        });
      }
      setIsLoading(false);
    };
    
    getSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          username: data.user.user_metadata.username || '',
          document: data.user.user_metadata.document || '',
          avatar_url: data.user.user_metadata.avatar_url || '',
          phone: data.user.user_metadata.phone || '',
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, username: string, document: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            username: username,
            document: document,
            avatar_url: '',
          }
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          username: data.user.user_metadata.username || '',
          document: data.user.user_metadata.document || '',
          avatar_url: data.user.user_metadata.avatar_url || '',
          phone: data.user.user_metadata.phone || '',
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add updateUserProfile function
  const updateUserProfile = async (userData: { 
    name?: string; 
    document?: string; 
    username?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        console.error('Profile update error:', error.message);
        return false;
      }

      // Update local user state
      setUser(currentUser => {
        if (!currentUser) return null;
        return {
          ...currentUser,
          ...userData
        };
      });

      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login,
        logout,
        register,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
