
import React from 'react';
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
  const { logout } = useAuth();

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
              onClick={onUpdateProfile} 
              className="sm:flex-1 mimo-button"
            >
              Salvar alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
