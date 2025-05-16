
// If this file exists, add this to it, otherwise add a new file:
export interface MimoPackage {
  id: number | string;
  title: string;
  price: number;
  features: string[];
  highlighted: boolean;
  isHidden?: boolean;
  description?: string;
  media: MediaItem[];
}

export interface MediaItem {
  id: number;
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
  isPreview: boolean;
}
