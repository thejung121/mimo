
import { useState } from 'react';
import { MimoPackage } from '@/types/creator';
import { useToast } from '@/components/ui/use-toast';

export const usePackageFeatures = (packageData: MimoPackage, setPackageData: React.Dispatch<React.SetStateAction<MimoPackage>>) => {
  const { toast } = useToast();

  // Handler to add a feature to a package
  const handleAddFeature = () => {
    // Limit the number of features to prevent performance issues
    if (packageData.features.length >= 10) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite máximo de características para este pacote.",
        variant: "destructive"
      });
      return;
    }

    setPackageData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Handler to update a feature in a package
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...packageData.features];
    updatedFeatures[index] = value;
    setPackageData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Handler to remove a feature from a package
  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = packageData.features.filter((_, i) => i !== index);
    setPackageData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  return {
    handleAddFeature,
    handleFeatureChange,
    handleRemoveFeature
  };
};
