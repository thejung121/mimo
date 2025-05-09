
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md p-6">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-3 mb-4">
            <XCircle className="h-8 w-8 text-gray-500" />
          </div>
          <h1 className="text-xl font-bold mb-2">Pagamento cancelado</h1>
          <p className="text-muted-foreground text-center mb-6">
            O pagamento foi cancelado. Nenhum valor foi cobrado.
          </p>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary"
          >
            Voltar para a página inicial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceled;
