
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';

interface HowItWorksSectionProps {
  howItWorksRef: React.RefObject<HTMLDivElement>;
}

const HowItWorksSection = ({ howItWorksRef }: HowItWorksSectionProps) => {
  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="mimo-container">
        <div className="text-center mb-12 md:mb-16 px-4 sm:px-0">
          <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
            Simplicidade que transforma
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Três passos para decolar
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Sem burocracias, sem esperas, sem complicações. Uma jornada desenhada para
            priorizar o que realmente importa: sua criação e seu público.
          </p>
        </div>
        
        <div ref={howItWorksRef} className="grid md:grid-cols-2 gap-12 items-center px-4 sm:px-0 opacity-0">
          <div>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Defina seu universo</h3>
                  <p className="text-gray-600 mb-3">
                    Construa seu espaço com sua identidade e defina experiências 
                    exclusivas que só você pode oferecer. Sem fórmulas, seu estilo.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Visual que reflete sua essência</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Offerings personalizados</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Integração com seu ecossistema</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-purple-100 text-purple-600 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Amplifique</h3>
                  <p className="text-gray-600 mb-3">
                    Leve sua proposta ao mundo com um link personalizado que 
                    conecta seus admiradores diretamente ao que você tem a oferecer.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Sua marca no endereço</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Visibilidade estratégica</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Promoção orgânica</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-mimo-primary/20 text-mimo-primary rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Realize</h3>
                  <p className="text-gray-600 mb-3">
                    Quando alguém reconhece o valor do seu trabalho, o PIX chega instantaneamente
                    e você entrega a experiência sem intermediários ou atrasos.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Transferência imediata</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Taxa justa de apenas 10%</span>
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Autonomia financeira real</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-mimo-primary to-mimo-secondary rounded-xl p-1 shadow-xl hidden md:block">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-64 relative overflow-hidden">
                <div className="absolute top-4 left-4 right-4 h-32 bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-3 w-16 bg-gray-100 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                  <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="bg-white rounded p-2 shadow-sm">
                    <div className="h-16 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-5 w-1/2 bg-mimo-primary/20 rounded"></div>
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <div className="h-16 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-5 w-1/2 bg-mimo-primary/40 rounded"></div>
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <div className="h-16 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
                    <div className="h-5 w-1/2 bg-mimo-primary/60 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-5 w-16 bg-mimo-primary/30 rounded"></div>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded mb-2"></div>
                <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
                <div className="mt-4 h-10 rounded-lg bg-gradient-to-r from-mimo-primary/80 to-mimo-secondary/80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
