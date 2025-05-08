
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubscriptionOption {
  id: string;
  title: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
}

interface SubscriptionTabContentProps {
  subscriptionOptions: SubscriptionOption[];
  onSelectSubscription: (option: SubscriptionOption) => void;
}

const SubscriptionTabContent = ({ subscriptionOptions, onSelectSubscription }: SubscriptionTabContentProps) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {subscriptionOptions.map((option) => (
          <Card 
            key={option.id} 
            className={cn(
              "overflow-hidden relative rounded-2xl transition-all duration-300 hover:shadow-lg",
              option.popular ? 
                "border-2 border-mimo-primary shadow-lg shadow-mimo-primary/20" : 
                "border border-gray-200 hover:border-mimo-primary/50"
            )}
          >
            {option.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-to-r from-mimo-primary to-mimo-secondary text-white text-xs uppercase font-bold py-1 px-3 rounded-bl-lg">
                  Recomendado
                </div>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
              <div className="mb-5">
                <p className="text-3xl font-bold text-mimo-primary inline-block">
                  R${option.price.toFixed(2).replace('.', ',')}
                </p>
                <span className="text-sm text-gray-500 font-normal ml-1">/{option.period}</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={cn(
                  "w-full transition-all",
                  option.popular ? 
                    "bg-gradient-to-r from-mimo-primary to-mimo-secondary hover:from-mimo-primary/90 hover:to-mimo-secondary/90 text-white" : 
                    "bg-white text-mimo-primary border-2 border-mimo-primary hover:bg-mimo-primary/10"
                )}
                onClick={() => onSelectSubscription(option)}
              >
                <Star className="mr-1 h-4 w-4" />
                Assinar agora
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" fill="#eab308" />
          Vantagens da assinatura
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Acesso exclusivo a conteúdos premium que não são disponibilizados em mimos</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Interação direta e priorizada com a criadora</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Descontos exclusivos na compra de mimos individuais</span>
          </li>
          <li className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">Acesso antecipado a novos conteúdos e projetos</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default SubscriptionTabContent;
