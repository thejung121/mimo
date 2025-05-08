
import { useToast } from '@/components/ui/use-toast';
import { MediaItem, MimoPackage } from '@/types/creator';
import { useState } from 'react';

export const usePackageMedia = (
  mimoPackages: MimoPackage[], 
  setMimoPackages: React.Dispatch<React.SetStateAction<MimoPackage[]>>,
  newPackage: MimoPackage,
  setNewPackage: React.Dispatch<React.SetStateAction<MimoPackage>>
) => {
  const { toast } = useToast();

  // Handler to add media to the package
  const handleAddMedia = (packageId: number | null, media: MediaItem) => {
    if (packageId === null) {
      // Adding media to the new package
      setNewPackage(prev => ({
        ...prev,
        media: [...prev.media, media]
      }));
    } else {
      // Adding media to an existing package
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: [...pkg.media, media] 
        } : pkg
      ));
    }
    
    toast({
      title: "Mídia adicionada",
      description: `${media.type === 'image' ? 'Imagem' : media.type === 'video' ? 'Vídeo' : 'Áudio'} adicionado(a) ao pacote com sucesso.`,
    });
  };

  // Handler to remove media from the package
  const handleRemoveMedia = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      // Removing media from the new package
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      }));
    } else {
      // Removing media from an existing package
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: pkg.media.filter(m => m.id !== mediaId) 
        } : pkg
      ));
    }
    
    toast({
      title: "Mídia removida",
      description: "A mídia foi removida do pacote com sucesso.",
    });
  };

  // Handler to set media as preview - fixed to toggle only one preview at a time
  const handleTogglePreview = (packageId: number | null, mediaId: number) => {
    if (packageId === null) {
      // Toggling preview in the new package - ensure only one preview at a time
      setNewPackage(prev => ({
        ...prev,
        media: prev.media.map(m => ({
          ...m,
          isPreview: m.id === mediaId ? true : false
        }))
      }));
    } else {
      // Toggling preview in an existing package - ensure only one preview at a time
      setMimoPackages(prev => prev.map(pkg => 
        pkg.id === packageId ? { 
          ...pkg, 
          media: pkg.media.map(m => ({
            ...m,
            isPreview: m.id === mediaId ? true : false
          }))
        } : pkg
      ));
    }
  };

  return {
    handleAddMedia,
    handleRemoveMedia,
    handleTogglePreview
  };
};
