import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  Heart, 
  Zap, 
  Shield, 
  Gift, 
  ChevronRight, 
  ArrowRight,
  Check,
  X,
  CreditCard,
  Users,
  ArrowUpRight,
  BadgeDollarSign,
  Sparkles,
  Calendar
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const refs = [
      heroRef.current,
      featuresRef.current,
      howItWorksRef.current,
      integrationRef.current,
      comparisonRef.current,
      ctaRef.current
    ];
    
    refs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      refs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Function to render comparison table rows
  const renderCreatorComparisonRows = () => (
    <>
      <TableRow>
        <TableCell className="font-medium">Taxa sobre ganhos</TableCell>
        <TableCell className="text-center font-semibold text-green-600">
          Apenas 10%
        </TableCell>
        <TableCell className="text-center text-gray-600">
          20% ou mais
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Recebimento</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600 font-medium">
            <Check className="h-5 w-5 mr-1" /> 
            PIX imediato
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          7 a 30 dias para processamento
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Obrigação de produção</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Liberdade criativa
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Conteúdo recorrente
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Pressão de engajamento</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Sem pressão
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Alta pressão
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Autonomia</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Total
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Limitada
          </div>
        </TableCell>
      </TableRow>
    </>
  );

  const renderFanComparisonRows = () => (
    <>
      <TableRow>
        <TableCell className="font-medium">Necessidade de cadastro</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Sem cadastro
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Cadastro obrigatório
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Flexibilidade financeira</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600 font-medium">
            <Check className="h-5 w-5 mr-1" /> 
            Pagamento único
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          Cobranças recorrentes
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Experiência</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Personalizada
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Genérica
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Privacidade</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Alta
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Baixa
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Método de pagamento</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            PIX
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          Cartão de crédito
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-mimo-primary/10 py-16 md:py-32">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-mimo-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-mimo-secondary/10 rounded-full blur-3xl"></div>
          
          <div ref={heroRef} className="mimo-container relative z-10 opacity-0">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 px-4 py-1.5 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Monetização para criadoras de conteúdo
              </Badge>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Aumente sua renda com <span className="text-mimo-primary">mimos</span>{" "}
                {!isMobile && <br />}
                exclusivos para seus fãs
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto px-4 sm:px-0">
                Mimo é uma plataforma que permite você monetizar conteúdos especiais 
                de forma direta, sem assinaturas mensais ou taxas abusivas.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white text-lg px-6 py-5 h-auto rounded-full group" asChild>
                  <Link to="/cadastro">
                    Criar minha página
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto border-mimo-primary text-mimo-primary hover:bg-mimo-primary/5 hover:text-mimo-primary text-lg px-6 py-5 h-auto rounded-full">
                  Ver exemplos
                </Button>
              </div>
              
              <div className="mt-12 md:mt-16 grid grid-cols-3 gap-2 md:gap-6 max-w-xl mx-auto text-center">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-mimo-primary">10%</div>
                  <p className="text-xs md:text-sm text-gray-500">Taxa única</p>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-mimo-primary">PIX</div>
                  <p className="text-xs md:text-sm text-gray-500">Pagamento imediato</p>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold text-mimo-primary">R$100+</div>
                  <p className="text-xs md:text-sm text-gray-500">Ticket médio alto</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Mimo Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mimo-container">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4 sm:px-0">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                O que é um Mimo?
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                Uma nova forma de monetizar{isMobile ? " " : <br/>}seu conteúdo exclusivo
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Mimo é uma contribuição que um fã faz para apoiar uma criadora, e em troca
                recebe uma recompensa personalizada. É uma forma mais natural, espontânea e
                significativa de monetização.
              </p>
            </div>
            
            <div ref={featuresRef} className="grid md:grid-cols-3 gap-6 opacity-0 px-4 sm:px-0">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
                <div className="h-2 bg-green-400"></div>
                <CardContent className="p-6 pt-8">
                  <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Conteúdo especial</h3>
                  <p className="text-gray-600 mb-6">
                    Ofereça conteúdos especiais que não cabem no seu modelo de assinatura mensal.
                    Produtos de valor mais elevado e exclusivos.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Maior valor por transação</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Sem obrigação de produção contínua</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Conteúdo premium diferenciado</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
                <div className="h-2 bg-mimo-primary"></div>
                <CardContent className="p-6 pt-8">
                  <div className="bg-mimo-primary/20 text-mimo-primary rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Renda complementar</h3>
                  <p className="text-gray-600 mb-6">
                    Receba pagamentos extras sem comprometer sua plataforma principal.
                    Uma fonte adicional de renda para suas metas financeiras.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Taxa de apenas 10%</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Pagamento via PIX imediato</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Alcance bateria financeiras</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
                <div className="h-2 bg-purple-400"></div>
                <CardContent className="p-6 pt-8">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Diferencial Mimo</h3>
                  <p className="text-gray-600 mb-6">
                    Uma plataforma pensada para incentivar trocas genuínas e espontâneas, sem
                    as barreiras e complexidades das plataformas tradicionais.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Sem obrigação de assinatura</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Experiência personalizada</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Conexões mais significativas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Integration with other platforms */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="mimo-container">
            <div ref={integrationRef} className="max-w-3xl mx-auto mb-12 md:mb-16 px-4 sm:px-0 opacity-0">
              <div className="text-center">
                <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                  Integração Perfeita
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold mb-6">
                  Coexistência com suas plataformas atuais
                </h2>
              </div>
              
              <Card className="border-none shadow-lg p-6">
                <CardContent className="p-0">
                  <div className="prose max-w-none text-gray-700">
                    <p className="text-lg mb-6">
                      Não precisa abandonar sua plataforma atual! Mimo foi desenhado para coexistir e
                      complementar sua presença em plataformas como Privacy e OnlyFans.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                          <Check className="h-5 w-5 mr-2" />
                          Integração complementar
                        </h4>
                        <p>"Use a Privacy para o conteúdo de sempre. Use o Mimo para quem quer te presentear de verdade."</p>
                      </div>
                      
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                          <Check className="h-5 w-5 mr-2" />
                          Valores emocionais maiores
                        </h4>
                        <p>O Mimo é para conteúdos especiais com valor emocional maior, que não cabem numa assinatura mensal.</p>
                      </div>
                    </div>
                    
                    <div className="bg-mimo-primary/5 border border-mimo-primary/20 rounded-lg p-4 mb-6">
                      <p className="italic">
                        "O Mimo não veio para substituir, mas para potencializar suas fontes de renda. 
                        Continue com suas assinaturas mensais e adicione essa nova fonte de receita para 
                        conteúdos especiais e diferenciados."
                      </p>
                    </div>
                    
                    <p>
                      Direcione seus fãs para as plataformas certas: cada uma tem seu propósito. 
                      O Mimo é o canhão extra para quando você quiser alcançar metas financeiras específicas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Comparison Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="mimo-container">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4 sm:px-0">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Por que escolher Mimo?
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                Compare e veja a diferença
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Mimo é a alternativa mais justa e flexível para monetização de conteúdo especial.
                Veja como nos comparamos às outras plataformas.
              </p>
            </div>
            
            <div ref={comparisonRef} className="bg-white rounded-xl shadow-lg mx-4 sm:mx-0 opacity-0">
              <Tabs defaultValue="creators" className="w-full">
                <div className="px-6 pt-4 border-b">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="creators" className="text-base py-2">Para Criadoras</TabsTrigger>
                    <TabsTrigger value="fans" className="text-base py-2">Para Fãs</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="creators" className="p-4">
                  <div className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-1/3"></TableHead>
                          <TableHead className="text-center w-1/3">
                            <div className="flex flex-col items-center">
                              <div className="font-bold text-base md:text-xl text-mimo-primary mb-1 flex items-center">
                                <Heart className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Mimo
                              </div>
                              <span className="text-xs md:text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            </div>
                          </TableHead>
                          <TableHead className="text-center w-1/3 font-medium text-gray-600">
                            Plataformas de assinatura
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {renderCreatorComparisonRows()}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="fans" className="p-4">
                  <div className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-1/3"></TableHead>
                          <TableHead className="text-center w-1/3">
                            <div className="flex flex-col items-center">
                              <div className="font-bold text-base md:text-xl text-mimo-primary mb-1 flex items-center">
                                <Heart className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Mimo
                              </div>
                              <span className="text-xs md:text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            </div>
                          </TableHead>
                          <TableHead className="text-center w-1/3 font-medium text-gray-600">
                            Plataformas de assinatura
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {renderFanComparisonRows()}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="mimo-container">
            <div className="text-center mb-12 md:mb-16 px-4 sm:px-0">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Simples e Descomplicado
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                Como o Mimo funciona
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
                A plataforma mais direta para conectar criadoras e fãs, sem burocracias ou complicações.
              </p>
            </div>
            
            <div ref={howItWorksRef} className="grid md:grid-cols-2 gap-12 items-center px-4 sm:px-0 opacity-0">
              <div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Crie sua página</h3>
                      <p className="text-gray-600 mb-3">
                        Personalize sua página com sua identidade, crie pacotes especiais e defina as 
                        recompensas que vai oferecer. Rápido e sem burocracia.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Design completo da sua página</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Múltiplos pacotes com preços diferentes</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Integração com suas redes sociais</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-purple-100 text-purple-600 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Compartilhe</h3>
                      <p className="text-gray-600 mb-3">
                        Compartilhe sua página Mimo nas redes sociais e com seus seguidores. 
                        Cada link é personalizado com seu nome de usuário.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Links personalizados</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Compartilhamento direto</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Ferramentas de promoção</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-mimo-primary/20 text-mimo-primary rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Receba pagamentos</h3>
                      <p className="text-gray-600 mb-3">
                        Quando um fã compra seu mimo, você recebe o pagamento imediatamente via PIX e
                        entrega o conteúdo exclusivo através de um link seguro.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>PIX direto para sua conta</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Taxa de apenas 10%</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Sem tempo mínimo de saque</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-mimo-primary to-mimo-secondary rounded-xl p-1 shadow-xl hidden md:block">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 relative overflow-hidden">
                    <div className="absolute top-4 left-4 right-4 h-32 bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                        <div>
                          <div className="h-4 w-24 bg-gray-200 rounded"></div>
                          <div className="h-3 w-16 bg-gray-100 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                      <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                      <div className="bg-white rounded p-2 shadow-sm">
                        <div className="h-16 bg-gray-100 rounded mb-2"></div>
                        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="h-5 w-1/2 bg-mimo-primary/20 rounded"></div>
                      </div>
                      <div className="bg-white rounded p-2 shadow-sm">
                        <div className="h-16 bg-gray-100 rounded mb-2"></div>
                        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="h-5 w-1/2 bg-mimo-primary/40 rounded"></div>
                      </div>
                      <div className="bg-white rounded p-2 shadow-sm">
                        <div className="h-16 bg-gray-100 rounded mb-2"></div>
                        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                        <div className="h-5 w-1/2 bg-mimo-primary/60 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-
