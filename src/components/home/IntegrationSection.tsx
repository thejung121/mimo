
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
              Universo expandido
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Potencialize seu ecossistema digital
            </h2>
          </div>
          
          <Card className="border-none shadow-lg p-6">
            <CardContent className="p-0">
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg mb-6">
                  Seu público já está em diversas plataformas — e o Mimo não veio para substituí-las,
                  mas para completar seu arsenal de monetização com uma ferramenta poderosa.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Coexistência harmoniosa
                    </h4>
                    <p>Use as assinaturas para a rotina, e o Mimo para os momentos em que seu trabalho 
                    merece uma valorização especial.</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="font-medium text-lg mb-3 text-mimo-primary flex items-center">
                      <Check className="h-5 w-5 mr-2" />
                      Conexões significativas
                    </h4>
                    <p>Crie experiências que transcendem o transacional, onde seu conteúdo especial encontra
                    o reconhecimento merecido.</p>
                  </div>
                </div>
                
                <div className="bg-mimo-primary/5 border border-mimo-primary/20 rounded-lg p-4 mb-6">
                  <p className="italic">
                    "Não é sobre escolher um ou outro — é sobre criar uma estratégia completa
                    onde cada plataforma cumpre seu papel. Quando seu projeto exige aquele algo a mais,
                    é aí que o Mimo entra."
                  </p>
                </div>
                
                <p>
                  Cada interação tem seu lugar. Ofereça o conteúdo regular onde já está 
                  funcionando, e utilize o Mimo como seu canal premium para momentos especiais 
                  e oportunidades extraordinárias.
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
