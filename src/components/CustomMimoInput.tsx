
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CustomMimoInputProps {
  onSubmit: (amount: number) => void;
  minimumAmount?: number;
}

const CustomMimoInput: React.FC<CustomMimoInputProps> = ({ 
  onSubmit, 
  minimumAmount = 10 
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Por favor, informe um valor válido');
      return;
    }
    
    if (numAmount < minimumAmount) {
      setError(`O valor mínimo é R$${minimumAmount}`);
      return;
    }
    
    setError(null);
    onSubmit(numAmount);
  };

  return (
    <div className="mimo-card p-4">
      <h3 className="text-lg font-medium mb-3">Valor personalizado</h3>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="custom-amount">Quanto você quer enviar?</Label>
          <div className="flex items-center mt-1">
            <span className="bg-muted rounded-l-md border border-r-0 border-input px-3 py-2 text-muted-foreground">R$</span>
            <Input
              id="custom-amount"
              type="number"
              min={minimumAmount}
              step="0.01"
              placeholder="0.00" 
              className="rounded-l-none"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError(null);
              }}
            />
          </div>
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
        
        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary"
          disabled={!amount}
        >
          Enviar Mimo
        </Button>
      </div>
    </div>
  );
};

export default CustomMimoInput;
