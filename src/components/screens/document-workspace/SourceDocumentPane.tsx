"use client";

import { getSource } from "@/lib/mock-data";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { Button } from "@/components/ui/Button";
import { TextLink } from "@/components/ui/TextLink";
import { MetaText } from "@/components/ui/MetaText";
import { SourcePreviewCard } from "./source-preview/SourcePreviewCard";

export function SourceDocumentPane({
  sourceId,
  repositoryHref,
  onBackToNarrative,
  onJumpToNarrative,
}: {
  sourceId: string;
  repositoryHref: string;
  onBackToNarrative: () => void;
  onJumpToNarrative: () => void;
}) {
  const source = getSource(sourceId);
  if (!source) {
    return (
      <MetaText tone="faint" size="sm">
        Source not found.
      </MetaText>
    );
  }

  return (
    <Stack gap="section" className="max-w-[52rem] w-full anim-slide-in-right">
      <Cluster gap="cozy" wrap justify="between">
        <Button variant="ghost" size="sm" onClick={onBackToNarrative}>
          ← Section narrative
        </Button>
        <TextLink href={repositoryHref} external tone="muted" size="sm" trailingArrow>
          Open in repository
        </TextLink>
      </Cluster>
      <SourcePreviewCard
        sourceId={sourceId}
        layout="page"
        onJumpToNarrative={onJumpToNarrative}
      />
    </Stack>
  );
}
