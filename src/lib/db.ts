
import Dexie, { Table } from 'dexie';

export interface PageState {
  tabId: string; // Corresponds to the path/ID of the tab
  filters: Record<string, any>;
  tables?: Record<string, any[]>; // Store data for multiple tables, keyed by a unique table ID
  // Add other state properties as needed, e.g., scroll position, selections
}

export class AppDB extends Dexie {
  pageStates!: Table<PageState>;

  constructor() {
    super('jt-project-db');
    this.version(1).stores({
      // Primary key is tabId
      pageStates: 'tabId', 
    });
  }
}

export const db = new AppDB();
