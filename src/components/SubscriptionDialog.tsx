
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubscription: {
    title: string;
    price: number;
    period: string;
  } | null;
  userAlias: string;
  onUserAliasChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubscribe: () => void;
  processing: boolean;
}

const SubscriptionDialog = ({
  open,
  onOpenChange,
  selectedSubscription,
  userAlias,
  onUserAliasChange,
  onSubscribe,
  processing
}: SubscriptionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assinar {selectedSubscription?.title}</DialogTitle>
          <DialogDescription>
            Comece sua assinatura de conteúdo exclusivo agora mesmo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nome de usuário*
            </label>
            <Input
              id="username"
              placeholder="Digite seu nome de usuário"
              value={userAlias}
              onChange={onUserAliasChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Este nome será sua identificação e senha de acesso.
            </p>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email (opcional)
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu email"
            />
            <p className="text-xs text-gray-500 mt-1">
              Para receber notificações sobre novos conteúdos.
            </p>
          </div>
          
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp (opcional)
            </label>
            <Input
              id="whatsapp"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Plano</span>
            <span className="font-medium">{selectedSubscription?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Valor</span>
            <span className="font-medium">
              R${selectedSubscription?.price.toFixed(2).replace('.', ',')} /{selectedSubscription?.period}
            </span>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSubscribe}
            className="w-full sm:w-auto bg-gradient-to-r from-mimo-primary to-mimo-secondary"
            disabled={processing}
          >
            {processing ? "Processando..." : "Assinar agora"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog;
