
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';

interface ProfileAvatarSectionProps {
  avatarPreview: string;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  avatarPreview,
  handleAvatarChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Foto de Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mr-6">
            <img
              src={avatarPreview || '/placeholder.svg'}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileAvatarSection;
