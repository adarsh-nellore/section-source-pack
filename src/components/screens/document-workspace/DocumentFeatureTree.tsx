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
  onSourceSelect: (id: string) => void;
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
    <nav className="flex flex-col h-full min-h-0 bg-stripe">
      <div className="px-3 py-2 border-b border-hairline-strong">
        <MetaLabel tone="muted">FeatureManager</MetaLabel>
      </div>

      <div className="flex-1 overflow-y-auto scroll-tame min-h-0">
        <Stack gap="cozy" className="p-3">
          <MetaLabel tone="muted">Document sections</MetaLabel>
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

        {activeSection && (
          <Stack gap="block" className="border-t border-hairline-strong p-3 pt-4">
            <div className="rounded-md border border-hairline-strong bg-paper p-3 shadow-card">
              <Stack gap="cozy">
                <Cluster justify="between" gap="cozy" align="start" wrap={false}>
                  <Stack gap="tight" className="min-w-0 flex-1">
                    <MetaLabel tone="muted">Source pack</MetaLabel>
                    <Body size="small" className="font-semibold leading-snug">
                      {activeSection.title}
                    </Body>
                  </Stack>
                  <Badge tone="neutral" size="sm">
                    v{packVersion ?? 1}
                  </Badge>
                </Cluster>
                {isAssembling ? (
                  <Stack gap="cozy" className="anim-pulse">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <MetaText tone="faint" size="sm">
                      Assembling pack from catalog…
                    </MetaText>
                  </Stack>
                ) : (
                  <Stack gap="cozy">
                    <MetaText tone="faint" size="sm">
                      {inPackCount} source{inPackCount === 1 ? "" : "s"} in pack
                    </MetaText>
                    <Cluster gap="tight" wrap>
                      {(isEmptyPack || activeSection.pack_state === "empty") && (
                        <Button variant="primary" size="sm" onClick={onAssemble}>
                          Assemble pack
                        </Button>
                      )}
                      {!isEmptyPack && inPackCount > 0 && (
                        <Button variant="secondary" size="sm" onClick={onAssemble}>
                          Re-assemble
                        </Button>
                      )}
                      {onInherit && (packVersion ?? 0) > 0 && (
                        <Button variant="ghost" size="sm" onClick={onInherit}>
                          Inherit pack
                        </Button>
                      )}
                    </Cluster>
                  </Stack>
                )}
              </Stack>
            </div>

            <SearchInput

              placeholder="Filter sources…"
              value={sourceFilter}
              onChange={(e) => onSourceFilterChange(e.target.value)}
              containerClassName="mb-1"
            />

            {filterHasNoResults ? (
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
            ) : isEmptyPack && !isAssembling ? (
              <EmptyState
                variant="soft"
                title="No sources in this pack"
                body="Assemble 5–10 sources from the catalog or add suggested items below."
                action={
                  <Button variant="primary" size="sm" onClick={onAssemble}>
                    Assemble pack
                  </Button>
                }
              />
            ) : (
              <>
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
                          <MetaText tone="ink" size="sm" className="font-medium">
                            {REPO_LABELS[repo]} ({items.length})
                          </MetaText>
                        </Cluster>
                      </button>
                      {!collapsed && items.map((item) => renderLeaf(item))}
                    </Stack>
                  );
                })}

                {suggested.length > 0 && (
                  <Stack gap="tight" className="mt-2 pt-2 border-t border-dashed border-hairline-strong">
                    <MetaText tone="faint" size="sm" className="px-1 font-medium">
                      Suggested · not in pack
                    </MetaText>
                    {suggested.map((item) => renderLeaf(item, true))}
                  </Stack>
                )}
              </>
            )}
          </Stack>
        )}
      </div>
    </nav>
  );
}
