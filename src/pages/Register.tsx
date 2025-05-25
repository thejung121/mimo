
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Register = () => {
  const [startRegistration, setStartRegistration] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [document, setDocument] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== REGISTER PAGE AUTH CHECK ===', { isAuthenticated, userId: user?.id });
    if (isAuthenticated && user) {
      console.log('=== REDIRECTING TO DASHBOARD ===');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleStartRegistration = () => {
    setStartRegistration(true);
    setTimeout(() => setShowForm(true), 500);
  };
  
  const formatDocument = (value: string) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1-');
    } else {
      return digits
        .replace(/(\d{2})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1/')
        .replace(/(\d{4})(?=\d)/, '$1-');
    }
  };

  const validateForm = () => {
    console.log('=== VALIDATING FORM ===', { name, email, username, document });
    
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo",
        variant: "destructive"
      });
      return false;
    }
    
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, informe um email válido",
        variant: "destructive"
      });
      return false;
    }
    
    if (!username.trim()) {
      toast({
        title: "Nome de usuário obrigatório",
        description: "Por favor, escolha um nome de usuário",
        variant: "destructive"
      });
      return false;
    }
    
    if (!document.trim()) {
      toast({
        title: "CPF/CNPJ obrigatório",
        description: "Por favor, informe seu CPF ou CNPJ para recebimento via PIX",
        variant: "destructive"
      });
      return false;
    }
    
    if (!password || password.length < 6) {
      toast({
        title: "Senha obrigatória",
        description: "Por favor, escolha uma senha com pelo menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A senha e a confirmação de senha devem ser iguais",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION ===', { name, email, username });
    
    if (!validateForm()) {
      console.log('=== VALIDATION FAILED ===');
      return;
    }
    
    if (isLoading) {
      console.log('=== ALREADY LOADING ===');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('=== CALLING REGISTER FUNCTION ===');
      const success = await register(name, email, password, username, document);
      
      console.log('=== REGISTER RESULT ===', success);
      
      if (success) {
        console.log('=== REGISTRATION SUCCESSFUL - REDIRECTING ===');
        // Force immediate redirect on success
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } else {
        console.log('=== REGISTRATION FAILED ===');
      }
    } catch (error: any) {
      console.error("=== REGISTRATION EXCEPTION ===", error);
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-accent/20">
      <NavBar />
      
      <main className="flex-grow py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          {!startRegistration ? (
            <div className="text-center mb-8 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-mimo-primary animate-pulse" fill="#9b87f5" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Crie sua página no Mimo</h1>
              <p className="text-foreground/70 text-lg mb-8">
                Comece a receber mimos e fortaleça sua conexão com os fãs
              </p>
              
              <div className="space-y-4 mb-10">
                <div className="p-4 bg-card border border-border/50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-mimo-primary">Receba mimos dos seus fãs</h3>
                  <p className="text-foreground/70">
                    Crie pacotes personalizados com conteúdo exclusivo e deixe seus fãs escolherem como apoiar você.
                  </p>
                </div>
                
                <div className="p-4 bg-card border border-border/50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-mimo-primary">Controle total</h3>
                  <p className="text-foreground/70">
                    Você decide o que oferecer, por quanto tempo e define seus preços com total liberdade.
                  </p>
                </div>
                
                <div className="p-4 bg-card border border-border/50 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2 text-mimo-primary">Pagamentos rápidos</h3>
                  <p className="text-foreground/70">
                    Receba por PIX com pagamentos processados em minutos diretamente em sua conta.
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleStartRegistration}
                className="w-full mimo-button py-6 text-lg group"
              >
                Começar agora <Heart className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
              
              <p className="mt-6 text-sm text-muted-foreground">
                Já tem uma conta? <Link to="/login" className="text-mimo-primary hover:underline">Entre aqui</Link>
              </p>
            </div>
          ) : showForm ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-mimo-primary" fill="#9b87f5" />
                </div>
                <h1 className="text-3xl font-bold">Criar sua conta</h1>
                <p className="text-foreground/70 mt-2">
                  Preencha os dados abaixo para criar sua página
                </p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro</CardTitle>
                  <CardDescription>
                    Informe seus dados para criar sua página
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="Seu nome completo" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="username">Nome de usuário</Label>
                        <Input 
                          id="username" 
                          type="text" 
                          placeholder="seunome" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                          disabled={isLoading}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Este será o endereço da sua página: mimo.com/criador/{username || 'seunome'}
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="document">CPF/CNPJ (para recebimento PIX)</Label>
                        <Input 
                          id="document" 
                          type="text" 
                          placeholder="000.000.000-00" 
                          value={document}
                          onChange={(e) => setDocument(formatDocument(e.target.value))}
                          disabled={isLoading}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          O CPF/CNPJ será registrado como sua chave PIX para recebimentos
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="password">Senha</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          placeholder="Escolha uma senha" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          required
                          minLength={6}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirme a senha</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          placeholder="Confirme sua senha" 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full mimo-button" 
                      disabled={isLoading}
                      type="submit"
                    >
                      {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando conta...</>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>
                  </CardFooter>
                </form>
                <div className="px-6 pb-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Já tem uma conta? <Link to="/login" className="text-mimo-primary hover:underline">Entre aqui</Link>
                  </p>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
