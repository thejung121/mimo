
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MimosTab from './MimosTab';
import WithdrawalsTab from './WithdrawalsTab';
import PagePreview from '@/components/PagePreview';
import { useAuth } from '@/contexts/AuthContext';

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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
      <TabsList className="mb-4 grid grid-cols-3">
        <TabsTrigger value="mimos">Mimos</TabsTrigger>
        <TabsTrigger value="withdrawals">Saques</TabsTrigger>
        <TabsTrigger value="page">Minha Página</TabsTrigger>
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
        {user?.username && <PagePreview username={user.username} />}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
