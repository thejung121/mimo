
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoFormProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  isUpdating: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  name,
  email,
  phone,
  onNameChange,
  onPhoneChange,
  isUpdating
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="profile-name">Nome completo</Label>
        <Input 
          id="profile-name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={isUpdating}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input 
          id="profile-email"
          type="email"
          value={email}
          disabled={true} // Email can't be changed
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="profile-phone">WhatsApp</Label>
        <Input 
          id="profile-phone"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          disabled={isUpdating}
        />
      </div>
    </>
  );
};

export default PersonalInfoForm;
