
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useCallback } from 'react';
import { saveAllData } from '@/services/creatorDataService';
import { Creator, MimoPackage } from '@/types/creator';

export const useEditorUI = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handler to save all changes (memoized to prevent unnecessary rerenders)
  const handleSaveAll = useCallback((creator: Creator, mimoPackages: MimoPackage[]) => {
    // Save data to localStorage
    saveAllData(creator, mimoPackages);
    
    toast({
      title: "Alterações salvas com sucesso!",
      description: "Todas as suas alterações foram salvas.",
    });
    
    // Navigate to the dashboard after saving
    navigate('/dashboard');
  }, [toast, navigate]);

  return {
    handleSaveAll
  };
};
