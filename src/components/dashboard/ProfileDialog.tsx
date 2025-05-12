
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import the smaller component parts
import PersonalInfoForm from './profile/PersonalInfoForm';
import DocumentForm from './profile/DocumentForm';
import PasswordForm from './profile/PasswordForm';
import DialogFooterActions from './profile/DialogFooterActions';

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
  const { logout, user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Check if document is already set (non-empty)
  const isDocumentSet = Boolean(user?.document);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    
    try {
      // Update user metadata using the context function
      if (updateUserProfile) {
        const success = await updateUserProfile({
          name: userProfile.name,
          document: isDocumentSet ? user?.document : userProfile.document, // Only update document if not already set
        });

        if (!success) {
          throw new Error("Failed to update profile");
        }
      } else {
        // Fallback if updateUserProfile is not available
        const { error } = await supabase.auth.updateUser({
          data: { 
            name: userProfile.name,
            document: isDocumentSet ? user?.document : userProfile.document, // Only update document if not already set
          }
        });

        if (error) {
          throw error;
        }
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

  // Handlers for updating user profile fields
  const handleNameChange = (value: string) => {
    setUserProfile(prev => ({ ...prev, name: value }));
  };

  const handlePhoneChange = (value: string) => {
    setUserProfile(prev => ({ ...prev, phone: value }));
  };

  const handleDocumentChange = (value: string) => {
    // Only allow changing document if not already set
    if (!isDocumentSet) {
      setUserProfile(prev => ({ ...prev, document: value }));
    }
  };

  const handleCurrentPasswordChange = (value: string) => {
    setUserProfile(prev => ({ ...prev, currentPassword: value }));
  };

  const handleNewPasswordChange = (value: string) => {
    setUserProfile(prev => ({ ...prev, newPassword: value }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setUserProfile(prev => ({ ...prev, confirmPassword: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Meu Perfil</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Personal Information Section */}
          <PersonalInfoForm 
            name={userProfile.name}
            email={userProfile.email}
            phone={userProfile.phone}
            onNameChange={handleNameChange}
            onPhoneChange={handlePhoneChange}
            isUpdating={isUpdating}
          />
          
          {/* Document Section */}
          <DocumentForm 
            document={userProfile.document}
            onDocumentChange={handleDocumentChange}
            isUpdating={isUpdating}
            isDocumentSet={isDocumentSet}
          />
          
          {/* Password Section */}
          <PasswordForm 
            currentPassword={userProfile.currentPassword}
            newPassword={userProfile.newPassword}
            confirmPassword={userProfile.confirmPassword}
            onCurrentPasswordChange={handleCurrentPasswordChange}
            onNewPasswordChange={handleNewPasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            isUpdating={isUpdating}
          />
        </div>
        
        <DialogFooter>
          <DialogFooterActions 
            onLogout={logout}
            onSave={handleUpdateProfile}
            isUpdating={isUpdating}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
