
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UsernameFieldProps {
  username: string;
  onUsernameChange: (value: string) => void;
  isUpdating: boolean;
}

const UsernameField: React.FC<UsernameFieldProps> = ({
  username,
  onUsernameChange,
  isUpdating
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format username as user types - replace spaces with dashes
    const formattedValue = e.target.value.replace(/\s+/g, '-');
    onUsernameChange(formattedValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Nome de usuário (URL da sua página)</Label>
      <Input
        id="username"
        value={username}
        onChange={handleChange}
        placeholder="seu-nome-de-usuario"
        disabled={isUpdating}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Este será o link da sua página: mimo.app/criador/<strong>{username}</strong>
      </p>
    </div>
  );
};

export default UsernameField;
