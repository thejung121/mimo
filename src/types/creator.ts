
// Creator related types
export interface SocialLink {
  type: 'instagram' | 'twitter' | 'twitch' | 'onlyfans' | 'privacy';
  url: string;
}

export interface Creator {
  id?: string;
  username: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  coverTitle?: string;
  coverSubtitle?: string;
  about?: string;
  socialLinks: SocialLink[];
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
  isPreview: boolean;
}

export interface MimoPackage {
  id?: number;
  title: string;
  price: number;
  features: string[];
  highlighted: boolean;
  media: MediaItem[];
  isHidden?: boolean; // Adding the missing property
}

// Interface for form data
export interface OnboardingFormData {
  fullName: string;
  workName: string;
  email: string;
  whatsapp: string;
  instagram: string;
  document: string;
}

// Interface for withdrawals
export interface Withdrawal {
  id: string;
  amount: number;
  requestDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
  completedDate: Date | null;
}

// Interface for user profile
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  document: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Interface for subscription options
export interface SubscriptionOption {
  id: string;
  title: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
}
