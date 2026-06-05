// ============================================================
// LifeOS - Offline Cache Utility
// Saves Supabase data to localStorage so it's available offline
// ============================================================

const PREFIX = 'lifeos_cache_';

export function saveToCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // Storage quota exceeded — ignore
  }
}

export function loadFromCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.data as T;
  } catch {
    return null;
  }
}

export function clearCache(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}
