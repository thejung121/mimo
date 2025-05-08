import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Creator, MimoPackage } from '@/types/creator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { Heart, Star } from 'lucide-react';
import PurchaseFlow from "@/components/PurchaseFlow";
import CreatorHero from '@/components/CreatorHero';
import CreatorStickyHeader from '@/components/CreatorStickyHeader';
import MimoTabContent from '@/components/MimoTabContent';
import SubscriptionTabContent from '@/components/SubscriptionTabContent';
import TestimonialsSection from '@/components/TestimonialsSection';
import SubscriptionDialog from '@/components/SubscriptionDialog';

// Mock data
const mockCreator: Creator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter', url: 'https://twitter.com/mariafernanda' },
    { type: 'youtube', url: 'https://youtube.com/mariafernanda' },
    { type: 'website', url: 'https://mariafernanda.com' }
  ]
};

// Interface para os media items
const mimoPackages: MimoPackage[] = [
  {
    id: 1,
    title: 'Mimo Essencial',
    price: 30,
    features: [
      'Foto exclusiva de alta qualidade',
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
    price: 70,
    features: [
      'Set com 5 fotos exclusivas',
      'Vídeo de agradecimento',
      'Escolha de tema para as fotos',
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
    price: 120,
    features: [
      'Set com 8 fotos exclusivas',
      'Vídeo personalizado de 2 minutos',
      'Escolha de temas e poses',
      'Resposta a 3 perguntas',
      'Mensagem personalizada',
      'Acesso por 45 dias'
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

const subscriptionOptions = [
  {
    id: 's1',
    title: 'Assinatura Mensal',
    price: 49.90,
    period: 'mês',
    features: [
      'Acesso a conteúdo exclusivo',
      'Novo material toda semana',
      'Desconto de 15% em mimos',
      'Acesso ao chat privado'
    ],
    popular: false
  },
  {
    id: 's2',
    title: 'Assinatura Trimestral',
    price: 129.90,
    period: '3 meses',
    features: [
      'Tudo da mensal',
      'Economia de R$20',
      'Consulta por vídeo mensal',
      'Acesso a conteúdo do arquivo'
    ],
    popular: true
  }
];

const CreatorPage = () => {
  const { username } = useParams();
  const { toast } = useToast();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [userAlias, setUserAlias] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'preview' | 'payment'>('preview');
  const [activeTab, setActiveTab] = useState<'mimos' | 'subscription'>('mimos');
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSelectPackage = (pkg: MimoPackage) => {
    setSelectedPackage(pkg);
    setPurchaseFlowOpen(true);
    // Commented out since we're using PurchaseFlow now
    // setDialogOpen(true);
    // setPaymentStep('preview');
  };

  const scrollToMimoSection = () => {
    const mimoSection = document.getElementById('mimo-section');
    if (mimoSection) {
      mimoSection.scrollIntoView({ behavior: 'smooth' });
    }
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
  
  const handleSelectSubscription = (sub: any) => {
    setSelectedSubscription(sub);
    setSubscriptionDialogOpen(true);
  };
  
  const handleSubscribe = () => {
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
        title: "Assinatura realizada com sucesso!",
        description: `Obrigado pelo seu apoio contínuo. Sua assinatura está ativa.`,
      });
      setProcessing(false);
      setSubscriptionDialogOpen(false);
      setUserAlias('');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <NavBar />
      
      <CreatorStickyHeader 
        visible={headerVisible}
        avatar={mockCreator.avatar}
        name={mockCreator.name}
        username={mockCreator.username}
        onMimoClick={scrollToMimoSection}
      />
      
      <main className="flex-grow pb-16 animate-fade-in">
        {/* Hero Section */}
        <CreatorHero 
          creator={mockCreator} 
          onMimoClick={scrollToMimoSection} 
        />
        
        {/* Options Tab Section */}
        <section id="mimo-section" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-mimo-primary to-mimo-secondary inline-block">
                Escolha como apoiar
              </h2>
              <p className="text-lg text-gray-600">
                Escolha entre enviar um mimo ou assinar conteúdo exclusivo
              </p>
            </div>
            
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'mimos' | 'subscription')} 
              className="mb-8"
            >
              <div className="flex justify-center">
                <TabsList className="grid grid-cols-2 w-[400px] mb-10">
                  <TabsTrigger value="mimos" className="text-base py-3">
                    <Heart className="mr-2 h-4 w-4" /> Mimos
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="text-base py-3">
                    <Star className="mr-2 h-4 w-4" /> Assinatura
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="mimos">
                <MimoTabContent 
                  mimoPackages={mimoPackages} 
                  onSelectPackage={handleSelectPackage} 
                />
              </TabsContent>
              
              <TabsContent value="subscription">
                <SubscriptionTabContent 
                  subscriptionOptions={subscriptionOptions} 
                  onSelectSubscription={handleSelectSubscription} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Testimonials */}
        <TestimonialsSection />
        
        {/* Purchase Flow Component */}
        {selectedPackage && (
          <PurchaseFlow
            open={purchaseFlowOpen}
            onClose={() => {
              setPurchaseFlowOpen(false);
              setSelectedPackage(null);
            }}
            packageTitle={selectedPackage.title}
            packagePrice={selectedPackage.price}
            creatorName={mockCreator.name}
          />
        )}
        
        {/* Subscription Dialog */}
        <SubscriptionDialog
          open={subscriptionDialogOpen}
          onOpenChange={setSubscriptionDialogOpen}
          selectedSubscription={selectedSubscription}
          userAlias={userAlias}
          onUserAliasChange={(e) => setUserAlias(e.target.value)}
          onSubscribe={handleSubscribe}
          processing={processing}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorPage;
