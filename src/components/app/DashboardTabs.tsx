import { useRouter, usePathname } from '@/lib/hooks/useAppLocation';
import { useTabStore } from '@/lib/store/tabs';
import { usePageStore } from '@/lib/store/pageStore';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function DashboardTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { tabs, activeTabId, setActiveTab, removeTab } = useTabStore();
  const { loadState, clearState } = usePageStore();

  const handleTabClick = (tabId: string, path: string) => {
    setActiveTab(tabId);
    router.push(path);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation(); // Prevent click from bubbling up to the tab itself
    const { activeTabId: currentActiveTabId, tabs: currentTabs } = useTabStore.getState();
    
    // Find the path of the next active tab *before* removing the target tab
    let nextPath = '/'; // Default path if no tabs are left
    if (currentActiveTabId === tabId) {
        const closingTabIndex = currentTabs.findIndex((tab) => tab.id === tabId);
        const newTabs = currentTabs.filter((tab) => tab.id !== tabId);
        if (newTabs.length > 0) {
            const nextActiveTab = newTabs[Math.max(0, closingTabIndex - 1)];
            nextPath = nextActiveTab.path;
            loadState(nextActiveTab.id); // Load the state of the next active tab
        }
    }

    removeTab(tabId);
    clearState(tabId); // Clear state from IndexedDB when tab is closed

    // If the closed tab was the active one, navigate to the new active tab's path
    if (currentActiveTabId === tabId && nextPath !== pathname) {
        router.push(nextPath);
    }
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="flex-shrink-0 bg-slate-100 border-t border-slate-200 shadow-inner-top">
      <div className="flex items-end">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={cn(
              'flex items-center gap-2 px-4 pt-2 pb-1.5 text-sm font-medium border-r border-slate-200 transition-colors duration-150 ease-in-out',
              {
                'bg-white text-emerald-600 border-t-2 border-emerald-500': tab.id === activeTabId,
                'text-slate-600 hover:bg-slate-200 hover:text-slate-800 border-t-2 border-transparent': tab.id !== activeTabId,
              },
            )}
          >
            <span>{tab.label}</span>
            <X
              className="h-4 w-4 rounded-full text-slate-500 transition-colors hover:bg-slate-300 hover:text-slate-800"
              onClick={(e) => handleTabClose(e, tab.id)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
