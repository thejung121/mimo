
import React from 'react';
import { Building, CheckCircle, Clock, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WithdrawalsTabProps {
  withdrawals: any[];
  onOpenWithdrawalDialog: () => void;
}

const WithdrawalsTab: React.FC<WithdrawalsTabProps> = ({ withdrawals, onOpenWithdrawalDialog }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Histórico de Saques</h3>
        <Button
          onClick={onOpenWithdrawalDialog} 
          className="mimo-button w-full sm:w-auto text-sm"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Solicitar Saque
        </Button>
      </div>
      
      {withdrawals.length > 0 ? (
        <div className="space-y-4">
          {withdrawals.map(withdrawal => (
            <Card key={withdrawal.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center border-l-4 p-3 sm:p-4 border-l-mimo-primary bg-gradient-to-r from-mimo-primary/5 to-background">
                  <div className="mr-3 sm:mr-4 flex-shrink-0">
                    {withdrawal.status === 'completed' ? (
                      <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" />
                    ) : (
                      <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <p className="font-semibold text-base sm:text-lg">R${withdrawal.amount}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {new Date(withdrawal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="mt-2 sm:mt-0">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          withdrawal.status === 'completed' ? 
                          'bg-green-100 text-green-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {withdrawal.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                    
                    {withdrawal.status === 'completed' && withdrawal.updated_at && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Pago em {new Date(withdrawal.updated_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Building className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
            <p className="text-center text-sm sm:text-base text-muted-foreground">
              Nenhum saque solicitado ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WithdrawalsTab;
