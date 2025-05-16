
import { MimoPackage } from '@/types/creator';

// Initialize an empty package with default values
export const emptyPackage: MimoPackage = {
  id: '', // Will be replaced with a UUID when saved
  title: '',
  price: 0,
  features: [''],
  highlighted: false,
  isHidden: false,
  media: []
};
