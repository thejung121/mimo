
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DocumentFormProps {
  document: string;
  onDocumentChange: (value: string) => void;
  isUpdating: boolean;
}

const DocumentForm: React.FC<DocumentFormProps> = ({
  document,
  onDocumentChange,
  isUpdating
}) => {
  // Function to format CPF/CNPJ as user types
  const formatDocument = (value: string) => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format based on length (CPF or CNPJ)
    if (digits.length <= 11) {
      // CPF format: 123.456.789-01
      return digits
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1-');
    } else {
      // CNPJ format: 12.345.678/0001-90
      return digits
        .replace(/(\d{2})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1.')
        .replace(/(\d{3})(?=\d)/, '$1/')
        .replace(/(\d{4})(?=\d)/, '$1-');
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDocument(e.target.value);
    onDocumentChange(formattedValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="profile-document">CPF/CNPJ (Para recebimento PIX)</Label>
      <Input 
        id="profile-document"
        value={document}
        onChange={handleDocumentChange}
        disabled={isUpdating}
      />
      <p className="text-xs text-muted-foreground">
        O CPF/CNPJ será registrado como sua chave PIX para recebimentos
      </p>
    </div>
  );
};

export default DocumentForm;
