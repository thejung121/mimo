
import { useState, useEffect } from 'react';
import { MimoPackage } from '@/types/creator';
import { getPublicPackagesByUsername } from '@/services/supabase/packageService';

export const usePublicPackages = (username?: string) => {
  const [packages, setPackages] = useState<MimoPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = async () => {
    if (!username) {
      setPackages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('Loading public packages for username:', username);
      const publicPackages = await getPublicPackagesByUsername(username);
      console.log('Loaded public packages:', publicPackages);
      setPackages(publicPackages);
    } catch (error) {
      console.error('Error loading public packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [username]);

  return {
    packages,
    loading,
    refreshPackages: loadPackages
  };
};
