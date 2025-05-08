
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MimoPackage, MediaItem } from '@/types/creator';
import MimoPackageForm from '../MimoPackageForm';
import PackagesList from './PackagesList';
import NewPackageButton from './NewPackageButton';

interface PackagesSectionProps {
  mimoPackages: MimoPackage[];
  showNewPackageForm: boolean;
  newPackage: MimoPackage;
  onPackageChange: (field: string, value: any) => void;
  onFeatureChange: (index: number, value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
  onAddMedia: (packageId: number | null, media: MediaItem) => void;
  onRemoveMedia: (packageId: number | null, mediaId: number) => void;
  onTogglePreview: (packageId: number | null, mediaId: number) => void;
  onSavePackage: () => void;
  onDeletePackage: (id: number) => void;
  onEditPackage: (id: number) => void;
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const PackagesSection = ({
  mimoPackages,
  showNewPackageForm,
  newPackage,
  onPackageChange,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onAddMedia,
  onRemoveMedia,
  onTogglePreview,
  onSavePackage,
  onDeletePackage,
  onEditPackage,
  setShowNewPackageForm
}: PackagesSectionProps) => {
  const hasNoPackages = mimoPackages.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pacotes de Mimo</CardTitle>
        <CardDescription>Gerencie os pacotes que seus fãs podem adquirir para te enviar mimos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lista de pacotes existentes quando houver pacotes */}
        {!hasNoPackages && (
          <PackagesList
            mimoPackages={mimoPackages}
            onEditPackage={onEditPackage}
            onDeletePackage={onDeletePackage}
            onAddMedia={onAddMedia}
            onRemoveMedia={onRemoveMedia}
            onTogglePreview={onTogglePreview}
          />
        )}
        
        {/* Formulário para adicionar novo pacote ou botão para mostrá-lo */}
        {!showNewPackageForm ? (
          <NewPackageButton 
            onClick={() => setShowNewPackageForm(true)} 
            isFirstPackage={hasNoPackages}
          />
        ) : (
          <MimoPackageForm
            packageData={newPackage}
            onChange={onPackageChange}
            onFeatureChange={onFeatureChange}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onSave={onSavePackage}
            onCancel={() => setShowNewPackageForm(false)}
            onAddMedia={(media) => onAddMedia(null, media)}
            onRemoveMedia={(mediaId) => onRemoveMedia(null, mediaId)}
            onTogglePreview={(mediaId) => onTogglePreview(null, mediaId)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PackagesSection;
