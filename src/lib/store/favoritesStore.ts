import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface FavoriteFolder {
  id: string;
  name: string;
  parentId: string | null; // null = root level
  order: number;
}

export interface FavoriteItem {
  id: string;       // URL path (unique identifier)
  label: string;    // Page name
  path: string;     // URL path
  folderId: string; // Parent folder ID
  addedAt: number;
}

interface FavoritesState {
  folders: FavoriteFolder[];
  favorites: FavoriteItem[];

  // Folder management
  addFolder: (name: string, parentId: string | null) => string;
  removeFolder: (folderId: string) => void;
  renameFolder: (folderId: string, name: string) => void;
  moveFolder: (folderId: string, newParentId: string | null) => void;

  // Favorites management
  addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  moveFavorite: (id: string, targetFolderId: string) => void;
  isFavorite: (id: string) => boolean;
  findFavoriteFolder: (id: string) => string | null;

  // Selection management (for popup)
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  toggleItemSelection: (id: string) => void;
  clearSelection: () => void;

  // Bulk update (for save operation)
  replaceAll: (folders: FavoriteFolder[], favorites: FavoriteItem[]) => void;
}

// Debounce timer ID
let syncTimer: ReturnType<typeof setTimeout> | null = null;

// Debounced API sync function
const scheduleSyncToServer = (folders: FavoriteFolder[], favorites: FavoriteItem[]) => {
  if (syncTimer) {
    clearTimeout(syncTimer);
  }
  syncTimer = setTimeout(async () => {
    try {
      // TODO: API endpoint connection
      // await fetch('/api/favorites', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ folders, favorites }),
      // });
      console.log('[Favorites] Syncing to server:', { folders, favorites });
    } catch (error) {
      console.error('[Favorites] Failed to sync:', error);
    }
  }, 2000); // 2 second debounce
};

// Generate unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      folders: [
        { id: 'root', name: '즐겨찾기', parentId: null, order: 0 }
      ],
      favorites: [],
      selectedItems: [],

      // Folder management
      addFolder: (name, parentId) => {
        const { folders, favorites } = get();
        const newId = generateId();
        const siblingFolders = folders.filter(f => f.parentId === parentId);
        const newFolder: FavoriteFolder = {
          id: newId,
          name,
          parentId,
          order: siblingFolders.length,
        };
        const newFolders = [...folders, newFolder];
        set({ folders: newFolders });
        scheduleSyncToServer(newFolders, favorites);
        return newId;
      },

      removeFolder: (folderId) => {
        if (folderId === 'root') return; // Cannot remove root folder

        const { folders, favorites } = get();

        // Get all descendant folder IDs recursively
        const getDescendantIds = (parentId: string): string[] => {
          const children = folders.filter(f => f.parentId === parentId);
          return children.flatMap(child => [child.id, ...getDescendantIds(child.id)]);
        };

        const folderIdsToRemove = [folderId, ...getDescendantIds(folderId)];

        // Remove folders and their favorites
        const newFolders = folders.filter(f => !folderIdsToRemove.includes(f.id));
        const newFavorites = favorites.filter(f => !folderIdsToRemove.includes(f.folderId));

        set({ folders: newFolders, favorites: newFavorites });
        scheduleSyncToServer(newFolders, newFavorites);
      },

      renameFolder: (folderId, name) => {
        if (folderId === 'root') return; // Cannot rename root folder

        const { folders, favorites } = get();
        const newFolders = folders.map(f =>
          f.id === folderId ? { ...f, name } : f
        );
        set({ folders: newFolders });
        scheduleSyncToServer(newFolders, favorites);
      },

      moveFolder: (folderId, newParentId) => {
        if (folderId === 'root') return; // Cannot move root folder
        if (folderId === newParentId) return; // Cannot move to itself

        const { folders, favorites } = get();

        // Check if newParentId is a descendant of folderId (would create circular reference)
        const isDescendant = (parentId: string, targetId: string): boolean => {
          if (parentId === targetId) return true;
          const children = folders.filter(f => f.parentId === parentId);
          return children.some(child => isDescendant(child.id, targetId));
        };

        if (newParentId && isDescendant(folderId, newParentId)) return;

        const newFolders = folders.map(f =>
          f.id === folderId ? { ...f, parentId: newParentId } : f
        );
        set({ folders: newFolders });
        scheduleSyncToServer(newFolders, favorites);
      },

      // Favorites management
      addFavorite: (item) => {
        const { folders, favorites } = get();
        if (favorites.find((f) => f.id === item.id)) return;

        const newFavorites = [...favorites, { ...item, addedAt: Date.now() }];
        set({ favorites: newFavorites });
        scheduleSyncToServer(folders, newFavorites);
      },

      removeFavorite: (id) => {
        const { folders, favorites, selectedItems } = get();
        const newFavorites = favorites.filter((f) => f.id !== id);
        const newSelectedItems = selectedItems.filter(i => i !== id);
        set({ favorites: newFavorites, selectedItems: newSelectedItems });
        scheduleSyncToServer(folders, newFavorites);
      },

      moveFavorite: (id, targetFolderId) => {
        const { folders, favorites } = get();
        const newFavorites = favorites.map(f =>
          f.id === id ? { ...f, folderId: targetFolderId } : f
        );
        set({ favorites: newFavorites });
        scheduleSyncToServer(folders, newFavorites);
      },

      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },

      findFavoriteFolder: (id) => {
        const favorite = get().favorites.find(f => f.id === id);
        return favorite ? favorite.folderId : null;
      },

      // Selection management
      setSelectedItems: (items) => {
        set({ selectedItems: items });
      },

      toggleItemSelection: (id) => {
        const { selectedItems } = get();
        if (selectedItems.includes(id)) {
          set({ selectedItems: selectedItems.filter(i => i !== id) });
        } else {
          set({ selectedItems: [...selectedItems, id] });
        }
      },

      clearSelection: () => {
        set({ selectedItems: [] });
      },

      // Bulk update
      replaceAll: (folders, favorites) => {
        set({ folders, favorites, selectedItems: [] });
        scheduleSyncToServer(folders, favorites);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        folders: state.folders,
        favorites: state.favorites,
        // Don't persist selectedItems
      }),
    }
  )
);

// Listen for storage changes from other windows (popup → main page sync)
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'favorites-storage' && event.newValue) {
      // Rehydrate the store when localStorage changes from another window
      useFavoritesStore.persist.rehydrate();
    }
  });
}
