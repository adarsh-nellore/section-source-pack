/**
 * Demo tour copy + routes. Each `target` matches a `data-wt` on the page.
 * Reset: clear STORAGE_KEY + SESSION_KEY, or open any route with `?tour=1`.
 */
export type WalkthroughStep = {
  id: string;
  title: string;
  body: string;
  href: string;
  target?: string;
};

const SUB = "8f3a2c1b-9d4e-4a1f-b2c3-d4e5f6a7b8c9";
const DOC = "d1111111-2222-3333-4444-555555555551";

export type WorkspaceHrefExtra = {
  source?: string;
  open?: string;
  layout?: "source-full";
  state?: string;
};

/** Workspace URL with section + optional source / open / layout query params. */
export function workspaceHref(
  section = "s-efficacy",
  extra: WorkspaceHrefExtra | string = ""
) {
  const params = new URLSearchParams({ section });
  if (typeof extra === "string") {
    if (extra) {
      const legacy = new URLSearchParams(extra.startsWith("?") ? extra.slice(1) : extra);
      legacy.forEach((v, k) => params.set(k, v));
    }
  } else {
    if (extra.source) params.set("source", extra.source);
    if (extra.open) params.set("open", extra.open);
    if (extra.layout) params.set("layout", extra.layout);
    if (extra.state) params.set("state", extra.state);
  }
  return `/submissions/${SUB}/documents/${DOC}?${params.toString()}`;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "welcome",
    title: "Section Source Pack",
    body: "How Jordan curates versioned source packs beside regulatory narrative. Go at your own pace.",
    href: "/submissions",
  },
  {
    id: "program",
    title: "Your submission",
    body: "Each program bundles documents and sections. Open Rivonorex for the writer workspace.",
    href: "/submissions",
    target: "submission-card",
  },
  {
    id: "overview",
    title: "Pack health",
    body: "Curated, stale, and empty packs surface here before you open a section.",
    href: `/submissions/${SUB}`,
    target: "overview-stats",
  },
  {
    id: "workspace-entry",
    title: "Writer workspace",
    body: "Sections and sources on the left; narrative and source preview on the right.",
    href: workspaceHref("s-efficacy"),
    target: "feature-tree",
  },
  {
    id: "sections",
    title: "Document sections",
    body: "Each section owns a pack. Efficacy is curated; Risk–Benefit is empty for assemble.",
    href: workspaceHref("s-efficacy"),
    target: "document-sections",
  },
  {
    id: "pack-toolbar",
    title: "Pack toolbar",
    body: "Assemble, re-assemble, and inherit packs across document versions.",
    href: workspaceHref("s-efficacy"),
    target: "pack-toolbar",
  },
  {
    id: "narrative",
    title: "Narrative + citations",
    body: "Citation chips link prose to sources. Pick a source to open it beside the narrative.",
    href: workspaceHref("s-efficacy"),
    target: "narrative-editor",
  },
  {
    id: "tree-source",
    title: "Sources in tree",
    body: "Repo folders organize the pack. Selecting a row syncs URL, tree, and citations.",
    href: workspaceHref("s-efficacy", { source: "src-tfl-primary" }),
    target: "source-tree",
  },
  {
    id: "source-drawer",
    title: "Source drawer",
    body: "Tab across open sources, dock side-by-side, expand full page, or open a new tab.",
    href: workspaceHref("s-efficacy", { source: "src-tfl-primary" }),
    target: "source-drawer",
  },
  {
    id: "suggested",
    title: "Suggested vs filed",
    body: "AI suggestions stay outside the pack until you promote them into a repo folder.",
    href: workspaceHref("s-efficacy"),
    target: "suggested-folder",
  },
  {
    id: "stale",
    title: "Stale packs",
    body: "When underlying tables change, review flagged sources before re-locking the pack.",
    href: workspaceHref("s-safety"),
    target: "stale-banner",
  },
  {
    id: "assemble",
    title: "Empty pack assemble",
    body: "Risk–Benefit starts empty. Assemble seeds sources from the catalog.",
    href: workspaceHref("s-rb"),
    target: "pack-toolbar",
  },
  {
    id: "lock",
    title: "Lock the pack",
    body: "Locking marks this section version QC-ready for regulatory submission.",
    href: workspaceHref("s-efficacy"),
    target: "lock-pack",
  },
  {
    id: "done",
    title: "You are set",
    body: "Re-open this tour anytime from the button in the corner.",
    href: workspaceHref("s-efficacy"),
  },
];

export const WALKTHROUGH_STORAGE_KEY = "section-source-pack-demo-tour-v2";
export const WALKTHROUGH_SESSION_KEY = "section-source-pack-tour-active";

export type TourSession = { stepIndex: number };

export function readTourSession(): TourSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(WALKTHROUGH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TourSession;
    if (typeof parsed.stepIndex !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeTourSession(stepIndex: number) {
  window.sessionStorage.setItem(WALKTHROUGH_SESSION_KEY, JSON.stringify({ stepIndex }));
}

export function clearTourSession() {
  window.sessionStorage.removeItem(WALKTHROUGH_SESSION_KEY);
}

/** First relevant step for wherever the user already is. */
export function resolveTourStepIndex(pathname: string): number {
  if (pathname.includes("/documents/")) {
    return Math.max(0, WALKTHROUGH_STEPS.findIndex((s) => s.id === "workspace-entry"));
  }
  if (/^\/submissions\/[^/]+$/.test(pathname)) {
    return Math.max(0, WALKTHROUGH_STEPS.findIndex((s) => s.id === "overview"));
  }
  if (pathname === "/submissions") {
    return 0;
  }
  return 0;
}

export function currentTourPath(pathname: string, search: string) {
  return search ? `${pathname}?${search}` : pathname;
}

/** True when pathname + required query params from `href` already match. */
export function isSameTourLocation(current: string, href: string): boolean {
  const [hrefPath, hrefQuery] = href.split("?");
  const [currentPath, currentQuery = ""] = current.split("?");
  if (hrefPath !== currentPath) return false;
  if (!hrefQuery) return true;
  const required = new URLSearchParams(hrefQuery);
  const present = new URLSearchParams(currentQuery);
  for (const [key, value] of required.entries()) {
    if (present.get(key) !== value) return false;
  }
  return true;
}
