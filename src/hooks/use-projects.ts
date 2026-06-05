// ============================================================
// LifeOS - Projects Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { saveToCache, loadFromCache } from '@/lib/offline-cache';
import type { Project, ProjectFormData } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);

    // Try to load from cache immediately for instant UI
    const cached = loadFromCache<Project[]>('projects');
    if (cached) setProjects(cached);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, tasks(id)')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projectsWithCount = (data || []).map((p) => ({
        ...p,
        task_count: p.tasks?.length || 0,
        tasks: undefined,
      }));
      setProjects(projectsWithCount);
      saveToCache('projects', projectsWithCount);
    } catch (err) {
      console.warn('Offline — using cached projects');
      // Already set from cache above
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (project: ProjectFormData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return null;
    }
    setProjects((prev) => [{ ...data, task_count: 0 }, ...prev]);
    return data;
  };

  const updateProject = async (id: string, updates: Partial<ProjectFormData>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return null;
    }
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...data, task_count: p.task_count } : p)));
    return data;
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    setProjects((prev) => prev.filter((p) => p.id !== id));
    return true;
  };

  const getProjectsByStatus = (status: string) => projects.filter((p) => p.status === status);
  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    fetchProjects,
    getProjectsByStatus,
    activeProjects,
    completedProjects,
  };
}
