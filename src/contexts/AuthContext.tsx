
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AuthContextProps } from '@/types/auth';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useAuthService, logout } from '@/services/supabase/authService';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthUser();
  const { login, register } = useAuthService();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    
    if (result.success) {
      navigate('/');
      
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
    } else {
      toast({
        title: "Erro ao fazer logout",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout: handleLogout
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
