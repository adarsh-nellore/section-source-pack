import type { SourceItem } from "./types";

/** Pinned first within folder, then sort_order. */
export function sortSourcesInFolder(items: SourceItem[]): SourceItem[] {
  return [...items].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
}
