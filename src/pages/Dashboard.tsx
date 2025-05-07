
import React, { useState } from 'react';
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
  CardTitle 
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
import { Button } from '@/components/ui/button';
import { 
  Heart,
  Users,
  DollarSign,
  Upload,
  CheckCircle,
  AlertCircle,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockMimos = [
  {
    id: '1',
    username: 'joaosilva',
    amount: 20,
    packageName: 'Mimo Básico',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    rewardDelivered: true
  },
  {
    id: '2',
    username: 'mariaeduarda',
    amount: 50,
    packageName: 'Mimo Especial',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    rewardDelivered: false
  },
  {
    id: '3',
    username: 'pedrohenrique',
    amount: 100,
    packageName: 'Mimo Premium',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    rewardDelivered: false
  },
  {
    id: '4',
    username: 'anajulia',
    amount: 50,
    packageName: 'Mimo Especial',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    rewardDelivered: true
  }
];

const Dashboard = () => {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [selectedMimo, setSelectedMimo] = useState<any>(null);
  const [rewardMessage, setRewardMessage] = useState('');
  const [rewardFiles, setRewardFiles] = useState<FileList | null>(null);
  const { toast } = useToast();

  const handleViewMimo = (id: string) => {
    const mimo = mockMimos.find(m => m.id === id);
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

  const totalAmount = mockMimos.reduce((acc, mimo) => acc + mimo.amount, 0);
  const pendingCount = mockMimos.filter(mimo => !mimo.rewardDelivered).length;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container">
          <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
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
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Mimos recebidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{mockMimos.length}</span>
                  <Heart className="h-5 w-5 text-mimo-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Fãs únicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{mockMimos.length}</span>
                  <Users className="h-5 w-5 text-mimo-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-normal">Recompensas pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{pendingCount}</span>
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Todos os mimos</TabsTrigger>
              <TabsTrigger value="pending">Pendentes ({pendingCount})</TabsTrigger>
              <TabsTrigger value="delivered">Entregues ({mockMimos.length - pendingCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {mockMimos.map(mimo => (
                <ReceivedMimo
                  key={mimo.id}
                  id={mimo.id}
                  username={mimo.username}
                  amount={mimo.amount}
                  packageName={mimo.packageName}
                  createdAt={mimo.createdAt}
                  rewardDelivered={mimo.rewardDelivered}
                  onViewClick={handleViewMimo}
                />
              ))}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {mockMimos
                .filter(mimo => !mimo.rewardDelivered)
                .map(mimo => (
                  <ReceivedMimo
                    key={mimo.id}
                    id={mimo.id}
                    username={mimo.username}
                    amount={mimo.amount}
                    packageName={mimo.packageName}
                    createdAt={mimo.createdAt}
                    rewardDelivered={mimo.rewardDelivered}
                    onViewClick={handleViewMimo}
                  />
                ))}
            </TabsContent>
            
            <TabsContent value="delivered" className="space-y-4">
              {mockMimos
                .filter(mimo => mimo.rewardDelivered)
                .map(mimo => (
                  <ReceivedMimo
                    key={mimo.id}
                    id={mimo.id}
                    username={mimo.username}
                    amount={mimo.amount}
                    packageName={mimo.packageName}
                    createdAt={mimo.createdAt}
                    rewardDelivered={mimo.rewardDelivered}
                    onViewClick={handleViewMimo}
                  />
                ))}
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle>Minha página de criador</CardTitle>
              <CardDescription>
                Configure sua página personalizada para receber mimos dos seus fãs.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <Button className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span>Copiar link</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link to="/editar-pagina">
                  <FileText className="h-4 w-4" />
                  <span>Editar página</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
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
                    <p className="font-medium">{selectedMimo.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">R${selectedMimo.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pacote</p>
                    <p className="font-medium">{selectedMimo.packageName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center">
                      {selectedMimo.rewardDelivered ? (
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
                  {!selectedMimo.rewardDelivered && (
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
                  {selectedMimo.rewardDelivered && (
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
                  <p className="font-medium">{selectedMimo.username} ({selectedMimo.packageName})</p>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
