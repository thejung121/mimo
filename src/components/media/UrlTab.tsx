
import { useState } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, AudioLines } from 'lucide-react';

interface UrlTabProps {
  mediaType: 'image' | 'video' | 'audio';
  setMediaType: (type: 'image' | 'video' | 'audio') => void;
  uploadUrl: string;
  setUploadUrl: (url: string) => void;
  caption: string;
  setCaption: (caption: string) => void;
  handleAddFromUrl: () => void;
}

const UrlTab = ({
  mediaType,
  setMediaType,
  uploadUrl,
  setUploadUrl,
  caption,
  setCaption,
  handleAddFromUrl
}: UrlTabProps) => {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <div className="flex gap-2">
          <TabsList>
            <TabsTrigger 
              value="image" 
              onClick={() => setMediaType('image')}
              className={mediaType === 'image' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Image className="h-4 w-4 mr-1" /> Imagem
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              onClick={() => setMediaType('video')}
              className={mediaType === 'video' ? 'bg-primary text-primary-foreground' : ''}
            >
              <Video className="h-4 w-4 mr-1" /> Vídeo
            </TabsTrigger>
            <TabsTrigger 
              value="audio" 
              onClick={() => setMediaType('audio')}
              className={mediaType === 'audio' ? 'bg-primary text-primary-foreground' : ''}
            >
              <AudioLines className="h-4 w-4 mr-1" /> Áudio
            </TabsTrigger>
          </TabsList>
        </div>
        <label htmlFor="url" className="text-sm font-medium">
          URL da mídia ({mediaType === 'image' ? 'imagem' : mediaType === 'video' ? 'vídeo' : 'áudio'})
        </label>
        <Input
          id="url"
          placeholder="https://exemplo.com/arquivo"
          value={uploadUrl}
          onChange={(e) => setUploadUrl(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Cole o link direto para uma {mediaType === 'image' ? 'imagem' : mediaType === 'video' ? 'um vídeo' : 'um áudio'} online.
        </p>
      </div>
      
      <div className="flex flex-col space-y-2">
        <label htmlFor="caption-url" className="text-sm font-medium">
          Legenda (opcional)
        </label>
        <Textarea
          id="caption-url"
          placeholder="Descreva esta mídia..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="resize-none"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleAddFromUrl}
          className="mimo-button flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Adicionar
        </Button>
      </div>
    </>
  );
};

export default UrlTab;
