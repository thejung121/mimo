
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface DialogFooterActionsProps {
  onLogout: () => void;
  onSave: () => void;
  isUpdating: boolean;
}

const DialogFooterActions: React.FC<DialogFooterActionsProps> = ({
  onLogout,
  onSave,
  isUpdating
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-2">
      <Button 
        variant="outline" 
        className="sm:flex-1 flex items-center justify-center gap-2 text-rose-500 hover:text-rose-600"
        onClick={onLogout}
        disabled={isUpdating}
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </Button>
      <Button 
        onClick={onSave} 
        className="sm:flex-1 mimo-button"
        disabled={isUpdating}
      >
        {isUpdating ? "Salvando..." : "Salvar alterações"}
      </Button>
    </div>
  );
};

export default DialogFooterActions;
