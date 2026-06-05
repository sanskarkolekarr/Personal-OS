'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, TaskFormData } from '@/types';
import { toast } from 'sonner';

export function useProjectTasks(projectId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateProjectProgress = async (currentTasks: Task[]) => {
    if (currentTasks.length === 0) {
      await supabase.from('projects').update({ progress: 0 }).eq('id', projectId);
      return;
    }
    const completedTasks = currentTasks.filter(t => t.status === 'completed').length;
    const progress = Math.round((completedTasks / currentTasks.length) * 100);
    await supabase.from('projects').update({ progress }).eq('id', projectId);
  };

  const createTask = async (taskData: TaskFormData) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...taskData, project_id: projectId }])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }

    const newTasks = [data, ...tasks];
    setTasks(newTasks);
    await updateProjectProgress(newTasks);
    return data;
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    const newStatus = completed ? 'completed' : 'pending';
    
    // Optimistic update
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus as any } : t);
    setTasks(newTasks);

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      // Revert on error
      setTasks(tasks);
      return false;
    }

    await updateProjectProgress(newTasks);
    return true;
  };

  const deleteTask = async (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    
    if (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      setTasks(tasks);
      return false;
    }

    await updateProjectProgress(newTasks);
    return true;
  };

  return {
    tasks,
    loading,
    createTask,
    toggleTaskCompletion,
    deleteTask,
    fetchTasks
  };
}
