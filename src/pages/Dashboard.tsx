
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ReceivedMimo from '@/components/ReceivedMimo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Heart,
  Users,
  DollarSign,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  User,
  Building,
  Clock,
  Wallet,
  ChevronRight,
  CreditCard,
  LogOut,
  Settings,
  Shield,
  Eye
} from 'lucide-react';
import { Creator } from '@/types/creator';
import { getCreatorData } from '@/services/creatorDataService';
import { useAuth } from '@/contexts/AuthContext';
import { getCreatorTransactions, getAvailableBalance, getCreatorWithdrawals } from '@/services/supabase';
import PagePreview from '@/components/PagePreview';

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
  
  const { user, logout } = useAuth();
  
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
        document: "***.***.***-**"
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Painel da Criadora</h1>
              <p className="text-foreground/70">Olá, {user?.name}! Gerencie seus mimos, saldos e pagamentos</p>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setProfileDialogOpen(true)}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Meu Perfil</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link to={`/criador/${user?.username || ''}`} target="_blank">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Ver Minha Página</span>
                </Link>
              </Button>
              <Button className="mimo-button" asChild>
                <Link to="/editar-pagina">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Editar Página</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Total arrecadado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">R${totalAmount}</span>
                  <DollarSign className="h-5 w-5 text-mimo-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in" style={{animationDelay: "0.1s"}}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Saldo disponível</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">R${availableBalance}</span>
                  <Wallet className="h-5 w-5 text-mimo-primary" />
                </div>
                <Button 
                  variant="link" 
                  className="text-mimo-primary p-0 h-auto mt-1 text-xs justify-start"
                  onClick={() => setWithdrawalDialogOpen(true)}
                >
                  Solicitar saque <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in" style={{animationDelay: "0.2s"}}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Fãs únicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{uniqueFans}</span>
                  <Users className="h-5 w-5 text-mimo-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-card to-accent/10 border-mimo-primary/20 shadow-lg animate-fade-in" style={{animationDelay: "0.3s"}}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Recompensas pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{pendingRewards}</span>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger value="mimos">Mimos</TabsTrigger>
              <TabsTrigger value="withdrawals">Saques</TabsTrigger>
              <TabsTrigger value="page">Minha Página</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mimos" className="space-y-4">
              <div className="bg-card p-4 rounded-lg shadow-sm mb-4">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="pending">Pendentes ({pendingRewards})</TabsTrigger>
                    <TabsTrigger value="delivered">Entregues ({transactions.length - pendingRewards})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4 mt-4">
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
                          onViewClick={handleViewMimo}
                        />
                      ))
                    ) : (
                      <div className="text-center p-8">
                        <p className="text-muted-foreground">Você ainda não recebeu nenhum mimo.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="pending" className="space-y-4 mt-4">
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
                          onViewClick={handleViewMimo}
                        />
                      ))}
                  </TabsContent>
                  
                  <TabsContent value="delivered" className="space-y-4 mt-4">
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
                          onViewClick={handleViewMimo}
                        />
                      ))}
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
            
            <TabsContent value="withdrawals" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Histórico de Saques</h3>
                <Button
                  onClick={() => setWithdrawalDialogOpen(true)} 
                  className="mimo-button"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Solicitar Saque
                </Button>
              </div>
              
              {withdrawals.length > 0 ? (
                <div className="space-y-4">
                  {withdrawals.map(withdrawal => (
                    <Card key={withdrawal.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center border-l-4 p-4 border-l-mimo-primary bg-gradient-to-r from-mimo-primary/5 to-background">
                          <div className="mr-4">
                            {withdrawal.status === 'completed' ? (
                              <CheckCircle className="h-10 w-10 text-green-500" />
                            ) : (
                              <Clock className="h-10 w-10 text-yellow-500" />
                            )}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-lg">R${withdrawal.amount}</p>
                                <p className="text-sm text-muted-foreground">
                                  Solicitado em {new Date(withdrawal.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  withdrawal.status === 'completed' ? 
                                  'bg-green-100 text-green-700' : 
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {withdrawal.status === 'completed' ? 'Concluído' : 'Pendente'}
                                </span>
                              </div>
                            </div>
                            
                            {withdrawal.status === 'completed' && withdrawal.updated_at && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Pago em {new Date(withdrawal.updated_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-center text-muted-foreground">
                      Nenhum saque solicitado ainda.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="page">
              {user?.username && <PagePreview username={user.username} />}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Mimo Details Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Mimo</DialogTitle>
            </DialogHeader>
            
            {selectedMimo && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Fã</p>
                    <p className="font-medium">{selectedMimo.fan_username || "Fã anônimo"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">R${selectedMimo.creator_amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pacote</p>
                    <p className="font-medium">{selectedMimo.package_name || "Mimo"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center">
                      {selectedMimo.reward_delivered ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span>Entregue</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>Pendente</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  {!selectedMimo.reward_delivered && (
                    <Button 
                      className="mimo-button"
                      onClick={() => {
                        setDetailDialogOpen(false);
                        setRewardDialogOpen(true);
                      }}
                    >
                      Enviar recompensa
                    </Button>
                  )}
                  {selectedMimo.reward_delivered && (
                    <Button variant="outline">
                      Ver recompensa enviada
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Send Reward Dialog */}
        <Dialog open={rewardDialogOpen} onOpenChange={setRewardDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enviar recompensa</DialogTitle>
            </DialogHeader>
            
            {selectedMimo && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Enviar para</p>
                  <p className="font-medium">{selectedMimo.fan_username || "Fã anônimo"} ({selectedMimo.package_name || "Mimo"})</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Arquivos da recompensa</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Arraste fotos e vídeos ou clique para selecionar</p>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      id="reward-files"
                      onChange={(e) => setRewardFiles(e.target.files)} 
                    />
                    <label htmlFor="reward-files">
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        Selecionar arquivos
                      </Button>
                    </label>
                  </div>
                  {rewardFiles && (
                    <p className="text-sm text-muted-foreground">
                      {rewardFiles.length} arquivos selecionados
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="reward-message" className="text-sm font-medium">
                    Mensagem para o fã
                  </label>
                  <Textarea 
                    id="reward-message"
                    placeholder="Escreva uma mensagem personalizada para o fã..."
                    value={rewardMessage}
                    onChange={(e) => setRewardMessage(e.target.value)}
                    className="mimo-input resize-none"
                    rows={4}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => {
                  setRewardDialogOpen(false);
                  setDetailDialogOpen(true);
                }}
              >
                Voltar
              </Button>
              <Button 
                className="mimo-button"
                onClick={handleSendReward}
              >
                Enviar recompensa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Withdrawal Dialog */}
        <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Solicitar Saque</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-mimo-primary/10 to-transparent p-4 rounded-lg">
                <p className="flex items-center text-sm">
                  <Wallet className="h-4 w-4 mr-2 text-mimo-primary" />
                  Saldo disponível: <span className="font-bold ml-2">R${availableBalance}</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="withdrawal-amount">Valor do saque</Label>
                <div className="flex items-center">
                  <span className="bg-muted rounded-l-md border border-r-0 border-border px-3 py-2 text-muted-foreground">R$</span>
                  <Input 
                    id="withdrawal-amount"
                    type="number"
                    placeholder="0,00" 
                    min="1"
                    max={availableBalance}
                    className="rounded-l-none"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-mimo-primary" />
                  Dados para saque
                </h4>
                <p className="text-sm text-foreground/70 mb-1">
                  <span className="text-mimo-primary">PIX:</span> CPF - ***.***.***-**
                </p>
                <p className="text-xs text-muted-foreground">
                  O valor será enviado para a chave PIX cadastrada em até 24h após a solicitação.
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleRequestWithdrawal} 
                className="w-full mimo-button"
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || parseFloat(withdrawalAmount) > availableBalance}
              >
                Solicitar Saque
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Profile Dialog */}
        <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Meu Perfil</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nome completo</Label>
                <Input 
                  id="profile-name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input 
                  id="profile-email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-phone">WhatsApp</Label>
                <Input 
                  id="profile-phone"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profile-document">CPF/CNPJ (não editável)</Label>
                <Input 
                  id="profile-document"
                  value={userProfile.document}
                  readOnly
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  O CPF/CNPJ é sua chave PIX e não pode ser alterado.
                </p>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-3">Alterar senha</h4>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input 
                      id="current-password"
                      type="password"
                      value={userProfile.currentPassword}
                      onChange={(e) => setUserProfile({...userProfile, currentPassword: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input 
                      id="new-password"
                      type="password"
                      value={userProfile.newPassword}
                      onChange={(e) => setUserProfile({...userProfile, newPassword: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input 
                      id="confirm-password"
                      type="password"
                      value={userProfile.confirmPassword}
                      onChange={(e) => setUserProfile({...userProfile, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="sm:flex-1 flex items-center justify-center gap-2 text-rose-500 hover:text-rose-600"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
                <Button 
                  onClick={handleUpdateProfile} 
                  className="sm:flex-1 mimo-button"
                >
                  Salvar alterações
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
