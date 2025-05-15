
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MimoLogo from './MimoLogo';

const EnhancedNavBar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white border-b border-accent/10 py-4">
      <div className="mimo-container flex justify-between items-center">
        <MimoLogo />
        
        <nav className="flex items-center gap-6">
          <Link to="/explorar" className="text-foreground/70 hover:text-foreground transition-colors">
            Explorar
          </Link>
          <Link to="/sobre" className="text-foreground/70 hover:text-foreground transition-colors">
            Sobre
          </Link>
          
          {isAuthenticated ? (
            <Link to="/dashboard" className="text-[#F54040] border border-[#F54040] px-4 py-2 rounded-lg hover:bg-[#F54040]/10 transition-colors">
              Meu Painel
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-foreground/70 hover:text-foreground transition-colors">
                Login
              </Link>
              <Link to="/cadastro" className="bg-[#F54040] text-white px-4 py-2 rounded-lg hover:bg-[#E03030] transition-colors">
                Criar Página
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default EnhancedNavBar;
