import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "@/lib/hooks/useAppLocation";
import {
  CustomTabs as Tabs,
  CustomTabsList as TabsList,
  CustomTabsTrigger as TabsTrigger,
} from "@/components/app/CustomTabs";
import { FilterContainer } from "@/components/filters/FilterContainer";
import { PopupRightActions, PopupAction } from "@/components/app/PopupRightActions";
import { FolderTree } from "@/components/app/FolderTree";
import { useFavoritesStore, FavoriteFolder, FavoriteItem } from "@/lib/store/favoritesStore";
import type { FilterLayout } from "@/components/filters/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function FavoritesManagementPopupPage() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get("pageId") || "";
  const pageName = searchParams.get("pageName") || "";

  const [activeTab, setActiveTab] = useState("screen");
  const [filters, setFilters] = useState<Record<string, any>>({
    pageId: pageId,
    pageName: pageName,
  });

  // Store state
  const {
    folders: storeFolders,
    favorites: storeFavorites,
    selectedItems,
    replaceAll,
    toggleItemSelection,
    clearSelection,
  } = useFavoritesStore();

  // Draft state (changes before saving)
  const [draftFolders, setDraftFolders] = useState<FavoriteFolder[]>([]);
  const [draftFavorites, setDraftFavorites] = useState<FavoriteItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // New folder editing state
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  // Confirm close dialog state
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Initialize draft state from store
  useEffect(() => {
    setDraftFolders([...storeFolders]);
    setDraftFavorites([...storeFavorites]);
  }, []);

  // Initialize filters from URL params
  useEffect(() => {
    if (pageId) {
      setFilters((prev) => ({ ...prev, pageId }));
    }
    if (pageName) {
      setFilters((prev) => ({ ...prev, pageName }));
    }
  }, [pageId, pageName]);

  const handleFilterChange = useCallback((name: string, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle adding a favorite (to draft)
  const handleAddFavorite = useCallback(() => {
    const id = filters.pageId;
    const label = filters.pageName || id.split("/").pop() || "페이지";

    if (!id) {
      toast.error("화면ID를 입력해주세요.");
      return;
    }

    // Check if already exists in draft
    if (draftFavorites.find((f) => f.id === id)) {
      const existingFolderId = draftFavorites.find((f) => f.id === id)?.folderId;
      const folderName = draftFolders.find((f) => f.id === existingFolderId)?.name || "즐겨찾기";
      toast.error(`이미 "${folderName}" 폴더에 추가된 페이지입니다.`);
      return;
    }

    // Add to draft favorites
    setDraftFavorites((prev) => [
      ...prev,
      {
        id,
        label,
        path: id,
        folderId: "root",
        addedAt: Date.now(),
      },
    ]);
    setHasChanges(true);
    toast.success("즐겨찾기에 추가되었습니다.");
  }, [filters, draftFavorites, draftFolders]);

  // Handle creating a new folder (to draft with inline editing)
  const handleCreateFolder = useCallback(() => {
    const tempId = `temp-${Date.now()}`;
    const newFolder: FavoriteFolder = {
      id: tempId,
      name: "새폴더",
      parentId: "root",
      order: draftFolders.length,
    };

    setDraftFolders((prev) => [...prev, newFolder]);
    setEditingFolderId(tempId); // Enable inline editing
    setHasChanges(true);
  }, [draftFolders]);

  // Handle folder name confirm from inline editing
  const handleFolderNameConfirm = useCallback((folderId: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      // If empty name, remove the folder
      setDraftFolders((prev) => prev.filter((f) => f.id !== folderId));
      toast.error("폴더 이름이 비어있어 취소되었습니다.");
    } else {
      // Update folder name
      setDraftFolders((prev) =>
        prev.map((f) => (f.id === folderId ? { ...f, name: trimmedName } : f))
      );
    }
    setEditingFolderId(null);
  }, []);

  // Draft operations for FolderTree
  const handleDraftMoveFavorite = useCallback((favoriteId: string, targetFolderId: string) => {
    setDraftFavorites((prev) =>
      prev.map((f) => (f.id === favoriteId ? { ...f, folderId: targetFolderId } : f))
    );
    setHasChanges(true);
  }, []);

  const handleDraftMoveFolder = useCallback((folderId: string, newParentId: string | null) => {
    if (folderId === "root") return;
    setDraftFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, parentId: newParentId } : f))
    );
    setHasChanges(true);
  }, []);

  const handleDraftDeleteFavorite = useCallback((favoriteId: string) => {
    setDraftFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    setHasChanges(true);
  }, []);

  const handleDraftDeleteFolder = useCallback((folderId: string) => {
    if (folderId === "root") {
      toast.error("기본 폴더는 삭제할 수 없습니다.");
      return;
    }

    // Get all descendant folder IDs
    const getDescendantIds = (parentId: string): string[] => {
      const children = draftFolders.filter((f) => f.parentId === parentId);
      return children.flatMap((child) => [child.id, ...getDescendantIds(child.id)]);
    };

    const folderIdsToRemove = [folderId, ...getDescendantIds(folderId)];

    setDraftFolders((prev) => prev.filter((f) => !folderIdsToRemove.includes(f.id)));
    setDraftFavorites((prev) => prev.filter((f) => !folderIdsToRemove.includes(f.folderId)));
    setHasChanges(true);
  }, [draftFolders]);

  const handleDraftRenameFolder = useCallback((folderId: string, name: string) => {
    if (folderId === "root") return;
    setDraftFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name } : f))
    );
    setHasChanges(true);
  }, []);

  // Handle deleting selected items
  const handleDeleteSelected = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.error("삭제할 항목을 선택해주세요.");
      return;
    }

    let deletedCount = 0;
    selectedItems.forEach((id) => {
      const folder = draftFolders.find((f) => f.id === id);
      if (folder) {
        if (folder.id === "root") {
          toast.error("기본 폴더는 삭제할 수 없습니다.");
          return;
        }
        handleDraftDeleteFolder(id);
        deletedCount++;
      } else {
        handleDraftDeleteFavorite(id);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      toast.success(`${deletedCount}개 항목이 삭제되었습니다.`);
      clearSelection();
    }
  }, [selectedItems, draftFolders, handleDraftDeleteFolder, handleDraftDeleteFavorite, clearSelection]);

  // Save and close
  const handleSaveAndClose = useCallback(() => {
    replaceAll(draftFolders, draftFavorites);
    toast.success("즐겨찾기가 저장되었습니다.");
    window.close();
  }, [draftFolders, draftFavorites, replaceAll]);

  // Close without saving
  const handleClose = useCallback(() => {
    if (hasChanges) {
      setShowCloseConfirm(true);
    } else {
      window.close();
    }
  }, [hasChanges]);

  // Close without saving (confirmed)
  const handleCloseConfirmed = useCallback(() => {
    setShowCloseConfirm(false);
    window.close();
  }, []);

  // Popup actions
  const popupActions: PopupAction[] = [
    {
      id: "save-close",
      text: "저장닫기",
      onClick: handleSaveAndClose,
    },
    {
      id: "delete",
      text: "삭제",
      onClick: handleDeleteSelected,
    },
    {
      id: "close",
      text: "닫기",
      onClick: handleClose,
    },
  ];

  // Filter layout for the screen tab
  const filterLayout: FilterLayout = [
    {
      type: "grid",
      columns: 1,
      filters: [
        {
          name: "pageId",
          type: "text",
          label: "화면ID",
          placeholder: "/after-loan/bond-adjustment/bond-inquiry",
          readonly: true,
        },
        {
          name: "pageName",
          type: "text",
          label: "화면이름",
          placeholder: "채권조회",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">즐겨찾기 관리</h1>
        <PopupRightActions actions={popupActions} />
      </div>

      {/* Tabs */}
      <div className="border-t pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0">
            <TabsTrigger
              value="screen"
              className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              화면
            </TabsTrigger>
            <TabsTrigger
              value="internet"
              className="h-9 px-4 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-800"
            >
              인터넷
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter section (only for screen tab) */}
        {activeTab === "screen" && (
          <>
            <FilterContainer
              filterLayout={filterLayout}
              values={filters}
              onChange={handleFilterChange}
            />
            {/* Button area - separated from filters */}
            <div className="flex justify-end gap-2 mt-3">
              <Button variant="outline" onClick={handleAddFavorite}>
                추가
              </Button>
              <Button variant="outline" onClick={handleCreateFolder}>
                새폴더
              </Button>
            </div>
          </>
        )}

        {/* Internet tab - empty placeholder */}
        {activeTab === "internet" && (
          <div className="flex items-center justify-center h-32 text-gray-500">
            인터넷 즐겨찾기 기능은 준비 중입니다.
          </div>
        )}
      </div>

      {/* Folder Tree */}
      <div className="flex-grow border rounded-lg p-4 bg-white overflow-auto">
        <FolderTree
          folders={draftFolders}
          favorites={draftFavorites}
          selectedItems={selectedItems}
          onMoveFavorite={handleDraftMoveFavorite}
          onMoveFolder={handleDraftMoveFolder}
          onDeleteFavorite={handleDraftDeleteFavorite}
          onDeleteFolder={handleDraftDeleteFolder}
          onRenameFolder={handleDraftRenameFolder}
          onSelectItem={toggleItemSelection}
          editingFolderId={editingFolderId}
          onFolderNameConfirm={handleFolderNameConfirm}
        />
      </div>

      {/* Close Confirmation Dialog */}
      <Dialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>변경사항이 있습니다</DialogTitle>
            <DialogDescription>
              저장하지 않고 닫으면 변경사항이 사라집니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseConfirmed}>
              저장하지 않고 닫기
            </Button>
            <Button onClick={() => {
              setShowCloseConfirm(false);
              handleSaveAndClose();
            }}>
              저장닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
