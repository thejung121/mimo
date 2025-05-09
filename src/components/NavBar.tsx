
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  LogIn, 
  Menu, 
  X, 
  User, 
  LogOut,
  Settings
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-background border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-mimo-primary" fill="#9b87f5" />
              <span className="font-bold text-xl text-foreground">Mimo</span>
            </Link>
          </div>
          
          {/* Adjusted mobile menu to prevent overflow */}
          {isMobile ? (
            <div className="relative">
              <button 
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
                aria-expanded="false"
              >
                {mobileMenuOpen ? 
                  <X className="block h-6 w-6" aria-hidden="true" /> : 
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                }
              </button>
              
              {mobileMenuOpen && (
                <div className="absolute top-12 right-0 w-60 bg-background border border-border/50 shadow-lg rounded-md p-4 z-10">
                  <div className="flex flex-col space-y-4">
                    <Link 
                      to="/sobre" 
                      className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sobre
                    </Link>
                    <Link 
                      to="/explorar" 
                      className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Explorar
                    </Link>
                    
                    {isAuthenticated ? (
                      <>
                        <Link 
                          to="/dashboard" 
                          className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to={`/criador/${user?.username}`} 
                          className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Minha Página
                        </Link>
                        <button 
                          className="text-rose-500 hover:text-rose-600 transition-colors px-3 py-2 text-left flex items-center"
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Sair
                        </button>
                      </>
                    ) : (
                      <Button variant="outline" className="border-mimo-primary text-mimo-primary hover:text-white hover:bg-mimo-primary w-full justify-center" asChild>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <LogIn className="h-4 w-4 mr-2" /> Entrar
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/sobre" className="text-foreground/70 hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Link to="/explorar" className="text-foreground/70 hover:text-foreground transition-colors">
                Explorar
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full h-8 w-8 p-0">
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to={`/criador/${user?.username}`} className="cursor-pointer">
                          <Heart className="h-4 w-4 mr-2" /> Ver Minha Página
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/editar-pagina" className="cursor-pointer">
                          <Settings className="h-4 w-4 mr-2" /> Editar Página
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-rose-500 focus:text-rose-500 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button variant="outline" className="border-mimo-primary text-mimo-primary hover:text-white hover:bg-mimo-primary" asChild>
                  <Link to="/login"><LogIn className="h-4 w-4 mr-2" /> Entrar</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
