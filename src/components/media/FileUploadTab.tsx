
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import UploadProgress from './UploadProgress';

interface FileUploadTabProps {
  caption: string;
  setCaption: (caption: string) => void;
  handleUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  uploadProgress: number;
}

const FileUploadTab = ({ 
  caption, 
  setCaption, 
  handleUploadFile, 
  uploading, 
  uploadProgress 
}: FileUploadTabProps) => {
  return (
    <div className="flex flex-col space-y-2">
      {uploading ? (
        <UploadProgress progress={uploadProgress} />
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
  );
};

export default FileUploadTab;
