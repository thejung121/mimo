
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Creator } from '@/types/creator';
import { getCurrentCreator } from '@/services/supabase/creatorService';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorTransactions, getAvailableBalance, getCreatorWithdrawals } from '@/services/supabase';

export const useDashboard = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  
  useEffect(() => {
    // Use the authenticated user's information to load their creator profile
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // Load creator profile from Supabase
          const creatorData = await getCurrentCreator();
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
          if (creatorData?.id) {
            const [txData, withdrawalData, balance] = await Promise.all([
              getCreatorTransactions(creatorData.id),
              getCreatorWithdrawals(creatorData.id),
              getAvailableBalance(creatorData.id)
            ]);
            
            setTransactions(txData);
            setWithdrawals(withdrawalData);
            setAvailableBalance(balance);
          }
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao carregar seus dados. Por favor, tente novamente.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user, toast]);

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
  const totalAmount = transactions.reduce((acc, mimo) => acc + (mimo.creator_amount || mimo.amount || 0), 0);
  const pendingRewards = transactions.filter(mimo => !mimo.reward_delivered).length;
  const uniqueFans = new Set(transactions.map(tx => tx.fan_id || tx.id)).size;

  return {
    // State
    detailDialogOpen,
    rewardDialogOpen,
    selectedMimo,
    rewardMessage,
    rewardFiles,
    withdrawalDialogOpen,
    withdrawalAmount,
    activeTab,
    profileDialogOpen,
    userProfile,
    creator,
    transactions,
    withdrawals,
    availableBalance,
    totalAmount,
    pendingRewards,
    uniqueFans,
    isLoading,
    
    // Setters
    setDetailDialogOpen,
    setRewardDialogOpen,
    setRewardMessage,
    setRewardFiles,
    setWithdrawalDialogOpen,
    setWithdrawalAmount,
    setActiveTab,
    setProfileDialogOpen,
    setUserProfile,
    
    // Handlers
    handleViewMimo,
    handleSendReward,
    handleRequestWithdrawal,
    handleUpdateProfile
  };
};
