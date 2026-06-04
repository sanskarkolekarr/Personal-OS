// ============================================================
// LifeOS - Projects Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Project, ProjectFormData } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*, tasks(id)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      const projectsWithCount = (data || []).map((p) => ({
        ...p,
        task_count: p.tasks?.length || 0,
        tasks: undefined,
      }));
      setProjects(projectsWithCount);
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
