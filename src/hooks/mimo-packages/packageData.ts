
import { MimoPackage } from '@/types/creator';

// Array vazio para pacotes iniciais - o usuário vai cadastrar sem exemplos
export const initialMimoPackages: MimoPackage[] = [];

// Modelo de pacote vazio
export const emptyPackage: MimoPackage = {
  id: 0,
  title: '',
  price: 0,
  features: [''],
  highlighted: false,
  media: [],
  isHidden: false
};
