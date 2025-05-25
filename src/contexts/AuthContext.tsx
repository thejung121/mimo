
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
  
  useEffect(() => {
    console.log('=== AUTH PROVIDER INIT ===');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('=== AUTH STATE CHANGE ===', event, session?.user?.email);
      
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
        
        console.log('=== USER SET ===', authUser);
        setUser(authUser);
      } else {
        console.log('=== USER CLEARED ===');
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('=== INITIAL SESSION CHECK ===', session?.user?.email);
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('=== LOGIN START ===', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('=== LOGIN ERROR ===', error);
        toast({
          title: "Falha na autenticação",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      console.log('=== LOGIN SUCCESS ===', data.user?.email);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta!`,
      });
      
      return true;
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

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('=== LOGOUT START ===');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('=== LOGOUT ERROR ===', error);
        toast({
          title: "Erro ao sair",
          description: error.message,
          variant: "destructive",
        });
      } else {
        console.log('=== LOGOUT SUCCESS ===');
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

  const register = async (name: string, email: string, password: string, username: string, document: string): Promise<boolean> => {
    console.log('=== REGISTER START ===', { name, email, username, document });
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
            document,
            avatar_url: '',
            phone: '',
          }
        }
      });

      console.log('=== REGISTER RESPONSE ===', { 
        user: data.user?.email, 
        session: !!data.session,
        error: error?.message 
      });

      if (error) {
        console.error('=== REGISTER ERROR ===', error);
        toast({
          title: "Erro no cadastro",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('=== REGISTER SUCCESS ===', data.user.email);
        toast({
          title: "Conta criada com sucesso!",
          description: `Bem-vindo(a) ao Mimo, ${name}!`,
        });
        return true;
      }

      console.error('=== NO USER RETURNED ===');
      return false;
    } catch (error: any) {
      console.error('=== REGISTER EXCEPTION ===', error);
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

  const updateUserProfile = async (userData: { 
    name?: string; 
    document?: string; 
    username?: string;
    phone?: string;
  }): Promise<boolean> => {
    try {
      console.log('=== UPDATE PROFILE ===', userData);
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        console.error('=== UPDATE ERROR ===', error);
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      setUser(currentUser => {
        if (!currentUser) return null;
        return { ...currentUser, ...userData };
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });

      return true;
    } catch (error: any) {
      console.error('=== UPDATE EXCEPTION ===', error);
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
