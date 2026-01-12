import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronRight, Folder, Star, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { FavoriteFolder, FavoriteItem } from '@/lib/store/favoritesStore';

interface FolderTreeProps {
  folders: FavoriteFolder[];
  favorites: FavoriteItem[];
  selectedItems: string[];
  onFolderToggle?: (folderId: string) => void;
  onMoveFavorite: (favoriteId: string, targetFolderId: string) => void;
  onMoveFolder: (folderId: string, targetParentId: string | null) => void;
  onDeleteFavorite: (favoriteId: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRenameFolder: (folderId: string, name: string) => void;
  onSelectItem: (id: string) => void;
  // New folder inline editing
  editingFolderId?: string | null;
  onFolderNameConfirm?: (folderId: string, name: string) => void;
}

interface TreeNodeData {
  id: string;
  type: 'folder' | 'favorite';
  name: string;
  parentId: string | null;
  children?: TreeNodeData[];
  path?: string;
}

// Sortable tree item component
function SortableTreeItem({
  node,
  depth,
  isOpen,
  isSelected,
  onToggle,
  onSelect,
  onDelete,
  onRename,
}: {
  node: TreeNodeData;
  depth: number;
  isOpen: boolean;
  isSelected: boolean;
  onToggle?: () => void;
  onSelect: () => void;
  onDelete: () => void;
  onRename?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isFolder = node.type === 'folder';
  const isRoot = node.id === 'root';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isRoot ? {} : listeners)}
      className={cn(
        'flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer select-none',
        'hover:bg-gray-100 transition-colors',
        isSelected && 'bg-blue-50 hover:bg-blue-100',
        isDragging && 'z-50'
      )}
      onClick={(e) => {
        e.stopPropagation();
        if (isFolder && onToggle) {
          onToggle();
        }
        onSelect();
      }}
    >
      {/* Indentation */}
      <div style={{ width: depth * 16 }} />

      {/* Folder toggle or star icon */}
      {isFolder ? (
        <>
          <ChevronRight
            className={cn(
              'size-4 text-gray-400 transition-transform shrink-0',
              isOpen && 'rotate-90'
            )}
          />
          <Folder className="size-4 text-yellow-500 shrink-0" />
        </>
      ) : (
        <>
          <div className="w-4" /> {/* Spacer for alignment */}
          <Star className="size-4 text-yellow-500 fill-yellow-500 shrink-0" />
        </>
      )}

      {/* Name */}
      <span className="flex-grow truncate text-sm">{node.name}</span>

      {/* Context menu */}
      {!isRoot && (
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded p-0.5"
          >
            <MoreHorizontal className="size-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isFolder && onRename && (
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onRename();
              }}>
                <Pencil className="size-4 mr-2" />
                이름 변경
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600"
            >
              <Trash2 className="size-4 mr-2" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

// Drag overlay item
function DragOverlayItem({ node }: { node: TreeNodeData | null }) {
  if (!node) return null;

  const isFolder = node.type === 'folder';

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 bg-white rounded shadow-lg border">
      {isFolder ? (
        <>
          <ChevronRight className="size-4 text-gray-400" />
          <Folder className="size-4 text-yellow-500" />
        </>
      ) : (
        <>
          <div className="w-4" />
          <Star className="size-4 text-yellow-500 fill-yellow-500" />
        </>
      )}
      <span className="text-sm">{node.name}</span>
    </div>
  );
}

