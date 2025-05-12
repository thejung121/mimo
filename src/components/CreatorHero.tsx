import React from 'react';
import { Button } from '@/components/ui/button';
import { Creator } from '@/types/creator';
import { Heart, ChevronDown, Instagram, Twitter, Globe, Lock, Twitch } from 'lucide-react';

interface CreatorHeroProps {
  creator: Creator;
  onMimoClick: () => void;
}

const CreatorHero = ({ creator, onMimoClick }: CreatorHeroProps) => {
  const getSocialIcon = (type: 'instagram' | 'twitter' | 'twitch' | 'onlyfans' | 'privacy' | 'youtube' | 'website') => {
    switch (type) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'twitch':
        return <Twitch className="h-4 w-4" />;
      case 'website':
      case 'youtube':
      case 'onlyfans':
        return <Globe className="h-4 w-4" />;
      case 'privacy':
        return <Lock className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-900 to-gray-800">
        {creator.cover && (
          <img 
            src={creator.cover} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/30"></div>
      </div>
      
      <div className="relative z-10 text-center text-white mx-auto px-4 max-w-lg">
        <div className="flex justify-center mb-5">
          <img 
            src={creator.avatar} 
            alt={creator.name} 
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white/70 shadow-lg"
            loading="eager"
          />
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {creator.name}
        </h1>
        
        <p className="text-sm sm:text-base text-white/80 mb-4 max-w-sm mx-auto">
          {creator.description}
        </p>
        
        <div className="flex justify-center gap-2 mb-6">
          {creator.socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label={`${link.type} link`}
            >
              {getSocialIcon(link.type)}
            </a>
          ))}
        </div>
        
        <Button 
          className="bg-white text-black hover:bg-white/90 rounded-full px-6 py-1 text-sm"
          onClick={onMimoClick}
        >
          <Heart className="mr-2 h-4 w-4 text-red-500" />
          Enviar um Mimo
          <ChevronDown className="ml-2 h-4 w-4 animate-bounce" />
        </Button>
      </div>
    </section>
  );
};

export default CreatorHero;
