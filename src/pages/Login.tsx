import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, LogIn } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe seu email",
        variant: "destructive"
      });
      return;
    }
    
    if (!password) {
      toast({
        title: "Senha obrigatória",
        description: "Por favor, informe sua senha",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate(from, { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Recuperação de senha",
      description: "Um email com instruções será enviado para você.",
      variant: "default"
    });
    
    // Call Supabase password reset here
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    }).then(({ error }) => {
      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-mimo-primary" fill="#9b87f5" />
            </div>
            <h1 className="text-3xl font-bold">Entre na sua conta</h1>
            <p className="text-foreground/70 mt-2">
              Acesse sua página de criador e gerencie seus mimos
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Entre com seus dados cadastrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Sua senha" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <a 
                      href="#" 
                      onClick={handleForgotPassword}
                      className="text-xs text-right text-mimo-primary hover:underline"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full mimo-button" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  "Entrando..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                  </>
                )}
              </Button>
            </CardFooter>
            <div className="px-6 pb-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta? <Link to="/cadastro" className="text-mimo-primary hover:underline">Cadastre-se</Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
