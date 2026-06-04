// ============================================================
// LifeOS - Daily Logs Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { DailyLog, DailyLogFormData } from '@/types';

export function useDailyLogs() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching daily logs:', error);
    } else {
      setLogs(data || []);
      const todayEntry = data?.find((l) => l.date === today) || null;
      setTodayLog(todayEntry);
    }
    setLoading(false);
  }, [today]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getOrCreateLog = async (date: string): Promise<DailyLog | null> => {
    // Check if log exists
    const existing = logs.find((l) => l.date === date);
    if (existing) return existing;

    // Create new log for the date
    const newLog: Partial<DailyLogFormData> = {
      date,
      top3: [],
      time_blocks: [],
      notes: '',
      reflection: '',
      brain_dump: [],
      score: 0,
    };

    const { data, error } = await supabase
      .from('daily_logs')
      .upsert([newLog], { onConflict: 'date' })
      .select()
      .single();

    if (error) {
      console.error('Error creating daily log:', error);
      return null;
    }

    setLogs((prev) => [data, ...prev.filter((l) => l.date !== date)]);
    if (date === today) setTodayLog(data);
    return data;
  };

  const updateLog = async (id: string, updates: Partial<DailyLogFormData>) => {
    const { data, error } = await supabase
      .from('daily_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating daily log:', error);
      return null;
    }
    setLogs((prev) => prev.map((l) => (l.id === id ? data : l)));
    if (data.date === today) setTodayLog(data);
    return data;
  };

  const getLogByDate = (date: string) => logs.find((l) => l.date === date) || null;

  // Calculate streak
  const getStreak = (): number => {
    let streak = 0;
    const sortedLogs = [...logs]
      .filter((l) => l.score > 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedLogs.length === 0) return 0;

    const checkDate = new Date(today);
    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      const diff = Math.round(
        (checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff <= 1) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return {
    logs,
    todayLog,
    loading,
    getOrCreateLog,
    updateLog,
    getLogByDate,
    getStreak,
    fetchLogs,
  };
}
