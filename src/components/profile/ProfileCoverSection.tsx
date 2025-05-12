
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';

interface ProfileCoverSectionProps {
  coverPreview: string;
  handleCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileCoverSection: React.FC<ProfileCoverSectionProps> = ({
  coverPreview,
  handleCoverChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagem de Capa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-40 md:h-60 rounded-md overflow-hidden mb-4">
          <img
            src={coverPreview || '/placeholder.svg'}
            alt="Imagem de capa"
            className="w-full h-full object-cover"
          />
        </div>
        <Input 
          id="cover-upload" 
          type="file" 
          accept="image/*" 
          onChange={handleCoverChange}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
};

export default ProfileCoverSection;
