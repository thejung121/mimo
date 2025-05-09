
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Copy, Loader2, ArrowRight } from 'lucide-react';
import { verifyPayment } from '@/services/stripeService';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [rewardId, setRewardId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const transactionId = searchParams.get('transaction_id');
  
  useEffect(() => {
    const verifyTransaction = async () => {
      if (!sessionId || !transactionId) {
        setError('Dados da transação ausentes');
        setVerifying(false);
        setLoading(false);
        return;
      }

      try {
        const response = await verifyPayment(sessionId, transactionId);
        
        if (response.success) {
          setRewardId(response.reward_id);
        } else {
          setError('Pagamento não concluído. Por favor, tente novamente mais tarde.');
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
        setError('Erro ao verificar o pagamento. Por favor, tente novamente mais tarde.');
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };

    verifyTransaction();
  }, [sessionId, transactionId]);

  const copyLinkToClipboard = () => {
    if (!rewardId) return;
    
    const rewardUrl = `${window.location.origin}/recompensa/${rewardId}`;
    navigator.clipboard.writeText(rewardUrl);
    
    toast({
      title: "Link copiado!",
      description: "O link de acesso foi copiado para a área de transferência.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
        <Card className="w-full max-w-md p-6 flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-mimo-primary animate-spin mb-4" />
          <h1 className="text-xl font-bold mb-2">Processando seu pagamento</h1>
          <p className="text-muted-foreground text-center mb-4">
            Estamos verificando seu pagamento. Isso pode levar alguns instantes...
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
        <Card className="w-full max-w-md p-6">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="bg-red-100 rounded-full p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-xl font-bold mb-2">Ops! Algo deu errado</h1>
            <p className="text-muted-foreground text-center mb-6">
              {error}
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
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md p-6">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-xl font-bold mb-2">Mimo enviado com sucesso!</h1>
          <p className="text-muted-foreground text-center mb-6">
            Obrigado pelo seu mimo! Seu acesso ao conteúdo exclusivo está disponível agora.
          </p>

          <div className="border border-dashed border-mimo-primary/40 bg-mimo-primary/5 rounded-lg p-4 w-full mb-6">
            <h4 className="font-medium mb-2 text-mimo-primary flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Link de acesso ao conteúdo
            </h4>
            <p className="text-sm mb-3">Este link dá acesso ao conteúdo exclusivo que você comprou:</p>
            <div className="bg-white border border-border rounded-lg p-2 flex items-center justify-between mb-2">
              <span className="text-sm truncate">{window.location.origin}/recompensa/{rewardId}</span>
              <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Este link é pessoal e ficará disponível por 30 dias.
            </p>
          </div>

          <Button 
            onClick={() => navigate(`/recompensa/${rewardId}`)} 
            className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary flex items-center justify-center gap-2"
          >
            Acessar meu conteúdo agora
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <p className="text-sm text-muted-foreground text-center mt-4">
            O link de acesso também foi enviado para o email informado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
