
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  progress: number;
}

const UploadProgress = ({ progress }: UploadProgressProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-center">Enviando arquivo...</p>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
