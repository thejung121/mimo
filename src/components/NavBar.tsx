
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, LogIn, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

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
          
          {isMobile ? (
            <>
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
                <div className="absolute top-16 right-0 left-0 bg-background border-b border-border/50 shadow-lg p-4 z-10 animate-fade-in">
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
                    <Link 
                      to="/dashboard" 
                      className="text-foreground/70 hover:text-foreground transition-colors px-3 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button variant="outline" className="border-mimo-primary text-mimo-primary hover:text-white hover:bg-mimo-primary w-full justify-center" asChild>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" /> Entrar
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/sobre" className="text-foreground/70 hover:text-foreground transition-colors">
                Sobre
              </Link>
              <Link to="/explorar" className="text-foreground/70 hover:text-foreground transition-colors">
                Explorar
              </Link>
              <Link to="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Button variant="outline" className="border-mimo-primary text-mimo-primary hover:text-white hover:bg-mimo-primary" asChild>
                <Link to="/login"><LogIn className="h-4 w-4 mr-2" /> Entrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
