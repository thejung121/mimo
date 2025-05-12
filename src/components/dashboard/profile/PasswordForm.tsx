
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordFormProps {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  isUpdating: boolean;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  isUpdating
}) => {
  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="text-sm font-medium mb-3">Alterar senha</h4>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="current-password">Senha atual</Label>
          <Input 
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
            disabled={isUpdating}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="new-password">Nova senha</Label>
          <Input 
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
            disabled={isUpdating}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="confirm-password">Confirmar nova senha</Label>
          <Input 
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            disabled={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordForm;
