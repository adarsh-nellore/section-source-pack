import Link from "next/link";
import { documents, getSubmissionPackStats, submissions } from "@/lib/mock-data";
import { AppShell } from "@/components/layout/AppShell";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { TopNav } from "@/components/layout/TopNav";
import { PageHeader } from "@/components/patterns/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { MetaText } from "@/components/ui/MetaText";
import { Stat } from "@/components/ui/Stat";
import { Body } from "@/components/typography/Body";
import { Heading } from "@/components/typography/Heading";

export default function SubmissionsListPage() {
  const sub = submissions[0];
  const stats = sub ? getSubmissionPackStats(sub.id) : null;

  return (
    <AppShell className="min-h-dvh" topBar={<TopNav />}>
      <Stack gap="section" className="p-6 lg:p-8 max-w-3xl mx-auto w-full anim-fade-in">
        <PageHeader
          title="Submissions"
          titleSize="h1"
          meta={
            <Body size="small" tone="muted">
              Select a program to open the writer workspace
            </Body>
          }
        />

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-in-0">
            <Stat variant="card" label="Curated" value={String(stats.curated)} />
            <Stat variant="card" label="Stale" value={String(stats.stale)} />
            <Stat variant="card" label="Empty" value={String(stats.empty)} />
            <Stat variant="card" label="Sources" value={String(stats.totalSources)} />
          </div>
        )}

        <Stack gap="cozy" className="anim-fade-in-1">
          <MetaLabel tone="muted">Your programs</MetaLabel>
          {submissions.map((submission) => {
            const doc = documents.find((d) => d.submission_id === submission.id);
            return (
              <Link
                key={submission.id}
                href={
                  doc
                    ? `/submissions/${submission.id}/documents/${doc.id}?section=s-efficacy`
                    : `/submissions/${submission.id}`
                }
                className="block group"
                data-wt={submission.id === sub?.id ? "submission-card" : undefined}
              >
                <Card
                  variant="paper"
                  padding="md"
                  className="transition-all duration-200 ease-out group-hover:bg-soft group-hover:shadow-pop group-hover:-translate-y-px"
                >
                  <Stack gap="cozy">
                    <Cluster justify="between" gap="cozy" wrap={false}>
                      <Heading size="h4">{submission.name}</Heading>
                      <Badge tone="success" size="sm">
                        {submission.status}
                      </Badge>
                    </Cluster>
                    <MetaText tone="faint" size="sm">
                      {submission.program_code}
                    </MetaText>
                    {doc && (
                      <Body size="small" tone="muted">
                        {doc.title} · {doc.version_label}
                      </Body>
                    )}
                  </Stack>
                </Card>
              </Link>
            );
          })}
        </Stack>
      </Stack>
    </AppShell>
  );
}
