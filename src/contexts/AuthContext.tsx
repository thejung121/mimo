
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

  const updateUserProfile = async (userData: { name?: string; document?: string }) => {
    try {
      // Update user metadata in Supabase
      const { error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) {
        toast({
          title: "Erro ao atualizar perfil",
          description: error.message || "Ocorreu um erro ao atualizar seu perfil.",
          variant: "destructive"
        });
        return false;
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
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
        register,
        logout: handleLogout,
        updateUserProfile
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
