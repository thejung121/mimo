
import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Twitter, Youtube, Globe, Heart } from 'lucide-react';

interface SocialLink {
  type: 'instagram' | 'twitter' | 'youtube' | 'website';
  url: string;
}

interface CreatorProfileProps {
  name: string;
  avatar: string;
  cover: string;
  description: string;
  socialLinks: SocialLink[];
}

const CreatorProfile = ({ name, avatar, cover, description, socialLinks }: CreatorProfileProps) => {
  const getSocialIcon = (type: string) => {
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
    <div className="mimo-card">
      <div className="relative">
        <img 
          src={cover} 
          alt={`Capa de ${name}`} 
          className="mimo-cover"
        />
        <div className="absolute -bottom-12 left-6">
          <img 
            src={avatar} 
            alt={name} 
            className="mimo-avatar"
          />
        </div>
      </div>
      
      <div className="pt-16 pb-6 px-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{name}</h2>
          </div>
          <div className="flex space-x-2">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted hover:bg-accent text-foreground/70 hover:text-accent-foreground transition-colors"
              >
                {getSocialIcon(link.type)}
              </a>
            ))}
          </div>
        </div>
        
        <p className="text-foreground/80 mb-6">{description}</p>
        
        <Button className="mimo-button flex items-center space-x-2">
          <Heart className="h-4 w-4" />
          <span>Enviar um Mimo</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatorProfile;
