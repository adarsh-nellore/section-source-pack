import { Suspense } from "react";
import { SourcePreviewCard } from "@/components/screens/document-workspace/source-preview/SourcePreviewCard";
import { getSource } from "@/lib/mock-data";
import { getArtifactForSource } from "@/lib/source-artifacts";
import { AppShell } from "@/components/layout/AppShell";
import { Stack } from "@/components/layout/Stack";
import { TopNav } from "@/components/layout/TopNav";
import { PageHeader } from "@/components/patterns/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { TextLink } from "@/components/ui/TextLink";
import { Body } from "@/components/typography/Body";
import { MetaText } from "@/components/ui/MetaText";

function RepositoryContent({
  sourceId,
  from,
}: {
  sourceId?: string;
  from?: string;
}) {
  const source = sourceId ? getSource(sourceId) : null;
  const artifact = source ? getArtifactForSource(source) : null;

  if (!source || !artifact) {
    return (
      <EmptyState
        variant="soft"
        title="Source not found"
        body="Open a source from the document workspace to preview it here."
        action={
          <TextLink href="/submissions" tone="coral" size="md">
            Go to submissions
          </TextLink>
        }
      />
    );
  }

  return (
    <Stack gap="section" className="w-full anim-fade-in-1">
      <PageHeader
        kicker={
          from ? (
            <TextLink href={from} tone="muted" size="sm">
              Back to section
            </TextLink>
          ) : (
            <TextLink href="/submissions" tone="muted" size="sm">
              Submissions
            </TextLink>
          )
        }
        title={artifact.title}
        titleSize="h1"
        meta={
          <Body size="small" tone="muted">
            {artifact.kind === "table" ? "Statistical table" : "Document excerpt"} ·{" "}
            {artifact.version_label}
          </Body>
        }
      />
      <SourcePreviewCard sourceId={source.id} layout="page" />
      <MetaText tone="faintest" size="sm">
        Mock external repository · deep link would open eTMF or stats output in production
      </MetaText>
    </Stack>
  );
}

export default async function RepositoryPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; from?: string }>;
}) {
  const { source: sourceId, from } = await searchParams;

  return (
    <AppShell className="min-h-dvh" topBar={<TopNav />}>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <Suspense fallback={<Body size="small" tone="muted">Loading…</Body>}>
          <RepositoryContent sourceId={sourceId} from={from} />
        </Suspense>
      </div>
    </AppShell>
  );
}
