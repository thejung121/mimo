
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

  // Get current username with proper fallbacks
  const getCurrentUsername = () => {
    if (user?.username) {
      console.log('DashboardHeader - Using auth username:', user.username);
      return user.username;
    }
    
    const storedUser = localStorage.getItem('mimo:user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.username) {
          console.log('DashboardHeader - Using localStorage username:', parsedUser.username);
          return parsedUser.username;
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    
    console.log('DashboardHeader - No username found');
    return null;
  };

  const currentUsername = getCurrentUsername();

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
                <Link to={`/criador/${currentUsername}`} target="_blank">
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
