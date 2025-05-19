
import { MimoPackage } from '@/types/creator';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, isUUID, safeParseInt } from './packageUtils';
import { saveLocalPackages } from './packageLocalStorage';

// Save mimo packages with user ID association
export const saveMimoPackages = async (packages: MimoPackage[]): Promise<boolean> => {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn("Attempting to save packages data without being logged in");
    return false;
  }
  
  try {
    console.log("Saving packages to Supabase:", packages);
    
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
        await updateExistingPackage(pkg);
      } else {
        await createNewPackage(pkg, user.id);
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

// Update an existing package
const updateExistingPackage = async (pkg: MimoPackage): Promise<void> => {
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
    return;
  }
  
  // Update features: first delete existing, then add new ones
  await updatePackageFeatures(pkg);
  
  // Handle media: Only update changed items
  if (pkg.media && pkg.media.length > 0) {
    await updatePackageMedia(pkg);
  }
};

// Update features for a package
const updatePackageFeatures = async (pkg: MimoPackage): Promise<void> => {
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
};

// Update media for a package
const updatePackageMedia = async (pkg: MimoPackage): Promise<void> => {
  for (const media of pkg.media) {
    // Check if the ID is a UUID
    const mediaId = String(media.id);
    const isValidUUID = isUUID(mediaId);
                      
    if (!isValidUUID) {
      // This is a new media item that hasn't been saved to Supabase yet
      const { data: mediaData, error: mediaError } = await supabase
        .from('package_media')
        .insert({
          package_id: String(pkg.id),
          type: media.type,
          url: media.url,
          caption: media.caption || null,
          is_preview: media.isPreview
        })
        .select('id')
        .single();
      
      if (mediaError) {
        console.error("Error adding media:", mediaError);
      } else if (mediaData) {
        // Update media id with numeric value, not string
        const parsedId = safeParseInt(mediaData.id);
        media.id = parsedId;
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
        .eq('id', mediaId);
      
      if (updateMediaError) {
        console.error("Error updating media:", updateMediaError);
      }
    }
  }
};

// Create a new package
const createNewPackage = async (pkg: MimoPackage, creatorId: string): Promise<void> => {
  console.log("Creating new package in Supabase");
  const { data: newPkg, error: insertError } = await supabase
    .from('packages')
    .insert({
      title: pkg.title,
      price: pkg.price,
      highlighted: pkg.highlighted,
      is_hidden: pkg.isHidden,
      creator_id: creatorId
    })
    .select('id')
    .single();
  
  if (insertError) {
    console.error("Error inserting package:", insertError);
    return;
  }
  
  if (newPkg) {
    // Update the package ID with the UUID from Supabase
    const oldId = pkg.id;
    // Convert ID properly
    const parsedId = safeParseInt(newPkg.id);
    pkg.id = parsedId;
    
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
          // Convert ID properly
          const parsedId = safeParseInt(mediaData.id);
          media.id = parsedId;
        }
      }
    }
  }
};
