
import { useState } from 'react';
import { Creator, MimoPackage, MediaItem } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Mock data - inicialmente carregamos os dados do criador atual
const initialCreator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter', url: 'https://twitter.com/mariafernanda' },
    { type: 'youtube', url: 'https://youtube.com/mariafernanda' },
    { type: 'website', url: 'https://mariafernanda.com' }
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
    highlighted: false,
    media: []
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
    highlighted: true,
    media: [
      { 
        id: 1,
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        isPreview: true
      }
    ]
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
    highlighted: false,
    media: [
      { 
        id: 2,
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        isPreview: false
      },
      { 
        id: 3,
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        isPreview: true
      }
    ]
  }
];

export const useCreatorEditor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [creator, setCreator] = useState<Creator>(initialCreator);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>(initialMimoPackages);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(initialCreator.cover);
  const [avatarPreview, setAvatarPreview] = useState(initialCreator.avatar);
  const [showPreview, setShowPreview] = useState(false);
  
  // Estado para novo pacote de mimo
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({
    title: '',
    price: 0,
    features: [''],
    highlighted: false,
    media: []
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
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para adicionar mídia ao pacote
  const handleAddMedia = (packageId: number | null, media: MediaItem) => {
    if (packageId === null) {
      // Adicionando mídia ao novo pacote
      setNewPackage(prev => ({
        ...prev,
        media: [...prev.media, media]
      }));
    } else {
      // Adicionando mídia a um pacote existente
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: [...pkg.media, media] 
        } : pkg
      ));
    }
    
    toast({
      title: "Mídia adicionada",
      description: "A mídia foi adicionada ao pacote com sucesso.",
    });
  };

  // Handler para remover mídia do pacote
  const handleRemoveMedia = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      // Removendo mídia do novo pacote
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
    } else {
      // Removendo mídia de um pacote existente
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: pkg.media.filter(m => m.id !== mediaId) 
        } : pkg
      ));
    }
    
    toast({
      title: "Mídia removida",
      description: "A mídia foi removida do pacote com sucesso.",
    });
  };

  // Handler para definir uma mídia como preview
  const handleTogglePreview = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      // Alternando preview no novo pacote
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.map(m => ({
          ...m,
          isPreview: m.id === mediaId ? !m.isPreview : m.isPreview
        }))
      }));
    } else {
      // Alternando preview em um pacote existente
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: pkg.media.map(m => ({
            ...m,
            isPreview: m.id === mediaId ? !m.isPreview : m.isPreview
          }))
        } : pkg
      ));
    }
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
    const newId = Math.max(0, ...mimoPackages.map(p => p.id || 0)) + 1;
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
      highlighted: false,
      media: []
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
      setNewPackage({...packageToEdit});
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

  return {
    creator,
    mimoPackages,
    coverPreview,
    avatarPreview,
    showPreview,
    showNewPackageForm,
    newPackage,
    handleCreatorChange,
    handleSocialLinkChange,
    handleCoverChange,
    handleAvatarChange,
    handleSaveProfile,
    handleAddFeature,
    handleFeatureChange,
    handleRemoveFeature,
    handlePackageChange,
    handleAddMedia,
    handleRemoveMedia,
    handleTogglePreview,
    handleSavePackage,
    handleDeletePackage,
    handleEditPackage,
    handleSaveAll,
    setShowNewPackageForm,
    setShowPreview
  };
};
