// ============================================================
// LifeOS - Global Search Hook
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
  id: string;
  title: string;
  type: 'task' | 'project' | 'goal' | 'note' | 'content' | 'achievement';
  subtitle: string;
  href: string;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const lower = `%${query.toLowerCase()}%`;

    try {
      const [tasks, projects, goals, notes, content, achievements] = await Promise.all([
        supabase.from('tasks').select('id, title, status').ilike('title', lower).limit(5),
        supabase.from('projects').select('id, name, status').ilike('name', lower).limit(5),
        supabase.from('goals').select('id, title, type').ilike('title', lower).limit(5),
        supabase.from('notes').select('id, title').ilike('title', lower).limit(5),
        supabase.from('content_items').select('id, title, platform').ilike('title', lower).limit(5),
        supabase.from('achievements').select('id, title, type').ilike('title', lower).limit(5),
      ]);

      const searchResults: SearchResult[] = [
        ...(tasks.data || []).map((t) => ({
          id: t.id,
          title: t.title,
          type: 'task' as const,
          subtitle: `Task • ${t.status}`,
          href: '/tasks',
        })),
        ...(projects.data || []).map((p) => ({
          id: p.id,
          title: p.name,
          type: 'project' as const,
          subtitle: `Project • ${p.status}`,
          href: '/projects',
        })),
        ...(goals.data || []).map((g) => ({
          id: g.id,
          title: g.title,
          type: 'goal' as const,
          subtitle: `Goal • ${g.type}`,
          href: '/goals',
        })),
        ...(notes.data || []).map((n) => ({
          id: n.id,
          title: n.title,
          type: 'note' as const,
          subtitle: 'Note',
          href: '/knowledge',
        })),
        ...(content.data || []).map((c) => ({
          id: c.id,
          title: c.title,
          type: 'content' as const,
          subtitle: `Content • ${c.platform}`,
          href: '/content',
        })),
        ...(achievements.data || []).map((a) => ({
          id: a.id,
          title: a.title,
          type: 'achievement' as const,
          subtitle: `Achievement • ${a.type}`,
          href: '/achievements',
        })),
      ];

      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    }

    setLoading(false);
  }, []);

  return { results, loading, search };
}
