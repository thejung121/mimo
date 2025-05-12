
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Creator } from '@/types/creator';

interface ProfileBasicInfoSectionProps {
  creator: Creator;
  handleCreatorChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileBasicInfoSection: React.FC<ProfileBasicInfoSectionProps> = ({
  creator,
  handleCreatorChange
}) => {
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Replace spaces with dashes for URL compatibility
    const formattedUsername = e.target.value.replace(/\s+/g, '-');
    
    // Create a new event with the modified value
    const modifiedEvent = {
      ...e,
      target: {
        ...e.target,
        name: 'username',
        value: formattedUsername
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    handleCreatorChange(modifiedEvent);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
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
            onChange={handleUsernameChange}
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
            onChange={handleCreatorChange}
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
            onChange={handleCreatorChange}
            className="mimo-input resize-none"
            placeholder="Conte um pouco sobre você para seus fãs"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileBasicInfoSection;
