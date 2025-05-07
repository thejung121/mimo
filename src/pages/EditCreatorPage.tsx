
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Instagram, Twitter, Youtube, Globe, Plus, Settings, Heart, DollarSign, Upload, Trash2 } from 'lucide-react';
import MimoPackageForm from '@/components/MimoPackageForm';

// Mock data - inicialmente carregamos os dados do criador atual
const initialCreator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram' as const, url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter' as const, url: 'https://twitter.com/mariafernanda' },
    { type: 'website' as const, url: 'https://mariafernanda.com' }
  ]
};

// Mock dos pacotes de mimo existentes
const initialMimoPackages = [
  {
    id: 1,
    title: 'Mimo Básico',
    price: 20,
    features: [
      'Foto exclusiva',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: false
  },
  {
    id: 2,
    title: 'Mimo Especial',
    price: 50,
    features: [
      'Set com 3 fotos exclusivas',
      'Vídeo de agradecimento',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: true
  },
  {
    id: 3,
    title: 'Mimo Premium',
    price: 100,
    features: [
      'Set com 5 fotos exclusivas',
      'Vídeo personalizado',
      'Resposta a 3 perguntas',
      'Mensagem personalizada',
      'Acesso por 30 dias'
    ],
    highlighted: false
  }
];

const EditCreatorPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [creator, setCreator] = useState(initialCreator);
  const [mimoPackages, setMimoPackages] = useState(initialMimoPackages);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initialCreator.cover);
  const [avatarPreview, setAvatarPreview] = useState(initialCreator.avatar);
  
  // Estado para novo pacote de mimo
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState({
    title: '',
    price: 0,
    features: [''],
    highlighted: false
  });

  // Handler para atualizar o criador
  const handleCreatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCreator(prev => ({ ...prev, [name]: value }));
  };

  // Handlers para links sociais
  const handleSocialLinkChange = (index: number, field: string, value: string) => {
    const updatedSocialLinks = [...creator.socialLinks];
    updatedSocialLinks[index] = { 
      ...updatedSocialLinks[index], 
      [field]: value 
    };
    setCreator(prev => ({ ...prev, socialLinks: updatedSocialLinks }));
  };

  // Handler para o upload da imagem de capa
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para o upload da imagem de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para salvar o perfil do criador
  const handleSaveProfile = () => {
    // Aqui você implementaria a lógica para salvar no backend
    console.log("Salvando perfil:", creator);
    console.log("Arquivos para upload:", { cover: coverFile, avatar: avatarFile });
    
    toast({
      title: "Perfil salvo com sucesso!",
      description: "As alterações no seu perfil foram salvas.",
    });
  };

  // Handler para adicionar característica ao novo pacote
  const handleAddFeature = () => {
    setNewPackage(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Handler para atualizar uma característica no novo pacote
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newPackage.features];
    updatedFeatures[index] = value;
    setNewPackage(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handler para remover uma característica do novo pacote
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = newPackage.features.filter((_, i) => i !== index);
    setNewPackage(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handler para alterações nos campos do novo pacote
  const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewPackage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'price' ? Number(value) : value
    }));
  };

  // Handler para salvar um novo pacote
  const handleSavePackage = () => {
    // Validações básicas
    if (!newPackage.title.trim()) {
      toast({
        title: "Título obrigatório",
        description: "Por favor, insira um título para o pacote.",
        variant: "destructive"
      });
      return;
    }

    if (newPackage.price <= 0) {
      toast({
        title: "Preço inválido",
        description: "Por favor, insira um preço válido maior que zero.",
        variant: "destructive"
      });
      return;
    }

    // Filtra características vazias
    const filteredFeatures = newPackage.features.filter(feature => feature.trim());
    if (filteredFeatures.length === 0) {
      toast({
        title: "Características obrigatórias",
        description: "Por favor, insira ao menos uma característica para o pacote.",
        variant: "destructive"
      });
      return;
    }

    // Cria novo pacote com ID único
    const newId = Math.max(0, ...mimoPackages.map(p => p.id)) + 1;
    const packageToAdd = {
      ...newPackage,
      id: newId,
      features: filteredFeatures
    };

    // Adiciona o novo pacote à lista
    setMimoPackages(prev => [...prev, packageToAdd]);
    
    // Limpa o formulário e esconde
    setNewPackage({
      title: '',
      price: 0,
      features: [''],
      highlighted: false
    });
    
    setShowNewPackageForm(false);
    
    toast({
      title: "Pacote adicionado com sucesso!",
      description: `O pacote "${packageToAdd.title}" foi adicionado à sua lista.`,
    });
  };

  // Handler para excluir um pacote existente
  const handleDeletePackage = (id: number) => {
    setMimoPackages(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Pacote excluído",
      description: "O pacote foi removido da sua lista.",
    });
  };

  // Handler para editar um pacote existente
  const handleEditPackage = (id: number) => {
    const packageToEdit = mimoPackages.find(p => p.id === id);
    if (packageToEdit) {
      setNewPackage(packageToEdit);
      setShowNewPackageForm(true);
      
      // Remove o pacote da lista enquanto está sendo editado
      setMimoPackages(prev => prev.filter(p => p.id !== id));
    }
  };

  // Handler para salvar todas as alterações
  const handleSaveAll = () => {
    // Aqui você implementaria a lógica para salvar tudo no backend
    console.log("Salvando todas as alterações:", { creator, mimoPackages });
    
    toast({
      title: "Alterações salvas com sucesso!",
      description: "Todas as suas alterações foram salvas.",
    });
    
    // Navegar para o dashboard após salvar
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Editar Minha Página</h1>
            <Button 
              className="mimo-button"
              onClick={handleSaveAll}
            >
              Salvar Alterações
            </Button>
          </div>
          
          <Tabs defaultValue="profile" className="mb-8">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Perfil
              </TabsTrigger>
              <TabsTrigger value="packages" className="flex items-center gap-2">
                <Heart className="h-4 w-4" /> Pacotes de Mimo
              </TabsTrigger>
            </TabsList>
            
            {/* Tab de Perfil */}
            <TabsContent value="profile" className="space-y-6">
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
                            onChange={handleCoverChange}
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
                              onChange={handleAvatarChange}
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
                        onChange={handleCreatorChange}
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
                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                        className="mimo-input"
                        placeholder={`Seu link do ${link.type}`}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
                  className="mimo-button"
                >
                  Salvar Informações do Perfil
                </Button>
              </div>
            </TabsContent>
            
            {/* Tab de Pacotes de Mimo */}
            <TabsContent value="packages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seus Pacotes de Mimo</CardTitle>
                  <CardDescription>
                    Gerencie os pacotes que seus fãs podem adquirir para te enviar mimos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Lista de pacotes existentes */}
                  <div className="space-y-4">
                    {mimoPackages.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Você ainda não tem nenhum pacote de mimo. Crie seu primeiro pacote!
                      </p>
                    )}
                    
                    {mimoPackages.map((pkg) => (
                      <div key={pkg.id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium">{pkg.title}</h3>
                            {pkg.highlighted && (
                              <span className="bg-mimo-primary/10 text-mimo-primary text-xs px-2 py-1 rounded">
                                Destacado
                              </span>
                            )}
                          </div>
                          
                          <p className="font-bold text-lg mb-2">R${pkg.price}</p>
                          
                          <ul className="space-y-1">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm">
                                <span className="mr-2 text-mimo-primary">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPackage(pkg.id)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle>Novo Pacote de Mimo</CardTitle>
                        <CardDescription>
                          Defina as características e preço do seu novo pacote.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Título do pacote
                            </label>
                            <Input
                              name="title"
                              value={newPackage.title}
                              onChange={handlePackageChange}
                              placeholder="ex: Mimo Básico"
                              className="mimo-input"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Preço (R$)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                                type="number"
                                name="price"
                                value={newPackage.price}
                                onChange={handlePackageChange}
                                className="pl-10 mimo-input"
                                min={1}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium">
                              Características do pacote
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleAddFeature}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Adicionar
                            </Button>
                          </div>
                          
                          {newPackage.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                placeholder="ex: Foto exclusiva"
                                className="mimo-input"
                              />
                              
                              {newPackage.features.length > 1 && (
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRemoveFeature(index)}
                                  className="text-destructive hover:text-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="highlighted"
                            name="highlighted"
                            checked={newPackage.highlighted}
                            onChange={handlePackageChange}
                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="highlighted" className="text-sm">
                            Destacar este pacote na lista (recomendado)
                          </label>
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowNewPackageForm(false);
                              setNewPackage({
                                title: '',
                                price: 0,
                                features: [''],
                                highlighted: false
                              });
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="mimo-button"
                            onClick={handleSavePackage}
                          >
                            Salvar Pacote
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  className="mimo-button"
                  onClick={handleSaveAll}
                >
                  Salvar Todos os Pacotes
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditCreatorPage;
