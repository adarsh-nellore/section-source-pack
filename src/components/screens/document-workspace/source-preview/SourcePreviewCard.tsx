"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { getArtifactForSource, type SourceArtifactTable } from "@/lib/source-artifacts";
import { getNarrative, getSource, sourceMeta } from "@/lib/mock-data";
import { REPO_LABELS } from "@/lib/types";
import { cn } from "@/lib/cn";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { MetaText } from "@/components/ui/MetaText";
import { Pill } from "@/components/ui/Pill";
import { Table, type TableColumn } from "@/components/ui/Table";
import { TextLink } from "@/components/ui/TextLink";
import { Body } from "@/components/typography/Body";
import { Heading } from "@/components/typography/Heading";

type TableRow = Record<string, unknown> & { id: string };

export function SourcePreviewCard({
  sourceId,
  onJumpToNarrative,
  onOpenInWorkspace,
  layout = "popover",
}: {
  sourceId: string;
  onJumpToNarrative?: () => void;
  /** Popover only: open full source in the main document pane (same as tree click). */
  onOpenInWorkspace?: () => void;
  layout?: "popover" | "page" | "pane";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const source = getSource(sourceId);
  if (!source) return null;
  const artifact = getArtifactForSource(source);
  if (!artifact) return null;

  const narrative = getNarrative(source.section_id);
  const inText = source.citation_refs.length > 0;
  const meta = sourceMeta[source.id];
  const isPopover = layout === "popover";
  const isPane = layout === "pane";
  const isPage = layout === "page";
  const isEmbedded = isPage || isPane;
  const isCompact = isPopover || isPane;
  const workspaceQs = searchParams.toString();
  const repositoryHref = `/repository?source=${source.id}&from=${encodeURIComponent(`${pathname}${workspaceQs ? `?${workspaceQs}` : ""}`)}`;

  return (
    <article
      className={cn(
        "source-preview-card flex flex-col overflow-hidden bg-paper",
        isPane && "h-full min-h-0 border-0 shadow-none rounded-none",
        isPage && "rounded-card border border-hairline-strong shadow-card w-full h-full min-h-0",
        isPopover && "max-h-[min(440px,80vh)] rounded-[inherit]"
      )}
    >
      <header
        className={cn(
          "shrink-0 border-b border-hairline-strong",
          isPane ? "px-3 pt-2.5 pb-2" : "px-4 pt-4 pb-3",
          isPopover && onOpenInWorkspace && "cursor-pointer hover:bg-soft/60"
        )}
        onClick={isPopover && onOpenInWorkspace ? onOpenInWorkspace : undefined}
        onKeyDown={
          isPopover && onOpenInWorkspace
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenInWorkspace();
                }
              }
            : undefined
        }
        role={isPopover && onOpenInWorkspace ? "button" : undefined}
        tabIndex={isPopover && onOpenInWorkspace ? 0 : undefined}
      >
        <Cluster gap="cozy" className={isPane ? "mb-1" : "mb-2"}>
          <MetaLabel tone="muted" className={isPane ? "text-[10px]" : undefined}>
            {REPO_LABELS[artifact.repo_path]}
          </MetaLabel>
          <Pill variant="outlined" size="sm" asStatic>
            {artifact.kind === "table" ? "Table" : "Document"}
          </Pill>
        </Cluster>
        {!isPane && (
          <>
            <Heading size={isPage ? "h2" : "h4"}>{artifact.title}</Heading>
            <MetaText tone="faint" size="sm" className="mt-1 block">
              {artifact.version_label}
            </MetaText>
          </>
        )}
        {isPane && (
          <MetaText tone="faint" size="sm" className="block text-[11px] leading-snug">
            {artifact.version_label}
          </MetaText>
        )}
      </header>

      <div
        className={cn(
          "flex-1 min-h-0 overflow-y-auto scroll-tame",
          isPane ? "px-3 py-2.5 text-[13px] leading-snug" : "px-4 py-4",
          isEmbedded ? "max-h-none flex-1" : "max-h-[300px]"
        )}
      >
        {artifact.kind === "text" ? (
          <Stack gap={isPane ? "cozy" : "block"}>
            {artifact.paragraphs.map((p, i) => (
              <Body
                key={i}
                size={isPane ? "small" : "body"}
                tone={i === 0 ? "ink" : "muted"}
              >
                {p}
              </Body>
            ))}
          </Stack>
        ) : (
          <Stack gap={isPane ? "cozy" : "block"}>
            <Body size="small" tone="muted" className={isPane ? "text-[11px]" : undefined}>
              {artifact.caption}
            </Body>
            <div className="overflow-x-auto min-w-0 rounded-md border border-hairline-strong">
              <PreviewTable artifact={artifact} compact={isCompact} />
            </div>
          </Stack>
        )}
      </div>

      <footer
        className={cn(
          "shrink-0 border-t border-hairline-strong bg-stripe",
          isPane ? "px-3 py-2" : "px-4 py-3"
        )}
      >
        <Stack gap="cozy">
          {artifact.key_pills.length > 0 && (
            <Cluster gap="tight" wrap>
              {artifact.key_pills.map((pill) => (
                <Pill key={pill} variant="filled" size="sm" asStatic>
                  {pill}
                </Pill>
              ))}
            </Cluster>
          )}
          <Cluster justify="between" gap="cozy" wrap={false}>
            <Cluster gap="cozy" className="min-w-0 flex-wrap">
              {inText && onJumpToNarrative ? (
                <Button variant="ghost" size="sm" onClick={onJumpToNarrative}>
                  In narrative
                </Button>
              ) : narrative ? (
                <MetaText tone="faintest" size="sm">
                  Not cited in section
                </MetaText>
              ) : null}
              {meta?.last_accessed ? (
                <MetaText tone="faintest" size="sm">
                  Opened {new Date(meta.last_accessed).toLocaleDateString()}
                </MetaText>
              ) : null}
            </Cluster>
            {isPopover &&
              (onOpenInWorkspace ? (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenInWorkspace();
                  }}
                >
                  Open in split
                </Button>
              ) : (
                <TextLink href={repositoryHref} tone="muted" size="sm" trailingArrow>
                  Full view
                </TextLink>
              ))}
          </Cluster>
        </Stack>
      </footer>
    </article>
  );
}

function PreviewTable({
  artifact,
  compact,
}: {
  artifact: SourceArtifactTable;
  compact: boolean;
}) {
  const columns: TableColumn<TableRow>[] = artifact.columns.map((col, ci) => ({
    key: col,
    header: col,
    align: ci > 0 ? "right" : "left",
    render: (row) => String(row[col] ?? ""),
  }));

  const rows: TableRow[] = artifact.rows.map((row, ri) => {
    const record: TableRow = { id: String(ri) };
    artifact.columns.forEach((col, ci) => {
      record[col] = row[ci];
    });
    return record;
  });

  return (
    <Table<TableRow>
      columns={columns}
      rows={rows}
      rowKey={(r) => r.id}
      zebra
      className={compact ? "text-[12px]" : undefined}
    />
  );
}
