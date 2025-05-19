
import { MimoPackage } from '@/types/creator';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser } from './packageUtils';
import { getLocalPackages, saveLocalPackages } from './packageLocalStorage';

// Get mimo packages with proper user association
export const getMimoPackages = async (): Promise<MimoPackage[]> => {
  const user = getCurrentUser();
  
  // If not logged in, return empty array
  if (!user) {
    console.log("User not logged in, returning empty package list");
    return [];
  }
  
  try {
    // First try to get data from Supabase
    const { data: supabasePackages, error } = await supabase
      .from('packages')
      .select('*, package_features(feature), package_media(id, url, type, caption, is_preview)')
      .eq('creator_id', user.id);
    
    if (error) {
      console.error("Error fetching packages from Supabase:", error);
      // Fallback to localStorage
      return getLocalPackages(user.id);
    }
    
    if (supabasePackages && supabasePackages.length > 0) {
      console.log("Loaded packages from Supabase:", supabasePackages);
      
      // Transform data to match our MimoPackage structure
      const formattedPackages = supabasePackages.map(pkg => ({
        id: pkg.id, // Keep as string ID from Supabase
        title: pkg.title,
        price: Number(pkg.price),
        features: pkg.package_features ? pkg.package_features.map((f: any) => f.feature) : [],
        highlighted: pkg.highlighted,
        isHidden: pkg.is_hidden,
        media: pkg.package_media ? pkg.package_media.map((m: any) => ({
          id: m.id, // Keep as string ID from Supabase
          url: m.url,
          type: m.type,
          caption: m.caption,
          isPreview: m.is_preview
        })) : []
      }));
      
      // Update localStorage with the latest data
      saveLocalPackages(user.id, formattedPackages);
      
      return formattedPackages;
    } else {
      // No data in Supabase, fallback to localStorage
      console.log("No packages in Supabase, checking localStorage");
      return getLocalPackages(user.id);
    }
  } catch (e) {
    console.error("Error in getMimoPackages:", e);
    // Fallback to localStorage on any error
    return getLocalPackages(user.id);
  }
};

// Get packages for a specific creator by username
export const getPackagesByUsername = async (username: string | null | undefined): Promise<MimoPackage[]> => {
  if (!username) {
    console.log("No username provided to getPackagesByUsername");
    return [];
  }
  
  try {
    // First try to get creator ID by username
    const { data: creatorData, error: creatorError } = await supabase
      .from('creators')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    
    if (creatorError || !creatorData) {
      console.error(`Error or no creator found for username ${username}:`, creatorError);
      return [];
    }
    
    // Get packages for this creator
    const { data: packages, error: packagesError } = await supabase
      .from('packages')
      .select('*, package_features(feature), package_media(id, url, type, caption, is_preview)')
      .eq('creator_id', creatorData.id);
    
    if (packagesError) {
      console.error(`Error fetching packages for username ${username}:`, packagesError);
      return [];
    }
    
    console.log(`Raw packages for ${username}:`, packages);
    
    // Transform data to match our MimoPackage structure
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id, // String ID from Supabase
      title: pkg.title,
      price: Number(pkg.price),
      features: pkg.package_features ? pkg.package_features.map((f: any) => f.feature) : [],
      highlighted: pkg.highlighted,
      isHidden: pkg.is_hidden,
      media: pkg.package_media ? pkg.package_media.map((m: any) => ({
        id: m.id, // String ID from Supabase
        url: m.url,
        type: m.type,
        caption: m.caption,
        isPreview: m.is_preview
      })) : []
    }));
    
    console.log(`Loaded ${formattedPackages.length} packages for username ${username}`);
    return formattedPackages;
  } catch (e) {
    console.error(`Error in getPackagesByUsername for ${username}:`, e);
    return [];
  }
};
