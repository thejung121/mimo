
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

const Index = () => {
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
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
      testimonialsRef.current,
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

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-mimo-primary/10 py-20 md:py-32">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-mimo-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-mimo-secondary/10 rounded-full blur-3xl"></div>
          
          <div ref={heroRef} className="mimo-container relative z-10 opacity-0">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 px-4 py-1.5 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Uma nova forma de conexão entre criadores e fãs
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Envie <span className="text-mimo-primary">mimos</span>, receba <br />
                recompensas exclusivas
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                Mimo é a plataforma que conecta criadores e fãs de forma direta, 
                simples e transparente. Sem assinaturas obrigatórias, sem taxas abusivas.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white text-lg px-8 py-6 h-auto rounded-full group" asChild>
                  <Link to="/cadastro">
                    Criar minha página
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto border-mimo-primary text-mimo-primary hover:bg-mimo-primary/5 hover:text-mimo-primary text-lg px-8 py-6 h-auto rounded-full">
                  Ver exemplos
                </Button>
              </div>
              
              <div className="mt-16 grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
                <div>
                  <div className="text-2xl font-bold text-mimo-primary">250+</div>
                  <p className="text-sm text-gray-500">Criadores ativos</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-mimo-primary">15.000+</div>
                  <p className="text-sm text-gray-500">Mimos enviados</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-mimo-primary">R$1M+</div>
                  <p className="text-sm text-gray-500">Distribuídos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Mimo Section */}
        <section className="py-20 bg-white">
          <div className="mimo-container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                O que é um Mimo?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Uma troca justa e direta entre <br/>criadores e admiradores
              </h2>
              <p className="text-lg text-gray-600">
                Mimo é uma contribuição que um fã faz para apoiar uma criadora, e em troca
                recebe uma recompensa personalizada. É uma forma mais natural, espontânea e
                significativa de monetização.
              </p>
            </div>
            
            <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 opacity-0">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
                <div className="h-2 bg-green-400"></div>
                <CardContent className="p-6 pt-8">
                  <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">Para o fã</h3>
                  <p className="text-gray-600 mb-6">
                    Envie um mimo para uma criadora que você admira e receba conteúdo exclusivo,
                    mensagens personalizadas ou outras recompensas únicas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Sem necessidade de cadastro</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Escolha quanto quer enviar</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Receba conteúdo exclusivo</span>
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
                  <h3 className="font-semibold text-xl mb-3">Para a criadora</h3>
                  <p className="text-gray-600 mb-6">
                    Receba apoio financeiro dos seus fãs e ofereça em troca conteúdos exclusivos
                    que você já produz, sem a pressão de entregas recorrentes.
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
                      <span>Liberdade para criar</span>
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
        
        {/* Comparison Section */}
        <section className="py-20 bg-gray-50">
          <div className="mimo-container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Por que escolher Mimo?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Compare e veja a diferença
              </h2>
              <p className="text-lg text-gray-600">
                Mimo é a alternativa mais justa, transparente e natural para monetização
                de conteúdo. Veja como nos comparamos às outras plataformas.
              </p>
            </div>
            
            <div ref={comparisonRef} className="bg-white rounded-xl shadow-lg overflow-hidden opacity-0">
              <Tabs defaultValue="creators" className="w-full">
                <div className="px-6 pt-4 border-b">
                  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                    <TabsTrigger value="creators" className="text-base py-2">Para Criadoras</TabsTrigger>
                    <TabsTrigger value="fans" className="text-base py-2">Para Fãs</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="creators" className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-4 px-6 text-left font-medium text-gray-500"></th>
                          <th className="py-4 px-6 text-center">
                            <div className="flex flex-col items-center">
                              <div className="font-bold text-xl text-mimo-primary mb-1 flex items-center">
                                <Heart className="h-5 w-5 mr-1" /> Mimo
                              </div>
                              <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            </div>
                          </th>
                          <th className="py-4 px-6 text-center font-medium text-gray-600">
                            Plataformas de assinatura
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Taxa sobre ganhos</td>
                          <td className="py-4 px-6 text-center font-semibold text-green-600">
                            Apenas 10%
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            20% ou mais
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Recebimento</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600 font-medium">
                              <Check className="h-5 w-5 mr-1" /> 
                              PIX imediato
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            7 a 30 dias para processamento
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Obrigação de produção</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              Liberdade criativa
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-1 text-red-500" /> 
                              Conteúdo recorrente
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Pressão de engajamento</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              Sem pressão
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-1 text-red-500" /> 
                              Alta pressão
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-6 font-medium">Autonomia</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              Total
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-1 text-red-500" /> 
                              Limitada
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="fans" className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-4 px-6 text-left font-medium text-gray-500"></th>
                          <th className="py-4 px-6 text-center">
                            <div className="flex flex-col items-center">
                              <div className="font-bold text-xl text-mimo-primary mb-1 flex items-center">
                                <Heart className="h-5 w-5 mr-1" /> Mimo
                              </div>
                              <span className="text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                Recomendado
                              </span>
                            </div>
                          </th>
                          <th className="py-4 px-6 text-center font-medium text-gray-600">
                            Plataformas de assinatura
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Necessidade de cadastro</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              Sem cadastro
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-1 text-red-500" /> 
                              Cadastro obrigatório
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Flexibilidade financeira</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600 font-medium">
                              <Check className="h-5 w-5 mr-1" /> 
                              Pagamento único
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            Cobranças recorrentes
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Experiência</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              Personalizada
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-1 text-red-500" /> 
                              Genérica
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4 px-6 font-medium">Privacidade</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              Alta
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            <div className="flex items-center justify-center">
                              <X className="h-5 w-5 mr-1 text-red-500" /> 
                              Baixa
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-6 font-medium">Método de pagamento</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center text-green-600">
                              <Check className="h-5 w-5 mr-1" /> 
                              PIX
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center text-gray-600">
                            Cartão de crédito
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="mimo-container">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Simples e Descomplicado
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Como o Mimo funciona
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A plataforma mais direta para conectar criadores e fãs, sem burocracias ou complicações.
              </p>
            </div>
            
            <div ref={howItWorksRef} className="grid md:grid-cols-2 gap-12 items-center opacity-0">
              <div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Para criadoras</h3>
                      <p className="text-gray-600 mb-3">
                        Crie sua página personalizada, configure seus pacotes de mimos e as recompensas 
                        que deseja oferecer em troca.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Personalize sua página de forma completa</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Defina diferentes valores e recompensas</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Compartilhe sua página nas redes sociais</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-purple-100 text-purple-600 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Para fãs</h3>
                      <p className="text-gray-600 mb-3">
                        Escolha um pacote de mimo, faça um pagamento único via PIX e receba conteúdo 
                        exclusivo sem necessidade de assinatura.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Sem cadastro ou cartão de crédito</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Pagamento fácil via PIX</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Acesso ao link exclusivo por 30 dias</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-mimo-primary/20 text-mimo-primary rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">Conexão direta</h3>
                      <p className="text-gray-600 mb-3">
                        A criadora recebe o pagamento de forma imediata e envia o conteúdo exclusivo 
                        para o fã através de um link seguro.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>PIX direto para a conta da criadora</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Links seguros e temporários</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>Relação mais próxima e significativa</span>
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
                    <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-100 rounded-md w-4/5 animate-pulse"></div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="h-12 bg-mimo-primary/20 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <BadgeDollarSign className="h-5 w-5 text-green-600" />
                      <div className="h-4 w-full bg-green-100 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section ref={testimonialsRef} className="py-20 bg-gray-50 opacity-0">
          <div className="mimo-container">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
                Histórias de Sucesso
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Criadoras que estão prosperando
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Veja como criadores diversos estão transformando suas paixões em renda através do Mimo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold text-lg">Juliana M.</p>
                      <p className="text-sm text-gray-500">Fotógrafa & Modelo</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "Depois de anos lutando com as plataformas de assinatura, encontrei no Mimo a flexibilidade que precisava. Sem a pressão de produzir conteúdo toda semana, posso me dedicar a criar coisas realmente especiais."
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Ganhos mensais</p>
                      <p className="text-lg font-bold text-mimo-primary">R$6.800+</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-mimo-primary">
                      Ver perfil <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold text-lg">Pedro K.</p>
                      <p className="text-sm text-gray-500">Músico & Compositor</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "Como músico independente, o Mimo me permitiu monetizar meu trabalho sem intermediários. Ofereço músicas exclusivas, demos e até aulas personalizadas. A resposta dos fãs tem sido incrível!"
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Ganhos mensais</p>
                      <p className="text-lg font-bold text-mimo-primary">R$4.200+</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-mimo-primary">
                      Ver perfil <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-semibold text-lg">Amanda S.</p>
                      <p className="text-sm text-gray-500">Artista Digital</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">
                    "O pagamento imediato via PIX mudou completamente minha vida. Antes esperava semanas para receber, agora consigo planejar melhor minhas finanças e investir mais no meu trabalho!"
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Ganhos mensais</p>
                      <p className="text-lg font-bold text-mimo-primary">R$5.500+</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-mimo-primary">
                      Ver perfil <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 bg-gradient-to-br from-mimo-primary to-mimo-tertiary text-white opacity-0">
          <div className="mimo-container text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Liberte seu potencial criativo
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Dê o próximo passo na sua jornada criativa. Crie sua página, conecte-se com seus fãs
                e comece a receber mimos hoje mesmo.
              </p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left flex-1 max-w-xs">
                  <Users className="h-8 w-8 mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Para criadoras</h3>
                  <p className="text-white/80 mb-4">
                    Monetize seu conteúdo sem pressão, com taxas justas e pagamentos imediatos.
                  </p>
                  <Button asChild className="bg-white text-mimo-primary hover:bg-white/90 rounded-full w-full group">
                    <Link to="/cadastro">
                      Criar minha página
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left flex-1 max-w-xs">
                  <Heart className="h-8 w-8 mb-4 text-white" />
                  <h3 className="text-xl font-bold mb-2">Para fãs</h3>
                  <p className="text-white/80 mb-4">
                    Apoie seus criadores favoritos de forma direta e receba recompensas exclusivas.
                  </p>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/20 rounded-full w-full">
                    <Link to="/explorar">
                      Descobrir criadores
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-white" />
                  <span>Sem taxas ocultas</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-white" />
                  <span>Pagamentos via PIX</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-white" />
                  <span>Suporte personalizado</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-1 text-white" />
                  <span>Cancelamento a qualquer momento</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
