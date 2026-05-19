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
  layout = "popover",
}: {
  sourceId: string;
  onJumpToNarrative?: () => void;
  layout?: "popover" | "page";
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
  const isPage = layout === "page";
  const workspaceQs = searchParams.toString();
  const repositoryHref = `/repository?source=${source.id}&from=${encodeURIComponent(`${pathname}${workspaceQs ? `?${workspaceQs}` : ""}`)}`;

  return (
    <article
      className={cn(
        "source-preview-card flex flex-col overflow-hidden bg-paper",
        isPage
          ? "rounded-card border border-hairline-strong shadow-card w-full"
          : "max-h-[min(440px,80vh)] rounded-[inherit]"
      )}
    >
      <header className="shrink-0 px-4 pt-4 pb-3 border-b border-hairline-strong">
        <Cluster gap="cozy" className="mb-2">
          <MetaLabel tone="muted">{REPO_LABELS[artifact.repo_path]}</MetaLabel>
          <Pill variant="outlined" size="sm" asStatic>
            {artifact.kind === "table" ? "Table" : "Document"}
          </Pill>
        </Cluster>
        <Heading size={isPage ? "h2" : "h4"}>{artifact.title}</Heading>
        <MetaText tone="faint" size="sm" className="mt-1 block">
          {artifact.version_label}
        </MetaText>
      </header>

      <div
        className={cn(
          "flex-1 min-h-0 overflow-y-auto scroll-tame px-4 py-4",
          isPage ? "max-h-none" : "max-h-[300px]"
        )}
      >
        {artifact.kind === "text" ? (
          <Stack gap="block">
            {artifact.paragraphs.map((p, i) => (
              <Body key={i} size="body" tone={i === 0 ? "ink" : "muted"}>
                {p}
              </Body>
            ))}
          </Stack>
        ) : (
          <Stack gap="block">
            <Body size="small" tone="muted">
              {artifact.caption}
            </Body>
            <div className="overflow-x-auto min-w-0 rounded-md border border-hairline-strong">
              <PreviewTable artifact={artifact} compact={!isPage} />
            </div>
          </Stack>
        )}
      </div>

      <footer className="shrink-0 border-t border-hairline-strong bg-stripe px-4 py-3">
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
            {!isPage && (
              <TextLink href={repositoryHref} tone="muted" size="sm" trailingArrow>
                Full view
              </TextLink>
            )}
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
