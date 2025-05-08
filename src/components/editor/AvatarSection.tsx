
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from 'lucide-react';

interface AvatarSectionProps {
  avatarPreview: string;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSection = ({ avatarPreview, onAvatarChange }: AvatarSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar</CardTitle>
        <CardDescription>Sua foto de perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={avatarPreview} 
              alt="Avatar" 
              className="w-24 h-24 object-cover rounded-full"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
              <label className="cursor-pointer bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
                <Upload className="h-5 w-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onAvatarChange}
                />
              </label>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Clique na imagem para fazer upload de uma nova foto de perfil.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarSection;
