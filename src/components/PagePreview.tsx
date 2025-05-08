
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PagePreviewProps {
  username: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({ username }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoaded(false);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date());
    }, 1000);
  };

  // Reset loaded state when username changes
  useEffect(() => {
    setIsLoaded(false);
  }, [username]);
  
  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-mimo-primary/10 to-transparent">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Preview da sua página</CardTitle>
            <CardDescription>Veja como sua página vai aparecer para seus fãs.</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            disabled={refreshing}
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden relative">
          {!isLoaded && (
            <div className="absolute inset-0 bg-background flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                <RefreshCw className="h-8 w-8 animate-spin text-mimo-primary" />
                <p className="text-sm text-muted-foreground">Carregando preview...</p>
              </div>
            </div>
          )}
          <iframe 
            src={`/criador/${username}?t=${lastRefresh.getTime()}`} 
            className="w-full h-[600px]"
            title="Preview da página"
            loading="eager" 
            sandbox="allow-scripts allow-same-origin"
            onLoad={() => setIsLoaded(true)}
            style={{ opacity: isLoaded ? 1 : 0.3, transition: 'opacity 0.3s ease' }}
          />
        </div>
        <div className="p-3 text-xs text-muted-foreground bg-gray-50 border-t">
          <p>Última atualização: {lastRefresh.toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagePreview;
