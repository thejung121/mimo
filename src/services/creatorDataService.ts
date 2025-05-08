
import { Creator, MimoPackage } from '@/types/creator';

const CREATOR_KEY = 'mimo_creator_data';
const PACKAGES_KEY = 'mimo_packages_data';

// Default creator data for new users
const defaultCreator: Creator = {
  username: 'mariafernanda',
  name: 'Maria Fernanda',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
  cover: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
  description: 'Olá! Sou fotógrafa e amo capturar momentos especiais. Se você gosta do meu trabalho, ficarei feliz em receber seu mimo e criar algo especial para você!',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com/mariafernanda' },
    { type: 'twitter', url: 'https://twitter.com/mariafernanda' },
    { type: 'website', url: 'https://mariafernanda.com' },
    { type: 'privacy', url: 'https://privacy.com/mariafernanda' }
  ]
};

export const getCreatorData = (): Creator => {
  try {
    const savedData = localStorage.getItem(CREATOR_KEY);
    return savedData ? JSON.parse(savedData) : defaultCreator;
  } catch (error) {
    console.error('Error retrieving creator data:', error);
    return defaultCreator;
  }
};

export const saveCreatorData = (creatorData: Creator): void => {
  try {
    localStorage.setItem(CREATOR_KEY, JSON.stringify(creatorData));
  } catch (error) {
    console.error('Error saving creator data:', error);
  }
};

export const getMimoPackages = (): MimoPackage[] => {
  try {
    const savedPackages = localStorage.getItem(PACKAGES_KEY);
    return savedPackages ? JSON.parse(savedPackages) : [];
  } catch (error) {
    console.error('Error retrieving packages data:', error);
    return [];
  }
};

export const saveMimoPackages = (packages: MimoPackage[]): void => {
  try {
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
  } catch (error) {
    console.error('Error saving packages data:', error);
  }
};

export const saveAllData = (creator: Creator, packages: MimoPackage[]): void => {
  saveCreatorData(creator);
  saveMimoPackages(packages);
};
