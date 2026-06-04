// ============================================================
// LifeOS - Tasks Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Task, TaskFormData } from '@/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (task: TaskFormData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }
    setTasks((prev) => [data, ...prev]);
    return data;
  };

  const updateTask = async (id: string, updates: Partial<TaskFormData>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return null;
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);
  const getTasksByCategory = (category: string) => tasks.filter((t) => t.category === category);
  const getTasksByProject = (projectId: string) => tasks.filter((t) => t.project_id === projectId);
  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const upcomingDeadlines = tasks
    .filter((t) => t.due_date && t.status !== 'completed' && new Date(t.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    getTasksByStatus,
    getTasksByCategory,
    getTasksByProject,
    pendingTasks,
    completedTasks,
    upcomingDeadlines,
  };
}
