// ============================================================
// LifeOS - Analytics Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { AnalyticsData } from '@/types';

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    tasksCompleted: 0,
    goalsCompleted: 0,
    projectsCompleted: 0,
    streakCount: 0,
    weeklyProductivity: [],
    monthlyProductivity: [],
    categoryBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch all counts in parallel
      const [tasksRes, goalsRes, projectsRes, allTasksRes, logsRes] = await Promise.all([
        supabase.from('tasks').select('id', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('goals').select('id', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('projects').select('id', { count: 'exact' }).eq('status', 'completed'),
        supabase.from('tasks').select('category, status, created_at'),
        supabase.from('daily_logs').select('date, score').order('date', { ascending: false }),
      ]);

      const tasksCompleted = tasksRes.count || 0;
      const goalsCompleted = goalsRes.count || 0;
      const projectsCompleted = projectsRes.count || 0;

      // Category breakdown
      const allTasks = allTasksRes.data || [];
      const categoryMap = new Map<string, number>();
      allTasks.forEach((t) => {
        if (t.status === 'completed') {
          categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + 1);
        }
      });
      const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));

      // Weekly productivity (last 7 days - tasks completed per day)
      const now = new Date();
      const weeklyProductivity = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now);
        day.setDate(day.getDate() - (6 - i));
        const dayStr = day.toISOString().split('T')[0];
        return allTasks.filter(
          (t) =>
            t.status === 'completed' &&
            t.created_at &&
            t.created_at.startsWith(dayStr)
        ).length;
      });

      // Monthly productivity (last 12 months)
      const monthlyProductivity = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now);
        month.setMonth(month.getMonth() - (11 - i));
        const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;
        return allTasks.filter(
          (t) =>
            t.status === 'completed' &&
            t.created_at &&
            t.created_at.startsWith(monthStr)
        ).length;
      });

      // Streak calculation
      const logs = logsRes.data || [];
      let streakCount = 0;
      const today = new Date().toISOString().split('T')[0];
      const checkDate = new Date(today);

      for (const log of logs) {
        if (log.score <= 0) continue;
        const diff = Math.round(
          (checkDate.getTime() - new Date(log.date).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diff <= 1) {
          streakCount++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      setData({
        tasksCompleted,
        goalsCompleted,
        projectsCompleted,
        streakCount,
        weeklyProductivity,
        monthlyProductivity,
        categoryBreakdown,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, fetchAnalytics };
}
