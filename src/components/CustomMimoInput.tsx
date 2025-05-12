
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from 'lucide-react';

interface CustomMimoInputProps {
  onSubmit: (amount: number) => void;
  minimumAmount?: number;
  suggestedPrices?: number[];
}

const CustomMimoInput: React.FC<CustomMimoInputProps> = ({ 
  onSubmit, 
  minimumAmount = 10,
  suggestedPrices = [10, 15, 25, 50]
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

  const selectSuggestedPrice = (price: number) => {
    setAmount(price.toString());
    setError(null);
  };

  return (
    <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Valor personalizado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="suggested-prices" className="block mb-2">Valores sugeridos:</Label>
          <div className="flex flex-wrap gap-2 mb-4" id="suggested-prices">
            {suggestedPrices.map(price => (
              <Button
                key={price}
                type="button"
                variant={amount === price.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => selectSuggestedPrice(price)}
                className={`px-4 ${amount === price.toString() ? 'bg-mimo-primary hover:bg-mimo-primary/90' : ''}`}
              >
                R$ {price}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="custom-amount" className="block mb-2">Ou digite um valor personalizado:</Label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center">
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
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-mimo-primary to-mimo-secondary"
              disabled={!amount}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Enviar Mimo
            </Button>
          </div>
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomMimoInput;
