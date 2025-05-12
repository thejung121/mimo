
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Creator, MimoPackage } from '@/types/creator';
import { getCreatorByUsername, getCreatorPackages } from '@/services/supabase/creatorService';
import { useAuth } from '@/contexts/AuthContext';

export const useCreatorPage = () => {
  const { username } = useParams();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user } = useAuth();
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is the user's own page
  const isOwnPage = user ? user.username === username : false;

  // Always scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load creator and package data
  useEffect(() => {
    const fetchData = async () => {
      if (!username) return;
      
      setIsLoading(true);
      
      try {
        // Get creator data from Supabase
        const creatorData = await getCreatorByUsername(username);
        
        if (creatorData) {
          setCreator(creatorData);
          
          // Get creator packages
          if (creatorData.id) {
            const packagesData = await getCreatorPackages(creatorData.id);
            setMimoPackages(packagesData);
          }
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [username]);

  // Handle scroll effect for header
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      setHeaderVisible(currentScrollY < lastScrollY);
    } else {
      setHeaderVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSelectPackage = (pkg: MimoPackage) => {
    setSelectedPackage(pkg);
    setPurchaseFlowOpen(true);
  };

  const scrollToMimoSection = () => {
    const mimoSection = document.getElementById('mimo-section');
    if (mimoSection) {
      mimoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return {
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
  };
};
