import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userProfile: {
    name: string;
    email: string;
    phone: string;
    document: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setUserProfile: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    document: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>>;
  onUpdateProfile: () => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({ 
  open, 
  onOpenChange, 
  userProfile,
  setUserProfile,
  onUpdateProfile
}) => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to format CPF/CNPJ as user types
  const formatDocument = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format based on length (CPF or CNPJ)
    if (digits.length <= 11) {
      // CPF format: 123.456.789-01
      return digits
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1-');
    } else {
      // CNPJ format: 12.345.678/0001-90
      return digits
        .replace(/(\d{2})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1/')
        .replace(/(\d{4})(?=\d)/, '$1-');
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { 
          name: userProfile.name,
          document: userProfile.document,
        }
      });

      if (error) {
        throw error;
      }

      // Update password if provided
      if (userProfile.currentPassword && userProfile.newPassword && userProfile.confirmPassword) {
        if (userProfile.newPassword !== userProfile.confirmPassword) {
          toast({
            title: "Senhas não conferem",
            description: "A nova senha e a confirmação de senha devem ser iguais",
            variant: "destructive"
          });
          setIsUpdating(false);
          return;
        }
        
        const { error: passwordError } = await supabase.auth.updateUser({
          password: userProfile.newPassword
        });
        
        if (passwordError) {
          toast({
            title: "Erro ao atualizar senha",
            description: passwordError.message,
            variant: "destructive"
          });
        }
      }
      
      // Call the provided onUpdateProfile function
      onUpdateProfile();
      
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações pessoais foram atualizadas.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              disabled={isUpdating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input 
              id="profile-email"
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
              disabled={true} // Email can't be changed
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile-phone">WhatsApp</Label>
            <Input 
              id="profile-phone"
              value={userProfile.phone}
              onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
              disabled={isUpdating}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profile-document">CPF/CNPJ (Para recebimento PIX)</Label>
            <Input 
              id="profile-document"
              value={userProfile.document}
              onChange={(e) => setUserProfile({...userProfile, document: formatDocument(e.target.value)})}
              disabled={isUpdating}
            />
            <p className="text-xs text-muted-foreground">
              O CPF/CNPJ será registrado como sua chave PIX para recebimentos
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
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="new-password">Nova senha</Label>
                <Input 
                  id="new-password"
                  type="password"
                  value={userProfile.newPassword}
                  onChange={(e) => setUserProfile({...userProfile, newPassword: e.target.value})}
                  disabled={isUpdating}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <Input 
                  id="confirm-password"
                  type="password"
                  value={userProfile.confirmPassword}
                  onChange={(e) => setUserProfile({...userProfile, confirmPassword: e.target.value})}
                  disabled={isUpdating}
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
              disabled={isUpdating}
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
            <Button 
              onClick={handleUpdateProfile} 
              className="sm:flex-1 mimo-button"
              disabled={isUpdating}
            >
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
