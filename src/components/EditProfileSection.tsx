
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Twitter, Youtube, Globe, Upload } from 'lucide-react';
import { Creator, SocialLink } from '@/types/creator';

interface EditProfileSectionProps {
  creator: Creator;
  coverPreview: string;
  avatarPreview: string;
  onCreatorChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSocialLinkChange: (index: number, field: string, value: string) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveProfile: () => void;
}

const EditProfileSection: React.FC<EditProfileSectionProps> = ({
  creator,
  coverPreview,
  avatarPreview,
  onCreatorChange,
  onSocialLinkChange,
  onCoverChange,
  onAvatarChange,
  onSaveProfile
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Imagens do Perfil</CardTitle>
          <CardDescription>Atualize sua imagem de perfil e capa da página.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload da imagem de capa */}
          <div>
            <h3 className="text-lg font-medium mb-3">Imagem de Capa</h3>
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
            
            {/* Upload do avatar */}
            <h3 className="text-lg font-medium mb-3">Avatar</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className="w-24 h-24 object-cover rounded-full"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                  <label className="cursor-pointer bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                    <Upload className="h-5 w-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={onAvatarChange}
                    />
                  </label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Clique na imagem para fazer upload de uma nova foto de perfil.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Edite as informações do seu perfil de criador.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
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
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>Conecte suas redes sociais para que seus fãs possam te acompanhar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {creator.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-md bg-muted">
                {link.type === 'instagram' && <Instagram className="h-5 w-5" />}
                {link.type === 'twitter' && <Twitter className="h-5 w-5" />}
                {link.type === 'youtube' && <Youtube className="h-5 w-5" />}
                {link.type === 'website' && <Globe className="h-5 w-5" />}
              </div>
              
              <Input
                value={link.url}
                onChange={(e) => onSocialLinkChange(index, 'url', e.target.value)}
                className="mimo-input"
                placeholder={`Seu link do ${link.type}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={onSaveProfile}
          className="mimo-button"
        >
          Salvar Informações do Perfil
        </Button>
      </div>
    </>
  );
};

export default EditProfileSection;
