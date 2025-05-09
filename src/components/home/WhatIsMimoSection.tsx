
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
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-purple-50/30">
      <div className="mimo-container">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4 sm:px-0">
          <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
            Diferencial Mimo
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Uma troca justa e direta entre{isMobile ? " " : <br/>}criadoras e admiradores
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            É uma forma mais natural, espontânea e significativa de monetização. 
            Uma plataforma pensada para incentivar trocas genuínas, sem as barreiras e 
            complexidades das plataformas tradicionais.
          </p>
        </div>
        
        <div ref={featuresRef} className="grid md:grid-cols-3 gap-6 opacity-0 px-4 sm:px-0">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-gradient-to-br from-white to-green-50 group">
            <div className="h-2 bg-green-400"></div>
            <CardContent className="p-6 pt-8">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Sem rotina forçada</h3>
              <p className="text-gray-600 mb-6">
                Crie quando quiser, venda pelo que vale, e receba mimos que realmente 
                valorizam seu trabalho. Mimo é a chave para os seus conteúdos mais raros e exclusivos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Sem obrigação de assinatura</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Campanhas com propósito</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Conteúdos especiais</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-gradient-to-br from-white to-purple-50 group">
            <div className="h-2 bg-mimo-primary"></div>
            <CardContent className="p-6 pt-8">
              <div className="bg-mimo-primary/20 text-mimo-primary rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Taxa que respeita</h3>
              <p className="text-gray-600 mb-6">
                Taxa de apenas 10% e pagamento via PIX imediato. Seu trabalho merece ser valorizado, 
                e não sugado por intermediários gananciosos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>PIX na hora, sem esperar</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Apenas 10% de taxa</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Potencialize metas importantes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden bg-gradient-to-br from-white to-pink-50 group">
            <div className="h-2 bg-purple-400"></div>
            <CardContent className="p-6 pt-8">
              <div className="bg-purple-100 text-purple-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Conexões reais</h3>
              <p className="text-gray-600 mb-6">
                Experiências personalizadas que criam laços mais profundos. 
                Aqui, cada mimo é uma porta para conexões genuínas e duradouras.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Experiência personalizada</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Conexões mais significativas</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Valor, não volume</span>
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
