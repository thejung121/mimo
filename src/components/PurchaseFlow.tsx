import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, Lock, Mail, Phone } from 'lucide-react';

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

  const formatWhatsapp = (value: string) => {
    // Keep only numbers
    const numbers = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
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
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-1">{packageTitle}</h3>
                <p className="text-2xl font-bold mb-2">R$ {packagePrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Para: {creatorName}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="alias" className="block text-sm font-medium mb-1">
                    Nome de usuário*
                  </label>
                  <Input
                    id="alias"
                    value={userAlias}
                    onChange={(e) => setUserAlias(e.target.value)}
                    placeholder="Digite seu nome de usuário"
                    className="w-full"
                  />
                  <p className="text-xs mt-1 text-muted-foreground">
                    Este será seu identificador e senha de acesso ao conteúdo
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 flex items-center">
                    E-mail*
                    <Mail className="ml-1 h-3 w-3 text-muted-foreground" />
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    className="w-full"
                    required
                  />
                  <p className="text-xs mt-1 text-muted-foreground">
                    Seu e-mail é necessário para receber o acesso ao conteúdo exclusivo
                  </p>
                </div>
                
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium mb-1 flex items-center">
                    WhatsApp (opcional)
                    <Phone className="ml-1 h-3 w-3 text-muted-foreground" />
                  </label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="w-full"
                  />
                  <p className="text-xs mt-1 text-muted-foreground">
                    Opcional: Receba mensagens exclusivas diretamente no seu WhatsApp
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border border-muted rounded-md">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>
                      Seus dados são criptografados. Garantimos total discrição - não é necessário cadastro.
                    </span>
                  </div>
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary">
                    Continuar para pagamento
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-semibold mb-1">{packageTitle}</h3>
                <p className="text-2xl font-bold mb-2">R$ {packagePrice.toFixed(2)}</p>
              </div>

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

                <div className="pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border border-muted rounded-md">
                    <Lock className="h-4 w-4 text-green-500" />
                    <span>
                      Pagamento seguro e criptografado. Sua privacidade é garantida e seus dados protegidos.
                    </span>
                  </div>
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
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PurchaseFlow;
