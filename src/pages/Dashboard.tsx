
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardDialogs from '@/components/dashboard/DashboardDialogs';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const {
    // State
    detailDialogOpen,
    rewardDialogOpen,
    selectedMimo,
    rewardMessage,
    rewardFiles,
    withdrawalDialogOpen,
    withdrawalAmount,
    activeTab,
    profileDialogOpen,
    userProfile,
    transactions,
    withdrawals,
    availableBalance,
    totalAmount,
    pendingRewards,
    uniqueFans,
    
    // Setters
    setDetailDialogOpen,
    setRewardDialogOpen,
    setRewardMessage,
    setRewardFiles,
    setWithdrawalDialogOpen,
    setWithdrawalAmount,
    setActiveTab,
    setProfileDialogOpen,
    setUserProfile,
    
    // Handlers
    handleViewMimo,
    handleSendReward,
    handleRequestWithdrawal,
    handleUpdateProfile
  } = useDashboard();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-4 sm:py-8 bg-gradient-to-b from-background to-accent/10">
        <div className="mimo-container px-3 sm:px-4 max-w-full overflow-x-hidden">
          <DashboardHeader onOpenProfileDialog={() => setProfileDialogOpen(true)} />
          
          <StatCards 
            totalAmount={totalAmount}
            availableBalance={availableBalance}
            uniqueFans={uniqueFans}
            pendingRewards={pendingRewards}
            onOpenWithdrawalDialog={() => setWithdrawalDialogOpen(true)}
          />
          
          <DashboardContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            transactions={transactions}
            withdrawals={withdrawals}
            pendingRewards={pendingRewards}
            onViewMimo={handleViewMimo}
            onOpenWithdrawalDialog={() => setWithdrawalDialogOpen(true)}
          />
        </div>
        
        {/* Dialogs */}
        <DashboardDialogs
          detailDialogOpen={detailDialogOpen}
          setDetailDialogOpen={setDetailDialogOpen}
          selectedMimo={selectedMimo}
          rewardDialogOpen={rewardDialogOpen}
          setRewardDialogOpen={setRewardDialogOpen}
          rewardMessage={rewardMessage}
          setRewardMessage={setRewardMessage}
          rewardFiles={rewardFiles}
          setRewardFiles={setRewardFiles}
          withdrawalDialogOpen={withdrawalDialogOpen}
          setWithdrawalDialogOpen={setWithdrawalDialogOpen}
          availableBalance={availableBalance}
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
          profileDialogOpen={profileDialogOpen}
          setProfileDialogOpen={setProfileDialogOpen}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onSendReward={handleSendReward}
          onRequestWithdrawal={handleRequestWithdrawal}
          onUpdateProfile={handleUpdateProfile}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
