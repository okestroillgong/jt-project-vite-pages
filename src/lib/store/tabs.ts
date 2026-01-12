import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  id: string;
  label: string;
  path: string;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  _hasHydrated: boolean;
  addTab: (newTab: Tab) => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  reset: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,
      _hasHydrated: false,
      addTab: (newTab) => {
        const { tabs } = get();
        if (tabs.find((tab) => tab.id === newTab.id)) {
          set({ activeTabId: newTab.id });
          return;
        }
        if (tabs.length >= 10) {
          console.warn('Maximum number of tabs reached.');
          return;
        }
        set((state) => ({
          tabs: [...state.tabs, newTab],
          activeTabId: newTab.id,
        }));
      },
      removeTab: (tabId) => {
        set((state) => {
          const newTabs = state.tabs.filter((tab) => tab.id !== tabId);
          let newActiveTabId = state.activeTabId;
          if (state.activeTabId === tabId) {
            const closingTabIndex = state.tabs.findIndex((tab) => tab.id === tabId);
            if (newTabs.length > 0) {
              newActiveTabId = newTabs[Math.max(0, closingTabIndex - 1)].id;
            } else {
              newActiveTabId = null;
            }
          }
          return {
            tabs: newTabs,
            activeTabId: newActiveTabId,
          };
        });
      },
      setActiveTab: (tabId) => {
        set({ activeTabId: tabId });
      },
      reset: () => {
        set({ tabs: [], activeTabId: null });
      },
    }),
    {
      name: 'tab-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
