
import { create } from 'zustand';
import { db, PageState } from '@/lib/db';
import { debounce } from 'lodash-es';

// Helper function to send logs to the server terminal
export const logToServer = (message: string, data?: any) => {
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, data }),
  }).catch(console.error);
};

interface PageStoreState {
  // The state of the *currently active* tab is held in memory
  currentState: Omit<PageState, 'tabId'> | null;
  
  // Actions
  loadState: (tabId: string) => Promise<void>;
  saveState: (tabId: string, newState: Omit<PageState, 'tabId'>) => void;
  updateFilters: (tabId: string, newFilters: Record<string, any>) => void;
  updateTableData: (tabId: string, tableId: string, data: any[]) => void;
  clearState: (tabId: string) => Promise<void>;
  clearAllStates: () => Promise<void>;
  getStateForTab: (tabId: string) => Promise<PageState | undefined>;
}

// Debounced function to save to IndexedDB
const debouncedSave = debounce((tabId: string, state: Omit<PageState, 'tabId'>) => {
    logToServer(`[PageStore] SAVING state for tab: ${tabId}`, state);
    db.pageStates.put({ tabId, ...state });
}, 500); // 500ms debounce delay


export const usePageStore = create<PageStoreState>((set, get) => ({
  currentState: null,

  loadState: async (tabId) => {
    logToServer(`[PageStore] Action: loadState triggered for tab: ${tabId}`);
    const storedState = await db.pageStates.get(tabId);
    
    if (storedState) {
      logToServer(`[PageStore] Success: Found stored state for ${tabId}`, storedState);
      set({ currentState: { filters: storedState.filters, tables: storedState.tables } });
    } else {
      const initialState = { filters: {}, tables: {} };
      logToServer(`[PageStore] Info: No state found for ${tabId}. Initializing.`, initialState);
      set({ currentState: initialState });
      await db.pageStates.put({ tabId, ...initialState });
      logToServer(`[PageStore] Success: Initial state saved for ${tabId}.`);
    }
  },

  saveState: (tabId, newState) => {
    set({ currentState: newState });
    debouncedSave(tabId, newState);
  },
  
  updateFilters: (tabId, newFilters) => {
    const currentState = get().currentState;
    const updatedState = {
        ...currentState,
        filters: {
            ...currentState?.filters,
            ...newFilters
        }
    };
    set({ currentState: updatedState as Omit<PageState, 'tabId'> });
    debouncedSave(tabId, updatedState as Omit<PageState, 'tabId'>);
  },

  updateTableData: (tabId, tableId, data) => {
    const currentState = get().currentState;
    const updatedState = {
      ...currentState,
      tables: {
        ...currentState?.tables,
        [tableId]: data,
      }
    };
    set({ currentState: updatedState as Omit<PageState, 'tabId'> });
    debouncedSave(tabId, updatedState as Omit<PageState, 'tabId'>);
  },

  clearState: async (tabId) => {
    await db.pageStates.delete(tabId);
    // Re-initialize with a default state instead of setting to null
    const initialState = { filters: {}, tables: {} };
    logToServer(`[PageStore] CLEARED state for tab: ${tabId}. Resetting to default.`);
    set({ currentState: initialState });
    // Also save this initial state to the DB so it persists
    await db.pageStates.put({ tabId, ...initialState });
  },

  clearAllStates: async () => {
    await db.pageStates.clear();
    set({ currentState: null });
  },

  getStateForTab: async (tabId) => {
    return await db.pageStates.get(tabId);
  },
}));
