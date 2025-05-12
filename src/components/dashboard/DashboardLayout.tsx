
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, User, Settings, ExternalLink, Eye } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gradient-to-b from-background to-accent/10 py-4 sm:py-8">
        <div className="mimo-container px-3 sm:px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0">
              <nav className="bg-background rounded-lg border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                  <h2 className="font-medium">Olá, {user?.name}</h2>
                  <p className="text-sm text-muted-foreground">Painel de controle</p>
                </div>
                
                <div className="p-2">
                  <NavItem 
                    to="/dashboard" 
                    icon={<LayoutDashboard className="h-4 w-4" />}
                    isActive={pathname === '/dashboard'}
                  >
                    Dashboard
                  </NavItem>
                  
                  <NavItem 
                    to="/dashboard/minha-pagina" 
                    icon={<Eye className="h-4 w-4" />}
                    isActive={pathname.includes('/dashboard/minha-pagina')}
                  >
                    Minha Página
                  </NavItem>
                  
                  <NavItem 
                    to="/dashboard/pacotes" 
                    icon={<Package className="h-4 w-4" />}
                    isActive={pathname.includes('/dashboard/pacotes')}
                  >
                    Pacotes
                  </NavItem>
                  
                  <NavItem 
                    to="/dashboard/configuracoes" 
                    icon={<Settings className="h-4 w-4" />}
                    isActive={pathname.includes('/dashboard/configuracoes')}
                  >
                    Configurações
                  </NavItem>
                  
                  <div className="mt-2 px-2">
                    <Button
                      className="w-full flex items-center gap-2 justify-start"
                      variant="outline"
                      asChild
                    >
                      <Link to={`/criador/${user?.username || ''}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                        <span>Ver Página</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </nav>
              
              {/* Dashboard Quick Actions */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
                <Link to="/dashboard/minha-pagina" className="block">
                  <div className="bg-background p-4 rounded-lg border hover:border-primary/50 hover:bg-accent/5 transition-colors">
                    <Eye className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Gerenciar Página</h3>
                    <p className="text-sm text-muted-foreground">Atualize seu perfil e pacotes</p>
                  </div>
                </Link>
                <Link to="/dashboard/pacotes/novo" className="block">
                  <div className="bg-background p-4 rounded-lg border hover:border-primary/50 hover:bg-accent/5 transition-colors">
                    <Package className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-medium">Novo Pacote</h3>
                    <p className="text-sm text-muted-foreground">Crie um novo pacote de mimo</p>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Navigation item component
const NavItem = ({ 
  to, 
  icon, 
  children, 
  isActive 
}: { 
  to: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  isActive: boolean;
}) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 p-2 rounded-md mb-1 text-sm ${
        isActive 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'hover:bg-accent/10'
      }`}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default DashboardLayout;
