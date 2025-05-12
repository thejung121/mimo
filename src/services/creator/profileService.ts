
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
    console.log('No user found, returning initial creator data');
    return initialCreator;
  }
  
  // Try to load stored creator data
  const creatorKey = `mimo:creator:${user.id}`;
  const storedCreator = localStorage.getItem(creatorKey);
  
  if (storedCreator) {
    try {
      const parsedCreator = JSON.parse(storedCreator);
      console.log('Loaded creator data from localStorage:', parsedCreator);
      
      // Ensure the creator has the latest username from the user object
      if (user.username && (!parsedCreator.username || parsedCreator.username !== user.username)) {
        parsedCreator.username = user.username;
        // Save the updated creator data
        saveCreatorData(parsedCreator);
      }
      
      return parsedCreator;
    } catch (e) {
      console.error("Failed to parse creator data", e);
      // If parsing fails, return a new creator for this user with minimal data
      return createDefaultCreator(user);
    }
  }
  
  // If no stored creator data, create a default profile with minimal data
  console.log('No stored creator data, creating default creator');
  return createDefaultCreator(user);
};

// Create default creator profile
export const createDefaultCreator = (user: any): Creator => {
  const defaultCreator: Creator = {
    id: user.id,
    name: user.name || '',
    username: user.username || '',
    coverTitle: `Página de ${user.name || 'Criador'}`,
    coverSubtitle: "Envie-me um mimo e ajude meu trabalho!",
    about: `Olá! Eu sou ${user.name || 'Criador'} e esta é minha página de mimos. Aqui você pode me apoiar e receber conteúdo exclusivo.`,
    avatar: "/placeholder.svg", 
    cover: "/placeholder.svg",
    description: `Criador de conteúdo`,
    socialLinks: [
      { type: "instagram", url: "" },
      { type: "twitter", url: "" },
      { type: "twitch", url: "" },
      { type: "onlyfans", url: "" },
      { type: "privacy", url: "" }
    ]
  };
  
  // Save this default creator to localStorage
  saveCreatorData(defaultCreator);
  console.log('Created and saved default creator:', defaultCreator);
  
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
  
  // Also update user data in localStorage with the new username if it changed
  if (creator.username && user.username !== creator.username) {
    user.username = creator.username;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    console.log('Updated username in user data:', user.username);
  }
  
  const creatorKey = `mimo:creator:${user.id}`;
  localStorage.setItem(creatorKey, JSON.stringify(creator));
  console.log('Saved creator data to localStorage:', creator);
};
