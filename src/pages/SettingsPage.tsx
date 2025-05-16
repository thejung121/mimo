import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { saveCreatorData } from '@/services/creator/profileService';

const SettingsPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    document: user?.document || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        document: user.document || prev.document,
      }));
    }
  }, [user]);
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      // Update user metadata
      if (updateUserProfile) {
        const success = await updateUserProfile({
          name: formData.name,
          document: formData.document,
          phone: formData.phone,
        });
        
        if (!success) {
          throw new Error("Failed to update profile");
        }
      } else {
        // Fallback if updateUserProfile is not available
        const { error } = await supabase.auth.updateUser({
          data: { 
            name: formData.name,
            document: formData.document,
            phone: formData.phone,
          }
        });
        
        if (error) throw error;
      }
      
      // Also update the creator data to keep it in sync
      if (user?.id) {
        const creatorKey = `mimo:creator:${user.id}`;
        const storedCreator = localStorage.getItem(creatorKey);
        
        if (storedCreator) {
          try {
            const creatorData = JSON.parse(storedCreator);
            creatorData.name = formData.name;
            
            // Save updated creator data
            saveCreatorData(creatorData);
          } catch (e) {
            console.error("Failed to update creator data", e);
          }
        }
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      // Reload the page to refresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Ocorreu um erro ao atualizar o perfil.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChangePassword = async () => {
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
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });
      
      if (error) throw error;
      
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
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao alterar a senha.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
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
                  disabled={isSaving}
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
                  disabled={true}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O e-mail não pode ser alterado.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone/WhatsApp
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  disabled={isSaving}
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
                  disabled={isSaving || Boolean(user?.document)}
                />
                {Boolean(user?.document) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    O CPF/CNPJ não pode ser alterado após definido.
                  </p>
                )}
              </div>
              
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : "Salvar Alterações"}
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
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                    disabled={isSaving}
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button onClick={handleChangePassword} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Alterando senha...
                  </>
                ) : "Alterar Senha"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
