
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram, Twitter, Globe, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const {
    creator,
    coverPreview,
    avatarPreview,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile
  } = useCreatorProfile();
  
  const { toast } = useToast();

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

  const handleSubmit = async () => {
    await handleSaveProfile();
    toast({
      title: "Perfil atualizado",
      description: "Seu perfil foi atualizado com sucesso."
    });
  };

  // Get social links by type
  const getSocialLink = (type: string) => {
    return creator.socialLinks.find(link => link.type === type) || { type, url: '' };
  };

  const instagramLink = getSocialLink('instagram');
  const twitterLink = getSocialLink('twitter');
  const twitchLink = getSocialLink('twitch');
  const onlyfansLink = getSocialLink('onlyfans');
  const privacyLink = getSocialLink('privacy');

  // Get index of each social link
  const getIndexOfSocialLink = (type: string) => {
    return creator.socialLinks.findIndex(link => link.type === type);
  };

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
        
        <div className="space-y-6">
          {/* Cover Image Section */}
          <Card>
            <CardHeader>
              <CardTitle>Imagem de Capa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 md:h-60 rounded-md overflow-hidden mb-4">
                <img
                  src={coverPreview || creator.cover || '/placeholder.svg'}
                  alt="Imagem de capa"
                  className="w-full h-full object-cover"
                />
              </div>
              <Input 
                id="cover-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleCoverChange}
                className="w-full"
              />
            </CardContent>
          </Card>
          
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
                  <img
                    src={avatarPreview || creator.avatar || '/placeholder.svg'}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Basic Info Section */}
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
          
          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium mb-1">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </label>
                <Input
                  value={instagramLink.url}
                  onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('instagram'), 'url', e.target.value)}
                  className="mimo-input"
                  placeholder="https://instagram.com/seuusuario"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium mb-1">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </label>
                <Input
                  value={twitterLink.url}
                  onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('twitter'), 'url', e.target.value)}
                  className="mimo-input"
                  placeholder="https://twitter.com/seuusuario"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium mb-1">
                  <Globe className="h-4 w-4 mr-2" />
                  Twitch
                </label>
                <Input
                  value={twitchLink.url}
                  onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('twitch'), 'url', e.target.value)}
                  className="mimo-input"
                  placeholder="https://twitch.tv/seuusuario"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium mb-1">
                  <Globe className="h-4 w-4 mr-2" />
                  OnlyFans
                </label>
                <Input
                  value={onlyfansLink.url}
                  onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('onlyfans'), 'url', e.target.value)}
                  className="mimo-input"
                  placeholder="https://onlyfans.com/seuusuario"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium mb-1">
                  <Lock className="h-4 w-4 mr-2" />
                  Privacy
                </label>
                <Input
                  value={privacyLink.url}
                  onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('privacy'), 'url', e.target.value)}
                  className="mimo-input"
                  placeholder="https://privacy.app/seuusuario"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground">
              Atualize suas informações de perfil
            </p>
            <Button onClick={handleSubmit} className="mimo-button">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
