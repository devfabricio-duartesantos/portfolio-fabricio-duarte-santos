export interface LocalHistoryItem {
  id: string;
  data: string;
  format: string;
  createdAt: string;
}

const STORAGE_KEY = 'qr_generation_history';

export const localHistoryService = {
  getHistory(): LocalHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading local history:', e);
      return [];
    }
  },

  addEntry(data: string, format: string): LocalHistoryItem {
    const history = this.getHistory();
    const newEntry: LocalHistoryItem = {
      id: Math.random().toString(36).substring(2, 11),
      data,
      format,
      createdAt: new Date().toISOString()
    };
    
    // Uniqueness check or just prepend
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newEntry;
  },

  clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
