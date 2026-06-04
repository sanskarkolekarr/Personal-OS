// ============================================================
// LifeOS - Constants
// ============================================================

import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Target,
  CalendarDays,
  Calendar as CalendarIcon,
  Pen,
  BookOpen,
  Trophy,
  BarChart3,
  Settings,
  Key,
} from 'lucide-react';

// ─── Navigation ──────────────────────────────────────────────

export const NAV_ITEMS = [
  { title: 'Dashboard', href: '/', icon: LayoutDashboard },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare },
  { title: 'Projects', href: '/projects', icon: FolderKanban },
  { title: 'Goals', href: '/goals', icon: Target },
  { title: 'Daily Planner', href: '/planner', icon: CalendarDays },
  { title: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { title: 'Content Hub', href: '/content', icon: Pen },
  { title: 'Knowledge Vault', href: '/notes', icon: BookOpen },
  { title: 'Achievements', href: '/achievements', icon: Trophy },
  { title: 'Analytics', href: '/analytics', icon: BarChart3 },
  { title: 'Credentials', href: '/credentials', icon: Key },
  { title: 'Settings', href: '/settings', icon: Settings },
] as const;

// ─── Categories ──────────────────────────────────────────────

export const TASK_CATEGORIES = [
  { value: 'money', label: 'Money', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-500' },
  { value: 'growth', label: 'Growth', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-500' },
  { value: 'future', label: 'Future', bgColor: 'bg-purple-500/10', textColor: 'text-purple-500' },
  { value: 'operations', label: 'Operations', bgColor: 'bg-slate-500/10', textColor: 'text-slate-500' },
] as const;

export const GOAL_CATEGORIES = [
  { value: 'health', label: 'Health & Fitness', bgColor: 'bg-red-500/10', textColor: 'text-red-500' },
  { value: 'wealth', label: 'Wealth & Business', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-500' },
  { value: 'relationships', label: 'Relationships', bgColor: 'bg-pink-500/10', textColor: 'text-pink-500' },
  { value: 'growth', label: 'Personal Growth', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-500' },
  { value: 'business', label: 'Business', bgColor: 'bg-amber-500/10', textColor: 'text-amber-500' },
] as const;

// ─── Priorities ──────────────────────────────────────────────

export const PRIORITIES = [
  { value: 'high', label: 'High', color: '#ef4444', bgColor: 'bg-red-500/10', textColor: 'text-red-400', dotColor: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400', dotColor: 'bg-amber-500' },
  { value: 'low', label: 'Low', color: '#22c55e', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', dotColor: 'bg-emerald-500' },
] as const;

// ─── Task Statuses ───────────────────────────────────────────

export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#94a3b8', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400' },
  { value: 'in_progress', label: 'In Progress', color: '#3b82f6', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400' },
  { value: 'completed', label: 'Completed', color: '#22c55e', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
] as const;

// ─── Project Statuses ────────────────────────────────────────

export const PROJECT_STATUSES = [
  { value: 'active', label: 'Active', color: '#3b82f6', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400' },
  { value: 'on_hold', label: 'On Hold', color: '#f59e0b', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400' },
  { value: 'completed', label: 'Completed', color: '#22c55e', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
  { value: 'archived', label: 'Archived', color: '#94a3b8', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400' },
] as const;

// ─── Goal Types ──────────────────────────────────────────────

export const GOAL_TYPES = [
  { value: 'yearly', label: 'Yearly', color: '#ec4899' },
  { value: 'quarterly', label: 'Quarterly', color: '#a855f7' },
  { value: 'monthly', label: 'Monthly', color: '#3b82f6' },
  { value: 'weekly', label: 'Weekly', color: '#22c55e' },
  { value: 'daily', label: 'Daily', color: '#f59e0b' },
] as const;

// ─── Content Statuses ────────────────────────────────────────

export const CONTENT_STATUSES = [
  { value: 'idea', label: 'Idea', color: '#94a3b8', bgColor: 'bg-slate-500/10', textColor: 'text-slate-400' },
  { value: 'researching', label: 'Researching', color: '#a855f7', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' },
  { value: 'drafting', label: 'Drafting', color: '#3b82f6', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400' },
  { value: 'ready', label: 'Ready', color: '#f59e0b', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400' },
  { value: 'posted', label: 'Posted', color: '#22c55e', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
] as const;

// ─── Achievement Types ───────────────────────────────────────

export const ACHIEVEMENT_TYPES = [
  { value: 'achievement', label: 'Achievement', icon: '🏆' },
  { value: 'certificate', label: 'Certificate', icon: '📜' },
  { value: 'milestone', label: 'Milestone', icon: '🎯' },
  { value: 'win', label: 'Win', icon: '🎉' },
] as const;

export const CONTENT_PLATFORMS = [
  { value: 'twitter',      label: 'Twitter/X',   bgColor: 'bg-sky-500/10',     textColor: 'text-sky-400' },
  { value: 'linkedin',     label: 'LinkedIn',    bgColor: 'bg-blue-700/10',    textColor: 'text-blue-400' },
  { value: 'youtube',      label: 'YouTube',     bgColor: 'bg-red-500/10',     textColor: 'text-red-400' },
  { value: 'blog',         label: 'Blog',        bgColor: 'bg-amber-500/10',   textColor: 'text-amber-400' },
  { value: 'instagram',    label: 'Instagram',   bgColor: 'bg-pink-500/10',    textColor: 'text-pink-400' },
  { value: 'newsletter',   label: 'Newsletter',  bgColor: 'bg-violet-500/10',  textColor: 'text-violet-400' },
  { value: 'podcast',      label: 'Podcast',     bgColor: 'bg-orange-500/10',  textColor: 'text-orange-400' },
  { value: 'tiktok',       label: 'TikTok',      bgColor: 'bg-slate-500/10',   textColor: 'text-slate-400' },
  { value: 'other',        label: 'Other',       bgColor: 'bg-muted',          textColor: 'text-muted-foreground' },
] as const;

// ─── Keyboard Shortcuts ──────────────────────────────────────

export const KEYBOARD_SHORTCUTS = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette' },
  { keys: ['Ctrl', 'N'], description: 'Quick add task' },
  { keys: ['Ctrl', 'B'], description: 'Toggle sidebar' },
  { keys: ['Ctrl', 'Shift', 'N'], description: 'Quick add note' },
  { keys: ['Escape'], description: 'Close dialogs' },
] as const;
