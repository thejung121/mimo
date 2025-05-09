
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Heart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ComparisonRowsCreator from './ComparisonRowsCreator';
import ComparisonRowsFan from './ComparisonRowsFan';

interface ComparisonSectionProps {
  comparisonRef: React.RefObject<HTMLDivElement>;
}

const ComparisonSection = ({ comparisonRef }: ComparisonSectionProps) => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mimo-container">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16 px-4 sm:px-0">
          <Badge className="mb-4 px-3 py-1 text-sm bg-mimo-primary/10 text-mimo-primary border-none">
            Por que escolher Mimo?
          </Badge>
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Compare e veja a diferença
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            Mimo é a alternativa mais justa e flexível para monetização de conteúdo especial.
            Veja como nos comparamos às outras plataformas.
          </p>
        </div>
        
        <div ref={comparisonRef} className="bg-white rounded-xl shadow-lg mx-4 sm:mx-0 opacity-0">
          <Tabs defaultValue="creators" className="w-full">
            <div className="px-6 pt-4 border-b">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="creators" className="text-base py-2">Para Criadoras</TabsTrigger>
                <TabsTrigger value="fans" className="text-base py-2">Para Fãs</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="creators" className="p-4">
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-1/3"></TableHead>
                      <TableHead className="text-center w-1/3">
                        <div className="flex flex-col items-center">
                          <div className="font-bold text-base md:text-xl text-mimo-primary mb-1 flex items-center">
                            <Heart className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Mimo
                          </div>
                          <span className="text-xs md:text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Recomendado
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center w-1/3 font-medium text-gray-600">
                        Plataformas de assinatura
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ComparisonRowsCreator />
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="fans" className="p-4">
              <div className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-1/3"></TableHead>
                      <TableHead className="text-center w-1/3">
                        <div className="flex flex-col items-center">
                          <div className="font-bold text-base md:text-xl text-mimo-primary mb-1 flex items-center">
                            <Heart className="h-4 w-4 md:h-5 md:w-5 mr-1" /> Mimo
                          </div>
                          <span className="text-xs md:text-sm text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                            Recomendado
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="text-center w-1/3 font-medium text-gray-600">
                        Plataformas de assinatura
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <ComparisonRowsFan />
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
