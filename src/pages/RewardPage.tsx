
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Lock, Image, Video, AudioLines, FileText, Check, Copy, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data
const mockReward = {
  id: 'reward123',
  creatorName: 'Maria Fernanda',
  packageName: 'Mimo Especial',
  message: 'Muito obrigada pelo seu apoio! Preparei este conteúdo exclusivo com todo carinho. Espero que goste!',
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 dias
  files: [
    { type: 'image', name: 'photo1.jpg', url: 'https://images.unsplash.com/photo-1611042553365-9b101441c135', caption: 'Ensaio especial para você' },
    { type: 'image', name: 'photo2.jpg', url: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb', caption: 'Momento único' },
    { type: 'image', name: 'photo3.jpg', url: 'https://images.unsplash.com/photo-1617419086540-518c5b847661', caption: 'Exclusivo para apoiadores' },
    { type: 'video', name: 'video.mp4', url: 'https://example.com/video.mp4', caption: 'Vídeo personalizado', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7' },
    { type: 'audio', name: 'audio.mp3', url: 'https://example.com/audio.mp3', caption: 'Mensagem de voz especial' }
  ]
};

const RewardPage = () => {
  const { rewardId } = useParams<{ rewardId: string }>();
  const { toast } = useToast();
  
  const [unlocked, setUnlocked] = useState(false);
  const [username, setUsername] = useState('');
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  
  const handleUnlock = () => {
    if (username.trim() === '') {
      toast({
        title: "Nome de usuário obrigatório",
        description: "Por favor, insira seu nome de usuário para acessar.",
        variant: "destructive"
      });
      return;
    }
    
    setUnlocked(true);
    setLoginDialogOpen(false);
    toast({
      title: "Acesso concedido!",
      description: "Bem-vindo às suas recompensas exclusivas.",
    });
  };
  
  const daysLeft = Math.ceil((mockReward.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  const viewFile = (file: any) => {
    setSelectedFile(file);
    setFileViewerOpen(true);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "Link copiado para a área de transferência.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="mimo-container">
          {!unlocked ? (
            <Card className="max-w-md mx-auto animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-mimo-primary" />
                  <span>Conteúdo exclusivo</span>
                </CardTitle>
                <CardDescription>
                  Acesse o conteúdo exclusivo enviado para você por {mockReward.creatorName}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Este link contém recompensas do pacote <strong>{mockReward.packageName}</strong>.
                </p>
                <Button 
                  onClick={() => setLoginDialogOpen(true)}
                  className="w-full mimo-button"
                >
                  Desbloquear conteúdo
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4 text-xs text-muted-foreground">
                <p>Use o nome de usuário que você criou ao enviar o Mimo</p>
              </CardFooter>
            </Card>
          ) : (
            <>
              <div className="max-w-3xl mx-auto mb-8 animate-fade-in">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Seu Mimo de {mockReward.creatorName}</CardTitle>
                        <CardDescription>
                          Pacote {mockReward.packageName} • Disponível por mais {daysLeft} dias
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={copyLinkToClipboard}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copiar link</span>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-accent/30 border border-border rounded-lg p-4 mb-6">
                      <p className="italic text-foreground/80">{mockReward.message}</p>
                    </div>
                    
                    <h3 className="font-medium mb-4">Conteúdo exclusivo para você</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {mockReward.files.map((file, index) => (
                        <div 
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden relative cursor-pointer group border border-border"
                          onClick={() => viewFile(file)}
                        >
                          {file.type === 'image' && (
                            <img 
                              src={file.url} 
                              alt={file.caption || file.name} 
                              className="w-full h-full object-cover"
                            />
                          )}
                          {file.type === 'video' && (
                            <div className="relative w-full h-full">
                              <img 
                                src={file.thumbnail} 
                                alt={file.caption || file.name} 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 rounded-full p-3">
                                  <Video className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>
                          )}
                          {file.type === 'audio' && (
                            <div className="relative w-full h-full bg-gradient-to-br from-mimo-primary/10 to-mimo-secondary/10 flex items-center justify-center">
                              <div className="bg-black/20 rounded-full p-3">
                                <AudioLines className="h-10 w-10 text-mimo-primary" />
                              </div>
                            </div>
                          )}
                          
                          {file.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm transform translate-y-full group-hover:translate-y-0 transition-transform">
                              {file.caption}
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              {file.type === 'image' && <Image className="h-8 w-8 text-white drop-shadow-lg" />}
                              {file.type === 'video' && <Video className="h-8 w-8 text-white drop-shadow-lg" />}
                              {file.type === 'audio' && <AudioLines className="h-8 w-8 text-white drop-shadow-lg" />}
                              {file.type === 'document' && <FileText className="h-8 w-8 text-white drop-shadow-lg" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
        
        {/* Login Dialog */}
        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Acesse seu conteúdo</DialogTitle>
              <DialogDescription>
                Insira seu nome de usuário para acessar as recompensas enviadas para você.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Nome de usuário
                </label>
                <Input
                  id="username"
                  placeholder="Seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mimo-input"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Este é o nome de usuário que você criou ao enviar o mimo.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={handleUnlock} className="mimo-button w-full">
                Desbloquear
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* File Viewer Dialog */}
        <Dialog open={fileViewerOpen} onOpenChange={setFileViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedFile && (
              <div className="py-4">
                <DialogHeader>
                  <DialogTitle>{selectedFile.caption || selectedFile.name}</DialogTitle>
                </DialogHeader>
                
                <div className="mt-4">
                  {selectedFile.type === 'image' && (
                    <img 
                      src={selectedFile.url} 
                      alt={selectedFile.caption || selectedFile.name} 
                      className="max-w-full h-auto rounded-lg mx-auto"
                    />
                  )}
                  {selectedFile.type === 'video' && (
                    <video 
                      src={selectedFile.url} 
                      controls 
                      className="max-w-full rounded-lg mx-auto"
                    />
                  )}
                  {selectedFile.type === 'audio' && (
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-center mb-4 text-muted-foreground">
                        {selectedFile.caption || "Áudio exclusivo"}
                      </p>
                      <audio 
                        src={selectedFile.url} 
                        controls 
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      
      <Footer />
    </div>
  );
};

export default RewardPage;
