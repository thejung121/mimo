
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
              Integração Perfeita
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Coexistência com suas plataformas atuais
            </h2>
          </div>
          
          <Card className="border-none shadow-lg p-6">
            <CardContent className="p-0">
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Não precisa abandonar sua plataforma atual! Mimo foi desenhado para coexistir e
                  complementar sua presença em plataformas como Privacy e OnlyFans.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Integração complementar
                    </h4>
                    <p>"Use a Privacy para o conteúdo de sempre. Use o Mimo para quem quer te presentear de verdade."</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Valores emocionais maiores
                    </h4>
                    <p>O Mimo é para conteúdos especiais com valor emocional maior, que não cabem numa assinatura mensal.</p>
                  </div>
                </div>
                
                <div className="bg-mimo-primary/5 border border-mimo-primary/20 rounded-lg p-4 mb-6">
                  <p className="italic">
                    "O Mimo não veio para substituir, mas para potencializar suas fontes de renda. 
                    Continue com suas assinaturas mensais e adicione essa nova fonte de receita para 
                    conteúdos especiais e diferenciados."
                  </p>
                </div>
                
                <p>
                  Direcione seus fãs para as plataformas certas: cada uma tem seu propósito. 
                  O Mimo é o canhão extra para quando você quiser alcançar metas financeiras específicas.
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
