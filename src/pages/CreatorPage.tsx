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

// Mock creator data - will be fetched from API in real application
const mockCreator: Creator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter', url: 'https://twitter.com/mariafernanda' },
    { type: 'youtube', url: 'https://youtube.com/mariafernanda' },
    { type: 'website', url: 'https://mariafernanda.com' }
  ]
};

const CreatorPage = () => {
  const { username } = useParams();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Always scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Simulate fetching packages
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      // In a real app, fetch from API based on username
      // For now, we'll simulate a network request with setTimeout
      setTimeout(() => {
        // Empty array for now - packages will be added by the creator
        setMimoPackages([]);
        setIsLoading(false);
      }, 500);
    };
    
    fetchPackages();
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      
      <CreatorStickyHeader 
        visible={headerVisible}
        avatar={mockCreator.avatar}
        name={mockCreator.name}
        username={mockCreator.username}
        onMimoClick={scrollToMimoSection}
      />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <CreatorHero 
          creator={mockCreator} 
          onMimoClick={scrollToMimoSection} 
        />
        
        {/* Mimos Section */}
        <section id="mimo-section" className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                Envie um Mimo
              </h2>
              <p className="text-gray-600">
                Escolha um dos pacotes abaixo para apoiar
              </p>
            </div>
            
            <Tabs defaultValue="mimos" className="mb-8">
              <div className="flex justify-center">
                <TabsList className="w-[200px] mb-8">
                  <TabsTrigger value="mimos" className="w-full">
                    <Heart className="mr-2 h-4 w-4" /> Mimos
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="mimos">
                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                        <div className="p-4 border border-t-0 rounded-b-lg">
                          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                          <div className="space-y-2 mb-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          </div>
                          <div className="h-10 bg-gray-200 rounded w-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <MimoTabContent 
                    mimoPackages={mimoPackages} 
                    onSelectPackage={handleSelectPackage} 
                  />
                )}
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
            creatorName={mockCreator.name}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatorPage;
