
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, FileImage } from 'lucide-react';

interface MimoPackageProps {
  title: string;
  price: number;
  features: string[];
  highlighted?: boolean;
  previewImageUrl?: string;
  onClick: () => void;
}

const MimoPackage = ({ title, price, features, highlighted = false, previewImageUrl, onClick }: MimoPackageProps) => {
  return (
    <div 
      className={`mimo-card ${
        highlighted 
          ? 'border-mimo-primary shadow-lg shadow-mimo-primary/20 scale-105' 
          : 'hover:border-mimo-primary/50'
      }`}
    >
      {/* Preview image */}
      <div className="mb-2 rounded-t-lg overflow-hidden h-40 bg-muted">
        {previewImageUrl ? (
          <img 
            src={previewImageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <FileImage className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        
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
          className={highlighted ? "w-full mimo-button" : "w-full bg-card text-foreground border border-border hover:border-mimo-primary hover:text-mimo-primary"}
        >
          Enviar R${price} de Mimo
        </Button>
      </div>
    </div>
  );
};

export default MimoPackage;
