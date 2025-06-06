
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Users, AlertCircle, Wallet, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatCardsProps {
  totalAmount: number;
  availableBalance: number;
  uniqueFans: number;
  pendingRewards: number;
  onOpenWithdrawalDialog: () => void;
}

const StatCards: React.FC<StatCardsProps> = ({ 
  totalAmount, 
  availableBalance, 
  uniqueFans, 
  pendingRewards,
  onOpenWithdrawalDialog 
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
      <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in">
        <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
          <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Total arrecadado</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-2xl font-bold">R${totalAmount}</span>
            <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 text-mimo-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in" style={{animationDelay: "0.1s"}}>
        <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
          <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Saldo disponível</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0 flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-2xl font-bold">R${availableBalance}</span>
            <Wallet className="h-4 sm:h-5 w-4 sm:w-5 text-mimo-primary" />
          </div>
          <Button 
            variant="link" 
            className="text-mimo-primary p-0 h-auto mt-1 text-xs justify-start"
            onClick={onOpenWithdrawalDialog}
          >
            Solicitar saque <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in" style={{animationDelay: "0.2s"}}>
        <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
          <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Fãs únicos</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-2xl font-bold">{uniqueFans}</span>
            <Users className="h-4 sm:h-5 w-4 sm:w-5 text-mimo-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in" style={{animationDelay: "0.3s"}}>
        <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
          <CardTitle className="text-muted-foreground text-xs sm:text-sm font-normal">Recompensas pendentes</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
          <div className="flex justify-between items-center">
            <span className="text-base sm:text-2xl font-bold">{pendingRewards}</span>
            <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
