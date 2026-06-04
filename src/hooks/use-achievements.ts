// ============================================================
// LifeOS - Achievements Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Achievement, AchievementFormData } from '@/types';

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
    } else {
      setAchievements(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const createAchievement = async (achievement: AchievementFormData) => {
    const { data, error } = await supabase
      .from('achievements')
      .insert([achievement])
      .select()
      .single();

    if (error) {
      console.error('Error creating achievement:', error);
      return null;
    }
    setAchievements((prev) => [data, ...prev]);
    return data;
  };

  const deleteAchievement = async (id: string) => {
    const { error } = await supabase.from('achievements').delete().eq('id', id);
    if (error) {
      console.error('Error deleting achievement:', error);
      return false;
    }
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    return true;
  };

  const getByType = (type: string) => achievements.filter((a) => a.type === type);

  return {
    achievements,
    loading,
    createAchievement,
    deleteAchievement,
    fetchAchievements,
    getByType,
  };
}
