// ============================================================
// LifeOS - Goals Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Goal, GoalFormData, GoalType, Milestone } from '@/types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
    } else {
      setGoals(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = async (goal: GoalFormData) => {
    const { data, error } = await supabase
      .from('goals')
      .insert([goal])
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return null;
    }
    setGoals((prev) => [data, ...prev]);
    return data;
  };

  const updateGoal = async (id: string, updates: Partial<GoalFormData>) => {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal:', error);
      return null;
    }
    setGoals((prev) => prev.map((g) => (g.id === id ? data : g)));
    return data;
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    return true;
  };

  const toggleMilestone = async (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((m: Milestone) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );

    const completedCount = updatedMilestones.filter((m: Milestone) => m.completed).length;
    const progress = updatedMilestones.length > 0
      ? Math.round((completedCount / updatedMilestones.length) * 100)
      : goal.progress;

    await updateGoal(goalId, { milestones: updatedMilestones, progress });
  };

  const getGoalsByType = (type: GoalType) => goals.filter((g) => g.type === type);
  const getChildGoals = (parentId: string) => goals.filter((g) => g.parent_id === parentId);
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    fetchGoals,
    getGoalsByType,
    getChildGoals,
    activeGoals,
    completedGoals,
  };
}
