
import React from 'react';
import { Button } from '@/components/ui/button';
import { Instagram, Twitter, Youtube, Globe, Heart, CheckCircle2, Image, Video } from 'lucide-react';

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

  // Dados fictícios para as estatísticas
  const videoCount = 12;
  const imageCount = 48;
  const subscriberCount = 525;

  return (
    <div className="bg-slate-900 text-white">
      {/* Cover Image */}
      <div className="w-full h-48 overflow-hidden">
        <img 
          src={cover} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="relative px-5 pt-16 pb-6 text-center">
        {/* Avatar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-12">
          <div className="rounded-full border-4 border-slate-900 overflow-hidden bg-slate-800 w-24 h-24">
            <img 
              src={avatar} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold flex items-center justify-center">
          {name}
          <CheckCircle2 className="w-4 h-4 text-blue-500 ml-1" />
        </h1>
        
        <p className="text-slate-400 text-sm mt-1 mb-3">
          {description}
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="font-bold">{videoCount}</span> Vídeos
          </div>
          <div>
            <span className="font-bold">{imageCount}</span> Fotos
          </div>
          <div>
            <span className="font-bold">{subscriberCount}</span> assinantes
          </div>
        </div>
        
        <h2 className="text-center mb-4">Explore meus conteúdos</h2>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-2 mb-4">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                {getSocialIcon(link.type)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorProfile;
