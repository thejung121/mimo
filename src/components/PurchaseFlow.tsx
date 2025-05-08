
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Copy, Check, ArrowRight, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PurchaseFlowProps {
  open: boolean;
  onClose: () => void;
  packageTitle: string;
  packagePrice: number;
  creatorName: string;
}

const PurchaseFlow: React.FC<PurchaseFlowProps> = ({
  open,
  onClose,
  packageTitle,
  packagePrice,
  creatorName
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'username' | 'payment' | 'contact' | 'success'>('username');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [accessUrl] = useState(`https://${window.location.host}/reward/${Date.now()}`);
  
  const handleContinue = () => {
    if (step === 'username') {
      if (!username.trim()) {
        toast({
          title: "Campo obrigatório",
          description: "Por favor, escolha um nome de usuário para acesso.",
          variant: "destructive"
        });
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      // Simulate payment processing
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep('contact');
      }, 1500);
    } else if (step === 'contact') {
      setStep('success');
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(accessUrl);
    toast({
      title: "Link copiado!",
      description: "Link copiado para área de transferência.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'username' && 'Criar acesso'}
            {step === 'payment' && 'Realizar pagamento'}
            {step === 'contact' && 'Informações adicionais'}
            {step === 'success' && 'Mimo enviado com sucesso!'}
          </DialogTitle>
          <DialogDescription>
            {step === 'username' && `Você está enviando um Mimo de R$${packagePrice} para ${creatorName}`}
            {step === 'payment' && 'Escaneie o QR Code ou copie a chave PIX para pagar'}
            {step === 'contact' && 'Informações opcionais para contato'}
            {step === 'success' && 'Seu mimo foi enviado e seu conteúdo já está disponível!'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {step === 'username' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Nome de Usuário (para acesso)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Este será seu login para acessar o conteúdo. Memorize ou salve essa informação.
                </p>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Escolha um nome de usuário"
                  className="mimo-input"
                />
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Pacote:</span>
                  <span className="text-sm font-medium">{packageTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="text-sm font-medium">R$ {packagePrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 flex flex-col items-center">
                <div className="bg-white p-3 rounded-md border mb-3">
                  <QrCode className="w-48 h-48 text-gray-800" />
                </div>
                <p className="text-sm text-center">QR Code PIX</p>
              </div>
              
              <div className="flex items-center border rounded-lg p-2 bg-muted/30">
                <div className="flex-1 mr-2 overflow-hidden">
                  <p className="text-xs text-muted-foreground">Chave PIX (CPF)</p>
                  <p className="font-mono text-sm truncate">123.456.789-00</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText('12345678900');
                    toast({ title: "Chave PIX copiada!" });
                  }}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </Button>
              </div>
              
              {processing ? (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground animate-pulse">Verificando pagamento...</p>
                </div>
              ) : null}
            </div>
          )}

          {step === 'contact' && (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Estas informações são opcionais e ajudam o criador a te manter informado.
              </p>
              
              <div>
                <Label htmlFor="email">E-mail (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  className="mimo-input"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
                <Input
                  id="whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Seu número com DDD"
                  className="mimo-input"
                />
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-3">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-lg mb-2">Seu mimo foi enviado!</h3>
                <p className="text-sm text-muted-foreground">
                  O conteúdo já está disponível para você acessar através do link abaixo:
                </p>
              </div>
              
              <div className="flex items-center border rounded-lg p-2 bg-muted/30">
                <div className="flex-1 mr-2 overflow-hidden">
                  <p className="text-xs text-muted-foreground">Link de acesso</p>
                  <p className="font-mono text-xs truncate">{accessUrl}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copiar</span>
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p className="mb-1">Para acessar seu conteúdo:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Acesse o link acima</li>
                  <li>Use "{username}" como sua senha de acesso</li>
                  <li>Desfrute do seu conteúdo exclusivo!</li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-2">
            {step === 'username' && (
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white hover:from-mimo-primary/90 hover:to-mimo-secondary/90"
              >
                Continuar para pagamento <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {step === 'payment' && (
              <Button 
                onClick={handleContinue} 
                disabled={processing}
                className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white hover:from-mimo-primary/90 hover:to-mimo-secondary/90"
              >
                {processing ? "Processando..." : "Já realizei o pagamento"}
              </Button>
            )}
            
            {step === 'contact' && (
              <Button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white hover:from-mimo-primary/90 hover:to-mimo-secondary/90"
              >
                Concluir <Heart className="ml-2 h-4 w-4" />
              </Button>
            )}
            
            {step === 'success' && (
              <Button 
                onClick={onClose}
                className="w-full bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white hover:from-mimo-primary/90 hover:to-mimo-secondary/90"
              >
                Ver meu conteúdo
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseFlow;
