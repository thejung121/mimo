
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const MimoLogo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Link to dashboard if user is logged in, otherwise to home
  const linkTo = isAuthenticated ? "/dashboard" : "/";
  
  return (
    <Link to={linkTo} className="flex items-center">
      <span className="text-2xl font-bold text-mimo-primary">mimo</span>
    </Link>
  );
};

export default MimoLogo;
