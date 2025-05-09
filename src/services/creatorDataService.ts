
import { Creator, MimoPackage } from '@/types/creator';

// Mock creator data for initial display only when not logged in
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

// Initial package examples - only shown for demo purposes when not logged in
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
      // If parsing fails, return a new creator for this user with minimal data
      return createDefaultCreator(user);
    }
  }
  
  // If no stored creator data, create a default profile with minimal data
  return createDefaultCreator(user);
};

// Create default creator profile
const createDefaultCreator = (user: any): Creator => {
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
      // Return empty array instead of demo packages for authenticated users
      return [];
    }
  }
  
  // If no stored packages, return empty array for new users
  return [];
};

// Get transactions for the current user
export const getTransactions = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return []; // No transactions for unauthenticated users
  }
  
  const transactionsKey = `mimo:transactions:${user.id}`;
  const storedTransactions = localStorage.getItem(transactionsKey);
  
  if (storedTransactions) {
    try {
      return JSON.parse(storedTransactions);
    } catch (e) {
      console.error("Failed to parse transactions data", e);
      return [];
    }
  }
  
  return []; // New users have no transactions
};

// Get withdrawals for the current user
export const getWithdrawals = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return []; // No withdrawals for unauthenticated users
  }
  
  const withdrawalsKey = `mimo:withdrawals:${user.id}`;
  const storedWithdrawals = localStorage.getItem(withdrawalsKey);
  
  if (storedWithdrawals) {
    try {
      return JSON.parse(storedWithdrawals);
    } catch (e) {
      console.error("Failed to parse withdrawals data", e);
      return [];
    }
  }
  
  return []; // New users have no withdrawals
};

// Get available balance for the current user
export const getAvailableBalanceFromLocal = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return 0; // No balance for unauthenticated users
  }
  
  const balanceKey = `mimo:balance:${user.id}`;
  const storedBalance = localStorage.getItem(balanceKey);
  
  if (storedBalance) {
    try {
      return parseFloat(storedBalance);
    } catch (e) {
      console.error("Failed to parse balance data", e);
      return 0;
    }
  }
  
  return 0; // New users have no balance
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

// Save transactions data
export const saveTransactions = (transactions: any[]): void => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save transactions data without being logged in");
    return;
  }
  
  const transactionsKey = `mimo:transactions:${user.id}`;
  localStorage.setItem(transactionsKey, JSON.stringify(transactions));
};

// Save withdrawals data
export const saveWithdrawals = (withdrawals: any[]): void => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save withdrawals data without being logged in");
    return;
  }
  
  const withdrawalsKey = `mimo:withdrawals:${user.id}`;
  localStorage.setItem(withdrawalsKey, JSON.stringify(withdrawals));
};

// Save balance data
export const saveBalance = (balance: number): void => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save balance data without being logged in");
    return;
  }
  
  const balanceKey = `mimo:balance:${user.id}`;
  localStorage.setItem(balanceKey, balance.toString());
};
