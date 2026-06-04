import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';
import { toast } from 'sonner';

export function useSettings() {
  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
    
    // Convert array to a key-value map for easier consumption
    const settingsMap = data.reduce((acc: Record<string, any>, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
    
    return settingsMap;
  }, []);

  const { data: settings = {}, error, isLoading, mutate } = useSWR('settings', fetchSettings);

  const updateSetting = useCallback(
    async (key: string, value: any) => {
      try {
        // Optimistic update
        mutate((prev: any) => ({ ...prev, [key]: value }), false);

        const { error } = await supabase
          .from('settings')
          .upsert({ key, value }, { onConflict: 'key' });

        if (error) throw error;
        
        mutate(); // Revalidate
      } catch (err: any) {
        toast.error('Failed to update setting', { description: err.message });
        mutate(); // Revert on error
      }
    },
    [mutate]
  );

  return {
    settings,
    updateSetting,
    isLoading,
    error,
  };
}
