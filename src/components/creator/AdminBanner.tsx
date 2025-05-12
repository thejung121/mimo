
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminBanner = () => {
  return (
    <div className="bg-mimo-primary/10 text-mimo-primary p-2 text-center">
      <div className="flex justify-center items-center gap-3">
        <p>Esta é a visualização pública da sua página</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-mimo-primary text-mimo-primary hover:bg-mimo-primary hover:text-white" 
          asChild
        >
          <Link to="/editar-pagina">
            Editar página
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminBanner;
