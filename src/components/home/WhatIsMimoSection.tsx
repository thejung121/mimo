
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Heart, Sparkles, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WhatIsMimoSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

const WhatIsMimoSection = ({ featuresRef }: WhatIsMimoSectionProps) => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mimo-container">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4 sm:px-0">
          <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
            Chega de migalhas
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Seu talento vale mais que{isMobile ? " " : <br/>}uma assinatura de R$19,90
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Enquanto plataformas tradicionais te forçam a produzir sem parar para manter migalhas mensais, 
            o Mimo te liberta para criar quando quiser e receber o que seu trabalho realmente merece.
          </p>
        </div>
        
        <div ref={featuresRef} className="grid md:grid-cols-3 gap-6 opacity-0 px-4 sm:px-0">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
            <div className="h-2 bg-green-400"></div>
            <CardContent className="p-6 pt-8">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Sem rotina forçada</h3>
              <p className="text-gray-600 mb-6">
                Adeus pressão mensal por conteúdo. Crie quando quiser, 
                venda pelo que vale, e receba mimos que realmente valorizam seu trabalho.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Sem obrigação de cronograma</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Venda pelo valor justo</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Crie apenas o que te inspira</span>
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
              <h3 className="font-semibold text-xl mb-3">Dinheiro de verdade</h3>
              <p className="text-gray-600 mb-6">
                Receba R$100, R$300, R$500 por vez. Esqueça os trocados mensais 
                que mal pagam um café depois que a plataforma abocanha sua parte.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>PIX na hora, sem esperar o mês fechar</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Só 10% de taxa (não os 30% de sempre)</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Realize projetos que importam pra você</span>
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
              <h3 className="font-semibold text-xl mb-3">Conexão real</h3>
              <p className="text-gray-600 mb-6">
                Saia do relacionamento superficial com seu público. Um mimo é uma troca genuína 
                entre quem realmente valoriza seu trabalho e você.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Recompensas que fazem sentido</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Menos fãs, mais valor por fã</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Construa uma comunidade de verdade</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhatIsMimoSection;
