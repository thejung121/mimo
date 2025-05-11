
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MimoLogo = () => {
  const { isAuthenticated } = useAuth();
  const logoPath = isAuthenticated ? '/dashboard' : '/';
  
  return (
    <Link to={logoPath} className="flex items-center">
      <h1 className="text-2xl font-bold text-mimo-primary">
        Mimo
      </h1>
    </Link>
  );
};

export default MimoLogo;
