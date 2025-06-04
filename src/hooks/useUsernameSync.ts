
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveCreatorData, getCreatorData } from '@/services/creator/profileService';

export const useUsernameSync = () => {
  const { user, updateUserProfile } = useAuth();

  useEffect(() => {
    // Sync username between auth context and creator data
    const syncUsername = async () => {
      if (user?.username) {
        const creator = getCreatorData();
        if (creator.username !== user.username) {
          console.log('Syncing username from auth to creator:', user.username);
          const updatedCreator = { ...creator, username: user.username };
          saveCreatorData(updatedCreator);
          
          // Force a small delay to ensure sync
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('usernameUpdated', { 
              detail: { username: user.username } 
            }));
          }, 100);
        }
      }
    };

    syncUsername();
  }, [user?.username]);

  return user?.username;
};
