
import { MimoPackage, MediaItem } from '@/types/creator';

// Initial mimo packages data
export const initialMimoPackages: MimoPackage[] = [
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

export const emptyPackage: MimoPackage = {
  title: '',
  price: 0,
  features: [''],
  highlighted: false,
  media: []
};
