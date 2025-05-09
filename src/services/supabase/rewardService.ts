
import { supabase, useDemo } from './supabaseClient';

export const getRewardByToken = async (token: string) => {
  if (useDemo) return null;
  
  const { data, error } = await supabase
    .from('rewards')
    .select('*, transactions!inner(*, creators(*)), reward_content(*)')
    .eq('access_token', token)
    .single();
  
  if (error) {
    console.error('Error getting reward:', error);
    return null;
  }
  
  return data;
};

export const createRewardContent = async (rewardId: string, contents: Array<{ type: string; url: string; caption?: string; }>) => {
  if (useDemo) return;
  
  const { error } = await supabase
    .from('reward_content')
    .insert(
      contents.map(content => ({
        reward_id: rewardId,
        type: content.type,
        url: content.url,
        caption: content.caption,
      }))
    );
  
  if (error) {
    console.error('Error creating reward content:', error);
    throw error;
  }
};
