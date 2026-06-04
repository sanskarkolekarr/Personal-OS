// ============================================================
// LifeOS - Content Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { ContentItem, ContentFormData } from '@/types';

export function useContent() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching content:', error);
    } else {
      setContent(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const createContent = async (item: ContentFormData) => {
    const { data, error } = await supabase
      .from('content_items')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error creating content:', error);
      return null;
    }
    setContent((prev) => [data, ...prev]);
    return data;
  };

  const updateContent = async (id: string, updates: Partial<ContentFormData>) => {
    const { data, error } = await supabase
      .from('content_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating content:', error);
      return null;
    }
    setContent((prev) => prev.map((c) => (c.id === id ? data : c)));
    return data;
  };

  const deleteContent = async (id: string) => {
    const { error } = await supabase.from('content_items').delete().eq('id', id);
    if (error) {
      console.error('Error deleting content:', error);
      return false;
    }
    setContent((prev) => prev.filter((c) => c.id !== id));
    return true;
  };

  const getContentByStatus = (status: string) => content.filter((c) => c.status === status);
  const getContentByPlatform = (platform: string) => content.filter((c) => c.platform === platform);

  return {
    content,
    loading,
    createContent,
    updateContent,
    deleteContent,
    fetchContent,
    getContentByStatus,
    getContentByPlatform,
  };
}
