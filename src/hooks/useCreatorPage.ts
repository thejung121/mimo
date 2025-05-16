
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorByUsername, getCreatorPackages } from '@/services/supabase/creatorService';
import { Creator, MimoPackage } from '@/types/creator';
import { getPackagesByUsername } from '@/services/creator/packageService';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCreatorPage = () => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [suggestedPrices] = useState<number[]>([7, 15, 50]);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  
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
          } else {
            // If it's not the current user, try to find the user in localStorage
            // Iterate through all localStorage items to find the user by username
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key?.startsWith('mimo:creator:')) {
                try {
                  const data = JSON.parse(localStorage.getItem(key) || '{}');
                  if (data.username === username) {
                    creatorData = data;
                    console.log("Found creator in localStorage by username search:", creatorData);
                    break;
                  }
                } catch (e) {
                  console.error("Error parsing localStorage item:", e);
                }
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
              // First try to get directly from localStorage for the creator's ID
              const localStorageKey = `mimo:packages:${creatorData.id}`;
              const storedPackages = localStorage.getItem(localStorageKey);
              
              if (storedPackages) {
                try {
                  packages = JSON.parse(storedPackages);
                  console.log("Packages from localStorage by creator ID:", packages);
                } catch (error) {
                  console.error("Error parsing packages from localStorage:", error);
                }
              } else {
                // If that fails, try by username
                packages = getPackagesByUsername(username);
                console.log("Packages from localStorage by username:", packages);
              }
            } catch (e) {
              console.error("Error getting packages from localStorage:", e);
            }
          }
          
          // Filter out hidden packages for display
          packages = packages.filter(pkg => !pkg.isHidden);
          console.log("Filtered visible packages:", packages);
          setMimoPackages(packages);
        } else {
          console.log("Creator not found");
          setCreator(null);
        }
      } catch (error) {
        console.error("Error in fetchCreator:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreator();
    
    // Setup scroll listener for sticky header
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
  
  const handleSelectPackage = (pkg: MimoPackage) => {
    console.log("Selected package:", pkg);
    setSelectedPackage(pkg);
    setCustomAmount(null);
    setPurchaseFlowOpen(true);
  };
  
  const handleCustomAmount = (amount: number) => {
    console.log("Custom amount selected:", amount);
    setCustomAmount(amount);
    setSelectedPackage({
      id: 0,
      title: "Valor personalizado",
      price: amount,
      features: ["Valor personalizado definido por você"],
      highlighted: false,
      media: [],
      isHidden: false
    });
    setPurchaseFlowOpen(true);
  };
  
  const scrollToMimoSection = () => {
    const mimoSection = document.getElementById('mimo-section');
    if (mimoSection) {
      mimoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const isOwnPage = user?.username === username;
  
  return {
    creator,
    mimoPackages,
    isLoading,
    headerVisible,
    isOwnPage,
    selectedPackage,
    purchaseFlowOpen,
    suggestedPrices,
    customAmount,
    handleSelectPackage,
    handleCustomAmount,
    scrollToMimoSection,
    setPurchaseFlowOpen
  };
};
