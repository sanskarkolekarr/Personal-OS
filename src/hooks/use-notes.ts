// ============================================================
// LifeOS - Notes Hook
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { saveToCache, loadFromCache } from '@/lib/offline-cache';
import type { Note, NoteFormData, Folder } from '@/types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    setLoading(true);

    const cachedNotes = loadFromCache<Note[]>('notes');
    const cachedFolders = loadFromCache<Folder[]>('folders');
    if (cachedNotes) setNotes(cachedNotes);
    if (cachedFolders) setFolders(cachedFolders);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setLoading(false);
      return;
    }

    try {
      const [notesRes, foldersRes] = await Promise.all([
        supabase.from('notes').select('*').order('updated_at', { ascending: false }),
        supabase.from('folders').select('*').order('name', { ascending: true }),
      ]);
      if (notesRes.error) throw notesRes.error;
      setNotes(notesRes.data || []);
      setFolders(foldersRes.data || []);
      saveToCache('notes', notesRes.data || []);
      saveToCache('folders', foldersRes.data || []);
    } catch {
      console.warn('Offline — using cached notes');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ─── Notes CRUD ─────────────────────────────────────────

  const createNote = async (note: NoteFormData) => {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      return null;
    }
    setNotes((prev) => [data, ...prev]);
    return data;
  };

  const updateNote = async (id: string, updates: Partial<NoteFormData>) => {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return null;
    }
    setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
    return data;
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting note:', error);
      return false;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
    return true;
  };

  // ─── Folders CRUD ───────────────────────────────────────

  const createFolder = async (name: string, parentId?: string) => {
    const { data, error } = await supabase
      .from('folders')
      .insert([{ name, parent_id: parentId || null }])
      .select()
      .single();

    if (error) {
      console.error('Error creating folder:', error);
      return null;
    }
    setFolders((prev) => [...prev, data]);
    return data;
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase.from('folders').delete().eq('id', id);
    if (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
    setFolders((prev) => prev.filter((f) => f.id !== id));
    // Move notes in this folder to no folder
    setNotes((prev) => prev.map((n) => (n.folder_id === id ? { ...n, folder_id: null } : n)));
    return true;
  };

  // ─── Search ─────────────────────────────────────────────

  const searchNotes = (query: string) => {
    const lower = query.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(lower) ||
        n.content.toLowerCase().includes(lower) ||
        n.tags.some((t) => t.toLowerCase().includes(lower))
    );
  };

  const getNotesByFolder = (folderId: string | null) =>
    notes.filter((n) => n.folder_id === folderId);

  return {
    notes,
    folders,
    loading,
    createNote,
    updateNote,
    deleteNote,
    createFolder,
    deleteFolder,
    searchNotes,
    getNotesByFolder,
    fetchNotes,
  };
}
