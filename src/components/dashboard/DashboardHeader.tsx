
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
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Painel da Criadora</h1>
        <p className="text-foreground/70">Olá, {user?.name}! Gerencie seus mimos, saldos e pagamentos</p>
      </div>
      
      <div className="flex gap-4 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onOpenProfileDialog}
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Meu Perfil</span>
        </Button>
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <Link to={`/criador/${user?.username || ''}`} target="_blank">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Ver Minha Página</span>
          </Link>
        </Button>
        <Button className="mimo-button" asChild>
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
