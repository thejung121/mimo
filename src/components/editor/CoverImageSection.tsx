
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CoverImageSectionProps {
  coverPreview: string;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoverImageSection = ({ coverPreview, onCoverChange }: CoverImageSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagem de Capa</CardTitle>
        <CardDescription>A imagem principal da sua página.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <img 
            src={coverPreview} 
            alt="Capa" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
            <label className="cursor-pointer bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors">
              Alterar Imagem
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onCoverChange}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoverImageSection;
