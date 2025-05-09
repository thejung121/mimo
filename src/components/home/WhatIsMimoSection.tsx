
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  );
};

export default WhatIsMimoSection;
