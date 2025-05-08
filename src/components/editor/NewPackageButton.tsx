
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewPackageButtonProps {
  onClick: () => void;
  isFirstPackage?: boolean;
}

const NewPackageButton = ({ onClick, isFirstPackage = false }: NewPackageButtonProps) => {
  if (isFirstPackage) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-2">Crie seu primeiro pacote de mimo</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina os pacotes que seus fãs podem adquirir para te apoiar
          </p>
        </div>
        <Button
          onClick={onClick}
          className="flex items-center gap-2 bg-gradient-to-r from-mimo-primary to-mimo-secondary"
        >
          <Plus className="h-4 w-4" />
          Criar Primeiro Pacote
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Button
        onClick={onClick}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Adicionar Novo Pacote
      </Button>
    </div>
  );
};

export default NewPackageButton;
