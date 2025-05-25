
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthRedirect = (redirectTo: string = '/dashboard') => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  useEffect(() => {
    console.log('=== AUTH REDIRECT HOOK ===', { 
      isAuthenticated, 
      userId: user?.id, 
      isLoading,
      redirectTo 
    });
    
    if (!isLoading && isAuthenticated && user) {
      console.log('=== REDIRECTING TO ===', redirectTo);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate, redirectTo]);
  
  return { isAuthenticated, user, isLoading };
};
