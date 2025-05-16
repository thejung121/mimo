
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Instagram, Twitter, Globe, Lock, Twitch } from 'lucide-react';
import { SocialLink } from '@/types/creator';

interface ProfileSocialLinksSectionProps {
  socialLinks: SocialLink[];
  getIndexOfSocialLink: (type: string) => number;
  handleSocialLinkChange: (index: number, field: string, value: string) => void;
}

const ProfileSocialLinksSection: React.FC<ProfileSocialLinksSectionProps> = ({
  socialLinks,
  getIndexOfSocialLink,
  handleSocialLinkChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redes Sociais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-medium mb-1">
            <Instagram className="h-4 w-4 mr-2" />
            Instagram
          </label>
          <Input
            value={socialLinks[getIndexOfSocialLink('instagram')].url}
            onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('instagram'), 'url', e.target.value)}
            className="mimo-input"
            placeholder="https://instagram.com/seuusuario"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium mb-1">
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </label>
          <Input
            value={socialLinks[getIndexOfSocialLink('twitter')].url}
            onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('twitter'), 'url', e.target.value)}
            className="mimo-input"
            placeholder="https://twitter.com/seuusuario"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium mb-1">
            <Twitch className="h-4 w-4 mr-2" />
            Twitch
          </label>
          <Input
            value={socialLinks[getIndexOfSocialLink('twitch')].url}
            onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('twitch'), 'url', e.target.value)}
            className="mimo-input"
            placeholder="https://twitch.tv/seuusuario"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium mb-1">
            <Globe className="h-4 w-4 mr-2" />
            OnlyFans
          </label>
          <Input
            value={socialLinks[getIndexOfSocialLink('onlyfans')].url}
            onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('onlyfans'), 'url', e.target.value)}
            className="mimo-input"
            placeholder="https://onlyfans.com/seuusuario"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium mb-1">
            <Lock className="h-4 w-4 mr-2" />
            Privacy
          </label>
          <Input
            value={socialLinks[getIndexOfSocialLink('privacy')].url}
            onChange={(e) => handleSocialLinkChange(getIndexOfSocialLink('privacy'), 'url', e.target.value)}
            className="mimo-input"
            placeholder="https://privacy.app/seuusuario"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSocialLinksSection;
