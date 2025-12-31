// lib/pasteStore.ts

export type Paste = {
  id: string;
  content: string;
  createdAt: number;
  ttlSeconds: number | null;
  maxViews: number | null;
  views: number;
};

const store = new Map<string, Paste>();

export function createPaste(paste: Paste) {
  store.set(paste.id, paste);
}

export function getPaste(id: string) {
  return store.get(id) ?? null;
}

export function deletePaste(id: string) {
  store.delete(id);
}
