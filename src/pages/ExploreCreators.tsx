
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Creator } from '@/types/creator';

// Mock data for creators
const mockCreators: Creator[] = Array.from({ length: 30 }, (_, i) => ({
  username: `creator${i + 1}`,
  name: `Criador ${i + 1}`,
  avatar: `https://images.unsplash.com/photo-${1580000000 + i * 100000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80`,
  cover: `https://images.unsplash.com/photo-${1590000000 + i * 100000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80`,
  description: `Descrição do criador ${i + 1}. Este é um texto de exemplo para mostrar como seria a bio deste criador.`,
  socialLinks: []
}));

const ExploreCreators = () => {
  const { toast } = useToast();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [visibleCreators, setVisibleCreators] = useState<Creator[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const creatorsPerPage = 12;

  useEffect(() => {
    // Simulating API call to fetch creators
    const fetchCreators = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        setCreators(mockCreators);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching creators:", error);
        toast({
          title: "Erro ao carregar criadores",
          description: "Não foi possível carregar a lista de criadores. Por favor, tente novamente.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchCreators();
  }, [toast]);

  useEffect(() => {
    // Update visible creators when page changes or creators are loaded
    setVisibleCreators(creators.slice(0, page * creatorsPerPage));
  }, [creators, page]);

  const loadMoreCreators = () => {
    if ((page * creatorsPerPage) < creators.length) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explorar Criadores</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra criadores de conteúdo incríveis e apoie seu trabalho enviando mimos. 
              Nossos criadores oferecem conteúdo exclusivo e experiências únicas.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCreators.map((creator) => (
                  <Link 
                    to={`/criador/${creator.username}`} 
                    key={creator.username}
                    className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={creator.cover} 
                        alt={creator.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 p-4 flex items-center">
                        <img 
                          src={creator.avatar} 
                          alt={creator.name} 
                          className="w-12 h-12 rounded-full border-2 border-white mr-3"
                        />
                        <div>
                          <h3 className="text-white font-semibold text-lg">{creator.name}</h3>
                          <p className="text-white/80 text-sm">@{creator.username}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <p className="text-gray-600 text-sm line-clamp-2 h-10">
                        {creator.description}
                      </p>
                      
                      <div className="mt-4 flex justify-end">
                        <span className="text-sm text-primary-500 font-medium flex items-center group-hover:underline">
                          Ver perfil
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {visibleCreators.length < creators.length && (
                <div className="mt-10 flex justify-center">
                  <Button 
                    onClick={loadMoreCreators} 
                    className="px-6 py-2"
                    disabled={loading}
                  >
                    {loading ? "Carregando..." : "Carregar mais criadores"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExploreCreators;
