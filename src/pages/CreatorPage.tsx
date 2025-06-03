
import React from 'react';
import { useCreatorPage } from '@/hooks/useCreatorPage';
import CreatorHero from '@/components/CreatorHero';
import CreatorProfile from '@/components/CreatorProfile';
import CreatorNavBar from '@/components/CreatorNavBar';
import MimoTabContent from '@/components/MimoTabContent';
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
    isOwnPage,
    selectedPackage,
    purchaseFlowOpen,
    suggestedPrices,
    customAmount,
    handleSelectPackage,
    handleCustomAmount,
    setPurchaseFlowOpen
  } = useCreatorPage();

  console.log('CreatorPage - Loading:', isLoading);
  console.log('CreatorPage - Creator:', creator);
  console.log('CreatorPage - Packages:', mimoPackages);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!creator) {
    return <NotFoundState />;
  }

  // Filter social links to only include supported types for CreatorProfile
  const supportedSocialLinks = (creator.socialLinks || [])
    .filter(link => ['instagram', 'twitter', 'youtube', 'website'].includes(link.type))
    .map(link => ({
      type: link.type as 'instagram' | 'twitter' | 'youtube' | 'website',
      url: link.url
    }));

  return (
    <div className="min-h-screen bg-slate-900">
      {isOwnPage && <AdminBanner />}
      
      <CreatorProfile 
        name={creator.name}
        avatar={creator.avatar}
        cover={creator.cover}
        description={creator.description}
        socialLinks={supportedSocialLinks}
      />
      
      <main className="bg-slate-900" id="mimo-section">
        <MimoTabContent 
          creator={creator}
          suggestedPrices={suggestedPrices}
          onSelectPackage={handleSelectPackage}
          onCustomAmount={handleCustomAmount}
        />
      </main>
      
      {selectedPackage && (
        <PurchaseFlow
          open={purchaseFlowOpen}
          onClose={() => setPurchaseFlowOpen(false)}
          packageId={selectedPackage.id.toString()}
          packageTitle={selectedPackage.title}
          packagePrice={selectedPackage.price}
          creatorId={creator.id || creator.username}
          creatorName={creator.name}
        />
      )}
    </div>
  );
};

export default CreatorPage;
