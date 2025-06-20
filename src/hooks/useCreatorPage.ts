
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCreatorByUsername } from '@/services/supabase/creatorService';
import { Creator, MimoPackage } from '@/types/creator';
import { getPackagesByUsername } from '@/services/creator/packageService';
import { useAuth } from '@/contexts/AuthContext';

export const useCreatorPage = () => {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [mimoPackages, setMimoPackages] = useState<MimoPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<MimoPackage | null>(null);
  const [purchaseFlowOpen, setPurchaseFlowOpen] = useState(false);
  const [suggestedPrices] = useState<number[]>([7, 15, 50]);
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchCreator = async () => {
      if (!username) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log("Fetching creator with username:", username);
        
        // Get creator profile from Supabase first
        let creatorData = await getCreatorByUsername(username);
        
        // If not found in Supabase, try to get from localStorage (useful for development)
        if (!creatorData) {
          console.log("Creator not found in Supabase, trying localStorage...");
          
          // Check if this is the current user's profile
          const currentUsername = user?.username;
          if (currentUsername === username) {
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
          
          // Transform CreatorData to Creator interface
          const transformedCreator: Creator = {
            id: creatorData.id,
            name: creatorData.name,
            username: creatorData.username,
            avatar: creatorData.avatar || '/placeholder.svg',
            cover: creatorData.cover || '/placeholder.svg',
            description: creatorData.description || '',
            coverTitle: creatorData.cover_title || '',
            coverSubtitle: creatorData.cover_subtitle || '',
            about: creatorData.about || '',
            socialLinks: [] // Default empty array since CreatorData doesn't have socialLinks
          };
          
          setCreator(transformedCreator);
          
          // Try to get packages from Supabase or localStorage
          try {
            // Load packages by username
            const packages = await getPackagesByUsername(username);
            console.log("Packages loaded for creator:", packages);
            
            if (packages && packages.length > 0) {
              // Only display packages that are not hidden
              const visiblePackages = packages.filter(pkg => pkg.isHidden !== true);
              console.log("Filtered visible packages:", visiblePackages);
              setMimoPackages(visiblePackages);
            } else {
              console.log("No packages found for this creator or all are hidden");
              // Try fallback for current user
              const currentUsername = user?.username;
              if (currentUsername === username && user?.id) {
                console.log("Attempting direct load for current user");
                // Try localStorage directly for current user's packages
                const localStorageKey = `mimo:packages:${user.id}`;
                const localPackagesStr = localStorage.getItem(localStorageKey);
                if (localPackagesStr) {
                  try {
                    const localPackages = JSON.parse(localPackagesStr);
                    if (Array.isArray(localPackages) && localPackages.length > 0) {
                      const visibleLocalPackages = localPackages.filter(pkg => pkg.isHidden !== true);
                      console.log("Found packages in localStorage:", visibleLocalPackages);
                      setMimoPackages(visibleLocalPackages);
                    } else {
                      setMimoPackages([]);
                    }
                  } catch (error) {
                    console.error("Error parsing packages from localStorage:", error);
                    setMimoPackages([]);
                  }
                } else {
                  setMimoPackages([]);
                }
              } else {
                setMimoPackages([]);
              }
            }
          } catch (e) {
            console.error("Error getting packages:", e);
            setMimoPackages([]);
          }
        } else {
          console.log("Creator not found");
          setCreator(null);
        }
      } catch (error) {
        console.error("Error in fetchCreator:", error);
        setCreator(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreator();
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
      id: "custom", // Use string ID
      title: "Valor personalizado",
      price: amount,
      features: ["Valor personalizado definido por você"],
      highlighted: false,
      media: [],
      isHidden: false
    });
    setPurchaseFlowOpen(true);
  };
  
  const currentUsername = user?.username;
  const isOwnPage = currentUsername === username;
  
  return {
    creator,
    mimoPackages,
    isLoading,
    isOwnPage,
    selectedPackage,
    purchaseFlowOpen,
    suggestedPrices,
    customAmount,
    handleSelectPackage,
    handleCustomAmount,
    setPurchaseFlowOpen
  };
};
