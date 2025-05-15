
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MimosTab from '@/components/dashboard/MimosTab';

const MimosPage = () => {
  const { transactions, pendingRewards, handleViewMimo } = useDashboard();
  
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Mimos</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mimos Recebidos</CardTitle>
            </CardHeader>
            <CardContent>
              <MimosTab 
                transactions={transactions} 
                pendingRewards={pendingRewards}
                onViewMimo={handleViewMimo}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MimosPage;
