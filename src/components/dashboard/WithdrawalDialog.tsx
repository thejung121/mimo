
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, CreditCard } from 'lucide-react';

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBalance: number;
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  onRequestWithdrawal: () => void;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({ 
  open, 
  onOpenChange, 
  availableBalance,
  withdrawalAmount,
  setWithdrawalAmount,
  onRequestWithdrawal
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Saque</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-mimo-primary/10 to-transparent p-4 rounded-lg">
            <p className="flex items-center text-sm">
              <Wallet className="h-4 w-4 mr-2 text-mimo-primary" />
              Saldo disponível: <span className="font-bold ml-2">R${availableBalance}</span>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="withdrawal-amount">Valor do saque</Label>
            <div className="flex items-center">
              <span className="bg-muted rounded-l-md border border-r-0 border-border px-3 py-2 text-muted-foreground">R$</span>
              <Input 
                id="withdrawal-amount"
                type="number"
                placeholder="0,00" 
                min="1"
                max={availableBalance}
                className="rounded-l-none"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-mimo-primary" />
              Dados para saque
            </h4>
            <p className="text-sm text-foreground/70 mb-1">
              <span className="text-mimo-primary">PIX:</span> CPF - ***.***.***-**
            </p>
            <p className="text-xs text-muted-foreground">
              O valor será enviado para a chave PIX cadastrada em até 24h após a solicitação.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={onRequestWithdrawal} 
            className="w-full mimo-button"
            disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > availableBalance}
          >
            Solicitar Saque
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;
