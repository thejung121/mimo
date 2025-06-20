
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';

// Function to get current authenticated user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
};

// Login function
export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Starting login attempt for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error from Supabase:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    console.log('Login successful:', data);
    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
    };
  }
};

// Register function
export const register = async (
  name: string, 
  email: string, 
  password: string, 
  username: string, 
  document?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("Registering user with data:", { name, email, username, document });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          document: document || '',
          avatar_url: '/placeholder.svg'
        }
      }
    });
    
    if (error) {
      console.error("Registration error from Supabase:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    if (data.user) {
      console.log("User created successfully:", data.user);
      return { success: true };
    } else {
      console.error("User creation failed - no user returned");
      return {
        success: false,
        error: 'Não foi possível criar sua conta. Por favor, tente novamente.'
      };
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
    };
  }
};

// Logout function
export const logout = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during logout:', error);
      return {
        success: false,
        error: "Ocorreu um erro ao sair. Por favor, tente novamente."
      };
    }
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Ocorreu um erro inesperado ao fazer logout.'
    };
  }
};

// Update user profile
export const updateUserProfile = async (userData: {
  name?: string;
  username?: string;
  document?: string;
  phone?: string;
  avatar_url?: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Updating user profile:', userData);
    
    const { error } = await supabase.auth.updateUser({
      data: userData
    });

    if (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Ocorreu um erro inesperado ao atualizar o perfil.'
    };
  }
};

// Convert Supabase user to our AuthUser type
export const convertSupabaseUser = (user: any): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.user_metadata?.name || 'User',
    email: user.email || '',
    username: user.user_metadata?.username || '',
    avatar: user.user_metadata?.avatar_url || '/placeholder.svg',
    document: user.user_metadata?.document || '',
    avatar_url: user.user_metadata?.avatar_url || '/placeholder.svg',
    phone: user.user_metadata?.phone || ''
  };
};
