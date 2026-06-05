// ============================================================
// LifeOS - Global App Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Search
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;

  // Quick add / Edit
  quickAddOpen: boolean;
  quickAddType: 'project' | 'goal' | 'note' | 'content' | null;
  activeItem: any | null;
  openQuickAdd: (type: 'project' | 'goal' | 'note' | 'content', item?: any) => void;
  closeQuickAdd: () => void;

  // Mobile nav
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // Command palette
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

      // Search
      globalSearchQuery: '',
      setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

      // Quick add / Edit
      quickAddOpen: false,
      quickAddType: null,
      activeItem: null,
      openQuickAdd: (type, item = null) => set({ quickAddOpen: true, quickAddType: type, activeItem: item }),
      closeQuickAdd: () => set({ quickAddOpen: false, quickAddType: null, activeItem: null }),

      // Mobile nav
      mobileNavOpen: false,
      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    }),
    {
      name: 'lifeos-app-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
