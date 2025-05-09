
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CreatorNavBar from '@/components/CreatorNavBar';
import CreatorFooter from '@/components/CreatorFooter';
import { MimoPackage, Creator } from '@/types/creator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Eye } from 'lucide-react';
import PurchaseFlow from "@/components/PurchaseFlow";
import CreatorHero from '@/components/CreatorHero';
import CreatorStickyHeader from '@/components/CreatorStickyHeader';
import MimoTabContent from '@/components/MimoTabContent';
import { getCreatorData, getMimoPackages } from '@/services/creatorDataService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const CreatorPage = () => {
  const { username } = useParams();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useAuth();
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is the user's own page
  const isOwnPage = user?.username === username;

  // Always scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load creator and package data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get data from localStorage via the service
        const creatorData = getCreatorData();
        const packagesData = getMimoPackages();
        
        setCreator(creatorData);
        setMimoPackages(packagesData);
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [username]);

  // Handle scroll effect for header - using passive event listener for better performance
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setHeaderVisible(currentScrollY < lastScrollY);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSelectPackage = (pkg: MimoPackage) => {
    setSelectedPackage(pkg);
    setPurchaseFlowOpen(true);
  };

  const scrollToMimoSection = () => {
    const mimoSection = document.getElementById('mimo-section');
    if (mimoSection) {
      mimoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle custom value submissions
  const handleCustomValue = (value: number) => {
    const customPackage: MimoPackage = {
      id: 0,
      title: "Mimo Personalizado",
      price: value,
      features: ["Valor personalizado", "Mensagem exclusiva"],
      highlighted: false,
      media: []
    };
    
    setSelectedPackage(customPackage);
    setPurchaseFlowOpen(true);
  };

  // Show loading state
  if (isLoading || !creator) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <CreatorNavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <CreatorFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <CreatorNavBar />
      
      <CreatorStickyHeader 
        visible={headerVisible}
        avatar={creator.avatar}
        name={creator.name}
        username={creator.username}
        onMimoClick={scrollToMimoSection}
      />
      
      <main className="flex-grow">
        {/* Admin banner if this is the user's own page */}
        {isOwnPage && (
          <div className="bg-mimo-primary/10 text-mimo-primary p-2 text-center">
            <div className="flex justify-center items-center gap-3">
              <p>Esta é a visualização pública da sua página</p>
              <Button variant="outline" size="sm" className="border-mimo-primary text-mimo-primary hover:bg-mimo-primary hover:text-white" asChild>
                <Link to="/editar-pagina">
                  Editar página
                </Link>
              </Button>
            </div>
          </div>
        )}
        
        {/* Hero Section */}
        <CreatorHero 
          creator={creator} 
          onMimoClick={scrollToMimoSection} 
        />
        
        {/* Mimos Section - simplified */}
        <section id="mimo-section" className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                Envie um Mimo
              </h2>
              <p className="text-gray-600 text-sm">
                Escolha um dos pacotes abaixo para apoiar
              </p>
            </div>
            
            <Tabs defaultValue="mimos" className="mb-6">
              <div className="flex justify-center">
                <TabsList className="w-[200px] mb-6">
                  <TabsTrigger value="mimos" className="w-full">
                    <Heart className="mr-2 h-4 w-4" /> Mimos
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="mimos">
                <MimoTabContent 
                  mimoPackages={mimoPackages} 
                  onSelectPackage={handleSelectPackage}
                  onCustomValue={handleCustomValue}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Purchase Flow Component */}
        {selectedPackage && (
          <PurchaseFlow
            open={purchaseFlowOpen}
            onClose={() => {
              setPurchaseFlowOpen(false);
              setSelectedPackage(null);
            }}
            packageTitle={selectedPackage.title}
            packagePrice={selectedPackage.price}
            creatorName={creator.name}
          />
        )}
      </main>
      
      <CreatorFooter />
    </div>
  );
};

export default CreatorPage;
