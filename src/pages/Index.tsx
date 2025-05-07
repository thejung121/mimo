import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { ChevronRight, Heart, Zap, Shield, Gift } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-mimo-primary/10 to-transparent z-0"></div>
          <div className="mimo-container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Receba <span className="text-mimo-primary">mimos</span> dos seus fãs, entregue recompensas únicas
              </h1>
              <p className="text-xl text-foreground/80 mb-8">
                Crie sua página personalizada, ofereça recompensas exclusivas e fortaleça sua conexão com os fãs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="mimo-button text-lg px-8 py-6 h-auto w-full sm:w-auto" asChild>
                  <Link to="/cadastro">Criar minha página</Link>
                </Button>
                <Button variant="outline" className="border-mimo-primary text-mimo-primary hover:bg-mimo-primary hover:text-white text-lg px-8 py-6 h-auto w-full sm:w-auto">
                  Ver exemplos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted">
          <div className="mimo-container">
            <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="bg-mimo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-mimo-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Receba mimos</h3>
                <p className="text-foreground/70">
                  Os fãs enviam contribuições financeiras para apoiar seu trabalho.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="bg-mimo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-mimo-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Entregue recompensas</h3>
                <p className="text-foreground/70">
                  Ofereça conteúdos exclusivos como fotos, vídeos ou mensagens personalizadas.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="bg-mimo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-mimo-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Fortaleça conexões</h3>
                <p className="text-foreground/70">
                  Crie um relacionamento mais próximo com seus apoiadores mais fiéis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="mimo-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Simples e direto</h2>
              <p className="text-xl text-foreground/70">
                Uma plataforma descomplicada para conectar criadores e fãs
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="bg-mimo-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Personalize sua página</h3>
                      <p className="text-foreground/70">
                        Adicione sua foto, capa, redes sociais e descrição. Configure os valores de mimos e recompensas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-mimo-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Compartilhe com os fãs</h3>
                      <p className="text-foreground/70">
                        Divulgue sua página nas redes sociais e comece a receber mimos dos seus fãs.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-mimo-primary text-white rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1">Envie recompensas</h3>
                      <p className="text-foreground/70">
                        Gerencie os mimos recebidos e entregue as recompensas prometidas através de links exclusivos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-mimo-primary to-mimo-secondary rounded-xl p-1">
                <div className="bg-card rounded-lg p-6 shadow-lg">
                  <div className="bg-muted rounded-xl h-48 animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded-md w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-4 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-4 bg-muted rounded-md w-4/5 animate-pulse"></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-10 bg-mimo-primary rounded-md w-1/3 animate-pulse"></div>
                    <div className="h-10 bg-muted rounded-md w-1/3 animate-pulse"></div>
                    <div className="h-10 bg-muted rounded-md w-1/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-mimo-primary to-mimo-tertiary text-white">
          <div className="mimo-container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece a receber mimos hoje mesmo</h2>
            <p className="text-xl mb-8 text-white/90">
              Crie sua página personalizada em minutos e comece a receber o apoio dos seus fãs.
            </p>
            <Button className="bg-white text-mimo-primary hover:bg-white/90 text-lg px-8 py-6 h-auto" asChild>
              <Link to="/cadastro">Criar minha página</Link>
            </Button>
          </div>
        </section>
        
        {/* Testimonials (mockup) */}
        <section className="py-16">
          <div className="mimo-container">
            <h2 className="text-3xl font-bold text-center mb-12">Criadores que usam Mimo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="mimo-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse"></div>
                    <div>
                      <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
                      <div className="h-4 bg-muted rounded w-32 mt-1 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/explorar" className="inline-flex items-center text-mimo-primary hover:text-mimo-secondary font-medium">
                <span>Ver todos os criadores</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Trust section */}
        <section className="py-16 bg-muted">
          <div className="mimo-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Confiável e seguro</h2>
              <p className="text-xl text-foreground/70">
                Focamos na segurança e simplicidade para criadores e fãs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="bg-mimo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-mimo-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Pagamentos seguros</h3>
                <p className="text-foreground/70">
                  Utilizamos sistemas de pagamento confiáveis para garantir a segurança das transações.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="bg-mimo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-mimo-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Links temporários</h3>
                <p className="text-foreground/70">
                  Links de recompensa com expiração automática após 30 dias para maior segurança.
                </p>
              </div>
              <div className="bg-card p-6 rounded-xl shadow-sm text-center">
                <div className="bg-mimo-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-mimo-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Suporte personalizado</h3>
                <p className="text-foreground/70">
                  Atendimento dedicado para ajudar criadores e fãs em todos os momentos.
                </p>
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
