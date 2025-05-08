
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Twitter, Globe, Upload, Lock, Plus, Trash2 } from 'lucide-react';
import { Creator, SocialLink, MimoPackage, MediaItem } from '@/types/creator';
import MimoPackageForm from './MimoPackageForm';
import MediaUploader from './MediaUploader';
import MediaItemDisplay from './MediaItemDisplay';

interface UnifiedEditorSectionProps {
  creator: Creator;
  mimoPackages: MimoPackage[];
  coverPreview: string;
  avatarPreview: string;
  showNewPackageForm: boolean;
  newPackage: MimoPackage;
  onCreatorChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSocialLinkChange: (index: number, field: string, value: string) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFeature: () => void;
  onFeatureChange: (index: number, value: string) => void;
  onRemoveFeature: (index: number) => void;
  onPackageChange: (field: string, value: any) => void;
  onAddMedia: (packageId: number | null, media: MediaItem) => void;
  onRemoveMedia: (packageId: number | null, mediaId: number) => void;
  onTogglePreview: (packageId: number | null, mediaId: number) => void;
  onSavePackage: () => void;
  onDeletePackage: (id: number) => void;
  onEditPackage: (id: number) => void;
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// Using React.memo to prevent unnecessary re-renders
const UnifiedEditorSection = memo(({
  creator,
  mimoPackages,
  coverPreview,
  avatarPreview,
  showNewPackageForm,
  newPackage,
  onCreatorChange,
  onSocialLinkChange,
  onCoverChange,
  onAvatarChange,
  onAddFeature,
  onFeatureChange,
  onRemoveFeature,
  onPackageChange,
  onAddMedia,
  onRemoveMedia,
  onTogglePreview,
  onSavePackage,
  onDeletePackage,
  onEditPackage,
  setShowNewPackageForm,
}: UnifiedEditorSectionProps) => {

  return (
    <div className="space-y-8">
      {/* Cover Image Section */}
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
      
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Sua foto de perfil.</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Profile Information Section */}
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
      
      {/* Social Links Section */}
      <Card>
        <CardHeader>
          <CardTitle>Redes Sociais</CardTitle>
          <CardDescription>Conecte suas redes sociais para que seus fãs possam te acompanhar. Serão mostradas apenas as que estiverem preenchidas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {creator.socialLinks.map((link, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-md bg-muted">
                {link.type === 'instagram' && <Instagram className="h-5 w-5" />}
                {link.type === 'twitter' && <Twitter className="h-5 w-5" />}
                {link.type === 'website' && <Globe className="h-5 w-5" />}
                {link.type === 'privacy' && <Lock className="h-5 w-5" />}
              </div>
              
              <div className="flex-grow">
                <label className="text-sm text-muted-foreground mb-1 block">
                  {link.type === 'instagram' ? 'Instagram' : 
                   link.type === 'twitter' ? 'Twitter' : 
                   link.type === 'website' ? 'OnlyFans' : 
                   link.type === 'privacy' ? 'Privacy' : 'Link'}
                </label>
                <Input
                  value={link.url}
                  onChange={(e) => onSocialLinkChange(index, 'url', e.target.value)}
                  className="mimo-input"
                  placeholder={`Seu link do ${link.type}`}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Mimo Packages Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pacotes de Mimo</CardTitle>
          <CardDescription>Gerencie os pacotes que seus fãs podem adquirir para te enviar mimos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lista de pacotes existentes */}
          <div className="space-y-6">
            {mimoPackages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não tem nenhum pacote de mimo. Crie seu primeiro pacote!
              </p>
            )}
            
            {mimoPackages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-lg font-medium">{pkg.title}</h3>
                      {pkg.highlighted && (
                        <span className="bg-mimo-primary/10 text-mimo-primary text-xs px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                    </div>
                    
                    <p className="font-bold text-lg mb-2">R${pkg.price}</p>
                    
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="mr-2 text-mimo-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {pkg.features.length > 5 && (
                        <li className="text-xs text-muted-foreground">
                          +{pkg.features.length - 5} mais características
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPackage(pkg.id!)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePackage(pkg.id!)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Seção de mídia do pacote */}
                <div className="border-t bg-muted/50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Mídias do pacote</h4>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4">
                    {pkg.media.map((media) => (
                      <div key={media.id} className="w-24 md:w-auto flex-shrink-0">
                        <MediaItemDisplay
                          media={media}
                          onTogglePreview={() => onTogglePreview(pkg.id!, media.id)}
                          onRemove={() => onRemoveMedia(pkg.id!, media.id)}
                        />
                      </div>
                    ))}
                    
                    <div className="w-24 md:w-auto flex-shrink-0">
                      <MediaUploader onMediaAdd={(media) => onAddMedia(pkg.id!, media)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Formulário para adicionar novo pacote */}
          {!showNewPackageForm ? (
            <div className="flex justify-center">
              <Button
                onClick={() => setShowNewPackageForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Novo Pacote
              </Button>
            </div>
          ) : (
            <MimoPackageForm
              packageData={newPackage}
              onChange={onPackageChange}
              onFeatureChange={onFeatureChange}
              onAddFeature={onAddFeature}
              onRemoveFeature={onRemoveFeature}
              onSave={onSavePackage}
              onCancel={() => setShowNewPackageForm(false)}
              onAddMedia={(media) => onAddMedia(null, media)}
              onRemoveMedia={(mediaId) => onRemoveMedia(null, mediaId)}
              onTogglePreview={(mediaId) => onTogglePreview(null, mediaId)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
});

// Use displayName for better debugging
UnifiedEditorSection.displayName = 'UnifiedEditorSection';

export default UnifiedEditorSection;
