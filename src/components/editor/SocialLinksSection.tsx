
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Instagram, Twitter, Globe, Lock, Twitch } from 'lucide-react';
import { SocialLink } from '@/types/creator';

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onChange: (index: number, field: 'type' | 'url', value: string) => void;
}

const SocialLinksSection = ({ socialLinks, onChange }: SocialLinksSectionProps) => {
  // Ensure we have all the social link types
  const socialLinkTypes = ['instagram', 'twitter', 'twitch', 'onlyfans', 'privacy', 'youtube', 'website'] as const;
  
  const getSocialLink = (type: string) => {
    return socialLinks.find(link => link.type === type) || { type, url: '' };
  };

  const getSocialLinkIndex = (type: string) => {
    const index = socialLinks.findIndex(link => link.type === type);
    return index >= 0 ? index : socialLinks.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociais</CardTitle>
        <CardDescription>Conecte suas redes sociais para que seus fãs possam te acompanhar. Serão mostradas apenas as que estiverem preenchidas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinkTypes.map((type) => {
          const link = getSocialLink(type);
          const index = getSocialLinkIndex(type);
          
          return (
            <div key={type} className="flex items-center gap-3">
              <div className="flex-shrink-0 p-2 rounded-md bg-muted">
                {type === 'instagram' && <Instagram className="h-5 w-5" />}
                {type === 'twitter' && <Twitter className="h-5 w-5" />}
                {type === 'twitch' && <Twitch className="h-5 w-5" />}
                {type === 'onlyfans' && <Globe className="h-5 w-5" />}
                {type === 'privacy' && <Lock className="h-5 w-5" />}
                {type === 'youtube' && <Globe className="h-5 w-5" />}
                {type === 'website' && <Globe className="h-5 w-5" />}
              </div>
              
              <div className="flex-grow">
                <label className="text-sm text-muted-foreground mb-1 block">
                  {type === 'instagram' ? 'Instagram' : 
                   type === 'twitter' ? 'Twitter' : 
                   type === 'twitch' ? 'Twitch' :
                   type === 'onlyfans' ? 'OnlyFans' :
                   type === 'privacy' ? 'Privacy' :
                   type === 'youtube' ? 'YouTube' :
                   type === 'website' ? 'Website' : 'Link'}
                </label>
                <Input
                  value={link.url}
                  onChange={(e) => onChange(index, 'url', e.target.value)}
                  className="mimo-input"
                  placeholder={`Seu link do ${type}`}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SocialLinksSection;
