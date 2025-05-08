
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface CreatorStickyHeaderProps {
  visible: boolean;
  avatar: string;
  name: string;
  username: string;
  onMimoClick: () => void;
}

const CreatorStickyHeader = ({ 
  visible, 
  avatar, 
  name, 
  username, 
  onMimoClick 
}: CreatorStickyHeaderProps) => {
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-10 transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      style={{marginTop: '64px'}} // Adjust based on navbar height
    >
      <div className="bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-sm text-white py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={avatar} 
              alt={name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
            />
            <div>
              <h2 className="font-medium">{name}</h2>
              <p className="text-xs text-white/80">@{username}</p>
            </div>
          </div>
          <Button 
            size="sm"
            className="bg-white text-black hover:bg-white/90 rounded-full flex items-center gap-1"
            onClick={onMimoClick}
          >
            <Heart className="h-4 w-4 text-red-500" />
            <span>Enviar Mimo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorStickyHeader;
