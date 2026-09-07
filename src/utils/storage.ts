/**
 * Safe browser storage utilities that gracefully handle SSR, private browsing,
 * and security restrictions.
 */

export function safeStorageGet(key: string, fallback: string = ''): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key) ?? fallback;
    }
  } catch (e) {
    console.warn(`[storage] Failed to read ${key} from localStorage:`, e);
  }
  return fallback;
}

export function safeStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn(`[storage] Failed to write ${key} to localStorage:`, e);
  }
}

export function safeStorageRemove(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn(`[storage] Failed to remove ${key} from localStorage:`, e);
  }
}

export async function safeDeleteIndexedDB(name: string): Promise<void> {
  try {
    if (typeof window !== 'undefined' && window.indexedDB) {
      const req = window.indexedDB.deleteDatabase(name);
      await new Promise<void>((resolve) => {
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
        setTimeout(resolve, 600);
      });
    }
  } catch (e) {
    console.warn(`[storage] Could not delete IndexedDB database ${name}:`, e);
  }
}
