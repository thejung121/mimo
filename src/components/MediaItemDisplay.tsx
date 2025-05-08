
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Image, Video, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: number;
  type: 'image' | 'video' | 'audio';
  url: string;
  caption?: string;
  isPreview: boolean;
}

interface MediaItemDisplayProps {
  media: MediaItem;
  onTogglePreview: () => void;
  onRemove: () => void;
}

const MediaItemDisplay = ({ media, onTogglePreview, onRemove }: MediaItemDisplayProps) => {
  return (
    <div 
      className={cn(
        "relative rounded-md overflow-hidden border", 
        media.isPreview ? "border-mimo-primary" : "border-border"
      )}
    >
      {media.type === 'image' && (
        <div className="w-full h-24 bg-muted">
          <img 
            src={media.url} 
            alt={media.caption || `Imagem ${media.id}`}
            className="w-full h-24 object-cover"
            onError={(e) => {
              // On image load error, show a placeholder
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      )}
      
      {media.type === 'video' && (
        <div className="w-full h-24 bg-muted flex items-center justify-center">
          <Video className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {media.type === 'audio' && (
        <div className="w-full h-24 bg-muted flex items-center justify-center">
          <AudioLines className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {media.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
          {media.caption}
        </div>
      )}
      
      <div className="absolute top-1 right-1 flex space-x-1">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 bg-white/80 hover:bg-white border"
          onClick={onTogglePreview}
          title={media.isPreview ? "Remover do preview" : "Adicionar ao preview"}
        >
          <Eye className="h-3 w-3" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 bg-white/80 hover:bg-white border text-destructive"
          onClick={onRemove}
          title="Remover mídia"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      {media.isPreview && (
        <div className="absolute bottom-0 left-0 right-0 bg-mimo-primary text-white text-[10px] py-0.5 px-2 text-center">
          Preview
        </div>
      )}
    </div>
  );
};

export default MediaItemDisplay;
