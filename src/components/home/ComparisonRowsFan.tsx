
import React from 'react';
import { Check, X } from 'lucide-react';
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";

const ComparisonRowsFan = () => {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">Necessidade de cadastro</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Sem cadastro
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Cadastro obrigatório
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Flexibilidade financeira</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600 font-medium">
            <Check className="h-5 w-5 mr-1" /> 
            Pagamento único
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          Cobranças recorrentes
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Experiência</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Personalizada
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Genérica
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Privacidade</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Alta
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Baixa
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Método de pagamento</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            PIX
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          Cartão de crédito
        </TableCell>
      </TableRow>
    </>
  );
};

export default ComparisonRowsFan;
