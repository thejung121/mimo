
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
import { ArrowRight, Check, ExternalLink, Loader2 } from 'lucide-react';
import UserInfoForm from './purchase/UserInfoForm';
import PackageSummary from './purchase/PackageSummary';
import SecurityNotice from './purchase/SecurityNotice';
import { createCheckoutSession } from '@/services/stripeService';

interface PurchaseFlowProps {
  open: boolean;
  onClose: () => void;
  packageId: string;
  packageTitle: string;
  packagePrice: number;
  creatorId: string;
  creatorName: string;
}

const PurchaseFlow = ({
  open,
  onClose,
  packageId,
  packageTitle,
  packagePrice,
  creatorId,
  creatorName,
}: PurchaseFlowProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userAlias, setUserAlias] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProceedToPayment = async () => {
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
    
    try {
      setProcessing(true);
      
      // Create checkout session with Stripe
      const response = await createCheckoutSession({
        packageId,
        packageTitle,
        packagePrice,
        creatorId,
        creatorName,
        userAlias,
        email,
        whatsapp: whatsapp.trim() || undefined,
      });
      
      // Redirect to Stripe checkout
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Não foi possível criar a sessão de checkout');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Erro ao processar pagamento',
        description: 'Ocorreu um erro ao processar seu pagamento. Tente novamente mais tarde.',
        variant: 'destructive',
      });
      setProcessing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Enviar Mimo</SheetTitle>
          <SheetDescription>
            Envie um presente para {creatorName}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-4">
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
              disabled={processing}
              className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary">
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Continuar para pagamento'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PurchaseFlow;
