
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MimoLogo = ({ size = "default" }: { size?: "default" | "small" }) => {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const logoPath = isAuthenticated ? '/dashboard' : '/';
  
  const logoClasses = size === "small" 
    ? "text-xl font-bold text-mimo-primary"
    : "text-2xl font-bold text-mimo-primary";
  
  return (
    <Link to={logoPath} className="flex items-center">
      <h1 className={logoClasses}>
        Mimo
      </h1>
    </Link>
  );
};

export default MimoLogo;
