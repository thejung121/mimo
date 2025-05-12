
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Check, X, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define transaction and withdrawal types to match what's in the database
interface Transaction {
  id: string;
  created_at: string;
  creator_id: string;
  buyer_alias: string;
  package_name?: string;
  amount: number;
  platform_fee: number;
  status: string;
  creators?: {
    name: string;
    username: string;
  }
}

interface Withdrawal {
  id: string;
  creator_id: string;
  amount: number;
  status: string;
  pix_key: string;
  created_at: string;
  creators?: {
    name: string;
    username: string;
  }
}

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [activeTab, setActiveTab] = useState('transactions');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      // TODO: Replace with actual admin check
      // This is a temporary check, in production you would check against a real admin list
      const isUserAdmin = user?.email === 'admin@example.com';
      setIsAdmin(isUserAdmin);
      
      if (!isUserAdmin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive"
        });
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user, navigate, toast]);

  // Fetch transactions and withdrawals
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) return;
      
      setIsLoading(true);
      
      try {
        // Get all available tables from the database
        const { data: availableTables } = await supabase
          .from('donations')
          .select('*')
          .limit(0);
        
        // Fetch transactions (use donations table if transactions doesn't exist)
        try {
          const { data: transactionData, error: transactionError } = await supabase
            .from('donations')
            .select(`
              *,
              creators:creator_id (name, username)
            `)
            .order('created_at', { ascending: false });
          
          if (transactionError) throw transactionError;
          setTransactions(transactionData as Transaction[] || []);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setTransactions([]);
        }
        
        // Use the demo mode since withdrawals table may not exist yet
        try {
          const { data: withdrawalData, error: withdrawalError } = await supabase
            .from('donations')  // Use donations table as fallback
            .select(`
              *,
              creators:creator_id (name, username)
            `)
            .eq('status', 'completed')  // Just as an example filter
            .order('created_at', { ascending: false });
          
          if (withdrawalError) throw withdrawalError;
          // Transform data to match withdrawal structure for demo purposes
          const transformedData = (withdrawalData || []).map(item => ({
            id: item.id,
            creator_id: item.creator_id,
            amount: item.amount * 0.9, // Simulating 90% of donation amount
            status: 'pending', // Default status
            pix_key: 'pix@example.com', // Example PIX key
            created_at: item.created_at,
            creators: item.creators
          }));
          
          setWithdrawals(transformedData as Withdrawal[]);
        } catch (error) {
          console.error('Error fetching withdrawals:', error);
          setWithdrawals([]);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados administrativos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin, toast]);

  // Handle withdrawal approval
  const handleWithdrawalApproval = async (id, approve) => {
    try {
      // Since we're in demo mode, just update the local state
      // In production, you would make an actual database update
      setWithdrawals(withdrawals.map(w => 
        w.id === id 
          ? { ...w, status: approve ? 'completed' : 'rejected' } 
          : w
      ));
      
      toast({
        title: approve ? "Saque aprovado" : "Saque rejeitado",
        description: approve 
          ? "O saque foi aprovado e marcado como concluído." 
          : "O saque foi rejeitado."
      });
    } catch (error) {
      console.error('Error updating withdrawal:', error);
      toast({
        title: "Erro ao processar saque",
        description: "Ocorreu um erro ao processar o saque.",
        variant: "destructive"
      });
    }
  };

  // Export data to CSV
  const exportToCSV = (dataType) => {
    const data = dataType === 'transactions' ? transactions : withdrawals;
    
    // Create CSV content
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(item => 
      Object.values(item).map(val => 
        typeof val === 'object' ? JSON.stringify(val) : val
      ).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    
    // Create and download the file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return <div className="flex justify-center items-center h-screen">Verificando permissões...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-4 sm:py-8 bg-gradient-to-b from-background to-accent/10">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="transactions">Transações</TabsTrigger>
                <TabsTrigger value="withdrawals">Saques</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transactions">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Transações</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!transactions.length || isLoading}
                    onClick={() => exportToCSV('transactions')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>
                      {isLoading ? 'Carregando transações...' : (
                        transactions.length 
                          ? `Total de ${transactions.length} transações` 
                          : 'Nenhuma transação encontrada'
                      )}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Criadora</TableHead>
                        <TableHead>Fã</TableHead>
                        <TableHead>Pacote</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Taxa</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">{tx.id.substring(0, 8)}...</TableCell>
                          <TableCell>{format(new Date(tx.created_at), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{tx.creators?.username || 'Desconhecido'}</TableCell>
                          <TableCell>{tx.buyer_alias || 'Anônimo'}</TableCell>
                          <TableCell>{tx.package_name || 'Mimo personalizado'}</TableCell>
                          <TableCell>R${tx.amount}</TableCell>
                          <TableCell>R${tx.platform_fee || (tx.amount * 0.1).toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : tx.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tx.status === 'completed' ? 'Concluído' : 
                               tx.status === 'pending' ? 'Pendente' : 'Falhou'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="withdrawals">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Saques</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!withdrawals.length || isLoading}
                    onClick={() => exportToCSV('withdrawals')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>
                      {isLoading ? 'Carregando saques...' : (
                        withdrawals.length 
                          ? `Total de ${withdrawals.length} saques` 
                          : 'Nenhum saque encontrado'
                      )}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Criadora</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Chave PIX</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {withdrawals.map(withdrawal => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="font-mono text-xs">{withdrawal.id.substring(0, 8)}...</TableCell>
                          <TableCell>{format(new Date(withdrawal.created_at), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{withdrawal.creators?.username || 'Desconhecido'}</TableCell>
                          <TableCell>R${withdrawal.amount}</TableCell>
                          <TableCell>{withdrawal.pix_key}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              withdrawal.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : withdrawal.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {withdrawal.status === 'completed' ? 'Pago' : 
                               withdrawal.status === 'pending' ? 'Pendente' : 'Rejeitado'}
                            </span>
                          </TableCell>
                          <TableCell>
                            {withdrawal.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                                  onClick={() => handleWithdrawalApproval(withdrawal.id, true)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                                  onClick={() => handleWithdrawalApproval(withdrawal.id, false)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
