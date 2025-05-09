
import React from 'react';
import { Check, X } from 'lucide-react';
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";

const ComparisonRowsCreator = () => {
  return (
    <>
      <TableRow>
        <TableCell className="font-medium">Taxa sobre ganhos</TableCell>
        <TableCell className="text-center font-semibold text-green-600">
          Apenas 10%
        </TableCell>
        <TableCell className="text-center text-gray-600">
          20% ou mais
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Recebimento</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600 font-medium">
            <Check className="h-5 w-5 mr-1" /> 
            PIX imediato
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          7 a 30 dias para processamento
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Obrigação de produção</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Liberdade criativa
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Conteúdo recorrente
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Pressão de engajamento</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Sem pressão
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Alta pressão
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="font-medium">Autonomia</TableCell>
        <TableCell className="text-center">
          <div className="flex items-center justify-center text-green-600">
            <Check className="h-5 w-5 mr-1" /> 
            Total
          </div>
        </TableCell>
        <TableCell className="text-center text-gray-600">
          <div className="flex items-center justify-center">
            <X className="h-5 w-5 mr-1 text-red-500" /> 
            Limitada
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ComparisonRowsCreator;
