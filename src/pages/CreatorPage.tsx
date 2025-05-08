
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { MimoPackage, Creator, SocialLink } from '@/types/creator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from 'lucide-react';
import PurchaseFlow from "@/components/PurchaseFlow";
import CreatorHero from '@/components/CreatorHero';
import CreatorStickyHeader from '@/components/CreatorStickyHeader';
import MimoTabContent from '@/components/MimoTabContent';
import { getCreatorData, getMimoPackages } from '@/services/creatorDataService';

const CreatorPage = () => {
  const { username } = useParams();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Always scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load creator and package data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, fetch from API based on username
        // For now, we'll get from localStorage
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

  // Show loading state
  if (isLoading || !creator) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <CreatorStickyHeader 
        visible={headerVisible}
        avatar={creator.avatar}
        name={creator.name}
        username={creator.username}
        onMimoClick={scrollToMimoSection}
      />
      
      <main className="flex-grow">
        {/* Hero Section - simplified */}
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
      
      <Footer />
    </div>
  );
};

export default CreatorPage;
