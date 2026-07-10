import { get, set, del, clear, keys } from 'idb-keyval';

export async function dbGet<T = unknown>(key: string): Promise<T | null> {
  const v = await get<T>(key);
  return v ?? null;
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  await set(key, value);
}

export async function dbDel(key: string): Promise<void> {
  await del(key);
}

export async function dbClear(): Promise<void> {
  await clear();
}

export async function dbKeys(): Promise<string[]> {
  const ks = await keys();
  return ks.filter((k): k is string => typeof k === 'string');
}

// Adapter for Zustand persist (createJSONStorage passes already-stringified JSON).
export const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const v = (await get(name)) as unknown;
    if (v == null) return null;
    if (typeof v === 'string') return v;
    return JSON.stringify(v);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export async function dbListGenerations(): Promise<unknown[]> {
  const allKeys = await dbKeys();
  const genKeys = allKeys.filter(k => k.startsWith('gen:'));
  const vals = await Promise.all(genKeys.map(k => get(k)));
  return vals.filter((v): v is unknown => v != null);
}