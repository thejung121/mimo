
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MimosTab from './MimosTab';
import WithdrawalsTab from './WithdrawalsTab';
import PagePreview from '@/components/PagePreview';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, Edit } from 'lucide-react';
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 max-w-full overflow-hidden">
      <TabsList className="mb-4 grid grid-cols-3 w-full">
        <TabsTrigger value="mimos" className="text-sm sm:text-base">Mimos</TabsTrigger>
        <TabsTrigger value="withdrawals" className="text-sm sm:text-base">Saques</TabsTrigger>
        <TabsTrigger value="page" className="text-sm sm:text-base">Minha Página</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mimos" className="space-y-4">
        <MimosTab 
          transactions={transactions} 
          pendingRewards={pendingRewards}
          onViewMimo={onViewMimo}
        />
      </TabsContent>
      
      <TabsContent value="withdrawals" className="space-y-4">
        <WithdrawalsTab 
          withdrawals={withdrawals}
          onOpenWithdrawalDialog={onOpenWithdrawalDialog}
        />
      </TabsContent>
      
      <TabsContent value="page">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2" 
              variant="outline"
              onClick={copyShareLink}
            >
              <Copy className="h-4 w-4" />
              Copiar Link de Divulgação
            </Button>
            {user?.username ? (
              <Button 
                className="flex items-center gap-2" 
                variant="outline"
                asChild
              >
                <Link to={`/criador/${user.username}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Ver Página Atualizada
                </Link>
              </Button>
            ) : (
              <Button
                className="flex items-center gap-2"
                variant="outline"
                disabled
                title="Configure seu nome de usuário no perfil"
              >
                <ExternalLink className="h-4 w-4" />
                Ver Página Atualizada
              </Button>
            )}
            <Button 
              className="flex items-center gap-2 mimo-button" 
              asChild
            >
              <Link to="/editar-pagina">
                <Edit className="h-4 w-4" />
                Editar Página
              </Link>
            </Button>
          </div>

          <div className="w-full overflow-x-hidden border rounded-lg">
            {user?.username ? (
              <PagePreview username={user.username} />
            ) : (
              <div className="p-8 text-center">
                <p>Configure um nome de usuário para visualizar sua página</p>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
