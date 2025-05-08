
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FileImage, Upload, Image, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MediaUploaderProps {
  onMediaAdd: (media: {
    id: number,
    type: 'image' | 'video',
    url: string,
    isPreview: boolean
  }) => void;
}

// Mock das URLs de imagens
const sampleImages = [
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1582562124811-c09040d0a901',
];

// Mock das URLs de vídeos
const sampleVideos = [
  'https://example.com/sample-video1.mp4',
  'https://example.com/sample-video2.mp4',
];

const MediaUploader = ({ onMediaAdd }: MediaUploaderProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadUrl, setUploadUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleAddFromLibrary = () => {
    if (selectedImage) {
      // Gerar um ID único para a nova mídia
      const newId = Date.now();
      
      onMediaAdd({
        id: newId,
        type: 'image',
        url: selectedImage,
        isPreview: false
      });
      
      setOpen(false);
      setSelectedImage(null);
      
      toast({
        title: "Imagem adicionada",
        description: "A imagem foi adicionada com sucesso ao seu pacote.",
      });
    } else if (selectedVideo) {
      // Gerar um ID único para a nova mídia
      const newId = Date.now();
      
      onMediaAdd({
        id: newId,
        type: 'video',
        url: selectedVideo,
        isPreview: false
      });
      
      setOpen(false);
      setSelectedVideo(null);
      
      toast({
        title: "Vídeo adicionado",
        description: "O vídeo foi adicionado com sucesso ao seu pacote.",
      });
    } else {
      toast({
        title: "Nenhuma mídia selecionada",
        description: "Por favor, selecione uma imagem ou vídeo primeiro.",
        variant: "destructive"
      });
    }
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
      
      // Determinar tipo pela extensão do arquivo
      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(uploadUrl);
      
      // Gerar um ID único para a nova mídia
      const newId = Date.now();
      
      onMediaAdd({
        id: newId,
        type: isVideo ? 'video' : 'image',
        url: uploadUrl,
        isPreview: false
      });
      
      setOpen(false);
      setUploadUrl('');
      
      toast({
        title: `${isVideo ? 'Vídeo' : 'Imagem'} adicionado`,
        description: `${isVideo ? 'O vídeo' : 'A imagem'} foi adicionado com sucesso ao seu pacote.`,
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
              Adicione imagens ou vídeos para o seu pacote de mimo.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="upload">Upload por URL</TabsTrigger>
              <TabsTrigger value="library">Biblioteca</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4 space-y-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  URL da imagem ou vídeo
                </label>
                <Input
                  id="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Cole o link direto para uma imagem ou vídeo online.
                </p>
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
            
            <TabsContent value="library" className="mt-4">
              <Tabs defaultValue="images" className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="images" className="flex items-center gap-1">
                    <Image className="h-4 w-4" /> Imagens
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="flex items-center gap-1">
                    <Video className="h-4 w-4" /> Vídeos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="images">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {sampleImages.map((url, index) => (
                      <div 
                        key={index}
                        className={`relative border rounded-md overflow-hidden cursor-pointer ${selectedImage === url ? 'border-mimo-primary ring-2 ring-mimo-primary/30' : 'border-border'}`}
                        onClick={() => {
                          setSelectedImage(url);
                          setSelectedVideo(null);
                        }}
                      >
                        <img 
                          src={url} 
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="videos">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {sampleVideos.map((url, index) => (
                      <div 
                        key={index}
                        className={`relative border rounded-md overflow-hidden cursor-pointer ${selectedVideo === url ? 'border-mimo-primary ring-2 ring-mimo-primary/30' : 'border-border'}`}
                        onClick={() => {
                          setSelectedVideo(url);
                          setSelectedImage(null);
                        }}
                      >
                        <div className="w-full h-24 bg-muted flex items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1">
                          Vídeo {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleAddFromLibrary}
                  disabled={!selectedImage && !selectedVideo}
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
