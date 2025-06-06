
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { FileImage } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FileUploadTab from './media/FileUploadTab';
import UrlTab from './media/UrlTab';

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

  const determineMediaType = (file: File): 'image' | 'video' | 'audio' => {
    if (file.type.startsWith('video/')) {
      return 'video';
    } else if (file.type.startsWith('audio/')) {
      return 'audio';
    } 
    return 'image';
  };

  // Use the exact same upload logic as avatar/cover uploads
  const uploadFileToSupabase = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `media/${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      
      console.log('MediaUploader - Starting upload to media bucket:', fileName);
      
      // Upload to media bucket (same as avatar/cover logic)
      const { data, error } = await supabase.storage
        .from('media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('MediaUploader - Error uploading to Supabase:', error);
        toast({
          title: `Erro ao fazer upload`,
          description: error.message,
          variant: "destructive"
        });
        return null;
      }

      console.log('MediaUploader - Upload successful:', data);

      // Get public URL (same as avatar/cover logic)
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(data.path);

      console.log('MediaUploader - Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('MediaUploader - Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleUploadFile = async (files: FileList) => {
    if (!files || files.length === 0) {
      return;
    }
    
    console.log('MediaUploader - Starting file upload for', files.length, 'files');
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Process files sequentially to avoid overwhelming the system
      const processedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const type = determineMediaType(file);
        
        // Update progress
        const progressPercent = ((i + 0.5) / files.length) * 100;
        setUploadProgress(progressPercent);
        
        // Upload to Supabase Storage (same as avatar/cover)
        const uploadedUrl = await uploadFileToSupabase(file);
        
        if (!uploadedUrl) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        const newId = Date.now() + Math.floor(Math.random() * 1000);
        
        console.log('MediaUploader - Successfully uploaded file:', file.name, 'type:', type, 'url:', uploadedUrl);
        
        processedFiles.push({
          id: newId,
          type,
          url: uploadedUrl,
          caption: caption || undefined,
          isPreview: false
        });
      }
      
      // Final progress update
      setUploadProgress(100);
      
      // Add all processed files
      processedFiles.forEach(file => {
        console.log('MediaUploader - Adding media with Supabase URL:', file);
        onMediaAdd({
          id: file.id,
          type: file.type,
          url: file.url,
          caption: file.caption,
          isPreview: file.isPreview
        });
      });
      
      setUploading(false);
      setUploadProgress(0);
      setCaption('');
      setOpen(false);
      
      toast({
        title: files.length > 1 ? `${files.length} mídias adicionadas` : "Mídia adicionada",
        description: `${files.length > 1 ? "As mídias foram adicionadas" : "A mídia foi adicionada"} com sucesso ao seu pacote.`,
      });
    } catch (error) {
      console.error('Error processing files:', error);
      setUploading(false);
      setUploadProgress(0);
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao processar os arquivos.",
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
      
      // Determine media type from URL extension or use selected type
      let type: 'image' | 'video' | 'audio' = mediaType;
      if (/\.(mp4|webm|ogg|mov)$/i.test(uploadUrl)) {
        type = 'video';
      } else if (/\.(mp3|wav|ogg|m4a)$/i.test(uploadUrl)) {
        type = 'audio';
      } else if (/\.(jpg|jpeg|png|gif|webp)$/i.test(uploadUrl)) {
        type = 'image';
      }
      
      // Gerar um ID único para a nova mídia
      const newId = Date.now();
      
      const newMedia = {
        id: newId,
        type,
        url: uploadUrl,
        caption: caption || undefined,
        isPreview: false
      };
      
      console.log('MediaUploader - Adding media from URL:', newMedia);
      onMediaAdd(newMedia);
      
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
              Adicione imagens, vídeos ou áudios para o seu pacote de mimo. Você pode selecionar múltiplos arquivos.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="upload" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="upload">Upload de arquivo</TabsTrigger>
              <TabsTrigger value="url">URL externa</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4 space-y-4">
              <FileUploadTab
                caption={caption}
                setCaption={setCaption}
                handleUploadFile={handleUploadFile}
                uploading={uploading}
                uploadProgress={uploadProgress}
              />
            </TabsContent>
            
            <TabsContent value="url" className="mt-4 space-y-4">
              <UrlTab
                mediaType={mediaType}
                setMediaType={setMediaType}
                uploadUrl={uploadUrl}
                setUploadUrl={setUploadUrl}
                caption={caption}
                setCaption={setCaption}
                handleAddFromUrl={handleAddFromUrl}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaUploader;
