
import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import UploadProgress from './UploadProgress';

interface FileUploadTabProps {
  caption: string;
  setCaption: (caption: string) => void;
  handleUploadFile: (files: FileList) => void;
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
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
      handleUploadFile(e.dataTransfer.files);
    }
  }, [handleUploadFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      handleUploadFile(e.target.files);
    }
  };
  
  const cancelSelection = () => {
    setSelectedFiles(null);
  };
  
  return (
    <div className="flex flex-col space-y-3">
      {uploading ? (
        <UploadProgress 
          progress={uploadProgress} 
          filesCount={selectedFiles?.length}
        />
      ) : (
        <>
          <div 
            className={`relative flex flex-col items-center justify-center h-32 border-2 ${dragActive ? "border-primary bg-primary/5" : "border-dashed"} rounded-md cursor-pointer text-muted-foreground hover:bg-muted/50 transition-colors`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="hidden" 
              id="file-upload"
              accept="image/*,video/*,audio/*" 
              onChange={handleFileChange}
              multiple
            />
            
            {selectedFiles ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-1 font-medium">
                  {selectedFiles.length} {selectedFiles.length === 1 ? "arquivo selecionado" : "arquivos selecionados"}
                </p>
                <button 
                  onClick={cancelSelection}
                  className="text-xs text-destructive hover:underline flex items-center"
                  type="button"
                >
                  <X className="h-3 w-3 mr-1" /> Cancelar
                </button>
              </div>
            ) : (
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full cursor-pointer">
                <Upload className="h-10 w-10 mb-2" />
                <p className="mb-2 text-sm">Clique ou arraste para fazer upload</p>
                <p className="text-xs">Vários arquivos permitidos</p>
              </label>
            )}
          </div>
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
