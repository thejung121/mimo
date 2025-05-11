
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { Creator } from '@/types/creator';
import { getCreatorData } from '@/services/creatorDataService';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorTransactions, getAvailableBalance, getCreatorWithdrawals } from '@/services/supabase';
import PagePreview from '@/components/PagePreview';

// Dashboard components
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import MimosTab from '@/components/dashboard/MimosTab';
import WithdrawalsTab from '@/components/dashboard/WithdrawalsTab';
import MimoDetailDialog from '@/components/dashboard/MimoDetailDialog';
import SendRewardDialog from '@/components/dashboard/SendRewardDialog';
import WithdrawalDialog from '@/components/dashboard/WithdrawalDialog';
import ProfileDialog from '@/components/dashboard/ProfileDialog';

const Dashboard = () => {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedMimo, setSelectedMimo] = useState<any>(null);
  const [rewardMessage, setRewardMessage] = useState('');
  const [rewardFiles, setRewardFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [activeTab, setActiveTab] = useState('mimos');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [creator, setCreator] = useState<Creator | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [availableBalance, setAvailableBalance] = useState(0);
  
  const { user } = useAuth();
  
  useEffect(() => {
    // Use the authenticated user's information to load their creator profile
    if (user) {
      const creatorData = getCreatorData();
      setCreator(creatorData);
      
      // Set user profile data
      setUserProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: "",
        document: user.document || ''
      }));
      
      // Load real transaction data
      const fetchTransactions = async () => {
        if (creatorData.id) {
          const txData = await getCreatorTransactions(creatorData.id);
          setTransactions(txData);
        }
      };
      
      // Load real withdrawal data
      const fetchWithdrawals = async () => {
        if (creatorData.id) {
          const withdrawalData = await getCreatorWithdrawals(creatorData.id);
          setWithdrawals(withdrawalData);
        }
      };
      
      // Load real balance data
      const fetchBalance = async () => {
        if (creatorData.id) {
          const balance = await getAvailableBalance(creatorData.id);
          setAvailableBalance(balance);
        }
      };
      
      fetchTransactions();
      fetchWithdrawals();
      fetchBalance();
    }
  }, [user]);

  const handleViewMimo = (id: string) => {
    const mimo = transactions.find(m => m.id === id);
    setSelectedMimo(mimo);
    setDetailDialogOpen(true);
  };

  const handleSendReward = () => {
    if (!rewardMessage.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, escreva uma mensagem para o fã.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Recompensa enviada com sucesso!",
      description: "O fã já pode acessar o conteúdo exclusivo.",
    });
    
    setRewardDialogOpen(false);
    setDetailDialogOpen(false);
    setRewardMessage('');
  };
  
  const handleRequestWithdrawal = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, informe um valor válido para saque.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Solicitação de saque enviada!",
      description: `Seu saque de R$${amount.toFixed(2)} foi solicitado e será processado em até 24 horas.`,
    });
    
    setWithdrawalDialogOpen(false);
    setWithdrawalAmount('');
  };
  
  const handleUpdateProfile = () => {
    toast({
      title: "Perfil atualizado com sucesso!",
      description: "Suas informações pessoais foram atualizadas.",
    });
    
    setProfileDialogOpen(false);
  };

  // Calculate real stats based on actual data
  const totalAmount = transactions.reduce((acc, mimo) => acc + (mimo.creator_amount || 0), 0);
  const pendingRewards = transactions.filter(mimo => !mimo.reward_delivered).length;
  const uniqueFans = new Set(transactions.map(tx => tx.fan_id || tx.id)).size;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8 bg-gradient-to-b from-background to-accent/10">
        <div className="mimo-container">
          <DashboardHeader onOpenProfileDialog={() => setProfileDialogOpen(true)} />
          
          <StatCards 
            totalAmount={totalAmount}
            availableBalance={availableBalance}
            uniqueFans={uniqueFans}
            pendingRewards={pendingRewards}
            onOpenWithdrawalDialog={() => setWithdrawalDialogOpen(true)}
          />
          
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
              {user?.username && <PagePreview username={user.username} />}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Dialogs */}
        <MimoDetailDialog 
          open={detailDialogOpen} 
          onOpenChange={setDetailDialogOpen}
          selectedMimo={selectedMimo}
          onSendReward={() => {
            setDetailDialogOpen(false);
            setRewardDialogOpen(true);
          }}
        />
        
        <SendRewardDialog 
          open={rewardDialogOpen}
          onOpenChange={setRewardDialogOpen}
          selectedMimo={selectedMimo}
          rewardMessage={rewardMessage}
          setRewardMessage={setRewardMessage}
          rewardFiles={rewardFiles}
          setRewardFiles={setRewardFiles}
          onSendReward={handleSendReward}
          onBack={() => {
            setRewardDialogOpen(false);
            setDetailDialogOpen(true);
          }}
        />
        
        <WithdrawalDialog 
          open={withdrawalDialogOpen}
          onOpenChange={setWithdrawalDialogOpen}
          availableBalance={availableBalance}
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
          onRequestWithdrawal={handleRequestWithdrawal}
        />
        
        <ProfileDialog 
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onUpdateProfile={handleUpdateProfile}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
