
import React from 'react';
import { Creator, SocialLink } from '@/types/creator';
import ProfileCoverSection from './ProfileCoverSection';
import ProfileAvatarSection from './ProfileAvatarSection';
import ProfileBasicInfoSection from './ProfileBasicInfoSection';
import ProfileSocialLinksSection from './ProfileSocialLinksSection';

interface ProfileEditorProps {
  creator: Creator;
  coverPreview: string;
  avatarPreview: string;
  handleCreatorChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSocialLinkChange: (index: number, field: string, value: string) => void;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  creator,
  coverPreview,
  avatarPreview,
  handleCreatorChange,
  handleSocialLinkChange,
  handleCoverChange,
  handleAvatarChange
}) => {
  // Get social links by type
  const getSocialLink = (type: 'instagram' | 'twitter' | 'twitch' | 'onlyfans' | 'privacy' | 'youtube' | 'website') => {
    return creator.socialLinks.find(link => link.type === type) || { type, url: '' } as SocialLink;
  };

  // Get index of each social link
  const getIndexOfSocialLink = (type: string) => {
    return creator.socialLinks.findIndex(link => link.type === type);
  };

  const instagramLink = getSocialLink('instagram');
  const twitterLink = getSocialLink('twitter');
  const twitchLink = getSocialLink('twitch');
  const onlyfansLink = getSocialLink('onlyfans');
  const privacyLink = getSocialLink('privacy');

  return (
    <div className="space-y-6">
      <ProfileCoverSection 
        coverPreview={coverPreview}
        handleCoverChange={handleCoverChange}
      />
      
      <ProfileAvatarSection 
        avatarPreview={avatarPreview}
        handleAvatarChange={handleAvatarChange}
      />
      
      <ProfileBasicInfoSection 
        creator={creator}
        handleCreatorChange={handleCreatorChange}
      />
      
      <ProfileSocialLinksSection 
        socialLinks={[
          instagramLink,
          twitterLink,
          twitchLink,
          onlyfansLink,
          privacyLink
        ]}
        getIndexOfSocialLink={getIndexOfSocialLink}
        handleSocialLinkChange={handleSocialLinkChange}
      />
    </div>
  );
};

export default ProfileEditor;
