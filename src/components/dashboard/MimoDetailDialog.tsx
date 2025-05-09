
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface MimoDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedMimo: any;
  onSendReward: () => void;
}

const MimoDetailDialog: React.FC<MimoDetailDialogProps> = ({ 
  open, 
  onOpenChange, 
  selectedMimo, 
  onSendReward 
}) => {
  if (!selectedMimo) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do Mimo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Fã</p>
              <p className="font-medium">{selectedMimo.fan_username || "Fã anônimo"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="font-medium">R${selectedMimo.creator_amount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pacote</p>
              <p className="font-medium">{selectedMimo.package_name || "Mimo"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center">
                {selectedMimo.reward_delivered ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span>Entregue</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>Pendente</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            {!selectedMimo.reward_delivered && (
              <Button 
                className="mimo-button"
                onClick={onSendReward}
              >
                Enviar recompensa
              </Button>
            )}
            {selectedMimo.reward_delivered && (
              <Button variant="outline">
                Ver recompensa enviada
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MimoDetailDialog;
