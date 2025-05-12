
import React from 'react';
import MimoDetailDialog from './MimoDetailDialog';
import SendRewardDialog from './SendRewardDialog';
import WithdrawalDialog from './WithdrawalDialog';
import ProfileDialog from './ProfileDialog';

interface DashboardDialogsProps {
  detailDialogOpen: boolean;
  setDetailDialogOpen: (open: boolean) => void;
  selectedMimo: any;
  rewardDialogOpen: boolean;
  setRewardDialogOpen: (open: boolean) => void;
  rewardMessage: string;
  setRewardMessage: (message: string) => void;
  rewardFiles: FileList | null;
  setRewardFiles: (files: FileList | null) => void;
  withdrawalDialogOpen: boolean;
  setWithdrawalDialogOpen: (open: boolean) => void;
  availableBalance: number;
  withdrawalAmount: string;
  setWithdrawalAmount: (amount: string) => void;
  profileDialogOpen: boolean;
  setProfileDialogOpen: (open: boolean) => void;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  onSendReward: () => void;
  onRequestWithdrawal: () => void;
  onUpdateProfile: () => void;
}

const DashboardDialogs: React.FC<DashboardDialogsProps> = ({
  detailDialogOpen,
  setDetailDialogOpen,
  selectedMimo,
  rewardDialogOpen,
  setRewardDialogOpen,
  rewardMessage,
  setRewardMessage,
  rewardFiles,
  setRewardFiles,
  withdrawalDialogOpen,
  setWithdrawalDialogOpen,
  availableBalance,
  withdrawalAmount,
  setWithdrawalAmount,
  profileDialogOpen,
  setProfileDialogOpen,
  userProfile,
  setUserProfile,
  onSendReward,
  onRequestWithdrawal,
  onUpdateProfile
}) => {
  return (
    <>
      <MimoDetailDialog 
        open={detailDialogOpen} 
        onOpenChange={setDetailDialogOpen}
        selectedMimo={selectedMimo}
        onSendReward={() => {
          setDetailDialogOpen(false);
          setRewardDialogOpen(true);
        }}
      />
      
      <SendRewardDialog 
        open={rewardDialogOpen}
        onOpenChange={setRewardDialogOpen}
        selectedMimo={selectedMimo}
        rewardMessage={rewardMessage}
        setRewardMessage={setRewardMessage}
        rewardFiles={rewardFiles}
        setRewardFiles={setRewardFiles}
        onSendReward={onSendReward}
        onBack={() => {
          setRewardDialogOpen(false);
          setDetailDialogOpen(true);
        }}
      />
      
      <WithdrawalDialog 
        open={withdrawalDialogOpen}
        onOpenChange={setWithdrawalDialogOpen}
        availableBalance={availableBalance}
        withdrawalAmount={withdrawalAmount}
        setWithdrawalAmount={setWithdrawalAmount}
        onRequestWithdrawal={onRequestWithdrawal}
      />
      
      <ProfileDialog 
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        onUpdateProfile={onUpdateProfile}
      />
    </>
  );
};

export default DashboardDialogs;
