
// Auth User Type Interface
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  document?: string; // Add document field for CPF/PIX
}
