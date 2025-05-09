
import { AuthUser } from '@/types/auth';
import { Creator } from '@/types/creator';
import { LOCAL_STORAGE_KEY, USERS_STORAGE_KEY, getItemFromStorage, setItemToStorage, removeItemFromStorage } from '@/utils/storage';
import { saveCreatorData } from '@/services/creatorDataService';
import { useToast } from '@/components/ui/use-toast';

export const useAuthService = () => {
  const { toast } = useToast();
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from localStorage
      const storedUsers = getItemFromStorage<any[]>(USERS_STORAGE_KEY) || [];
      
      // Find user with matching email
      const foundUser = storedUsers.find((u: any) => u.email === email);
      
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
      setItemToStorage(LOCAL_STORAGE_KEY, authUser);
      
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
    }
  };

  const register = async (name: string, email: string, password: string, username: string): Promise<boolean> => {
    try {
      // Check if users exist in localStorage
      const storedUsers = getItemFromStorage<any[]>(USERS_STORAGE_KEY) || [];
      
      // Check if email already exists
      if (storedUsers.some((u: any) => u.email === email)) {
        toast({
          title: "Erro ao criar conta",
          description: "Este email já está em uso",
          variant: "destructive",
        });
        return false;
      }
      
      // Check if username already exists
      if (storedUsers.some((u: any) => u.username === username)) {
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
      storedUsers.push(newUser);
      setItemToStorage(USERS_STORAGE_KEY, storedUsers);
      
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
      setItemToStorage(LOCAL_STORAGE_KEY, authUser);
      
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
    }
  };

  return {
    login,
    register
  };
};

export const logout = () => {
  removeItemFromStorage(LOCAL_STORAGE_KEY);
  
  return {
    success: true,
    message: "Logout realizado com sucesso.",
  };
};
