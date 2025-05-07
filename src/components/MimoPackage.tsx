
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface MimoPackageProps {
  title: string;
  price: number;
  features: string[];
  highlighed?: boolean;
  onClick: () => void;
}

const MimoPackage = ({ title, price, features, highlighed = false, onClick }: MimoPackageProps) => {
  return (
    <div 
      className={`mimo-card ${
        highlighed 
          ? 'border-mimo-primary shadow-lg shadow-mimo-primary/20 scale-105' 
          : 'hover:border-mimo-primary/50'
      }`}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold">R${price}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-mimo-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={onClick}
          className={highlighed ? "w-full mimo-button" : "w-full bg-card text-foreground border border-border hover:border-mimo-primary hover:text-mimo-primary"}
        >
          Escolher
        </Button>
      </div>
    </div>
  );
};

export default MimoPackage;
