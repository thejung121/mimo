
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">O que estão dizendo</h2>
          <p className="text-gray-600">Depoimentos de fãs que enviaram mimos</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                M
              </div>
              <div className="ml-3">
                <p className="font-medium">Marcelo S.</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Adorei o mimo que recebi! As fotos são incríveis e a mensagem personalizada foi super especial. Totalmente valeu a pena!"
            </p>
          </Card>
          
          <Card className="bg-white p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                C
              </div>
              <div className="ml-3">
                <p className="font-medium">Carolina F.</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "Já sou assinante e também adoro enviar mimos especiais. A Maria sempre surpreende com conteúdo de qualidade e exclusivo."
            </p>
          </Card>
          
          <Card className="bg-white p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">
                R
              </div>
              <div className="ml-3">
                <p className="font-medium">Rafael T.</p>
                <div className="flex text-yellow-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            </div>
            <p className="text-gray-600 italic">
              "O processo foi super fácil e rápido. Recebi o link com as recompensas em menos de uma hora após o pagamento. Recomendo!"
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
