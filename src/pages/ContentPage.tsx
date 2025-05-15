
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

const ContentPage = () => {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Conteúdo</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Seu Conteúdo</CardTitle>
              <Button className="mimo-button">
                <Plus className="h-4 w-4 mr-2" />
                Criar Conteúdo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum conteúdo criado</h3>
                <p className="text-muted-foreground mb-6">
                  Crie conteúdos exclusivos para compartilhar com seus fãs como recompensa.
                </p>
                <Button className="mimo-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Meu Primeiro Conteúdo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentPage;
