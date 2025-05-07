
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-mimo-primary" fill="#9b87f5" />
            </div>
            <h1 className="text-3xl font-bold">Crie sua página no Mimo</h1>
            <p className="text-foreground/70 mt-2">
              Comece a receber mimos e fortaleça sua conexão com os fãs
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Cadastre-se</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para criar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input id="name" placeholder="Seu nome completo" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input id="username" placeholder="Seu nome de usuário" />
                    <p className="text-xs text-muted-foreground">
                      Este será o endereço da sua página: mimo.app/criador/seunome
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="Crie uma senha segura" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full mimo-button">Criar minha página</Button>
            </CardFooter>
            <div className="px-6 pb-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta? <Link to="/login" className="text-mimo-primary hover:underline">Entre aqui</Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
