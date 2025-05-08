
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileImage, Upload, Image, Video, AudioLines } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

interface MediaUploaderProps {
  onMediaAdd: (media: {
    id: number,
    type: 'image' | 'video' | 'audio',
    url: string,
    caption?: string,
    isPreview: boolean
  }) => void;
}

const MediaUploader = ({ onMediaAdd }: MediaUploaderProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadUrl, setUploadUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image');

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    if (!file) return;
    
    // Determine media type from file
    let type: 'image' | 'video' | 'audio' = 'image';
    if (file.type.startsWith('video/')) {
      type = 'video';
    } else if (file.type.startsWith('audio/')) {
      type = 'audio';
    } else if (!file.type.startsWith('image/')) {
      toast({
        title: "Formato não suportado",
        description: "Por favor, faça upload apenas de imagens, vídeos ou áudios.",
        variant: "destructive"
      });
      return;
    }
    
    setMediaType(type);
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Create temporary URL for preview
        const url = URL.createObjectURL(file);
        
        // Generate a mock ID for the media
        const newId = Date.now();
        
        onMediaAdd({
          id: newId,
          type,
          url,
          caption: caption || undefined,
          isPreview: false
        });
        
        setUploading(false);
        setUploadProgress(0);
        setCaption('');
        setOpen(false);
        
        toast({
          title: `${type === 'image' ? 'Imagem' : type === 'video' ? 'Vídeo' : 'Áudio'} adicionado`,
          description: `${type === 'image' ? 'A imagem' : type === 'video' ? 'O vídeo' : 'O áudio'} foi adicionado com sucesso ao seu pacote.`,
        });
      }
    }, 200);
  };

  const handleAddFromUrl = () => {
    if (!uploadUrl.trim()) {
      toast({
        title: "URL vazia",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validar URL (verificação básica)
      new URL(uploadUrl);
      
      // Determine media type from URL extension
      let type: 'image' | 'video' | 'audio' = 'image';
      if (/\.(mp4|webm|ogg|mov)$/i.test(uploadUrl)) {
        type = 'video';
      } else if (/\.(mp3|wav|ogg|m4a)$/i.test(uploadUrl)) {
        type = 'audio';
      } else if (!/\.(jpg|jpeg|png|gif|webp)$/i.test(uploadUrl)) {
        // If not a recognized extension, use the manually selected type
        type = mediaType;
      }
      
      // Gerar um ID único para a nova mídia
      const newId = Date.now();
      
      onMediaAdd({
        id: newId,
        type,
        url: uploadUrl,
        caption: caption || undefined,
        isPreview: false
      });
      
      setOpen(false);
      setUploadUrl('');
      setCaption('');
      
      toast({
        title: `${type === 'image' ? 'Imagem' : type === 'video' ? 'Vídeo' : 'Áudio'} adicionado`,
        description: `${type === 'image' ? 'A imagem' : type === 'video' ? 'O vídeo' : 'O áudio'} foi adicionado com sucesso ao seu pacote.`,
      });
    } catch (e) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div 
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 h-24 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <FileImage className="h-8 w-8 text-muted-foreground mb-1" />
        <span className="text-xs text-muted-foreground text-center">Adicionar mídia</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar mídia</DialogTitle>
            <DialogDescription>
              Adicione imagens, vídeos ou áudios para o seu pacote de mimo.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="upload">Upload de arquivo</TabsTrigger>
              <TabsTrigger value="url">URL externa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="flex flex-col space-y-2">
                {uploading ? (
                  <div className="space-y-2">
                    <p className="text-sm text-center">Enviando arquivo...</p>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                ) : (
                  <>
                    <label className="relative flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer text-muted-foreground hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 mb-2" />
                        <p className="mb-2 text-sm">Clique ou arraste para fazer upload</p>
                        <p className="text-xs">Imagem, vídeo ou áudio</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*,video/*,audio/*" 
                        onChange={handleUploadFile}
                      />
                    </label>
                    <div className="flex flex-col space-y-2">
                      <label htmlFor="caption" className="text-sm font-medium">
                        Legenda (opcional)
                      </label>
                      <Textarea
                        id="caption"
                        placeholder="Descreva esta mídia..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="mt-4 space-y-4">
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
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaUploader;
