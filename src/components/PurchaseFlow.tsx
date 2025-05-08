
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';
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
  const [userAlias, setUserAlias] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'preview' | 'payment'>('preview');

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

    setTimeout(() => {
      toast({
        title: 'Mimo enviado com sucesso!',
        description: `Obrigado pelo seu apoio. Você receberá o acesso às recompensas no email ${email}.`,
      });
      setProcessing(false);
      setUserAlias('');
      setEmail('');
      setWhatsapp('');
      setStep('preview');
      onClose();
    }, 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{step === 'preview' ? 'Enviar Mimo' : 'Finalizar Compra'}</SheetTitle>
          <SheetDescription>
            {step === 'preview'
              ? `Envie um presente para ${creatorName}`
              : 'Complete seu pagamento para finalizar'}
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
          ) : (
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
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PurchaseFlow;
