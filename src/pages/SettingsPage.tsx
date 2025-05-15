
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    document: user?.document || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso."
    });
  };
  
  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso."
    });
    
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };
  
  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Configurações</h1>
        
        <div className="space-y-6">
          {/* Personal Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome Completo
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  E-mail
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O e-mail não pode ser alterado.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  CPF/CNPJ
                </label>
                <Input
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                />
              </div>
              
              <Button onClick={handleSaveProfile}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
          
          {/* Password Change Card */}
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Senha Atual
                </label>
                <div className="relative">
                  <Input
                    name="currentPassword"
                    type={showPassword.current ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Senha atual"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                  >
                    {showPassword.current ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    name="newPassword"
                    type={showPassword.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Nova senha"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme a nova senha"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button onClick={handleChangePassword}>
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
