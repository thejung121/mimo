
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
    console.log('=== INITIALIZING AUTH CONTEXT ===');
    
    // First set up the auth state listener to react to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('=== AUTH STATE CHANGE ===', event, session?.user?.id);
      
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
        
        console.log('=== SETTING USER STATE ===', authUser);
        setUser(authUser);
        localStorage.setItem('LOCAL_STORAGE_KEY', JSON.stringify(authUser));
      } else {
        console.log('=== CLEARING USER STATE ===');
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
        
        console.log('=== INITIAL SESSION CHECK ===', data.session?.user?.id);
        
        if (data?.session?.user) {
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
          
          console.log('=== SETTING INITIAL USER ===', authUser);
          setUser(authUser);
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
      console.log('=== LOGIN ATTEMPT ===', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('=== LOGIN ERROR ===', error.message);
        toast({
          title: "Falha na autenticação",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('=== LOGIN SUCCESS ===', data.user.id);
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a) de volta!`,
        });
        
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('=== LOGIN EXCEPTION ===', error);
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
      console.log('=== LOGOUT ATTEMPT ===');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('=== LOGOUT ERROR ===', error.message);
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('=== LOGOUT SUCCESS ===');
        setUser(null);
        localStorage.removeItem('LOCAL_STORAGE_KEY');
        toast({
          title: "Logout realizado com sucesso",
          description: "Você saiu da sua conta com sucesso.",
        });
      }
    } catch (error: any) {
      console.error('=== LOGOUT EXCEPTION ===', error);
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
    console.log('=== REGISTER ATTEMPT ===', { name, email, username });
    
    try {
      // Check if username exists first
      console.log('=== CHECKING USERNAME AVAILABILITY ===', username);
      const { data: existingUserWithUsername, error: usernameCheckError } = await supabase
        .from('creators')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      
      if (usernameCheckError) {
        console.error('=== USERNAME CHECK ERROR ===', usernameCheckError.message);
      }
      
      if (existingUserWithUsername) {
        console.error('=== USERNAME EXISTS ===', username);
        toast({
          title: "Nome de usuário indisponível",
          description: "Este nome de usuário já está sendo utilizado. Por favor, escolha outro.",
          variant: "destructive",
        });
        return false;
      }
      
      console.log('=== USERNAME AVAILABLE, PROCEEDING WITH SIGNUP ===');
      
      // Proceed with registration
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            username: username,
            document: document,
            avatar_url: '',
            phone: '',
          }
        }
      });

      console.log('=== SIGNUP RESPONSE ===', { 
        user: data.user?.id, 
        session: !!data.session,
        confirmed: data.user?.email_confirmed_at,
        error: error?.message 
      });

      if (error) {
        console.error('=== REGISTRATION ERROR ===', error.message);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('=== USER CREATED ===', data.user.id);
        
        // Check if user is immediately confirmed or has a session
        if (data.user.email_confirmed_at || data.session) {
          console.log('=== USER CONFIRMED - REGISTRATION SUCCESS ===');
          toast({
            title: "Conta criada com sucesso!",
            description: `Bem-vindo(a) ao Mimo, ${name}!`,
          });
          return true;
        } else {
          console.log('=== USER NEEDS CONFIRMATION ===');
          toast({
            title: "Verifique seu email",
            description: "Enviamos um link de confirmação para seu email.",
          });
          return false;
        }
      } else {
        console.error('=== NO USER RETURNED ===');
        toast({
          title: "Erro no cadastro",
          description: "Não foi possível criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('=== REGISTRATION EXCEPTION ===', error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro inesperado durante o cadastro",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
      console.log('=== REGISTRATION PROCESS FINISHED ===');
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
