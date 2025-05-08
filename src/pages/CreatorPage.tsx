
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, FileImage } from 'lucide-react';

// Mock data
const mockCreator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram' as const, url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter' as const, url: 'https://twitter.com/mariafernanda' },
    { type: 'youtube' as const, url: 'https://youtube.com/mariafernanda' },
    { type: 'website' as const, url: 'https://mariafernanda.com' }
  ]
};

// Interface para os media items
interface MediaItem {
  id: number;
  type: 'image' | 'video';
  url: string;
  isPreview: boolean;
}

interface MimoPackageType {
  id: number;
  title: string;
  price: number;
  features: string[];
  highlighted: boolean;
  media: MediaItem[];
}

// Mock dos pacotes de mimo
const mimoPackages: MimoPackageType[] = [
  {
    id: 1,
    title: 'Mimo Básico',
    price: 20,
    features: [
      'Foto exclusiva',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: false,
    media: [
      { 
        id: 1,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
        isPreview: true
      }
    ]
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
    highlighted: true,
    media: [
      { 
        id: 2,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        isPreview: true
      },
      { 
        id: 3,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isPreview: true
      }
    ]
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
    highlighted: false,
    media: [
      { 
        id: 4,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        isPreview: false
      },
      { 
        id: 5,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isPreview: true
      },
      { 
        id: 6,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        isPreview: true
      }
    ]
  }
];

const CreatorPage = () => {
  const { username } = useParams();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<MimoPackageType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userAlias, setUserAlias] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'preview' | 'payment'>('preview');

  const handleSelectPackage = (pkg: MimoPackageType) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
    setPaymentStep('preview');
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
      setPaymentStep('preview');
    }, 2000);
  };

  const previewMedia = selectedPackage?.media.filter(m => m.isPreview) || [];

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
                  previewImageUrl={pkg.media.find(m => m.isPreview)?.url}
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
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setPaymentStep('preview');
            }
          }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{paymentStep === 'preview' ? 'Prévia do Mimo' : 'Enviar Mimo'}: {selectedPackage?.title}</DialogTitle>
                <DialogDescription>
                  {paymentStep === 'preview' ? 'Veja um preview do que você receberá neste pacote.' : `Você está enviando um mimo de R$${selectedPackage?.price} para ${mockCreator.name}.`}
                </DialogDescription>
              </DialogHeader>
              
              {paymentStep === 'preview' ? (
                <div className="space-y-4 py-2">
                  {previewMedia.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {previewMedia.map((media) => (
                          <CarouselItem key={media.id}>
                            {media.type === 'image' ? (
                              <div className="flex justify-center p-1">
                                <img 
                                  src={media.url} 
                                  alt="Preview" 
                                  className="max-h-[250px] object-contain rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="flex justify-center items-center bg-muted h-[250px] rounded-md">
                                <FileImage className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </Carousel>
                  ) : (
                    <div className="flex items-center justify-center bg-muted h-[250px] rounded-md">
                      <div className="text-center text-muted-foreground">
                        <FileImage className="h-12 w-12 mx-auto mb-2" />
                        <p>Nenhum preview disponível</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 bg-muted p-3 rounded-lg">
                    <h4 className="font-medium text-sm">Este pacote inclui:</h4>
                    <ul className="space-y-1">
                      {selectedPackage?.features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className="mr-2 text-mimo-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={() => setPaymentStep('payment')}
                      className="mimo-button"
                    >
                      Continuar (R${selectedPackage?.price})
                    </Button>
                  </div>
                </div>
              ) : (
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
                  
                  <div className="flex justify-end gap-4 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setPaymentStep('preview')}
                      disabled={processing}
                    >
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleSendMimo}
                      className="mimo-button"
                      disabled={processing}
                    >
                      {processing ? 'Processando...' : 'Confirmar Mimo'}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorPage;
