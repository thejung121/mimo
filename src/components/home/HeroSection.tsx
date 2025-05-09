
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
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-mimo-primary/10 py-16 md:py-32">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-mimo-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-mimo-secondary/10 rounded-full blur-3xl"></div>
      
      <div ref={heroRef} className="mimo-container relative z-10 opacity-0">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
            Para quem cria sem amarras
          </Badge>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Receba <span className="text-mimo-primary">mimos</span>{" "}
            {!isMobile && <br />}
            pelo que seu trabalho realmente vale
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto px-4 sm:px-0">
            Chega de entregar seu melhor por migalhas. Com Mimo, seus fãs te recompensam de verdade pelo conteúdo especial que você cria, sem regras ou obrigações mensais.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white text-lg px-6 py-5 h-auto rounded-full group" asChild>
              <Link to="/cadastro">
                Liberte seu conteúdo
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
              <p className="text-xs md:text-sm text-gray-500">Taxa única. Só isso.</p>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-mimo-primary">PIX</div>
              <p className="text-xs md:text-sm text-gray-500">Dinheiro na hora</p>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-mimo-primary">R$100+</div>
              <p className="text-xs md:text-sm text-gray-500">Valor que você merece</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
