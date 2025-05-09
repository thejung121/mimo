
import { MimoPackage } from '@/types/creator';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

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
  const authUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  return authUser ? JSON.parse(authUser) : null;
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
