
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from 'lucide-react';

interface IntegrationSectionProps {
  integrationRef: React.RefObject<HTMLDivElement>;
}

const IntegrationSection = ({ integrationRef }: IntegrationSectionProps) => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="mimo-container">
        <div ref={integrationRef} className="max-w-3xl mx-auto mb-12 md:mb-16 px-4 sm:px-0 opacity-0">
          <div className="text-center">
            <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
              Sem exclusividade
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Use junto com o que já funciona pra você
            </h2>
          </div>
          
          <Card className="border-none shadow-lg p-6">
            <CardContent className="p-0">
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Continua com seu Instagram, seu Onlyfans, seu Patreon. O Mimo não é substituto — 
                  é a cereja do bolo quando você quer entregar algo especial que merece mais.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Integra com o que já existe
                    </h4>
                    <p>Seu conteúdo rotineiro continua onde está. Mimo é para quando você quer criar
                    algo extraordinário, que merece mais que um preço mensal fixo.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Momentos que valem mais
                    </h4>
                    <p>Aquele e-book especial, aquela mentoria poderosa, aquele projeto único — 
                    tudo isso merece um mimo, não uma assinatura genérica.</p>
                  </div>
                </div>
                
                <div className="bg-mimo-primary/5 border border-mimo-primary/20 rounded-lg p-4 mb-6">
                  <p className="italic">
                    "Não tô aqui pra acabar com suas assinaturas mensais — tô aqui pra quando você 
                    criar algo tão bom que seria um desperdício jogar no meio do seu conteúdo comum."
                  </p>
                </div>
                
                <p>
                  Mimo é a plataforma para momentos especiais, não pra rotina. É pra quando você quer que
                  seu conteúdo seja valorizado pelo que realmente vale — sem intermediários abocanhando a maior parte.
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
