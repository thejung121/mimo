
import React, { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Image, Video, AudioLines } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaItem } from '@/types/creator';

interface MediaItemDisplayProps {
  media: MediaItem;
  onTogglePreview: () => void;
  onRemove: () => void;
}

// Using React.memo to prevent unnecessary re-renders
const MediaItemDisplay = memo(({ media, onTogglePreview, onRemove }: MediaItemDisplayProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the placeholder component based on media type
  const renderPlaceholder = () => {
    switch (media.type) {
      case 'video':
        return <Video className="h-8 w-8 text-muted-foreground" />;
      case 'audio':
        return <AudioLines className="h-8 w-8 text-muted-foreground" />;
      default:
        return <Image className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const handleImageError = () => {
    console.error('Image failed to load:', media.url);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', media.url);
    setImageLoaded(true);
  };

  // Check if the URL is a base64 data URL or regular URL
  const isValidImageUrl = media.type === 'image' && 
    (media.url.startsWith('data:image/') || 
     media.url.startsWith('http') || 
     media.url.startsWith('/'));

  return (
    <div 
      className={cn(
        "relative rounded-md overflow-hidden border", 
        media.isPreview ? "border-mimo-primary" : "border-border"
      )}
    >
      {isValidImageUrl && !imageError ? (
        <div className={cn("w-full h-24 bg-muted flex items-center justify-center relative", imageLoaded ? "" : "animate-pulse")}>
          <img 
            src={media.url} 
            alt={media.caption || `Imagem ${media.id}`}
            className={cn("w-full h-24 object-cover transition-opacity", imageLoaded ? "opacity-100" : "opacity-0")}
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-24 bg-muted flex items-center justify-center">
          {renderPlaceholder()}
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
});

// Add display name for debugging purposes
MediaItemDisplay.displayName = 'MediaItemDisplay';

export default MediaItemDisplay;
