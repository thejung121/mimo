
import { Creator, MimoPackage } from '@/types/creator';

// Mock creator data for initial setup
const initialCreator: Creator = {
  name: 'Maria Fernanda',
  username: 'mariafernanda',
  coverTitle: 'Maria Fernanda | Modelo e Criadora de Conteúdo',
  coverSubtitle: 'Receba conteúdos exclusivos e me ajude a continuar compartilhando meu dia a dia',
  about: 'Olá! Sou Maria, modelo e criadora de conteúdo há 5 anos. Compartilho minha vida, experiências e dicas de moda, beleza e lifestyle. Adoro interagir com meus seguidores e criar conteúdos especiais.',
  avatar: 'https://i.imgur.com/6QbCNLa.jpg',
  cover: 'https://i.imgur.com/HPFGjlh.jpg',
  description: 'Modelo e Criadora de Conteúdo',
  socialLinks: [
    {
      type: 'instagram',
      url: 'https://instagram.com/mariafernanda'
    },
    {
      type: 'twitter',
      url: 'https://twitter.com/mariafernanda'
    },
    {
      type: 'website',
      url: 'https://mariafernanda.com'
    }
  ]
};

// Mock package data for initial setup
const initialPackages: MimoPackage[] = [
  {
    id: 1,
    title: "Mimo Básico",
    price: 20,
    features: [
      "Fotos exclusivas",
      "1 vídeo por mês",
      "Mensagem personalizada"
    ],
    highlighted: false,
    media: []
  },
  {
    id: 2,
    title: "Mimo Premium",
    price: 50,
    features: [
      "Todo o conteúdo do Mimo Básico",
      "Vídeos exclusivos semanais",
      "Acesso a lives privadas",
      "Conteúdo de bastidores"
    ],
    highlighted: true,
    media: []
  },
  {
    id: 3,
    title: "Mimo VIP",
    price: 100,
    features: [
      "Todo o conteúdo do Mimo Premium",
      "Sessão de fotos exclusiva mensal",
      "Prioridade nas respostas",
      "Presentes surpresa"
    ],
    highlighted: false,
    media: []
  }
];

// Get the current authenticated user from localStorage
const getCurrentUser = () => {
  const authUser = localStorage.getItem('mimo:auth');
  return authUser ? JSON.parse(authUser) : null;
};

// Get creator data with proper user association
export const getCreatorData = (): Creator => {
  const user = getCurrentUser();
  
  // If not logged in, return the initial creator data
  if (!user) {
    return initialCreator;
  }
  
  // Try to load stored creator data
  const creatorKey = `mimo:creator:${user.id}`;
  const storedCreator = localStorage.getItem(creatorKey);
  
  if (storedCreator) {
    try {
      return JSON.parse(storedCreator);
    } catch (e) {
      console.error("Failed to parse creator data", e);
      // If parsing fails, return a new creator for this user
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        coverTitle: `Página de ${user.name}`,
        coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
        about: `Olá! Eu sou ${user.name} e esta é minha página de mimos. Aqui você pode me apoiar e receber conteúdo exclusivo.`,
        avatar: "/placeholder.svg", 
        cover: "/placeholder.svg",
        description: `Criador de conteúdo`,
        socialLinks: [
          { type: "instagram", url: `https://instagram.com/${user.username}` },
          { type: "twitter", url: `https://twitter.com/${user.username}` },
          { type: "website", url: "" }
        ]
      };
    }
  }
  
  // If no stored creator data, create a default profile
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    coverTitle: `Página de ${user.name}`,
    coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
    about: `Olá! Eu sou ${user.name} e esta é minha página de mimos. Aqui você pode me apoiar e receber conteúdo exclusivo.`,
    avatar: "/placeholder.svg", 
    cover: "/placeholder.svg",
    description: `Criador de conteúdo`,
    socialLinks: [
      { type: "instagram", url: `https://instagram.com/${user.username}` },
      { type: "twitter", url: `https://twitter.com/${user.username}` },
      { type: "website", url: "" }
    ]
  };
};

// Get mimo packages with proper user association
export const getMimoPackages = (): MimoPackage[] => {
  const user = getCurrentUser();
  
  // If not logged in, return the initial packages
  if (!user) {
    return initialPackages;
  }
  
  // Try to load stored packages data
  const packagesKey = `mimo:packages:${user.id}`;
  const storedPackages = localStorage.getItem(packagesKey);
  
  if (storedPackages) {
    try {
      return JSON.parse(storedPackages);
    } catch (e) {
      console.error("Failed to parse packages data", e);
      return initialPackages;
    }
  }
  
  // If no stored packages, return the initial packages
  return initialPackages;
};

// Save creator data with user ID association
export const saveCreatorData = (creator: Creator): void => {
  const user = getCurrentUser();
  
  if (!user) {
    // If not logged in, just update in session, not persisted
    console.warn("Attempting to save creator data without being logged in");
    return;
  }
  
  const creatorKey = `mimo:creator:${user.id}`;
  localStorage.setItem(creatorKey, JSON.stringify(creator));
};

// Save mimo packages with user ID association
export const saveMimoPackages = (packages: MimoPackage[]): void => {
  const user = getCurrentUser();
  
  if (!user) {
    // If not logged in, just update in session, not persisted
    console.warn("Attempting to save packages data without being logged in");
    return;
  }
  
  const packagesKey = `mimo:packages:${user.id}`;
  localStorage.setItem(packagesKey, JSON.stringify(packages));
};

// Save all data at once (both creator and packages)
export const saveAllData = (creator: Creator, packages: MimoPackage[]): void => {
  saveCreatorData(creator);
  saveMimoPackages(packages);
};
