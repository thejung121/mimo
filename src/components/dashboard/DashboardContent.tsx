
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MimosTab from './MimosTab';
import WithdrawalsTab from './WithdrawalsTab';
import PagePreview from '@/components/PagePreview';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transactions: any[];
  withdrawals: any[];
  pendingRewards: number;
  onViewMimo: (id: string) => void;
  onOpenWithdrawalDialog: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  activeTab,
  setActiveTab,
  transactions,
  withdrawals,
  pendingRewards,
  onViewMimo,
  onOpenWithdrawalDialog
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const copyShareLink = () => {
    if (user?.username) {
      const shareLink = `${window.location.origin}/criador/${user.username}`;
      navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copiado!",
        description: "Link de divulgação copiado para a área de transferência.",
      });
    } else {
      toast({
        title: "Nome de usuário não definido",
        description: "Configure seu nome de usuário no perfil.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-full min-w-0">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-full overflow-hidden">
        <TabsList className="mb-4 grid grid-cols-3 w-full max-w-full">
          <TabsTrigger value="mimos" className="text-xs sm:text-sm truncate">Mimos</TabsTrigger>
          <TabsTrigger value="withdrawals" className="text-xs sm:text-sm truncate">Saques</TabsTrigger>
          <TabsTrigger value="page" className="text-xs sm:text-sm truncate">Minha Página</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mimos" className="space-y-4 w-full max-w-full min-w-0">
          <MimosTab 
            transactions={transactions} 
            pendingRewards={pendingRewards}
            onViewMimo={onViewMimo}
          />
        </TabsContent>
        
        <TabsContent value="withdrawals" className="space-y-4 w-full max-w-full min-w-0">
          <WithdrawalsTab 
            withdrawals={withdrawals}
            onOpenWithdrawalDialog={onOpenWithdrawalDialog}
          />
        </TabsContent>
        
        <TabsContent value="page" className="w-full max-w-full min-w-0">
          <div className="space-y-4 w-full">
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <Button 
                className="flex items-center gap-2 text-xs sm:text-sm" 
                variant="outline"
                onClick={copyShareLink}
                size="sm"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Copiar Link</span>
              </Button>
              {user?.username ? (
                <Button 
                  className="flex items-center gap-2 text-xs sm:text-sm" 
                  variant="outline"
                  asChild
                  size="sm"
                >
                  <Link to={`/criador/${user.username}`} target="_blank">
                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">Ver Página</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  className="flex items-center gap-2 text-xs sm:text-sm"
                  variant="outline"
                  disabled
                  size="sm"
                  title="Configure seu nome de usuário no perfil"
                >
                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate">Ver Página</span>
                </Button>
              )}
              <Button 
                className="flex items-center gap-2 mimo-button text-xs sm:text-sm" 
                asChild
                size="sm"
              >
                <Link to="/editar-pagina">
                  <span className="truncate">Gerenciar Página</span>
                </Link>
              </Button>
            </div>

            <div className="w-full max-w-full overflow-hidden border rounded-lg">
              {user?.username ? (
                <div className="w-full overflow-x-auto">
                  <PagePreview username={user.username} />
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-center">
                  <p className="text-sm">Configure um nome de usuário para visualizar sua página</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardContent;
