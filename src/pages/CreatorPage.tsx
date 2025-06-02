
import React from 'react';
import { useCreatorPage } from '@/hooks/useCreatorPage';
import CreatorHero from '@/components/CreatorHero';
import CreatorProfile from '@/components/CreatorProfile';
import CreatorNavBar from '@/components/CreatorNavBar';
import MimoTabContent from '@/components/MimoTabContent';
import CreatorStickyHeader from '@/components/CreatorStickyHeader';
import PurchaseFlow from '@/components/PurchaseFlow';
import CreatorFooter from '@/components/CreatorFooter';
import LoadingState from '@/components/creator/LoadingState';
import NotFoundState from '@/components/creator/NotFoundState';
import AdminBanner from '@/components/creator/AdminBanner';

const CreatorPage = () => {
  const {
    creator,
    mimoPackages,
    isLoading,
    headerVisible,
    isOwnPage,
    selectedPackage,
    purchaseFlowOpen,
    suggestedPrices,
    customAmount,
    handleSelectPackage,
    handleCustomAmount,
    scrollToMimoSection,
    setPurchaseFlowOpen
  } = useCreatorPage();

  if (isLoading) {
    return <LoadingState />;
  }

  if (!creator) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-background">
      {isOwnPage && <AdminBanner />}
      
      <CreatorHero 
        creator={creator} 
        onMimoClick={scrollToMimoSection} 
      />
      
      <CreatorProfile 
        name={creator.name}
        avatar={creator.avatar}
        cover={creator.cover}
        description={creator.description}
        socialLinks={creator.socialLinks}
      />
      
      <CreatorNavBar />
      
      <main className="py-8" id="mimo-section">
        <MimoTabContent 
          creator={creator}
          suggestedPrices={suggestedPrices}
          onSelectPackage={handleSelectPackage}
          onCustomAmount={handleCustomAmount}
        />
      </main>
      
      <CreatorFooter />
      
      {headerVisible && (
        <CreatorStickyHeader 
          visible={headerVisible}
          avatar={creator.avatar}
          name={creator.name}
          username={creator.username}
          onMimoClick={scrollToMimoSection} 
        />
      )}
      
      <PurchaseFlow
        open={purchaseFlowOpen}
        onClose={() => setPurchaseFlowOpen(false)}
        package={selectedPackage}
        customAmount={customAmount}
        creator={creator}
      />
    </div>
  );
};

export default CreatorPage;
