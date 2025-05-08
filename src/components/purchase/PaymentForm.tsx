
import React from 'react';
import { Input } from '@/components/ui/input';
import { CreditCard } from 'lucide-react';

const PaymentForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium mb-1">
          Número do cartão
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            id="cardNumber"
            placeholder="0000 0000 0000 0000"
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium mb-1">
            Validade
          </label>
          <Input id="expiryDate" placeholder="MM/AA" />
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium mb-1">
            CVV
          </label>
          <Input id="cvv" placeholder="123" />
        </div>
      </div>

      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium mb-1">
          Nome no cartão
        </label>
        <Input
          id="cardholderName"
          placeholder="Nome como está no cartão"
        />
      </div>
    </div>
  );
};

export default PaymentForm;
