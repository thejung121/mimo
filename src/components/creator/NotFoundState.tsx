
import React from 'react';
import { Button } from '@/components/ui/button';
import CreatorNavBar from '@/components/CreatorNavBar';
import CreatorFooter from '@/components/CreatorFooter';

const NotFoundState = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CreatorNavBar />
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center text-center px-4">
          <h2 className="text-2xl font-bold mb-2">Criador não encontrado</h2>
          <p className="text-muted-foreground mb-6">O criador que você está procurando não existe ou não está disponível.</p>
          <Button onClick={() => window.history.back()}>
            Voltar
          </Button>
        </div>
      </div>
      <CreatorFooter />
    </div>
  );
};

export default NotFoundState;
