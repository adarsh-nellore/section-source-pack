/** Build document workspace URLs with section / source / split-tab query params. */

export type WorkspaceQuery = {
  section?: string | null;
  source?: string | null;
  open?: string[] | null;
  /** `source-full` = source takes the main canvas; absent = docked drawer beside narrative */
  layout?: "source-full" | null;
  modal?: string | null;
  state?: string | null;
};

export function buildWorkspaceHref(
  pathname: string,
  query: WorkspaceQuery,
  preserve?: URLSearchParams
): string {
  const params = new URLSearchParams(preserve?.toString() ?? "");

  const setOrDelete = (key: string, value: string | null | undefined) => {
    if (value === null || value === undefined) params.delete(key);
    else params.set(key, value);
  };

  if ("section" in query) setOrDelete("section", query.section ?? null);
  if ("source" in query) setOrDelete("source", query.source ?? null);
  if ("open" in query) {
    const open = query.open;
    if (!open?.length) params.delete("open");
    else params.set("open", open.join(","));
  }
  if ("layout" in query) setOrDelete("layout", query.layout ?? null);
  if ("modal" in query) setOrDelete("modal", query.modal ?? null);
  if ("state" in query) setOrDelete("state", query.state ?? null);

  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ""}`;
}

export function parseOpenSourceIds(
  openParam: string | null,
  activeSourceId: string | null
): string[] {
  const fromOpen = openParam?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  if (!activeSourceId) return fromOpen;
  if (fromOpen.includes(activeSourceId)) return fromOpen;
  return fromOpen.length ? [...fromOpen, activeSourceId] : [activeSourceId];
}
