
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Instagram, Twitter, Globe, Lock } from 'lucide-react';
import { SocialLink } from '@/types/creator';

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
  onSocialLinkChange: (index: number, field: string, value: string) => void;
}

const SocialLinksSection = ({ socialLinks, onSocialLinkChange }: SocialLinksSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociais</CardTitle>
        <CardDescription>Conecte suas redes sociais para que seus fãs possam te acompanhar. Serão mostradas apenas as que estiverem preenchidas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 p-2 rounded-md bg-muted">
              {link.type === 'instagram' && <Instagram className="h-5 w-5" />}
              {link.type === 'twitter' && <Twitter className="h-5 w-5" />}
              {link.type === 'website' && <Globe className="h-5 w-5" />}
              {link.type === 'privacy' && <Lock className="h-5 w-5" />}
            </div>
            
            <div className="flex-grow">
              <label className="text-sm text-muted-foreground mb-1 block">
                {link.type === 'instagram' ? 'Instagram' : 
                 link.type === 'twitter' ? 'Twitter' : 
                 link.type === 'website' ? 'OnlyFans' : 
                 link.type === 'privacy' ? 'Privacy' : 'Link'}
              </label>
              <Input
                value={link.url}
                onChange={(e) => onSocialLinkChange(index, 'url', e.target.value)}
                className="mimo-input"
                placeholder={`Seu link do ${link.type}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SocialLinksSection;
