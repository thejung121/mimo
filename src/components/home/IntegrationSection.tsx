
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from 'lucide-react';

interface IntegrationSectionProps {
  integrationRef: React.RefObject<HTMLDivElement>;
}

const IntegrationSection = ({ integrationRef }: IntegrationSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-purple-50/30 to-white">
      <div className="mimo-container">
        <div ref={integrationRef} className="max-w-3xl mx-auto mb-12 md:mb-16 px-4 sm:px-0 opacity-0">
          <div className="text-center">
            <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
              Liberdade criativa
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Use junto com o que já funciona para você
            </h2>
          </div>
          
          <Card className="border-none shadow-lg p-6 bg-gradient-to-r from-white to-purple-50/20 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Mantenha seu Instagram, seu OnlyFans, seu Patreon. O Mimo não substitui — complementa 
                  quando você quer entregar algo especial que merece ser verdadeiramente valorizado.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/80 rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Integração harmoniosa
                    </h4>
                    <p>Seu conteúdo cotidiano continua onde está. Mimo é para momentos especiais, 
                    ideias brilhantes, projetos únicos que merecem mais que um valor fixo mensal.</p>
                  </div>
                  
                  <div className="bg-white/80 rounded-lg border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Valor que você define
                    </h4>
                    <p>Aquele e-book transformador, aquela mentoria valiosa, aquele projeto único — 
                    tudo isso merece um mimo, não uma assinatura genérica.</p>
                  </div>
                </div>
                
                <div className="bg-mimo-primary/5 border border-mimo-primary/20 rounded-lg p-5 mb-6 shadow-inner">
                  <p className="italic">
                    "Mimo é a plataforma onde suas melhores ideias encontram a valorização que merecem — 
                    sem intermediários mordendo a maior parte ou regras que limitam sua criatividade."
                  </p>
                </div>
                
                <p className="text-lg">
                  A Mimo existe para os momentos especiais de sua jornada criativa. 
                  Para quando você quer que seu trabalho seja reconhecido pelo verdadeiro valor 
                  que oferece — direto de você para quem realmente aprecia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
