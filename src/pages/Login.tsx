
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Heart, LogIn } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Login = () => {
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
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="Sua senha" />
                    <Link to="/esqueci-senha" className="text-xs text-right text-mimo-primary hover:underline">
                      Esqueceu sua senha?
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full mimo-button">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
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
