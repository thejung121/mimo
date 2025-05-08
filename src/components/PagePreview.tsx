
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PagePreviewProps {
  username: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({ username }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview da sua página</CardTitle>
        <CardDescription>Veja como sua página vai aparecer para seus fãs.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border rounded-lg overflow-hidden">
          <iframe 
            src={`/criador/${username}`} 
            className="w-full h-[600px]"
            title="Preview da página"
            loading="lazy" 
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PagePreview;
