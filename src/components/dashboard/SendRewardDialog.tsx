
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

interface SendRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMimo: any;
  rewardMessage: string;
  setRewardMessage: (message: string) => void;
  rewardFiles: FileList | null;
  setRewardFiles: (files: FileList | null) => void;
  onSendReward: () => void;
  onBack: () => void;
}

const SendRewardDialog: React.FC<SendRewardDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedMimo,
  rewardMessage,
  setRewardMessage,
  rewardFiles,
  setRewardFiles,
  onSendReward,
  onBack
}) => {
  if (!selectedMimo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar recompensa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Enviar para</p>
            <p className="font-medium">{selectedMimo.fan_username || "Fã anônimo"} ({selectedMimo.package_name || "Mimo"})</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivos da recompensa</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Arraste fotos e vídeos ou clique para selecionar</p>
              <input 
                type="file" 
                multiple 
                className="hidden" 
                id="reward-files"
                onChange={(e) => setRewardFiles(e.target.files)} 
              />
              <label htmlFor="reward-files">
                <Button type="button" variant="outline" size="sm" className="mt-2">
                  Selecionar arquivos
                </Button>
              </label>
            </div>
            {rewardFiles && (
              <p className="text-sm text-muted-foreground">
                {rewardFiles.length} arquivos selecionados
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="reward-message" className="text-sm font-medium">
              Mensagem para o fã
            </label>
            <Textarea 
              id="reward-message"
              placeholder="Escreva uma mensagem personalizada para o fã..."
              value={rewardMessage}
              onChange={(e) => setRewardMessage(e.target.value)}
              className="mimo-input resize-none"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button 
            className="mimo-button"
            onClick={onSendReward}
          >
            Enviar recompensa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendRewardDialog;
