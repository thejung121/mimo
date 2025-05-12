
import React from 'react';
import { Loader2 } from 'lucide-react';
import CreatorNavBar from '@/components/CreatorNavBar';
import CreatorFooter from '@/components/CreatorFooter';

const LoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CreatorNavBar />
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-mimo-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Carregando perfil do criador...</p>
        </div>
      </div>
      <CreatorFooter />
    </div>
  );
};

export default LoadingState;
