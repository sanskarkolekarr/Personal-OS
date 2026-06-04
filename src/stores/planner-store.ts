// ============================================================
// LifeOS - Planner Store (Zustand)
// ============================================================

import { create } from 'zustand';

interface PlannerState {
  selectedDate: string; // ISO date string (YYYY-MM-DD)
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  goToPrevDay: () => void;
  goToNextDay: () => void;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export const usePlannerStore = create<PlannerState>()((set) => ({
  selectedDate: getToday(),
  setSelectedDate: (date) => set({ selectedDate: date }),
  goToToday: () => set({ selectedDate: getToday() }),
  goToPrevDay: () => set((s) => ({ selectedDate: addDays(s.selectedDate, -1) })),
  goToNextDay: () => set((s) => ({ selectedDate: addDays(s.selectedDate, 1) })),
}));
