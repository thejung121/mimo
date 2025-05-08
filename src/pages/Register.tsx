
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import SellerOnboarding from '@/components/SellerOnboarding';

const Register = () => {
  const [startRegistration, setStartRegistration] = useState(false);

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
                onClick={() => setStartRegistration(true)} 
                className="w-full mimo-button py-6 text-lg group"
              >
                Começar agora <Heart className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
              
              <p className="mt-6 text-sm text-muted-foreground">
                Já tem uma conta? <Link to="/login" className="text-mimo-primary hover:underline">Entre aqui</Link>
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <SellerOnboarding />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
