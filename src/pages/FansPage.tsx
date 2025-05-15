
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

const FansPage = () => {
  const { transactions } = useDashboard();
  
  // Extract unique fans from transactions
  const uniqueFans = transactions.reduce((acc, tx) => {
    if (tx.fan_id && !acc.some(fan => fan.id === tx.fan_id)) {
      acc.push({
        id: tx.fan_id,
        username: tx.fan_username || 'Fã anônimo',
        total: transactions.filter(t => t.fan_id === tx.fan_id)
          .reduce((sum, t) => sum + (t.creator_amount || t.amount || 0), 0)
      });
    }
    return acc;
  }, []);
  
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Fãs</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Seus Fãs</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{uniqueFans.length} fãs</span>
              </div>
            </CardHeader>
            <CardContent>
              {uniqueFans.length > 0 ? (
                <div className="space-y-4">
                  {uniqueFans.map(fan => (
                    <div key={fan.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{fan.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{fan.username}</h3>
                          <p className="text-sm text-muted-foreground">
                            Total: R$ {fan.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">Você ainda não tem fãs.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FansPage;
