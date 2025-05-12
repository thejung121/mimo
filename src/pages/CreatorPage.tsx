
import React from 'react';
import CreatorNavBar from '@/components/CreatorNavBar';
import CreatorFooter from '@/components/CreatorFooter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart } from 'lucide-react';
import PurchaseFlow from "@/components/PurchaseFlow";
import CreatorHero from '@/components/CreatorHero';
import CreatorStickyHeader from '@/components/CreatorStickyHeader';
import MimoTabContent from '@/components/MimoTabContent';
import LoadingState from '@/components/creator/LoadingState';
import NotFoundState from '@/components/creator/NotFoundState';
import AdminBanner from '@/components/creator/AdminBanner';
import { useCreatorPage } from '@/hooks/useCreatorPage';

const CreatorPage = () => {
  const {
    creator,
    mimoPackages,
    isLoading,
    headerVisible,
    isOwnPage,
    selectedPackage,
    purchaseFlowOpen,
    handleSelectPackage,
    scrollToMimoSection,
    setPurchaseFlowOpen
  } = useCreatorPage();

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show not found state
  if (!creator) {
    return <NotFoundState />;
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
        {isOwnPage && <AdminBanner />}
        
        {/* Hero Section */}
        <CreatorHero 
          creator={creator} 
          onMimoClick={scrollToMimoSection} 
        />
        
        {/* Mimos Section */}
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
        {selectedPackage && creator && (
          <PurchaseFlow
            open={purchaseFlowOpen}
            onClose={() => {
              setPurchaseFlowOpen(false);
            }}
            packageId={selectedPackage.id?.toString() || ''}
            packageTitle={selectedPackage.title}
            packagePrice={selectedPackage.price}
            creatorId={creator.id || ''}
            creatorName={creator.name}
          />
        )}
      </main>
      
      <CreatorFooter />
    </div>
  );
};

export default CreatorPage;
