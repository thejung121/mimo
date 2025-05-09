
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
            Desperte o valor do seu conteúdo
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Uma jornada além das assinaturas{isMobile ? " " : <br/>}regulares
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Aquele conteúdo especial merece mais do que uma simples assinatura mensal.
            Com o Mimo, você oferece experiências exclusivas enquanto seus fãs expressam
            seu apoio de forma mais significativa.
          </p>
        </div>
        
        <div ref={featuresRef} className="grid md:grid-cols-3 gap-6 opacity-0 px-4 sm:px-0">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow rounded-xl overflow-hidden group">
            <div className="h-2 bg-green-400"></div>
            <CardContent className="p-6 pt-8">
              <div className="bg-green-100 text-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Além do ordinário</h3>
              <p className="text-gray-600 mb-6">
                Liberte seu melhor conteúdo das limitações das assinaturas mensais.
                Crie experiências premium que refletem seu verdadeiro valor.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Valorização justa do seu trabalho</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Liberdade criativa sem pressão</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Produtos de alto valor percebido</span>
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
              <h3 className="font-semibold text-xl mb-3">Caminho para liberdade</h3>
              <p className="text-gray-600 mb-6">
                Transforme seus objetivos financeiros em realidade com uma receita 
                adicional que respeita seus limites e valoriza sua autonomia.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>PIX instantâneo, sem esperas</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Taxa que respeita seu trabalho</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Potencialize metas importantes</span>
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
              <h3 className="font-semibold text-xl mb-3">Conexões autênticas</h3>
              <p className="text-gray-600 mb-6">
                Construa relações genuínas baseadas na troca de valor real, sem
                as barreiras artificiais que distanciam você de quem realmente aprecia seu trabalho.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Experiências memoráveis</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Engajamento mais profundo</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Fidelização natural</span>
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
