
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroSectionProps {
  heroRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = ({ heroRef }: HeroSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/40 to-pink-100/30 py-20 md:py-32">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-mimo-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute top-32 -left-12 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-mimo-secondary/10 rounded-full blur-3xl"></div>
      
      <div ref={heroRef} className="mimo-container relative z-10 opacity-0">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
            Uma nova forma de criar e receber
          </Badge>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Monetize seu conteúdo, {" "}
            {!isMobile && <br />}
            conquiste independência financeira
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto px-4 sm:px-0">
            Mimo é a plataforma que conecta criadores e fãs de forma direta, simples e transparente. 
            Sem assinaturas obrigatórias, sem taxas abusivas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white text-lg px-6 py-5 h-auto rounded-full group shadow-md" asChild>
              <Link to="/cadastro">
                Comece a criar agora
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto border-mimo-primary text-mimo-primary hover:bg-mimo-primary/5 hover:text-mimo-primary text-lg px-6 py-5 h-auto rounded-full shadow-sm">
              <Link to="/explorar">Conheça os criadores</Link>
            </Button>
          </div>
          
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-3 md:gap-6 max-w-xl mx-auto text-center">
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-xl md:text-2xl font-bold text-mimo-primary">10%</div>
              <p className="text-xs md:text-sm text-gray-600">Taxa justa pelo seu trabalho</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-xl md:text-2xl font-bold text-mimo-primary">PIX</div>
              <p className="text-xs md:text-sm text-gray-600">Pagamento imediato</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="text-xl md:text-2xl font-bold text-mimo-primary">Livre</div>
              <p className="text-xs md:text-sm text-gray-600">Liberdade para criar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
