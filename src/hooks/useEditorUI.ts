
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const useEditorUI = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showPreview, setShowPreview] = useState(false);

  // Handler to save all changes
  const handleSaveAll = (creator: any, mimoPackages: any) => {
    // Here you would implement logic to save everything to the backend
    console.log("Saving all changes:", { creator, mimoPackages });
    
    toast({
      title: "Alterações salvas com sucesso!",
      description: "Todas as suas alterações foram salvas.",
    });
    
    // Navigate to the dashboard after saving
    navigate('/dashboard');
  };

  return {
    showPreview,
    setShowPreview,
    handleSaveAll
  };
};
