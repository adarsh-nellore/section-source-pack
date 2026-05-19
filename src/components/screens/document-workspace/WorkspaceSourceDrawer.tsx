"use client";

import { getSource } from "@/lib/mock-data";
import type { SourceItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Cluster } from "@/components/layout/Cluster";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Tab } from "@/components/ui/Tab";
import type { TabKind } from "@/components/ui/Tab";
import { MetaText } from "@/components/ui/MetaText";
import { IconExpand, IconExternal, IconPanel, IconX } from "@/components/ui/icons";
import { SourcePreviewCard } from "./source-preview/SourcePreviewCard";

function tabKindForSource(source: SourceItem | undefined): TabKind {
  if (!source) return "generic";
  if (source.type === "tfl") return "csv";
  if (source.type === "document_chunk") return "pdf";
  return "md";
}

function tabLabel(source: SourceItem | undefined, fallbackId: string): string {
  const title = source?.title ?? fallbackId;
  if (title.length <= 22) return title;
  return `${title.slice(0, 20)}…`;
}

export function WorkspaceSourceDrawer({
  openSourceIds,
  activeSourceId,
  expanded,
  newTabHref,
  onSelectTab,
  onCloseTab,
  onCloseDrawer,
  onExpandFull,
  onDockBeside,
  onJumpToNarrative,
}: {
  openSourceIds: string[];
  activeSourceId: string;
  expanded: boolean;
  newTabHref: string;
  onSelectTab: (sourceId: string) => void;
  onCloseTab: (sourceId: string) => void;
  onCloseDrawer: () => void;
  onExpandFull: () => void;
  onDockBeside: () => void;
  onJumpToNarrative: (sourceId: string) => void;
}) {
  const active = getSource(activeSourceId);

  return (
    <div
      className={cn("workspace-drawer-inner flex flex-col h-full min-h-0", expanded && "is-expanded")}
      data-wt="source-drawer"
    >
      <header className="shrink-0 border-b border-hairline-strong bg-stripe">
        <Cluster
          gap="tight"
          wrap={false}
          align="center"
          className="px-2 py-1.5 min-h-11"
        >
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Close source panel"
            title="Close — working document expands"
            onClick={onCloseDrawer}
          >
            <IconX className="w-4 h-4" />
          </IconButton>

          <div className="workspace-drawer-tabs" role="tablist">
            {openSourceIds.map((id) => {
              const source = getSource(id);
              return (
                <Tab
                  key={id}
                  label={tabLabel(source, id)}
                  kind={tabKindForSource(source)}
                  active={id === activeSourceId}
                  onClick={() => onSelectTab(id)}
                  onClose={() => onCloseTab(id)}
                  className="shrink-0 max-w-[11rem]"
                />
              );
            })}
          </div>

          <Cluster gap="tight" wrap={false} className="shrink-0 ml-auto">
            {expanded ? (
              <Button variant="ghost" size="sm" onClick={onDockBeside} title="Show narrative beside source">
                Side by side
              </Button>
            ) : (
              <IconButton
                variant="ghost"
                size="md"
                aria-label="Expand source to full page"
                title="Full page"
                onClick={onExpandFull}
              >
                <IconExpand className="w-4 h-4" />
              </IconButton>
            )}
            <IconButton
              variant="ghost"
              size="md"
              aria-label="Open in new browser tab"
              title="New tab"
              onClick={() => window.open(newTabHref, "_blank", "noopener,noreferrer")}
            >
              <IconExternal className="w-4 h-4" />
            </IconButton>
          </Cluster>
        </Cluster>
        {active && (
          <MetaText tone="faint" size="sm" className="px-3 pb-2 block truncate">
            {active.title}
          </MetaText>
        )}
      </header>

      <div className="flex-1 min-h-0 overflow-hidden bg-paper">
        <SourcePreviewCard
          key={activeSourceId}
          sourceId={activeSourceId}
          layout="pane"
          onJumpToNarrative={() => onJumpToNarrative(activeSourceId)}
        />
      </div>
    </div>
  );
}
