
import { supabase } from '@/integrations/supabase/client';
import { MimoPackage } from '@/types/creator';

// Criar uma nova recompensa
export const createPackage = async (packageData: Omit<MimoPackage, 'id'>, creatorId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .insert({
        title: packageData.title,
        price: packageData.price,
        highlighted: packageData.highlighted,
        is_hidden: packageData.isHidden,
        creator_id: creatorId
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating package:', error);
      return null;
    }

    // Adicionar features
    if (packageData.features.length > 0) {
      const featuresData = packageData.features.map(feature => ({
        package_id: data.id,
        feature: feature
      }));

      const { error: featuresError } = await supabase
        .from('package_features')
        .insert(featuresData);

      if (featuresError) {
        console.error('Error creating package features:', featuresError);
      }
    }

    // Adicionar mídia
    if (packageData.media.length > 0) {
      const mediaData = packageData.media.map(media => ({
        package_id: data.id,
        type: media.type,
        url: media.url,
        caption: media.caption,
        is_preview: media.isPreview
      }));

      const { error: mediaError } = await supabase
        .from('package_media')
        .insert(mediaData);

      if (mediaError) {
        console.error('Error creating package media:', mediaError);
      }
    }

    return data.id;
  } catch (error) {
    console.error('Error in createPackage:', error);
    return null;
  }
};

// Atualizar uma recompensa existente
export const updatePackage = async (packageId: string, packageData: Partial<MimoPackage>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('packages')
      .update({
        title: packageData.title,
        price: packageData.price,
        highlighted: packageData.highlighted,
        is_hidden: packageData.isHidden
      })
      .eq('id', packageId);

    if (error) {
      console.error('Error updating package:', error);
      return false;
    }

    // Atualizar features se fornecidas
    if (packageData.features) {
      // Remover features existentes
      await supabase
        .from('package_features')
        .delete()
        .eq('package_id', packageId);

      // Adicionar novas features
      if (packageData.features.length > 0) {
        const featuresData = packageData.features.map(feature => ({
          package_id: packageId,
          feature: feature
        }));

        const { error: featuresError } = await supabase
          .from('package_features')
          .insert(featuresData);

        if (featuresError) {
          console.error('Error updating package features:', featuresError);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in updatePackage:', error);
    return false;
  }
};

// Deletar uma recompensa
export const deletePackage = async (packageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', packageId);

    if (error) {
      console.error('Error deleting package:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deletePackage:', error);
    return false;
  }
};

// Buscar recompensas do criador logado
export const getMyPackages = async (): Promise<MimoPackage[]> => {
  try {
    const { data: packages, error } = await supabase
      .from('packages')
      .select(`
        id,
        title,
        price,
        highlighted,
        is_hidden,
        package_features(feature),
        package_media(id, type, url, caption, is_preview)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my packages:', error);
      return [];
    }

    return formatPackagesFromSupabase(packages || []);
  } catch (error) {
    console.error('Error in getMyPackages:', error);
    return [];
  }
};

// Buscar recompensas visíveis de um criador por username
export const getPublicPackagesByUsername = async (username: string): Promise<MimoPackage[]> => {
  try {
    // Primeiro buscar o criador pelo username
    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select('id')
      .eq('username', username)
      .single();

    if (creatorError || !creator) {
      console.error('Creator not found:', creatorError);
      return [];
    }

    // Buscar recompensas visíveis do criador
    const { data: packages, error } = await supabase
      .from('packages')
      .select(`
        id,
        title,
        price,
        highlighted,
        is_hidden,
        package_features(feature),
        package_media(id, type, url, caption, is_preview)
      `)
      .eq('creator_id', creator.id)
      .eq('is_hidden', false)
      .order('highlighted', { ascending: false })
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching public packages:', error);
      return [];
    }

    return formatPackagesFromSupabase(packages || []);
  } catch (error) {
    console.error('Error in getPublicPackagesByUsername:', error);
    return [];
  }
};

// Alternar visibilidade de uma recompensa
export const togglePackageVisibility = async (packageId: string, isHidden: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('packages')
      .update({ is_hidden: isHidden })
      .eq('id', packageId);

    if (error) {
      console.error('Error toggling package visibility:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in togglePackageVisibility:', error);
    return false;
  }
};

// Função auxiliar para formatar dados do Supabase
const formatPackagesFromSupabase = (packages: any[]): MimoPackage[] => {
  return packages.map(pkg => ({
    id: pkg.id,
    title: pkg.title,
    price: Number(pkg.price),
    features: pkg.package_features?.map((f: any) => f.feature) || [],
    highlighted: pkg.highlighted,
    isHidden: pkg.is_hidden,
    media: pkg.package_media?.map((m: any) => ({
      id: m.id,
      type: m.type,
      url: m.url,
      caption: m.caption,
      isPreview: m.is_preview
    })) || []
  }));
};
