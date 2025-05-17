
import { MimoPackage } from '@/types/creator';
import { LOCAL_STORAGE_KEY } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

// Get the current authenticated user from localStorage
const getCurrentUser = () => {
  const authUser = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!authUser) return null;
  
  try {
    return JSON.parse(authUser);
  } catch (e) {
    console.error("Failed to parse user data from localStorage", e);
    return null;
  }
};

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
        id: pkg.id,
        title: pkg.title,
        price: Number(pkg.price),
        features: pkg.package_features ? pkg.package_features.map((f: any) => f.feature) : [],
        highlighted: pkg.highlighted,
        isHidden: pkg.is_hidden,
        media: pkg.package_media ? pkg.package_media.map((m: any) => ({
          id: m.id,
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

// Helper for localStorage fallback
const getLocalPackages = (userId: string): MimoPackage[] => {
  try {
    const packagesKey = `mimo:packages:${userId}`;
    const storedPackages = localStorage.getItem(packagesKey);
    
    if (storedPackages) {
      const parsed = JSON.parse(storedPackages);
      console.log("Loaded packages from local storage:", parsed);
      return parsed;
    }
  } catch (e) {
    console.error("Failed to parse packages data from localStorage", e);
  }
  
  return [];
};

// Save local backup of packages
const saveLocalPackages = (userId: string, packages: MimoPackage[]): void => {
  try {
    const packagesKey = `mimo:packages:${userId}`;
    localStorage.setItem(packagesKey, JSON.stringify(packages));
    console.log("Saved packages to localStorage as backup:", packages);
  } catch (error) {
    console.error("Error saving packages to localStorage:", error);
  }
};

// Save mimo packages with user ID association
export const saveMimoPackages = async (packages: MimoPackage[]): Promise<boolean> => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save packages data without being logged in");
    return false;
  }
  
  try {
    // Save to Supabase
    for (const pkg of packages) {
      // Check if package exists in Supabase
      const { data: existingPkg, error: checkError } = await supabase
        .from('packages')
        .select('id')
        .eq('id', String(pkg.id))
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking if package exists:", checkError);
        continue;
      }
      
      if (existingPkg) {
        // Package exists, update it
        console.log("Updating existing package in Supabase:", pkg.id);
        const { error } = await supabase
          .from('packages')
          .update({
            title: pkg.title,
            price: pkg.price,
            highlighted: pkg.highlighted,
            is_hidden: pkg.isHidden,
            updated_at: new Date().toISOString()
          })
          .eq('id', String(pkg.id));
        
        if (error) {
          console.error("Error updating package:", error);
          continue;
        }
        
        // Update features: first delete existing, then add new ones
        const { error: deleteError } = await supabase
          .from('package_features')
          .delete()
          .eq('package_id', String(pkg.id));
        
        if (deleteError) {
          console.error("Error deleting package features:", deleteError);
        }
        
        if (pkg.features && pkg.features.length > 0) {
          // Insert each feature individually
          for (const feature of pkg.features) {
            const { error: featureError } = await supabase
              .from('package_features')
              .insert({
                package_id: String(pkg.id),
                feature: feature
              });
            
            if (featureError) {
              console.error("Error adding package feature:", featureError);
            }
          }
        }
        
        // Handle media: Only update changed items
        if (pkg.media && pkg.media.length > 0) {
          for (const media of pkg.media) {
            // Fix: Properly check for UUID format or numeric IDs
            const mediaIdString = String(media.id);
            const isUUID = typeof media.id === 'string' && 
                          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(mediaIdString);
                          
            if (!isUUID) {
              // This is a new media item that hasn't been saved to Supabase yet
              const { data: mediaData, error: mediaError } = await supabase
                .from('package_media')
                .insert({
                  package_id: String(pkg.id),
                  type: media.type,
                  url: media.url,
                  caption: media.caption,
                  is_preview: media.isPreview
                })
                .select('id')
                .single();
              
              if (mediaError) {
                console.error("Error adding media:", mediaError);
              } else if (mediaData) {
                // Update the local ID with the Supabase UUID
                // Convert number to string if needed for consistent typing
                media.id = mediaData.id;
              }
            } else {
              // Existing media, update it
              const { error: updateMediaError } = await supabase
                .from('package_media')
                .update({
                  type: media.type,
                  url: media.url,
                  caption: media.caption,
                  is_preview: media.isPreview
                })
                .eq('id', String(media.id));
              
              if (updateMediaError) {
                console.error("Error updating media:", updateMediaError);
              }
            }
          }
        }
      } else {
        // New package, insert it
        console.log("Creating new package in Supabase");
        const { data: newPkg, error: insertError } = await supabase
          .from('packages')
          .insert({
            title: pkg.title,
            price: pkg.price,
            highlighted: pkg.highlighted,
            is_hidden: pkg.isHidden,
            creator_id: user.id
          })
          .select('id')
          .single();
        
        if (insertError) {
          console.error("Error inserting package:", insertError);
          continue;
        }
        
        if (newPkg) {
          // Update the package ID with the UUID from Supabase
          const oldId = pkg.id;
          pkg.id = newPkg.id;
          
          // Add features
          if (pkg.features && pkg.features.length > 0) {
            // Insert each feature individually
            for (const feature of pkg.features) {
              const { error: featureError } = await supabase
                .from('package_features')
                .insert({
                  package_id: String(newPkg.id),
                  feature: feature
                });
              
              if (featureError) {
                console.error("Error adding package feature:", featureError);
              }
            }
          }
          
          // Add media
          if (pkg.media && pkg.media.length > 0) {
            for (const media of pkg.media) {
              const { data: mediaData, error: mediaError } = await supabase
                .from('package_media')
                .insert({
                  package_id: String(newPkg.id),
                  type: media.type,
                  url: media.url,
                  caption: media.caption,
                  is_preview: media.isPreview
                })
                .select('id')
                .single();
              
              if (mediaError) {
                console.error("Error adding media:", mediaError);
              } else if (mediaData) {
                // Update the local ID with the Supabase UUID
                media.id = mediaData.id;
              }
            }
          }
        }
      }
    }
    
    // Save to localStorage as backup
    saveLocalPackages(user.id, packages);
    console.log("Successfully saved all packages to Supabase and localStorage");
    
    return true;
  } catch (error) {
    console.error("Error saving packages:", error);
    
    // Save to localStorage anyway as backup
    saveLocalPackages(user.id, packages);
    
    return false;
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
      .eq('creator_id', creatorData.id)
      .eq('is_hidden', false);
    
    if (packagesError) {
      console.error(`Error fetching packages for username ${username}:`, packagesError);
      return [];
    }
    
    // Transform data to match our MimoPackage structure
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      price: Number(pkg.price),
      features: pkg.package_features ? pkg.package_features.map((f: any) => f.feature) : [],
      highlighted: pkg.highlighted,
      isHidden: pkg.is_hidden,
      media: pkg.package_media ? pkg.package_media.map((m: any) => ({
        id: m.id,
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
