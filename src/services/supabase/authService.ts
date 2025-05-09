
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';
import { useToast } from '@/components/ui/use-toast';

// Function to get current authenticated user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
};

// Hook for authentication operations
export const useAuthService = () => {
  const { toast } = useToast();
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Falha na autenticação",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, username: string): Promise<boolean> => {
    try {
      // Use regular signUp method with data parameter to store user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username
          },
          // Skip email confirmation by not requiring emailRedirectTo
          emailRedirectTo: undefined
        }
      });
      
      if (error) {
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      // Check if the user was created successfully
      if (data.user) {
        // In Supabase, by default this will create a session immediately without email verification
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo(a) ao Mimo!",
        });
        
        return true;
      } else {
        toast({
          title: "Erro ao criar conta",
          description: "Não foi possível criar sua conta. Por favor, tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    login,
    register
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error during logout:', error);
    return {
      success: false,
      message: "Ocorreu um erro ao sair. Por favor, tente novamente.",
    };
  }
  
  return {
    success: true,
    message: "Logout realizado com sucesso.",
  };
};

// Convert Supabase user to our AuthUser type
export const convertSupabaseUser = (user: any): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.user_metadata?.name || 'User',
    email: user.email || '',
    username: user.user_metadata?.username || '',
    avatar: user.user_metadata?.avatar || ''
  };
};
