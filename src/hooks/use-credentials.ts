import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import useSWR from 'swr';
import { Credential, CredentialFormData } from '@/types';
import { toast } from 'sonner';

export function useCredentials() {
  const fetchCredentials = useCallback(async () => {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching credentials:', error);
      throw error;
    }
    return data as Credential[];
  }, []);

  const { data: credentials = [], error, isLoading, mutate } = useSWR('credentials', fetchCredentials);

  const addCredential = useCallback(
    async (credentialData: CredentialFormData) => {
      try {
        const { data, error } = await supabase
          .from('credentials')
          .insert([credentialData])
          .select()
          .single();

        if (error) throw error;

        mutate((prev: Credential[] = []) => [data, ...prev], false);
        toast.success('Credential saved successfully');
        return data as Credential;
      } catch (err: any) {
        toast.error('Failed to save credential', { description: err.message });
        throw err;
      }
    },
    [mutate]
  );

  const updateCredential = useCallback(
    async (id: string, updates: Partial<CredentialFormData>) => {
      try {
        // Optimistic update
        mutate((prev: Credential[] = []) =>
          prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c)),
          false
        );

        const { error } = await supabase
          .from('credentials')
          .update(updates)
          .eq('id', id);

        if (error) throw error;
        toast.success('Credential updated');
        mutate(); // Revalidate
      } catch (err: any) {
        toast.error('Failed to update credential', { description: err.message });
        mutate(); // Revert
        throw err;
      }
    },
    [mutate]
  );

  const deleteCredential = useCallback(
    async (id: string) => {
      try {
        // Optimistic delete
        mutate((prev: Credential[] = []) => prev.filter((c) => c.id !== id), false);

        const { error } = await supabase
          .from('credentials')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Credential deleted');
      } catch (err: any) {
        toast.error('Failed to delete credential', { description: err.message });
        mutate(); // Revert
        throw err;
      }
    },
    [mutate]
  );

  return {
    credentials,
    addCredential,
    updateCredential,
    deleteCredential,
    isLoading,
    error,
  };
}
