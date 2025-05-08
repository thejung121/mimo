
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface NewPackageButtonProps {
  onClick: () => void;
}

const NewPackageButton = ({ onClick }: NewPackageButtonProps) => {
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
