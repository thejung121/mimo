
// Auth User Type Interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  document?: string; // Add document field for CPF/PIX
  role?: string; // Add role field for admin check
  phone?: string; // Add phone field
  avatar_url?: string; // Add avatar_url field
}

// Also export UserData as an alias to maintain compatibility
export type UserData = AuthUser;

// Auth Context Props Interface
export interface AuthContextProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string, document?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile?: (userData: { name?: string; document?: string; username?: string; phone?: string }) => Promise<boolean>;
}

export type AuthContextType = AuthContextProps;
