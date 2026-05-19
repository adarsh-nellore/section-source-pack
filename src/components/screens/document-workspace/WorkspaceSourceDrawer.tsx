"use client";

import { getSource } from "@/lib/mock-data";
import type { SourceItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";
import { IconButton } from "@/components/ui/IconButton";
import { IconExpand, IconExternal, IconPanel, IconX } from "@/components/ui/icons";
import { SourcePreviewCard } from "./source-preview/SourcePreviewCard";

function tabLabel(source: SourceItem | undefined, fallbackId: string): string {
  const title = source?.title ?? fallbackId;
  if (title.length <= 36) return title;
  return `${title.slice(0, 34)}…`;
}

function SourceDrawerTab({
  label,
  active,
  onSelect,
  onClose,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onSelect}
      title={label}
      className={cn(
        "group relative flex h-10 max-w-[10.5rem] shrink-0 items-center gap-1 border-b-2 px-2",
        "font-mono text-[12px] leading-tight transition-colors",
        active
          ? "border-accent-indigo text-ink"
          : "border-transparent text-muted hover:border-hairline hover:text-ink"
      )}
    >
      <span className="min-w-0 truncate">{label}</span>
      <span
        role="button"
        tabIndex={0}
        aria-label={`Close ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded p-0.5 text-faint",
          "hover:bg-soft hover:text-ink",
          active ? "opacity-70" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Glyph name="x" size={11} strokeWidth={2.5} />
      </span>
    </button>
  );
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
  return (
    <div
      className={cn(
        "workspace-drawer-inner flex h-full min-h-0 flex-col bg-paper",
        expanded && "is-expanded"
      )}
      data-wt="source-drawer"
    >
      <header className="workspace-drawer-toolbar shrink-0 bg-paper">
        <div className="flex h-10 min-h-10 items-stretch gap-0.5 pl-1 pr-2">
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Close source panel"
            title="Close panel"
            onClick={onCloseDrawer}
            className="my-auto shrink-0"
          >
            <IconX className="w-4 h-4" />
          </IconButton>

          <div className="workspace-drawer-tabs min-w-0 flex-1" role="tablist">
            {openSourceIds.map((id) => {
              const source = getSource(id);
              return (
                <SourceDrawerTab
                  key={id}
                  label={tabLabel(source, id)}
                  active={id === activeSourceId}
                  onSelect={() => onSelectTab(id)}
                  onClose={() => onCloseTab(id)}
                />
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-0.5 my-auto">
            {expanded ? (
              <IconButton
                variant="ghost"
                size="md"
                aria-label="Side by side with narrative"
                title="Side by side"
                onClick={onDockBeside}
              >
                <IconPanel className="w-4 h-4" />
              </IconButton>
            ) : (
              <IconButton
                variant="ghost"
                size="md"
                aria-label="Expand to full page"
                title="Full page"
                onClick={onExpandFull}
              >
                <IconExpand className="w-4 h-4" />
              </IconButton>
            )}
            <IconButton
              variant="ghost"
              size="md"
              aria-label="Open in new tab"
              title="New tab"
              onClick={() => window.open(newTabHref, "_blank", "noopener,noreferrer")}
            >
              <IconExternal className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
