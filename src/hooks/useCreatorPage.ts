
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorByUsername, getCreatorPackages } from '@/services/supabase';
import { Creator, MimoPackage } from '@/types/creator';
import { getPackagesByUsername } from '@/services/creator/packageService';
import { useAuth } from '@/contexts/AuthContext';

export const useCreatorPage = () => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [suggestedPrices] = useState<number[]>([10, 15, 25, 50]);
  
  const { username } = useParams<{ username: string }>();
  const mimoSectionRef = useRef<HTMLElement | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCreator = async () => {
      if (!username) return;
      
      try {
        setIsLoading(true);
        console.log("Fetching creator with username:", username);
        
        // Get creator profile from Supabase
        let creatorData = await getCreatorByUsername(username);
        
        // If not found in Supabase, try to get from localStorage (useful for development)
        if (!creatorData) {
          console.log("Creator not found in Supabase, trying localStorage...");
          
          // Check if this is the current user's profile
          if (user?.username === username) {
            // If so, we can get the data from localStorage using the "mimo:creator:" prefix
            const storedCreator = localStorage.getItem(`mimo:creator:${user.id}`);
            if (storedCreator) {
              try {
                creatorData = JSON.parse(storedCreator);
                console.log("Found creator in localStorage:", creatorData);
              } catch (e) {
                console.error("Error parsing localStorage creator data:", e);
              }
            }
          }
        }
        
        if (creatorData) {
          console.log("Creator found:", creatorData);
          setCreator(creatorData);
          
          // Try to get packages from Supabase first
          let packages: MimoPackage[] = [];
          
          if (creatorData?.id) {
            try {
              packages = await getCreatorPackages(creatorData.id);
              console.log("Packages from Supabase:", packages);
            } catch (e) {
              console.error("Error fetching from Supabase:", e);
            }
          }
          
          // If no packages from Supabase or empty, try from localStorage
          if (!packages || packages.length === 0) {
            try {
              packages = getPackagesByUsername(username);
              console.log("Packages from localStorage:", packages);
            } catch (e) {
              console.error("Error fetching from localStorage:", e);
            }
          }
          
          // Only show non-hidden packages
          const visiblePackages = packages.filter(pkg => !pkg.isHidden);
          console.log("Visible packages:", visiblePackages);
          setMimoPackages(visiblePackages);
        } else {
          console.error('No creator data found for username:', username);
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
  }, [username, user]);
  
  // Check if this is the user's own creator page
  const isOwnPage = user?.username === username;
  
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
    // Create a custom package with the specified amount
    const customPackage: MimoPackage = {
      id: 9999, // Special ID for custom packages
      title: "Valor personalizado",
      price: amount, // Using number directly
      features: ["Mimo com valor personalizado"],
      highlighted: false,
      media: []
    };
    
    // Process the package selection with this custom package
    handleSelectPackage(customPackage);
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
    suggestedPrices,
    handleSelectPackage,
    handleCustomAmount,
    scrollToMimoSection,
    setPurchaseFlowOpen
  };
};
