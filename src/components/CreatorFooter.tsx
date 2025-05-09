
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const CreatorFooter = () => {
  return (
    <footer className="bg-background border-t border-border/50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Feito com</span>
            <Heart className="h-3 w-3 text-mimo-primary" fill="#9b87f5" />
            <span>por</span>
            <Link to="/" className="text-mimo-primary hover:underline">Mimo</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CreatorFooter;
