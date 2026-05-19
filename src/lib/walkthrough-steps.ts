/**
 * Demo tour copy + routes. Edit steps here — each `target` matches a `data-wt` on the page.
 * Restart tour: clear localStorage + sessionStorage keys, or open any route with `?tour=1`.
 * Starting from the workspace skips ahead to the workspace step instead of /submissions.
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

export function workspaceHref(section = "s-efficacy", extraQuery = "") {
  const base = `/submissions/${SUB}/documents/${DOC}?section=${section}`;
  if (!extraQuery) return base;
  const q = extraQuery.startsWith("?") ? extraQuery.slice(1) : extraQuery;
  return `${base}&${q}`;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "welcome",
    title: "Section Source Pack",
    body: "A quick tour of how Jordan curates versioned source packs beside regulatory narrative. Go at your own pace.",
    href: "/submissions",
  },
  {
    id: "program",
    title: "Your submission",
    body: "Each program bundles documents and sections. Open Rivonorex to reach the writer workspace.",
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
    body: "Feature tree on the left, narrative on the right. Selection syncs through the URL.",
    href: workspaceHref("s-efficacy"),
    target: "feature-tree",
  },
  {
    id: "pack-toolbar",
    title: "Pack toolbar",
    body: "Assemble, re-assemble, and inherit copy packs across document versions.",
    href: workspaceHref("s-efficacy"),
    target: "pack-toolbar",
  },
  {
    id: "narrative",
    title: "Narrative + citations",
    body: "Inline citation chips link prose to sources. Hover a tree row for a rich preview.",
    href: workspaceHref("s-efficacy"),
    target: "narrative-editor",
  },
  {
    id: "tree-source",
    title: "Tri-sync selection",
    body: "Selecting a source updates the URL and highlights matching citations in the narrative.",
    href: workspaceHref("s-efficacy", "source=src-tfl-primary"),
    target: "source-tree",
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
    body: "Risk–Benefit starts empty. Assemble seeds sources from the catalog for a full curation demo.",
    href: workspaceHref("s-rb"),
    target: "pack-toolbar",
  },
  {
    id: "lock",
    title: "Lock the pack",
    body: "Locking marks this section version QC-ready. Pins and removes write audit events in production.",
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

export const WALKTHROUGH_STORAGE_KEY = "section-source-pack-demo-tour-v1";
/** Survives route changes while the tour is in progress (session only). */
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

/** Pick the first relevant step for wherever the user already is. */
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
