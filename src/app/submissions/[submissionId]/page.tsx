import Link from "next/link";
import {
  documents,
  getPackAuditForSubmission,
  getSectionsForDocument,
  getSubmission,
  getSubmissionPackStats,
} from "@/lib/mock-data";
import { AppShell } from "@/components/layout/AppShell";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { TopNav } from "@/components/layout/TopNav";
import { PageHeader } from "@/components/patterns/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/layout/LinkButton";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { MetaText } from "@/components/ui/MetaText";
import { Stat } from "@/components/ui/Stat";
import { TextLink } from "@/components/ui/TextLink";
import { Body } from "@/components/typography/Body";
export default async function SubmissionOverviewPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = await params;
  const submission = getSubmission(submissionId);
  const docs = documents.filter((d) => d.submission_id === submissionId);
  const primaryDoc = docs[0];
  const sections = primaryDoc ? getSectionsForDocument(primaryDoc.id) : [];
  const needsAttention = sections.filter(
    (s) => s.pack_state === "stale" || s.pack_state === "empty"
  );
  const packStats = getSubmissionPackStats(submissionId);
  const auditEvents = getPackAuditForSubmission(submissionId);

  return (
    <AppShell className="min-h-dvh" topBar={<TopNav />}>
      <Stack gap="section" className="p-6 lg:p-8 max-w-3xl mx-auto w-full anim-fade-in">
        <PageHeader
          kicker={
            <TextLink href="/submissions" tone="muted" size="sm">
              Submissions
            </TextLink>
          }
          title={submission?.name ?? ""}
          titleSize="h1"
          meta={
            <Body size="small" tone="muted">
              Pack health across Module 2.5 sections
            </Body>
          }
          action={
            primaryDoc ? (
              <LinkButton
                href={`/submissions/${submissionId}/documents/${primaryDoc.id}?section=s-efficacy`}
                variant="primary"
                size="sm"
              >
                Open workspace
              </LinkButton>
            ) : undefined
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-in-0">
          <Stat variant="card" label="Curated packs" value={String(packStats.curated)} />
          <Stat
            variant="card"
            label="Stale sections"
            value={String(packStats.stale)}
            delta={{
              value: packStats.stale > 0 ? "Review" : "Clear",
              tone: packStats.stale > 0 ? "danger" : "success",
            }}
          />
          <Stat variant="card" label="Empty packs" value={String(packStats.empty)} />
          <Stat variant="card" label="Sources filed" value={String(packStats.totalSources)} />
        </div>

        {docs.length > 0 && (
          <Card variant="paper" padding="md" className="anim-fade-in-1">
            <Stack gap="cozy">
              <MetaLabel tone="muted">Documents</MetaLabel>
              {docs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/submissions/${submissionId}/documents/${doc.id}?section=s-efficacy`}
                  className="block rounded-md px-2 py-2 hover:bg-soft transition-colors"
                >
                  <Cluster justify="between" gap="cozy" wrap={false}>
                    <Stack gap="tight">
                      <Body size="small" className="font-medium">
                        {doc.title}
                      </Body>
                      <MetaText tone="faint" size="sm">
                        {doc.version_label} · {doc.study_id}
                      </MetaText>
                    </Stack>
                    <Badge tone={doc.version_label.includes("draft") ? "info" : "neutral"} size="sm">
                      {doc.version_label}
                    </Badge>
                  </Cluster>
                </Link>
              ))}
            </Stack>
          </Card>
        )}

        {needsAttention.length > 0 && (
          <Card variant="paper" padding="md" className="anim-fade-in-2">
            <Stack gap="cozy">
              <MetaLabel tone="muted">Needs attention</MetaLabel>
              {needsAttention.map((sec) => (
                <Link
                  key={sec.id}
                  href={`/submissions/${submissionId}/documents/${primaryDoc?.id}?section=${sec.id}`}
                  className="block rounded-md px-2 py-2 hover:bg-soft transition-colors"
                >
                  <Cluster justify="between" gap="cozy" wrap={false}>
                    <Body size="small">{sec.title}</Body>
                    <Badge tone={sec.pack_state === "stale" ? "danger" : "muted"} size="sm">
                      {sec.pack_state === "stale" ? "Stale pack" : "Empty pack"}
                    </Badge>
                  </Cluster>
                </Link>
              ))}
            </Stack>
          </Card>
        )}

        <Card variant="soft" padding="md" className="anim-fade-in-3">
          <Stack gap="cozy">
            <MetaLabel tone="muted">Recent pack activity</MetaLabel>
            {auditEvents.map((ev) => (
              <Cluster key={ev.id} justify="between" gap="cozy" align="start" wrap={false}>
                <Body size="small">{ev.detail}</Body>
                <MetaText tone="faint" size="sm" className="shrink-0">
                  {ev.actor}
                </MetaText>
              </Cluster>
            ))}
          </Stack>
        </Card>

        <Stack gap="tight" className="anim-fade-in-4">
          <MetaLabel tone="muted">All sections</MetaLabel>
          {sections.map((sec) => (
            <Link
              key={sec.id}
              href={`/submissions/${submissionId}/documents/${primaryDoc?.id}?section=${sec.id}`}
              className="block rounded-md border border-hairline px-3 py-2 hover:bg-soft transition-colors"
            >
              <Cluster justify="between" gap="cozy" wrap={false}>
                <Body size="small">{sec.title}</Body>
                <MetaText tone="faint" size="sm">
                  {sec.pack_count} sources · {sec.pack_state}
                </MetaText>
              </Cluster>
            </Link>
          ))}
        </Stack>
      </Stack>
    </AppShell>
  );
}
