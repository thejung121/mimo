
import { useState } from 'react';
import { MimoPackage, MediaItem } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';

// Initial mimo packages data
const initialMimoPackages: MimoPackage[] = [
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
        caption: 'Ensaio exclusivo',
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
        caption: 'Conteúdo exclusivo',
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

const emptyPackage: MimoPackage = {
  title: '',
  price: 0,
  features: [''],
  highlighted: false,
  media: []
};

export const useMimoPackages = () => {
  const { toast } = useToast();
  
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>(initialMimoPackages);
  const [showNewPackageForm, setShowNewPackageForm] = useState(false);
  const [newPackage, setNewPackage] = useState<MimoPackage>({...emptyPackage});

  // Handler to add a feature to a new package
  const handleAddFeature = () => {
    setNewPackage(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Handler to update a feature in a new package
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...newPackage.features];
    updatedFeatures[index] = value;
    setNewPackage(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handler to remove a feature from a new package
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = newPackage.features.filter((_, i) => i !== index);
    setNewPackage(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handler for changes in the fields of the new package
  const handlePackageChange = (field: string, value: any) => {
    setNewPackage(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler to add media to the package
  const handleAddMedia = (packageId: number | null, media: MediaItem) => {
    if (packageId === null) {
      // Adding media to the new package
      setNewPackage(prev => ({
        ...prev,
        media: [...prev.media, media]
      }));
    } else {
      // Adding media to an existing package
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: [...pkg.media, media] 
        } : pkg
      ));
    }
    
    toast({
      title: "Mídia adicionada",
      description: `${media.type === 'image' ? 'Imagem' : media.type === 'video' ? 'Vídeo' : 'Áudio'} adicionado(a) ao pacote com sucesso.`,
    });
  };

  // Handler to remove media from the package
  const handleRemoveMedia = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      // Removing media from the new package
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
    } else {
      // Removing media from an existing package
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

  // Handler to set media as preview
  const handleTogglePreview = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      // Toggling preview in the new package
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.map(m => ({
          ...m,
          isPreview: m.id === mediaId ? !m.isPreview : m.isPreview
        }))
      }));
    } else {
      // Toggling preview in an existing package
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

  // Handler to save a new package
  const handleSavePackage = () => {
    // Basic validations
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

    // Filter empty features
    const filteredFeatures = newPackage.features.filter(feature => feature.trim());
    if (filteredFeatures.length === 0) {
      toast({
        title: "Características obrigatórias",
        description: "Por favor, insira ao menos uma característica para o pacote.",
        variant: "destructive"
      });
      return;
    }

    // Create a new package with a unique ID
    const newId = Math.max(0, ...mimoPackages.map(p => p.id || 0)) + 1;
    const packageToAdd = {
      ...newPackage,
      id: newId,
      features: filteredFeatures
    };

    // Add the new package to the list
    setMimoPackages(prev => [...prev, packageToAdd]);
    
    // Clean the form and hide it
    setNewPackage({...emptyPackage});
    setShowNewPackageForm(false);
    
    toast({
      title: "Pacote adicionado com sucesso!",
      description: `O pacote "${packageToAdd.title}" foi adicionado à sua lista.`,
    });
  };

  // Handler to delete an existing package
  const handleDeletePackage = (id: number) => {
    setMimoPackages(prev => prev.filter(p => p.id !== id));
    
    toast({
      title: "Pacote excluído",
      description: "O pacote foi removido da sua lista.",
    });
  };

  // Handler to edit an existing package
  const handleEditPackage = (id: number) => {
    const packageToEdit = mimoPackages.find(p => p.id === id);
    if (packageToEdit) {
      setNewPackage({...packageToEdit});
      setShowNewPackageForm(true);
      
      // Remove the package from the list while it's being edited
      setMimoPackages(prev => prev.filter(p => p.id !== id));
    }
  };

  return {
    mimoPackages,
    showNewPackageForm,
    newPackage,
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
    setShowNewPackageForm
  };
};
