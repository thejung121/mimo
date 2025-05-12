
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCards from '@/components/dashboard/StatCards';
import DashboardContent from '@/components/dashboard/DashboardContent';
import DashboardDialogs from '@/components/dashboard/DashboardDialogs';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import ProfileDialog from '@/components/dashboard/ProfileDialog';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';

const Dashboard = () => {
  const { user } = useAuth();
  
  const {
    detailDialogOpen,
    rewardDialogOpen,
    selectedMimo,
    rewardMessage,
    rewardFiles,
    withdrawalDialogOpen,
    withdrawalAmount,
    activeTab,
    profileDialogOpen,
    creator,
    transactions,
    withdrawals,
    availableBalance,
    totalAmount,
    pendingRewards,
    uniqueFans,
    isLoading,
    setDetailDialogOpen,
    setRewardDialogOpen,
    setRewardMessage,
    setRewardFiles,
    setWithdrawalDialogOpen,
    setWithdrawalAmount,
    setActiveTab,
    setProfileDialogOpen,
    handleViewMimo,
    handleSendReward,
    handleRequestWithdrawal,
    handleUpdateProfile
  } = useDashboard();

  const [userProfile, setUserProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    document: user?.document || "",
    username: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Update user profile state when user data changes
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        document: user.document || prev.document,
        username: user.username || prev.username
      }));
    }
  }, [user]);

  // Function to handle profile update and propagate to localStorage
  const handleProfileUpdate = () => {
    handleUpdateProfile();
    
    // Update localStorage to ensure changes are available immediately
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        userData.username = userProfile.username;
        userData.name = userProfile.name;
        userData.document = userProfile.document;
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userData));
        console.log('Updated user data in localStorage:', userData);
      } catch (error) {
        console.error('Error updating localStorage user data:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-background rounded-lg border shadow-sm p-4 sm:p-6">
        <DashboardHeader onOpenProfileDialog={() => setProfileDialogOpen(true)} />
        
        <StatCards 
          totalAmount={totalAmount} 
          pendingRewards={pendingRewards} 
          uniqueFans={uniqueFans}
          availableBalance={availableBalance}
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
        
        <DashboardDialogs 
          detailDialogOpen={detailDialogOpen}
          setDetailDialogOpen={setDetailDialogOpen}
          rewardDialogOpen={rewardDialogOpen}
          setRewardDialogOpen={setRewardDialogOpen}
          selectedMimo={selectedMimo}
          rewardMessage={rewardMessage}
          setRewardMessage={setRewardMessage}
          rewardFiles={rewardFiles}
          setRewardFiles={setRewardFiles}
          onSendReward={handleSendReward}
          withdrawalDialogOpen={withdrawalDialogOpen}
          setWithdrawalDialogOpen={setWithdrawalDialogOpen}
          withdrawalAmount={withdrawalAmount}
          setWithdrawalAmount={setWithdrawalAmount}
          availableBalance={availableBalance}
          onRequestWithdrawal={handleRequestWithdrawal}
        />
        
        <ProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onUpdateProfile={handleProfileUpdate}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
