
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Creator } from '@/types/creator';

interface BasicInfoSectionProps {
  creator: Creator;
  onCreatorChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoSection = ({ creator, onCreatorChange }: BasicInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Edite as informações do seu perfil de criador.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Nome de usuário
          </label>
          <Input
            id="username"
            name="username"
            value={creator.username}
            onChange={onCreatorChange}
            className="mimo-input"
            placeholder="Seu nome de usuário único"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Este será o link da sua página: mimo.app/criador/<strong>{creator.username}</strong>
          </p>
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome de exibição
          </label>
          <Input
            id="name"
            name="name"
            value={creator.name}
            onChange={onCreatorChange}
            className="mimo-input"
            placeholder="Seu nome ou apelido"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Bio / Descrição
          </label>
          <Textarea
            id="description"
            name="description"
            value={creator.description}
            onChange={onCreatorChange}
            className="mimo-input resize-none"
            placeholder="Conte um pouco sobre você para seus fãs"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
