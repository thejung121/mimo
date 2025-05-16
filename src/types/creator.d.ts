
export interface Creator {
  id?: string;
  name: string;
  username: string;
  bio: string;
  coverImage: string;
  profileImage: string;
  coverTitle?: string;
  coverSubtitle?: string;
  about?: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  id?: number;
  type: string;
  url: string;
}

export interface MimoPackage {
  id: string | number;
  title: string;
  price: number;
  features: string[];
  highlighted: boolean;
  isHidden: boolean;
  media: MediaItem[];
  description?: string;
}

export interface MediaItem {
  id: string | number;
  type: string;
  url: string;
  caption?: string;
  isPreview: boolean;
}

export interface Transaction {
  id: string;
  creator_id: string;
  package_id: string;
  buyer_name: string;
  buyer_email?: string;
  buyer_phone?: string;
  amount: number;
  platform_fee: number;
  creator_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Withdraw {
  id: string;
  creator_id: string;
  amount: number;
  status: string;
  pix_key: string;
  request_date: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
}
