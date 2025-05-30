
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivedMimo from '@/components/ReceivedMimo';

interface MimosTabProps {
  transactions: any[];
  pendingRewards: number;
  onViewMimo: (id: string) => void;
}

const MimosTab: React.FC<MimosTabProps> = ({ transactions, pendingRewards, onViewMimo }) => {
  return (
    <div className="bg-card p-3 sm:p-4 rounded-lg shadow-sm mb-4 overflow-x-auto">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="text-xs sm:text-sm">Todos</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm">Pendentes ({pendingRewards})</TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs sm:text-sm">Entregues ({transactions.length - pendingRewards})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4 w-full">
          {transactions.length > 0 ? (
            transactions.map(tx => (
              <ReceivedMimo
                key={tx.id}
                id={tx.id}
                username={tx.fan_username || "Fã anônimo"}
                amount={tx.creator_amount || 0}
                packageName={tx.package_name || "Mimo"}
                createdAt={new Date(tx.created_at)}
                rewardDelivered={!!tx.reward_delivered}
                onViewClick={onViewMimo}
              />
            ))
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground text-sm sm:text-base">Você ainda não recebeu nenhum mimo.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4 mt-4 w-full">
          {transactions
            .filter(tx => !tx.reward_delivered)
            .map(tx => (
              <ReceivedMimo
                key={tx.id}
                id={tx.id}
                username={tx.fan_username || "Fã anônimo"}
                amount={tx.creator_amount || 0}
                packageName={tx.package_name || "Mimo"}
                createdAt={new Date(tx.created_at)}
                rewardDelivered={false}
                onViewClick={onViewMimo}
              />
            ))}
        </TabsContent>
        
        <TabsContent value="delivered" className="space-y-4 mt-4 w-full">
          {transactions
            .filter(tx => tx.reward_delivered)
            .map(tx => (
              <ReceivedMimo
                key={tx.id}
                id={tx.id}
                username={tx.fan_username || "Fã anônimo"}
                amount={tx.creator_amount || 0}
                packageName={tx.package_name || "Mimo"}
                createdAt={new Date(tx.created_at)}
                rewardDelivered={true}
                onViewClick={onViewMimo}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MimosTab;
