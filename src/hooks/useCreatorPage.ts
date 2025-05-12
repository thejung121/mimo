
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorByUsername, getCreatorPackages } from '@/services/supabase';
import { Creator, MimoPackage } from '@/types/creator';

export const useCreatorPage = () => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  
  const { username } = useParams<{ username: string }>();
  const mimoSectionRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    const fetchCreator = async () => {
      if (!username) return;
      
      try {
        setIsLoading(true);
        
        // Get creator profile
        const creatorData = await getCreatorByUsername(username);
        setCreator(creatorData);
        
        // If creator found, get their packages
        if (creatorData?.id) {
          const packages = await getCreatorPackages(creatorData.id);
          setMimoPackages(packages);
        }
      } catch (error) {
        console.error('Failed to load creator page:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreator();
    
    // Set up scroll listener for sticky header
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [username]);
  
  // Check if this is the user's own creator page
  const isOwnPage = false; // This will be implemented with auth context later
  
  const scrollToMimoSection = () => {
    if (!mimoSectionRef.current) {
      mimoSectionRef.current = document.getElementById('mimo-section');
    }
    
    mimoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSelectPackage = (pkg: MimoPackage) => {
    setSelectedPackage(pkg);
    setCustomAmount(null);
    setPurchaseFlowOpen(true);
  };
  
  const handleCustomAmount = (amount: number) => {
    // Create a virtual package with the custom amount
    if (creator) {
      const customPackage: MimoPackage = {
        id: 'custom',
        title: 'Mimo Personalizado',
        price: Number(amount), // Convert to number explicitly to ensure type correctness
        creator_id: creator.id || '',
        features: ['Valor personalizado'],
        highlighted: false,
        media: []
      };
      
      setSelectedPackage(customPackage);
      setCustomAmount(amount);
      setPurchaseFlowOpen(true);
    }
  };
  
  return {
    creator,
    mimoPackages,
    isLoading,
    headerVisible,
    isOwnPage,
    selectedPackage,
    customAmount,
    purchaseFlowOpen,
    handleSelectPackage,
    handleCustomAmount,
    scrollToMimoSection,
    setPurchaseFlowOpen
  };
};
