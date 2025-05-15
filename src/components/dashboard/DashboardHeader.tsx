
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Eye, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  onOpenProfileDialog: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onOpenProfileDialog }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Painel da Criadora</h1>
        <p className="text-foreground/70 text-sm md:text-base">Olá, {user?.name}! Gerencie seus mimos, saldos e pagamentos</p>
      </div>
      
      <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
        <Button 
          id="open-profile-dialog"
          variant="outline" 
          className="flex items-center gap-2 text-xs md:text-sm flex-1 md:flex-initial justify-center"
          onClick={onOpenProfileDialog}
          size="sm"
        >
          <User className="h-4 w-4" />
          <span>Meu Perfil</span>
        </Button>
        {user?.username ? (
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-xs md:text-sm flex-1 md:flex-initial justify-center" 
            asChild
            size="sm"
          >
            <Link to={`/criador/${user.username}`} target="_blank">
              <Eye className="h-4 w-4" />
              <span>Ver Página</span>
            </Link>
          </Button>
        ) : (
          <Button 
            variant="outline"
            className="flex items-center gap-2 text-xs md:text-sm flex-1 md:flex-initial justify-center"
            size="sm"
            onClick={onOpenProfileDialog}
            title="Configure seu nome de usuário no perfil"
          >
            <Eye className="h-4 w-4" />
            <span>Configure Nome de Usuário</span>
          </Button>
        )}
        <Button 
          className="bg-[#F54040] text-white hover:bg-[#E03030] text-xs md:text-sm flex-1 md:flex-initial justify-center" 
          asChild
          size="sm"
        >
          <Link to="/editar-pagina">
            <Settings className="h-4 w-4 mr-2" />
            <span>Editar Página</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
