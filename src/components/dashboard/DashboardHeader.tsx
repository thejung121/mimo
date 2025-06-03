
import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MimoLogo from '@/components/MimoLogo';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  // Force a re-render by getting fresh user data each render
  const currentUsername = React.useMemo(() => {
    // Get from multiple sources to ensure we have the most current username
    const authUsername = user?.username;
    const storedUser = localStorage.getItem('mimo:user');
    let localUsername = null;
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        localUsername = parsedUser.username;
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    
    // Prefer the most recent username
    const finalUsername = authUsername || localUsername;
    console.log('DashboardHeader - Final username:', finalUsername);
    console.log('DashboardHeader - Auth username:', authUsername);
    console.log('DashboardHeader - Local username:', localUsername);
    
    return finalUsername;
  }, [user, user?.username]);

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <MimoLogo />
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/dashboard/perfil">Perfil</Link>
            </DropdownMenuItem>
            {currentUsername && (
              <DropdownMenuItem asChild>
                <Link to={`/criador/${currentUsername}`} target="_blank" key={currentUsername}>
                  Ver Minha Página
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
