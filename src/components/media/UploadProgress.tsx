
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  progress: number;
  filesCount?: number;
}

const UploadProgress = ({ progress, filesCount = 1 }: UploadProgressProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-center">
        {filesCount > 1 
          ? `Enviando ${filesCount} arquivos...` 
          : "Enviando arquivo..."}
      </p>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-center text-muted-foreground">
        {Math.floor(progress)}%
      </p>
    </div>
  );
};

export default UploadProgress;