export function FolderTree({
  folders,
  favorites,
  selectedItems,
  onMoveFavorite,
  onMoveFolder,
  onDeleteFavorite,
  onDeleteFolder,
  onRenameFolder,
  onSelectItem,
  editingFolderId,
  onFolderNameConfirm,
}: FolderTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['root']));
  const [activeItem, setActiveItem] = useState<TreeNodeData | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Build tree structure from flat data
  const buildTree = useCallback((): TreeNodeData[] => {
    const folderMap = new Map<string, TreeNodeData>();

    // Create folder nodes
    folders.forEach(folder => {
      folderMap.set(folder.id, {
        id: folder.id,
        type: 'folder',
        name: folder.name,
        parentId: folder.parentId,
        children: [],
      });
    });

    // Add favorites to their parent folders
    favorites.forEach(fav => {
      const parentFolder = folderMap.get(fav.folderId);
      if (parentFolder) {
        parentFolder.children = parentFolder.children || [];
        parentFolder.children.push({
          id: fav.id,
          type: 'favorite',
          name: fav.label,
          parentId: fav.folderId,
          path: fav.path,
        });
      }
    });

    // Build hierarchy
    const rootNodes: TreeNodeData[] = [];
    folderMap.forEach(folder => {
      if (folder.parentId === null) {
        rootNodes.push(folder);
      } else {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(folder);
        }
      }
    });

    return rootNodes;
  }, [folders, favorites]);

  const tree = buildTree();

  // Get all sortable IDs
  const getAllIds = useCallback((nodes: TreeNodeData[]): string[] => {
    const ids: string[] = [];
    const traverse = (nodeList: TreeNodeData[]) => {
      nodeList.forEach(node => {
        ids.push(node.id);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(nodes);
    return ids;
  }, []);

  const allIds = getAllIds(tree);

  // Find node by ID
  const findNode = useCallback((id: string, nodes: TreeNodeData[]): TreeNodeData | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Toggle folder open/close
  const toggleFolder = (folderId: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const node = findNode(active.id as string, tree);
    setActiveItem(node);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveItem(null);
      setOverId(null);
      return;
    }

    const activeNode = findNode(active.id as string, tree);
    const overNode = findNode(over.id as string, tree);

    if (!activeNode || !overNode) {
      setActiveItem(null);
      setOverId(null);
      return;
    }

    // Determine target folder
    let targetFolderId: string | null = null;

    if (overNode.type === 'folder') {
      targetFolderId = overNode.id;
    } else {
      // If dropping on a favorite, use its parent folder
      targetFolderId = overNode.parentId;
    }

    if (targetFolderId) {
      if (activeNode.type === 'favorite') {
        onMoveFavorite(activeNode.id, targetFolderId);
      } else if (activeNode.type === 'folder' && activeNode.id !== 'root') {
        // Prevent moving to self or descendant
        const isDescendant = (parentId: string, checkId: string): boolean => {
          const parent = findNode(parentId, tree);
          if (!parent || !parent.children) return false;
          for (const child of parent.children) {
            if (child.id === checkId) return true;
            if (child.type === 'folder' && isDescendant(child.id, checkId)) return true;
          }
          return false;
        };

        if (!isDescendant(activeNode.id, targetFolderId)) {
          onMoveFolder(activeNode.id, targetFolderId === 'root' ? null : targetFolderId);
        }
      }
    }

    setActiveItem(null);
    setOverId(null);
  };

  // Handle rename submit
  const handleRenameSubmit = (folderId: string) => {
    if (renameValue.trim()) {
      onRenameFolder(folderId, renameValue.trim());
    }
    setRenamingFolderId(null);
    setRenameValue('');
  };

  // Render tree recursively
  const renderTree = (nodes: TreeNodeData[], depth: number = 0) => {
    return nodes.map(node => {
      const isOpen = openFolders.has(node.id);
      const isSelected = selectedItems.includes(node.id);
      const isOver = overId === node.id;
      const isFolder = node.type === 'folder';
      const isRenaming = renamingFolderId === node.id;
      const isNewFolderEditing = editingFolderId === node.id;

      return (
        <div key={node.id} className="group">
          <div className={cn(isOver && isFolder && 'bg-blue-100 rounded')}>
            {isNewFolderEditing ? (
              // New folder inline editing
              <div className="flex items-center gap-2 py-1.5 px-2" style={{ paddingLeft: depth * 16 + 8 }}>
                <Folder className="size-4 text-yellow-500 shrink-0" />
                <input
                  type="text"
                  defaultValue={node.name}
                  onBlur={(e) => onFolderNameConfirm?.(node.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onFolderNameConfirm?.(node.id, e.currentTarget.value);
                    }
                  }}
                  className="flex-grow text-sm border rounded px-1 py-0.5"
                  autoFocus
                />
              </div>
            ) : isRenaming ? (
              // Existing folder rename editing
              <div className="flex items-center gap-2 py-1.5 px-2" style={{ paddingLeft: depth * 16 + 8 }}>
                <Folder className="size-4 text-yellow-500 shrink-0" />
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSubmit(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(node.id);
                    if (e.key === 'Escape') {
                      setRenamingFolderId(null);
                      setRenameValue('');
                    }
                  }}
                  className="flex-grow text-sm border rounded px-1 py-0.5"
                  autoFocus
                />
              </div>
            ) : (
              <SortableTreeItem
                node={node}
                depth={depth}
                isOpen={isOpen}
                isSelected={isSelected}
                onToggle={isFolder ? () => toggleFolder(node.id) : undefined}
                onSelect={() => onSelectItem(node.id)}
                onDelete={() => {
                  if (node.type === 'favorite') {
                    onDeleteFavorite(node.id);
                  } else {
                    onDeleteFolder(node.id);
                  }
                }}
                onRename={isFolder && node.id !== 'root' ? () => {
                  setRenamingFolderId(node.id);
                  setRenameValue(node.name);
                } : undefined}
              />
            )}
          </div>

          {/* Render children if folder is open */}
          {isFolder && isOpen && node.children && node.children.length > 0 && (
            <div>{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allIds} strategy={verticalListSortingStrategy}>
        <div className="min-h-[200px]">
          {renderTree(tree)}
        </div>
      </SortableContext>

      <DragOverlay>
        <DragOverlayItem node={activeItem} />
      </DragOverlay>
    </DndContext>
  );
}
