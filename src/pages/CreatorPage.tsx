
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import CreatorProfile from '@/components/CreatorProfile';
import MimoPackage from '@/components/MimoPackage';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockCreator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter', url: 'https://twitter.com/mariafernanda' },
    { type: 'website', url: 'https://mariafernanda.com' }
  ]
};

const mimoPackages = [
  {
    id: 1,
    title: 'Mimo Básico',
    price: 20,
    features: [
      'Foto exclusiva',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: false
  },
  {
    id: 2,
    title: 'Mimo Especial',
    price: 50,
    features: [
      'Set com 3 fotos exclusivas',
      'Vídeo de agradecimento',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: true
  },
  {
    id: 3,
    title: 'Mimo Premium',
    price: 100,
    features: [
      'Set com 5 fotos exclusivas',
      'Vídeo personalizado',
      'Resposta a 3 perguntas',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: false
  }
];

const CreatorPage = () => {
  const { username } = useParams();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userAlias, setUserAlias] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSelectPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };

  const handleSendMimo = () => {
    if (!userAlias.trim()) {
      toast({
        title: "Nome de usuário obrigatório",
        description: "Por favor, insira um nome de usuário para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    // Simulando o processamento do pagamento
    setTimeout(() => {
      toast({
        title: "Mimo enviado com sucesso!",
        description: `Obrigado pelo seu apoio. Você receberá um link de acesso às recompensas em breve.`,
      });
      setProcessing(false);
      setDialogOpen(false);
      setUserAlias('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container">
          <CreatorProfile
            name={mockCreator.name}
            avatar={mockCreator.avatar}
            cover={mockCreator.cover}
            description={mockCreator.description}
            socialLinks={mockCreator.socialLinks}
          />
          
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Escolha seu Mimo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {mimoPackages.map((pkg) => (
                <MimoPackage
                  key={pkg.id}
                  title={pkg.title}
                  price={pkg.price}
                  features={pkg.features}
                  highlighed={pkg.highlighted}
                  onClick={() => handleSelectPackage(pkg)}
                />
              ))}
            </div>
            
            <div className="mt-12 bg-muted rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Como funciona</h3>
              <ol className="space-y-2 ml-5 list-decimal">
                <li>Escolha um pacote de mimo que deseja enviar.</li>
                <li>Crie um nome de usuário que servirá como sua identificação e senha de acesso.</li>
                <li>Após a confirmação do pagamento, você receberá um link de acesso às recompensas.</li>
                <li>O link ficará disponível por 30 dias.</li>
                <li>Use seu nome de usuário como senha para acessar as recompensas.</li>
              </ol>
            </div>
          </section>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enviar Mimo: {selectedPackage?.title}</DialogTitle>
                <DialogDescription>
                  Você está enviando um mimo de R${selectedPackage?.price} para {mockCreator.name}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm text-foreground/70">
                    Crie um nome de usuário que será usado como sua identificação e senha para acessar as recompensas.
                  </p>
                  <Input
                    placeholder="Seu nome de usuário"
                    value={userAlias}
                    onChange={(e) => setUserAlias(e.target.value)}
                    className="mimo-input"
                  />
                </div>
                
                <div className="space-y-2 bg-muted p-3 rounded-lg">
                  <h4 className="font-medium text-sm">Você receberá:</h4>
                  <ul className="space-y-1">
                    {selectedPackage?.features.map((feature: string, index: number) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="mr-2 text-mimo-primary">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  disabled={processing}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSendMimo}
                  className="mimo-button"
                  disabled={processing}
                >
                  {processing ? 'Processando...' : 'Confirmar Mimo'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorPage;
