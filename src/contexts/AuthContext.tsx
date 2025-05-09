
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Creator } from '@/types/creator';
import { getCreatorData, saveCreatorData } from '@/services/creatorDataService';
import { getCurrentUser } from '@/services/supabase';

// Define auth user type
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username: string;
}

interface AuthContextProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'mimo:auth';
const USERS_STORAGE_KEY = 'mimo:users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
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
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user', error);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Find user with matching email
      const foundUser = users.find((u: any) => u.email === email);
      
      if (!foundUser || foundUser.password !== password) {
        toast({
          title: "Falha na autenticação",
          description: "Email ou senha incorretos",
          variant: "destructive",
        });
        return false;
      }
      
      // Create auth user without password
      const authUser: AuthUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        username: foundUser.username,
        avatar: foundUser.avatar
      };
      
      // Store in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
      
      setUser(authUser);
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) de volta, ${foundUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if users exist in localStorage
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        toast({
          title: "Erro ao criar conta",
          description: "Este email já está em uso",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if username already exists
      if (users.some((u: any) => u.username === username)) {
        toast({
          title: "Erro ao criar conta",
          description: "Este nome de usuário já está em uso",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, this would be hashed
        username,
        createdAt: new Date().toISOString()
      };
      
      // Add to users array and save
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Create auth user
      const authUser: AuthUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username
      };
      
      // Create default creator profile
      const creatorProfile: Creator = {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        coverTitle: `Página de ${newUser.name}`,
        coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
        cover: "/placeholder.svg",
        avatar: "/placeholder.svg",
        about: `Olá! Eu sou ${newUser.name} e esta é minha página de mimos. Aqui você pode me apoiar e receber conteúdo exclusivo.`,
        description: `Criador de conteúdo`,
        socialLinks: [
          { type: "instagram", url: `https://instagram.com/${newUser.username}` },
          { type: "twitter", url: `https://twitter.com/${newUser.username}` },
          { type: "website", url: "" }
        ]
      };
      
      // Save creator profile
      saveCreatorData(creatorProfile);
      
      // Store auth user
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(authUser));
      
      setUser(authUser);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo(a) ao Mimo!",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro ao criar conta",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
    navigate('/');
    
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
