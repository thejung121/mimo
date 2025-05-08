import React from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Phone } from 'lucide-react';

interface UserInfoFormProps {
  userAlias: string;
  setUserAlias: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  whatsapp: string;
  setWhatsapp: (value: string) => void;
}

const UserInfoForm = ({
  userAlias,
  setUserAlias,
  email,
  setEmail,
  whatsapp,
  setWhatsapp,
}: UserInfoFormProps) => {
  const formatWhatsapp = (value: string) => {
    // Keep only numbers
    const numbers = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="alias" className="block text-sm font-medium mb-1">
          Nome de usuário*
        </label>
        <Input
          id="alias"
          value={userAlias}
          onChange={(e) => setUserAlias(e.target.value)}
          placeholder="Digite seu nome de usuário"
          className="w-full"
        />
        <p className="text-xs mt-1 text-muted-foreground">
          Este será seu identificador e senha de acesso ao conteúdo
        </p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1 flex items-center">
          E-mail*
          <Mail className="ml-1 h-3 w-3 text-muted-foreground" />
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          className="w-full"
          required
        />
        <p className="text-xs mt-1 text-muted-foreground">
          Seu e-mail é necessário para receber o acesso ao conteúdo exclusivo
        </p>
      </div>
      
      <div>
        <label htmlFor="whatsapp" className="block text-sm font-medium mb-1 flex items-center">
          WhatsApp (opcional)
          <Phone className="ml-1 h-3 w-3 text-muted-foreground" />
        </label>
        <Input
          id="whatsapp"
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatWhatsapp(e.target.value))}
          placeholder="(00) 00000-0000"
          className="w-full"
        />
        <p className="text-xs mt-1 text-muted-foreground">
          Opcional: Receba mensagens exclusivas diretamente no seu WhatsApp
        </p>
      </div>
    </div>
  );
};

export default UserInfoForm;
