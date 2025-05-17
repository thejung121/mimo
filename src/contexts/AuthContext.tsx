
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize auth state
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // First set up the auth state listener to react to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed, event:', event, 'session:', session);
      
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || '',
          username: session.user.user_metadata?.username || '',
          document: session.user.user_metadata?.document || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
          phone: session.user.user_metadata?.phone || '',
          avatar: session.user.user_metadata?.avatar || '',
        };
        
        console.log('Setting user state from session:', authUser);
        setUser(authUser);
        // Store in localStorage for other services to access
        localStorage.setItem('LOCAL_STORAGE_KEY', JSON.stringify(authUser));
      } else {
        console.log('No session, clearing user state');
        setUser(null);
        localStorage.removeItem('LOCAL_STORAGE_KEY');
      }
      
      setIsLoading(false);
    });

    // Then fetch the current session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('Initial auth check, session:', data.session);
        
        if (data && data.session && data.session.user) {
          const authUser: AuthUser = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || '',
            username: data.session.user.user_metadata?.username || '',
            document: data.session.user.user_metadata?.document || '',
            avatar_url: data.session.user.user_metadata?.avatar_url || '',
            phone: data.session.user.user_metadata?.phone || '',
            avatar: data.session.user.user_metadata?.avatar || '',
          };
          
          console.log('Setting initial user state:', authUser);
          setUser(authUser);
          // Store in localStorage for other services to access
          localStorage.setItem('LOCAL_STORAGE_KEY', JSON.stringify(authUser));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error in getSession:', error);
        setIsLoading(false);
      }
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
      console.log('Login attempt for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast({
          title: "Falha na autenticação",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('Login successful, user:', data.user);
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || '',
          username: data.user.user_metadata?.username || '',
          document: data.user.user_metadata?.document || '',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          phone: data.user.user_metadata?.phone || '',
          avatar: data.user.user_metadata?.avatar || '',
        };
        
        setUser(authUser);
        // Store in localStorage for other services to access
        localStorage.setItem('LOCAL_STORAGE_KEY', JSON.stringify(authUser));
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a) de volta, ${authUser.name || 'Usuário'}!`,
        });
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Erro de login",
        description: error.message || "Ocorreu um erro ao tentar fazer login",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setUser(null);
        // Remove from localStorage
        localStorage.removeItem('LOCAL_STORAGE_KEY');
        toast({
          title: "Logout realizado com sucesso",
          description: "Você saiu da sua conta com sucesso.",
        });
      }
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, username: string, document: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Registration attempt with:', { email, name, username, document });
      
      // Check if username exists first
      const { data: existingUserWithUsername, error: usernameCheckError } = await supabase
        .from('creators')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (usernameCheckError) {
        console.error('Error checking username:', usernameCheckError.message);
      }
      
      if (existingUserWithUsername) {
        console.error('Username already exists:', username);
        toast({
          title: "Nome de usuário indisponível",
          description: "Este nome de usuário já está sendo utilizado. Por favor, escolha outro.",
          variant: "destructive",
        });
        return false;
      }
      
      // If username is available, proceed with registration
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
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('Registration response:', data);
      
      if (data.user) {
        // Create a new user profile
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          username: username,
          document: document,
          avatar_url: '',
          phone: '',
          avatar: '',
        };
        
        setUser(authUser);
        // Store in localStorage for other services to access
        localStorage.setItem('LOCAL_STORAGE_KEY', JSON.stringify(authUser));
        
        toast({
          title: "Conta criada com sucesso!",
          description: `Bem-vindo(a) ao Mimo, ${name}!`,
        });
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro inesperado durante o cadastro",
        variant: "destructive",
      });
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
      console.log('Updating user profile with:', userData);
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        console.error('Profile update error:', error.message);
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      // Update local user state
      setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = {
          ...currentUser,
          ...userData
        };
        
        // Update localStorage too
        localStorage.setItem('LOCAL_STORAGE_KEY', JSON.stringify(updatedUser));
        
        return updatedUser;
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro inesperado ao atualizar o perfil",
        variant: "destructive",
      });
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
