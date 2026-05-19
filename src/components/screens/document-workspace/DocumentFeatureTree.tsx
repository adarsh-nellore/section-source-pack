"use client";

import { useMemo, useState } from "react";
import type { PackState, RepoPath, Section, SourceItem } from "@/lib/types";
import { REPO_LABELS } from "@/lib/types";
import { groupSourcesByRepo } from "@/lib/mock-data";
import { sortSourcesInFolder } from "@/lib/sort-sources";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Glyph } from "@/components/ui/Glyph";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { MetaText } from "@/components/ui/MetaText";
import { SearchInput } from "@/components/ui/SearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { Body } from "@/components/typography/Body";
import { SourceTreeLeaf } from "./source-preview/SourceTreeLeaf";

const PACK_BADGE: Record<
  PackState,
  { label: string; tone: "success" | "danger" | "muted" | "info" | "warning" }
> = {
  empty: { label: "—", tone: "muted" },
  draft_suggested: { label: "…", tone: "info" },
  in_curation: { label: "…", tone: "warning" },
  curated: { label: "OK", tone: "success" },
  stale: { label: "!", tone: "danger" },
};

const REPO_ORDER: RepoPath[] = ["stats", "etmf", "prior_submission", "guidance"];

export function DocumentFeatureTree({
  sections,
  activeSectionId,
  activeSourceId,
  sources,
  sourceFilter,
  onSourceFilterChange,
  onSectionSelect,
  onSourceSelect,
  onReparent,
  onPin,
  onDelete,
  onPromote,
  onAssemble,
  onInherit,
  isAssembling,
  packVersion,
}: {
  sections: Section[];
  activeSectionId: string;
  activeSourceId: string | null;
  sources: SourceItem[];
  sourceFilter: string;
  onSourceFilterChange: (q: string) => void;
  onSectionSelect: (id: string) => void;
  onSourceSelect: (id: string, opts?: { newTab?: boolean }) => void;
  onReparent: (sourceId: string, repo: RepoPath) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onPromote: (id: string) => void;
  onAssemble: () => void;
  onInherit?: () => void;
  isAssembling: boolean;
  packVersion?: number;
}) {
  const [collapsedRepos, setCollapsedRepos] = useState<Set<string>>(new Set());
  const [dragOverRepo, setDragOverRepo] = useState<RepoPath | null>(null);

  const activeSection = sections.find((s) => s.id === activeSectionId);
  const filterLower = sourceFilter.toLowerCase();

  const filtered = useMemo(() => {
    if (!filterLower) return sources;
    return sources.filter(
      (s) =>
        s.title.toLowerCase().includes(filterLower) ||
        s.excerpt.toLowerCase().includes(filterLower)
    );
  }, [sources, filterLower]);

  const { inPackByRepo, suggested } = useMemo(
    () => groupSourcesByRepo(filtered),
    [filtered]
  );

  const inPackCount = useMemo(
    () => sources.filter((s) => s.membership === "in_pack").length,
    [sources]
  );

  const isEmptyPack =
    activeSection?.pack_state === "empty" ||
    (inPackCount === 0 && suggested.length === 0);

  const filterHasNoResults =
    Boolean(filterLower) && filtered.length === 0 && sources.length > 0;

  const showAssemblePrimary = isEmptyPack || activeSection?.pack_state === "empty";
  const showReassemble = !isEmptyPack && inPackCount > 0 && !isAssembling;
  const showInherit = Boolean(onInherit && (packVersion ?? 0) > 0);

  const toggleRepo = (repo: string) => {
    setCollapsedRepos((prev) => {
      const next = new Set(prev);
      if (next.has(repo)) next.delete(repo);
      else next.add(repo);
      return next;
    });
  };

  const renderLeaf = (item: SourceItem, isSuggested = false) => (
    <SourceTreeLeaf
      key={item.id}
      item={item}
      selected={activeSourceId === item.id}
      onSelect={onSourceSelect}
      onPin={onPin}
      onDelete={onDelete}
      onDragReorder={() => {}}
      isSuggested={isSuggested}
      onPromote={isSuggested ? onPromote : undefined}
    />
  );

  return (
    <nav className="flex flex-col h-full min-h-0 bg-stripe" data-wt="feature-tree">
      <div className="flex-1 overflow-y-auto scroll-tame min-h-0">
        {/* Document sections */}
        <section className="px-3 pt-3 pb-2" data-wt="document-sections">
          <MetaLabel tone="muted" className="mb-2 block">
            Document sections
          </MetaLabel>
          <Stack gap="tight">
            {sections.map((s) => {
              const badge = PACK_BADGE[s.pack_state];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSectionSelect(s.id)}
                  className={`w-full text-left rounded-md px-3 py-2 transition-colors ${
                    s.id === activeSectionId
                      ? "bg-paper border border-hairline-strong shadow-card"
                      : "hover:bg-paper/80"
                  }`}
                >
                  <Cluster justify="between" gap="cozy" wrap={false}>
                    <Body size="small" className="font-medium truncate">
                      {s.title}
                    </Body>
                    <Badge tone={badge.tone} size="sm">
                      {badge.label}
                    </Badge>
                  </Cluster>
                </button>
              );
            })}
          </Stack>
        </section>

        {activeSection && (
          <>
            {/* Visual break between section picker and sources */}
            <div className="mx-3 border-t border-hairline" aria-hidden />

            <section className="px-3 pb-3 pt-2.5">
              <Cluster justify="between" gap="cozy" align="center" wrap={false} className="mb-1.5">
                <MetaLabel tone="muted">Sources</MetaLabel>
                <MetaText tone="faint" size="sm" className="tabular-nums">
                  v{packVersion ?? 1}
                </MetaText>
              </Cluster>
              <MetaText tone="default" size="sm" className="block leading-snug">
                {isAssembling
                  ? "Assembling from catalog…"
                  : `${inPackCount} in pack${suggested.length > 0 ? ` · ${suggested.length} suggested` : ""}`}
              </MetaText>

              <SearchInput
                placeholder="Filter sources…"
                value={sourceFilter}
                onChange={(e) => onSourceFilterChange(e.target.value)}
                containerClassName="mt-2.5"
              />

              {isAssembling ? (
                <Stack gap="cozy" className="mt-3 anim-pulse">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-full" />
                </Stack>
              ) : filterHasNoResults ? (
                <EmptyState
                  variant="soft"
                  title="No matching sources"
                  body="Try a different filter or clear the search box."
                  action={
                    <Button variant="ghost" size="sm" onClick={() => onSourceFilterChange("")}>
                      Clear filter
                    </Button>
                  }
                />
              ) : isEmptyPack ? (
                <EmptyState
                  variant="soft"
                  title="No sources in this pack"
                  body="Assemble from the catalog or add suggested items below."
                />
              ) : (
                <div data-wt="source-tree" className="mt-1.5 flex flex-col gap-1.5">
                  {REPO_ORDER.map((repo) => {
                    const items = sortSourcesInFolder(inPackByRepo.get(repo) ?? []);
                    if (items.length === 0 && filterLower) return null;
                    const collapsed = collapsedRepos.has(repo);
                    return (
                      <Stack key={repo} gap="tight">
                        <button
                          type="button"
                          onClick={() => toggleRepo(repo)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverRepo(repo);
                          }}
                          onDragLeave={() => setDragOverRepo(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            const id = e.dataTransfer.getData("sourceId");
                            if (id) onReparent(id, repo);
                            setDragOverRepo(null);
                          }}
                          className={`w-full text-left px-1 py-0.5 rounded ${
                            dragOverRepo === repo ? "bg-coral-soft ring-1 ring-coral/30" : ""
                          }`}
                        >
                          <Cluster gap="tight" align="center">
                            <Glyph
                              name={collapsed ? "chev-right" : "chev"}
                              size={12}
                              className="text-faint"
                            />
                            <MetaText tone="default" size="sm" className="font-medium">
                              {REPO_LABELS[repo]} ({items.length})
                            </MetaText>
                          </Cluster>
                        </button>
                        {!collapsed && items.map((item) => renderLeaf(item))}
                      </Stack>
                    );
                  })}

                  {suggested.length > 0 && (
                    <Stack
                      gap="tight"
                      data-wt="suggested-folder"
                      className="mt-1.5 pt-1.5 border-t border-dashed border-hairline"
                    >
                      <MetaText tone="default" size="sm" className="px-1">
                        Suggested · not in pack
                      </MetaText>
                      {suggested.map((item) => renderLeaf(item, true))}
                    </Stack>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {activeSection && (
        <footer
          className="shrink-0 border-t border-hairline-strong bg-paper px-3 py-3"
          data-wt="pack-toolbar"
        >
          {isAssembling ? (
            <MetaText tone="faint" size="sm">
              Assembling pack…
            </MetaText>
          ) : (
            <Cluster gap="tight" wrap>
              {showAssemblePrimary && (
                <Button variant="primary" size="sm" onClick={onAssemble} className="flex-1 min-w-[7rem]">
                  Assemble pack
                </Button>
              )}
              {showReassemble && (
                <Button variant="secondary" size="sm" onClick={onAssemble} className="flex-1 min-w-[7rem]">
                  Re-assemble
                </Button>
              )}
              {showInherit && (
                <Button variant="ghost" size="sm" onClick={onInherit} className="flex-1 min-w-[7rem]">
                  Inherit pack
                </Button>
              )}
            </Cluster>
          )}
        </footer>
      )}
    </nav>
  );
}
