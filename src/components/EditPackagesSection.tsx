
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import MimoPackageForm from './MimoPackageForm';
import MediaUploader from './MediaUploader';
import MediaItemDisplay from './MediaItemDisplay';
import { MimoPackage, MediaItem } from '@/types/creator';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

interface EditPackagesSectionProps {
  mimoPackages: MimoPackage[];
  showNewPackageForm: boolean;
  newPackage: MimoPackage;
  onAddPackage: () => void;
  onCancelAddPackage: () => void;
  onDeletePackage: (id: number) => void;
  onEditPackage: (id: number) => void;
  onSaveAll: () => void;
  onPackageChange: (field: string, value: any) => void;
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onSavePackage: () => void;
  onAddMedia: (packageId: number | null, media: MediaItem) => void;
  onRemoveMedia: (packageId: number | null, mediaId: number) => void;
  onTogglePreview: (packageId: number | null, mediaId: number) => void;
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PACKAGES_PER_PAGE = 3;

const EditPackagesSection: React.FC<EditPackagesSectionProps> = ({
  mimoPackages,
  showNewPackageForm,
  newPackage,
  onAddPackage,
  onCancelAddPackage,
  onDeletePackage,
  onEditPackage,
  onSaveAll,
  onPackageChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onSavePackage,
  onAddMedia,
  onRemoveMedia,
  onTogglePreview,
  setShowNewPackageForm
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mimoPackages.length / PACKAGES_PER_PAGE);
  
  // Calculate which packages to show on the current page
  const currentPackages = useMemo(() => {
    const start = (currentPage - 1) * PACKAGES_PER_PAGE;
    return mimoPackages.slice(start, start + PACKAGES_PER_PAGE);
  }, [mimoPackages, currentPage]);
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to specific page
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Seus Pacotes de Mimo</CardTitle>
          <CardDescription>
            Gerencie os pacotes que seus fãs podem adquirir para te enviar mimos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lista de pacotes existentes */}
          <div className="space-y-6">
            {mimoPackages.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Você ainda não tem nenhum pacote de mimo. Crie seu primeiro pacote!
              </p>
            )}
            
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="border rounded-lg overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-lg font-medium">{pkg.title}</h3>
                      {pkg.highlighted && (
                        <span className="bg-mimo-primary/10 text-mimo-primary text-xs px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                    </div>
                    
                    <p className="font-bold text-lg mb-2">R${pkg.price}</p>
                    
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 5).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <span className="mr-2 text-mimo-primary">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {pkg.features.length > 5 && (
                        <li className="text-xs text-muted-foreground">
                          +{pkg.features.length - 5} mais características
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditPackage(pkg.id!)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeletePackage(pkg.id!)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Seção de mídia do pacote - optimized with horizontal scroll on small screens */}
                <div className="border-t bg-muted/50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Mídias do pacote</h4>
                  </div>
                  
                  <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4">
                    {pkg.media.map((media) => (
                      <div key={media.id} className="w-24 md:w-auto flex-shrink-0">
                        <MediaItemDisplay
                          media={media}
                          onTogglePreview={() => onTogglePreview(pkg.id!, media.id)}
                          onRemove={() => onRemoveMedia(pkg.id!, media.id)}
                        />
                      </div>
                    ))}
                    
                    <div className="w-24 md:w-auto flex-shrink-0">
                      <MediaUploader onMediaAdd={(media) => onAddMedia(pkg.id!, media)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pagination */}
            {mimoPackages.length > PACKAGES_PER_PAGE && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={prevPage} 
                      disabled={currentPage === 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        onClick={() => goToPage(page)}
                        className="h-8 w-8"
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={nextPage} 
                      disabled={currentPage === totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
          
          {/* Formulário para adicionar novo pacote */}
          {!showNewPackageForm ? (
            <div className="flex justify-center">
              <Button
                onClick={onAddPackage}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Novo Pacote
              </Button>
            </div>
          ) : (
            <MimoPackageForm
              packageData={newPackage}
              onChange={onPackageChange}
              onFeatureChange={onFeatureChange}
              onAddFeature={onAddFeature}
              onRemoveFeature={onRemoveFeature}
              onSave={onSavePackage}
              onCancel={onCancelAddPackage}
              onAddMedia={(media) => onAddMedia(null, media)}
              onRemoveMedia={(mediaId) => onRemoveMedia(null, mediaId)}
              onTogglePreview={(mediaId) => onTogglePreview(null, mediaId)}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="mimo-button"
          onClick={onSaveAll}
        >
          Salvar Todos os Pacotes
        </Button>
      </div>
    </>
  );
};

export default EditPackagesSection;
