
// Auth User Type Interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  document?: string; // Add document field for CPF/PIX
}

// Auth Context Props Interface
export interface AuthContextProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string, document?: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
