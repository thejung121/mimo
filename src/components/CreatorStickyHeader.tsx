
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
        "fixed top-0 left-0 right-0 z-10 transition-transform duration-200",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      style={{marginTop: '64px'}} // Adjust based on navbar height
    >
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 py-2 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={avatar} 
              alt={name} 
              className="w-8 h-8 rounded-full object-cover"
              loading="eager"
            />
            <div>
              <h2 className="font-medium text-sm">{name}</h2>
              <p className="text-xs text-gray-500">@{username}</p>
            </div>
          </div>
          <Button 
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90 text-white"
            onClick={onMimoClick}
          >
            <Heart className="h-3 w-3 mr-1" />
            <span className="text-xs">Enviar Mimo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorStickyHeader;
