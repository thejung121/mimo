import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Creator, SocialLink, MediaItem, MimoPackage } from '@/types/creator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Heart, Image as ImageIcon, Video, Check, Star, ChevronRight, ArrowRight, ChevronDown, Instagram, Twitter, Youtube, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import PurchaseFlow from "@/components/PurchaseFlow";

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
    // Remove the previous dialog opening
    // setDialogOpen(true);
    // setPaymentStep('preview');
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

  const previewMedia = selectedPackage?.media.filter(m => m.isPreview) || [];
  
  const getSocialIcon = (type: 'instagram' | 'twitter' | 'youtube' | 'website') => {
    switch (type) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'website':
        return <Globe className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      <NavBar />
      
      <div 
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-10 transition-transform duration-300",
          headerVisible ? "translate-y-0" : "-translate-y-full"
        )}
        style={{marginTop: '64px'}} // Adjust based on your navbar height
      >
        <div className="bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-sm text-white py-3 px-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={mockCreator.avatar} 
                alt={mockCreator.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
              />
              <div>
                <h2 className="font-medium">{mockCreator.name}</h2>
                <p className="text-xs text-white/80">@{mockCreator.username}</p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-white text-black hover:bg-white/90 rounded-full flex items-center gap-1"
              onClick={() => {
                const mimoSection = document.getElementById('mimo-section');
                if (mimoSection) {
                  mimoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Heart className="h-4 w-4 text-red-500" />
              <span>Enviar Mimo</span>
            </Button>
          </div>
        </div>
      </div>
      
      <main className="flex-grow pb-16 animate-fade-in">
        {/* Hero Section */}
        <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={mockCreator.cover} 
              alt="Cover" 
              className="w-full h-full object-cover animate-scale-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 text-center text-white mx-auto px-4 max-w-3xl">
            <div className="flex justify-center mb-6">
              <img 
                src={mockCreator.avatar} 
                alt={mockCreator.name} 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {mockCreator.name}
            </h1>
            
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              {mockCreator.description}
            </p>
            
            <div className="flex justify-center gap-3 mb-8">
              {mockCreator.socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {getSocialIcon(link.type)}
                </a>
              ))}
            </div>
            
            <Button 
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg group"
              onClick={() => {
                const mimoSection = document.getElementById('mimo-section');
                if (mimoSection) {
                  mimoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Heart className="mr-2 h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
              Enviar um Mimo
              <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </section>
        
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
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                  {mimoPackages.map((pkg) => (
                    <Card 
                      key={pkg.id} 
                      className={cn(
                        "overflow-hidden relative rounded-2xl transition-all duration-300 hover:shadow-lg",
                        pkg.highlighted ? 
                          "border-2 border-mimo-primary shadow-lg shadow-mimo-primary/20" : 
                          "border border-gray-200 hover:border-mimo-primary/50"
                      )}
                    >
                      {pkg.highlighted && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white text-xs uppercase font-bold py-1 px-3 rounded-bl-lg">
                            Mais popular
                          </div>
                        </div>
                      )}
                      
                      {pkg.media.find(m => m.isPreview) ? (
                        <div className="h-40 overflow-hidden relative">
                          <img 
                            src={pkg.media.find(m => m.isPreview)?.url} 
                            alt={pkg.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
                            <div className="flex items-center text-white text-sm">
                              <ImageIcon className="h-4 w-4 mr-1" />
                              <span>{pkg.media.filter(m => m.type === 'image').length} fotos</span>
                              {pkg.media.some(m => m.type === 'video') && (
                                <>
                                  <span className="mx-1">•</span>
                                  <Video className="h-4 w-4 mr-1" />
                                  <span>{pkg.media.filter(m => m.type === 'video').length} vídeos</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <div className="text-gray-400 text-center">
                            <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                            <p className="text-sm">Prévia não disponível</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-5">
                        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                        <p className="text-2xl font-bold mb-4 text-mimo-primary">
                          R${pkg.price}
                          <span className="text-sm text-gray-500 font-normal ml-1">único</span>
                        </p>
                        
                        <ul className="space-y-2 mb-6">
                          {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className={cn(
                            "w-full transition-all",
                            pkg.highlighted ? 
                              "bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white" : 
                              "bg-white text-mimo-primary border-2 border-mimo-primary hover:bg-mimo-primary/10"
                          )}
                          onClick={() => handleSelectPackage(pkg)}
                        >
                          <Heart className={cn("mr-1 h-4 w-4", pkg.highlighted ? "" : "text-red-500")} />
                          Enviar Mimo
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" fill="#f43f5e" />
                    Como funciona
                  </h3>
                  <ol className="space-y-3 ml-5 list-decimal">
                    <li className="text-gray-700">Escolha um pacote de mimo que deseja enviar.</li>
                    <li className="text-gray-700">Crie um nome de usuário que será sua identificação e senha de acesso.</li>
                    <li className="text-gray-700">Após a confirmação do pagamento via PIX, você receberá um link de acesso às recompensas.</li>
                    <li className="text-gray-700">O link ficará disponível por 30 dias.</li>
                    <li className="text-gray-700">Use seu nome de usuário como senha para acessar as recompensas exclusivas.</li>
                  </ol>
                </div>
              </TabsContent>
              
              <TabsContent value="subscription">
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  {subscriptionOptions.map((option) => (
                    <Card 
                      key={option.id} 
                      className={cn(
                        "overflow-hidden relative rounded-2xl transition-all duration-300 hover:shadow-lg",
                        option.popular ? 
                          "border-2 border-mimo-primary shadow-lg shadow-mimo-primary/20" : 
                          "border border-gray-200 hover:border-mimo-primary/50"
                      )}
                    >
                      {option.popular && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white text-xs uppercase font-bold py-1 px-3 rounded-bl-lg">
                            Recomendado
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                        <div className="mb-5">
                          <p className="text-3xl font-bold text-mimo-primary inline-block">
                            R${option.price.toFixed(2).replace('.', ',')}
                          </p>
                          <span className="text-sm text-gray-500 font-normal ml-1">/{option.period}</span>
                        </div>
                        
                        <ul className="space-y-3 mb-6">
                          {option.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button 
                          className={cn(
                            "w-full transition-all",
                            option.popular ? 
                              "bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white" : 
                              "bg-white text-mimo-primary border-2 border-mimo-primary hover:bg-mimo-primary/10"
                          )}
                          onClick={() => handleSelectSubscription(option)}
                        >
                          <Star className="mr-1 h-4 w-4" />
                          Assinar agora
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" fill="#eab308" />
                    Vantagens da assinatura
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Acesso exclusivo a conteúdos premium que não são disponibilizados em mimos</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Interação direta e priorizada com a criadora</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Descontos exclusivos na compra de mimos individuais</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Acesso antecipado a novos conteúdos e projetos</span>
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">O que estão dizendo</h2>
              <p className="text-gray-600">Depoimentos de fãs que enviaram mimos</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    M
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Marcelo S.</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Adorei o mimo que recebi! As fotos são incríveis e a mensagem personalizada foi super especial. Totalmente valeu a pena!"
                </p>
              </Card>
              
              <Card className="bg-white p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    C
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Carolina F.</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Já sou assinante e também adoro enviar mimos especiais. A Maria sempre surpreende com conteúdo de qualidade e exclusivo."
                </p>
              </Card>
              
              <Card className="bg-white p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                    R
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Rafael T.</p>
                    <div className="flex text-yellow-400">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "O processo foi super fácil e rápido. Recebi o link com as recompensas em menos de uma hora após o pagamento. Recomendo!"
                </p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Replace the old dialog with PurchaseFlow */}
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
        
        {/* Keep the existing dialogs */}
        {/* ... keep existing code (Mimo Details Dialog) */}
        
        {/* ... keep existing code (Subscription Dialog) */}
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorPage;
