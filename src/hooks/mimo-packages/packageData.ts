
import { MimoPackage } from '@/types/creator';

// Empty array for packages - no pre-defined packages
export const initialMimoPackages: MimoPackage[] = [];

// Empty package template for creating new packages
export const emptyPackage: MimoPackage = {
  title: "",
  price: 0,
  features: [""],
  highlighted: false,
  media: []
};
