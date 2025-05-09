
import { Creator } from '@/types/creator';
import { LOCAL_STORAGE_KEY, getItemFromStorage, setItemToStorage } from '@/utils/storage';

// Initial/demo creator data for display when not logged in
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

// Get the current authenticated user from localStorage
const getCurrentUser = () => {
  const authUser = localStorage.getItem(LOCAL_STORAGE_KEY);
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
      // If parsing fails, return a new creator for this user with minimal data
      return createDefaultCreator(user);
    }
  }
  
  // If no stored creator data, create a default profile with minimal data
  return createDefaultCreator(user);
};

// Create default creator profile
export const createDefaultCreator = (user: any): Creator => {
  const defaultCreator: Creator = {
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
      { type: "instagram", url: "" },
      { type: "twitter", url: "" },
      { type: "website", url: "" }
    ]
  };
  
  // Save this default creator to localStorage
  saveCreatorData(defaultCreator);
  
  return defaultCreator;
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
