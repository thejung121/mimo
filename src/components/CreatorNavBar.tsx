
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const CreatorNavBar = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default CreatorNavBar;
