
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import UserInfoForm from './purchase/UserInfoForm';
import PaymentForm from './purchase/PaymentForm';
import PackageSummary from './purchase/PackageSummary';
import SecurityNotice from './purchase/SecurityNotice';

interface PurchaseFlowProps {
  open: boolean;
  onClose: () => void;
  packageTitle: string;
  packagePrice: number;
  creatorName: string;
}

const PurchaseFlow = ({
  open,
  onClose,
  packageTitle,
  packagePrice,
  creatorName,
}: PurchaseFlowProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userAlias, setUserAlias] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'preview' | 'payment' | 'success'>('preview');
  const [rewardId, setRewardId] = useState('');

  const handleProceedToPayment = () => {
    // Validate required fields
    if (!userAlias.trim()) {
      toast({
        title: 'Nome de usuário obrigatório',
        description: 'Por favor, insira um nome de usuário para continuar.',
        variant: 'destructive',
      });
      return;
    }
    
    // Email is now required
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: 'E-mail obrigatório',
        description: 'Por favor, insira um e-mail válido para receber seu mimo.',
        variant: 'destructive',
      });
      return;
    }
    
    setStep('payment');
  };

  const handlePayment = () => {
    setProcessing(true);

    // Generate a unique reward ID for the purchase
    const generatedRewardId = `reward-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setRewardId(generatedRewardId);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      
      toast({
        title: 'Mimo enviado com sucesso!',
        description: 'Seu acesso ao conteúdo exclusivo está disponível agora.',
      });
    }, 2000);
  };
  
  const handleAccessReward = () => {
    // Close the modal and navigate to the reward page
    onClose();
    navigate(`/recompensa/${rewardId}`);
    
    // Reset the form state for future purchases
    setUserAlias('');
    setEmail('');
    setWhatsapp('');
    setStep('preview');
  };

  const copyLinkToClipboard = () => {
    const rewardUrl = `${window.location.origin}/recompensa/${rewardId}`;
    navigator.clipboard.writeText(rewardUrl);
    toast({
      title: "Link copiado!",
      description: "O link de acesso foi copiado para a área de transferência.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {step === 'preview' ? 'Enviar Mimo' : 
             step === 'payment' ? 'Finalizar Compra' : 'Compra Concluída'}
          </SheetTitle>
          <SheetDescription>
            {step === 'preview'
              ? `Envie um presente para ${creatorName}`
              : step === 'payment'
              ? 'Complete seu pagamento para finalizar'
              : 'Seu acesso já está disponível!'}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          {step === 'preview' ? (
            <div className="space-y-4">
              <PackageSummary 
                packageTitle={packageTitle} 
                packagePrice={packagePrice} 
                showCreator={true} 
                creatorName={creatorName} 
              />

              <UserInfoForm
                userAlias={userAlias}
                setUserAlias={setUserAlias}
                email={email}
                setEmail={setEmail}
                whatsapp={whatsapp}
                setWhatsapp={setWhatsapp}
              />

              <div className="mt-6 flex flex-col gap-2">
                <SecurityNotice message="Seus dados são criptografados. Garantimos total discrição - não é necessário cadastro." />
                <Button
                  onClick={handleProceedToPayment}
                  className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary">
                  Continuar para pagamento
                </Button>
              </div>
            </div>
          ) : step === 'payment' ? (
            <div className="space-y-4">
              <PackageSummary packageTitle={packageTitle} packagePrice={packagePrice} />

              <PaymentForm />

              <div className="pt-4 flex flex-col gap-2">
                <SecurityNotice message="Pagamento seguro e criptografado. Sua privacidade é garantida e seus dados protegidos." />
                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary">
                  {processing ? 'Processando...' : `Pagar R$ ${packagePrice.toFixed(2)}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStep('preview')}
                  className="w-full"
                  disabled={processing}>
                  Voltar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 flex items-center gap-2">
                <div className="bg-green-100 rounded-full p-1">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Compra realizada com sucesso!</h3>
                  <p>Seu mimo foi enviado e você já pode acessar o conteúdo exclusivo.</p>
                </div>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium mb-2">Detalhes da compra:</h4>
                <p className="text-sm text-muted-foreground mb-1">Mimo: {packageTitle}</p>
                <p className="text-sm text-muted-foreground mb-1">Valor: R$ {packagePrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Criador(a): {creatorName}</p>
              </div>
              
              <div className="border border-dashed border-mimo-primary/40 bg-mimo-primary/5 rounded-lg p-4">
                <h4 className="font-medium mb-2 text-mimo-primary flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Link de acesso ao conteúdo
                </h4>
                <p className="text-sm mb-3">Este link dá acesso ao conteúdo exclusivo que você comprou:</p>
                <div className="bg-white border border-border rounded-lg p-2 flex items-center justify-between mb-2">
                  <span className="text-sm truncate">{window.location.origin}/recompensa/{rewardId}</span>
                  <Button variant="outline" size="sm" onClick={copyLinkToClipboard}>Copiar</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Este link é pessoal e ficará disponível por 30 dias.
                </p>
              </div>
              
              <Button 
                onClick={handleAccessReward}
                className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary flex items-center justify-center gap-2"
              >
                Acessar meu conteúdo agora
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                O link de acesso também foi enviado para o email {email}.
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PurchaseFlow;
