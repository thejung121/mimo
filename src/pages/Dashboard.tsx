
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCards from '@/components/dashboard/StatCards';
import MimosTab from '@/components/dashboard/MimosTab';
import WithdrawalsTab from '@/components/dashboard/WithdrawalsTab';
import { useDashboard } from '@/hooks/useDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Copy, ExternalLink, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PagePreview from '@/components/PagePreview';

const Dashboard = () => {
  const {
    // State & Data
    transactions,
    withdrawals,
    availableBalance,
    totalAmount,
    pendingRewards,
    uniqueFans,
    activeTab,
    
    // Handlers
    setActiveTab,
    handleViewMimo,
    setWithdrawalDialogOpen
  } = useDashboard();

  const { toast } = useToast();
  const { user } = useAuth();
  
  const copyShareLink = () => {
    if (user?.username) {
      const shareLink = `${window.location.origin}/criador/${user.username}`;
      navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link copiado!",
        description: "Link de divulgação copiado para a área de transferência.",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <StatCards 
          totalAmount={totalAmount}
          availableBalance={availableBalance}
          uniqueFans={uniqueFans}
          pendingRewards={pendingRewards}
          onOpenWithdrawalDialog={() => setWithdrawalDialogOpen(true)}
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4 grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="mimos" className="text-sm sm:text-base">Mimos</TabsTrigger>
            <TabsTrigger value="withdrawals" className="text-sm sm:text-base">Saques</TabsTrigger>
            <TabsTrigger value="page" className="text-sm sm:text-base">Minha Página</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mimos" className="space-y-4">
            <MimosTab 
              transactions={transactions} 
              pendingRewards={pendingRewards}
              onViewMimo={handleViewMimo}
            />
          </TabsContent>
          
          <TabsContent value="withdrawals" className="space-y-4">
            <WithdrawalsTab 
              withdrawals={withdrawals}
              onOpenWithdrawalDialog={() => setWithdrawalDialogOpen(true)}
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
                <Button 
                  className="flex items-center gap-2" 
                  variant="outline"
                  asChild
                >
                  <Link to={`/criador/${user?.username || ''}`} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                    Ver Página Atualizada
                  </Link>
                </Button>
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
                {user?.username && <PagePreview username={user.username} />}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
