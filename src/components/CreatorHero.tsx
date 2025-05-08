
import React from 'react';
import { Button } from '@/components/ui/button';
import { Creator, SocialLink } from '@/types/creator';
import { Heart, ChevronDown, Instagram, Twitter, Youtube, Globe } from 'lucide-react';

interface CreatorHeroProps {
  creator: Creator;
  onMimoClick: () => void;
}

const CreatorHero = ({ creator, onMimoClick }: CreatorHeroProps) => {
  const getSocialIcon = (type: 'instagram' | 'twitter' | 'youtube' | 'website') => {
    switch (type) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'website':
        return <Globe className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={creator.cover} 
          alt="Cover" 
          className="w-full h-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-center text-white mx-auto px-4 max-w-3xl">
        <div className="flex justify-center mb-6">
          <img 
            src={creator.avatar} 
            alt={creator.name} 
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
          />
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          {creator.name}
        </h1>
        
        <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto">
          {creator.description}
        </p>
        
        <div className="flex justify-center gap-3 mb-8">
          {creator.socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {getSocialIcon(link.type)}
            </a>
          ))}
        </div>
        
        <Button 
          className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg group"
          onClick={onMimoClick}
        >
          <Heart className="mr-2 h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
          Enviar um Mimo
          <ChevronDown className="ml-2 h-5 w-5 animate-bounce" />
        </Button>
      </div>
    </section>
  );
};

export default CreatorHero;
