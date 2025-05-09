
// Define auth user type
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  username: string;
}

export interface AuthContextProps {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
}
