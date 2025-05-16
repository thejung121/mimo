import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { UserData } from '@/types/auth';

export interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, username: string, document: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    const session = supabase.auth.getSession()
    
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.name || '',
          username: session.user.user_metadata.username || '',
          document: session.user.user_metadata.document || '',
          avatar_url: session.user.user_metadata.avatar_url || '',
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    })

    if (session) {
      if (session?.session?.user) {
        setUser({
          id: session.session.user.id,
          email: session.session.user.email || '',
          name: session.session.user.user_metadata.name || '',
          username: session.session.user.user_metadata.username || '',
          document: session.session.user.user_metadata.document || '',
          avatar_url: session.session.user.user_metadata.avatar_url || '',
        });
      }
    }
    setIsLoading(false);
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

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
