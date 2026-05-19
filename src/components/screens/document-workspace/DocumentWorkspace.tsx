"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDocument,
  getDocumentsForSubmission,
  getSection,
  getSectionsForDocument,
  getSubmission,
  MOCK_USER,
  sourceItems as initialSources,
} from "@/lib/mock-data";
import type { RepoPath, SourceItem } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { TopNav } from "@/components/layout/TopNav";
import { PageHeader } from "@/components/patterns/PageHeader";
import { Prose } from "@/components/patterns/Prose";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/layout/LinkButton";
import { MetaText } from "@/components/ui/MetaText";
import { Pill } from "@/components/ui/Pill";
import { Dot } from "@/components/ui/Dot";
import { TextLink } from "@/components/ui/TextLink";
import { DocumentFeatureTree } from "./DocumentFeatureTree";
import { SourcePreviewProvider } from "./source-preview/SourcePreviewContext";
import { SectionNarrativeBody } from "./SectionNarrativeBody";
import { WorkspaceModals } from "./WorkspaceModals";

const ASSEMBLE_SEED: Omit<SourceItem, "section_id">[] = [
  {
    id: "src-rb-tfl",
    artifact_id: "art-tfl-primary",
    type: "tfl",
    title: "Table 14.2.1 — Primary Endpoint (MMRM)",
    excerpt: "Difference vs placebo: −1.8 (95% CI −2.4, −1.2)",
    external_uri: "mock://stats/tfl/14.2.1",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: true,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.9,
  },
  {
    id: "src-rb-sae",
    artifact_id: "art-sae",
    type: "tfl",
    title: "Table 12.2.1 — Serious adverse events",
    excerpt: "SAE rate 4.4% Rivonorex vs 5.3% placebo",
    external_uri: "mock://stats/tfl/12.2.1",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 1,
    relevance_score: 0.85,
  },
  {
    id: "src-rb-guidance",
    artifact_id: "art-ich-e3",
    type: "guidance",
    title: "ICH E3 — Section 11",
    excerpt: "Guidance on presenting efficacy results",
    external_uri: "mock://guidance/ich-e3",
    repo_path: "guidance",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.72,
  },
  {
    id: "src-rb-prior",
    artifact_id: "art-prior-label",
    type: "prior_wording",
    title: "Prior label — Indications",
    excerpt: "Previously approved wording for adult population",
    external_uri: "mock://prior/label",
    repo_path: "prior_submission",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.66,
  },
  {
    id: "src-rb-csr",
    artifact_id: "art-csr",
    type: "document_chunk",
    title: "CSR Section 9.2 — Study Design",
    excerpt: "RDBPC study; N=412",
    external_uri: "mock://etmf/csr-9.2",
    repo_path: "etmf",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.78,
  },
];

export function DocumentWorkspace({
  submissionId,
  documentId,
}: {
  submissionId: string;
  documentId: string;
  initialSectionId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const docSections = getSectionsForDocument(documentId);

  const sectionFromUrl = searchParams.get("section");
  const sourceFromUrl = searchParams.get("source");
  const activeSectionId = sectionFromUrl ?? docSections[0]?.id ?? "";
  const isAssembling = searchParams.get("state") === "assembling";

  const [sources, setSources] = useState<SourceItem[]>(initialSources);
  const [sourceFilter, setSourceFilter] = useState("");
  const [pulseCiteId, setPulseCiteId] = useState<string | null>(null);
  const [pendingReparent, setPendingReparent] = useState<{
    sourceId: string;
    repo: RepoPath;
  } | null>(null);

  const setQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null) params.delete(k);
        else params.set(k, v);
      });
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (!sectionFromUrl && docSections[0]) {
      setQuery({ section: docSections[0].id });
    }
  }, [sectionFromUrl, docSections, setQuery]);

  useEffect(() => {
    if (!isAssembling) return;
    const t = window.setTimeout(() => {
      setSources((prev) => {
        const hasRb = prev.some((s) => s.section_id === "s-rb" && s.membership === "in_pack");
        if (hasRb) return prev;
        const seeded = ASSEMBLE_SEED.map((s) => ({ ...s, section_id: "s-rb" }));
        return [...prev, ...seeded];
      });
      setQuery({ state: null });
    }, 2200);
    return () => window.clearTimeout(t);
  }, [isAssembling, setQuery]);

  const selectSource = useCallback(
    (sourceId: string) => {
      const src = sources.find((s) => s.id === sourceId);
      const sectionId = src?.section_id ?? activeSectionId;
      setQuery({ source: sourceId, section: sectionId });
    },
    [activeSectionId, setQuery, sources]
  );

  const selectSection = (sectionId: string) => {
    setQuery({ section: sectionId, source: null });
  };

  const submission = getSubmission(submissionId);
  const docMeta = getDocument(documentId);
  const docVersions = getDocumentsForSubmission(submissionId);
  const section = getSection(activeSectionId);
  const sectionSources = useMemo(
    () => sources.filter((s) => s.section_id === activeSectionId),
    [sources, activeSectionId]
  );

  const activeSourceId = sourceFromUrl;

  const inPackForSection = sectionSources.filter((s) => s.membership === "in_pack");
  const staleInPack = inPackForSection.filter((s) => s.is_stale);
  const hasStale = staleInPack.length > 0 || section?.pack_state === "stale";
  const canLockPack =
    inPackForSection.length >= 1 && !hasStale && section?.pack_state !== "empty" && !isAssembling;

  const lockDisabledReason = hasStale
    ? "Resolve stale sources before locking the pack"
    : inPackForSection.length < 1
      ? "Add sources to the pack before locking"
      : isAssembling
        ? "Wait for assembly to finish"
        : null;

  const jumpToNarrativeForSource = useCallback(
    (sourceId: string) => {
      const src = sources.find((s) => s.id === sourceId);
      const citeId = src?.citation_refs[0];
      if (!citeId) return;
      const el = globalThis.document.getElementById(`cite-${citeId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      setPulseCiteId(citeId);
      window.setTimeout(() => setPulseCiteId(null), 1400);
    },
    [sources]
  );

  const onReparent = (sourceId: string, repo: RepoPath) => {
    const item = sources.find((s) => s.id === sourceId);
    if (item && item.repo_path !== repo) {
      setPendingReparent({ sourceId, repo });
      setQuery({ modal: "move-source" });
      return;
    }
    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId ? { ...s, repo_path: repo, membership: "in_pack" as const } : s
      )
    );
  };

  const confirmReparent = () => {
    if (!pendingReparent) return;
    const { sourceId, repo } = pendingReparent;
    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId ? { ...s, repo_path: repo, membership: "in_pack" as const } : s
      )
    );
    setPendingReparent(null);
    setQuery({ modal: null });
  };

  const onPin = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_pinned: !s.is_pinned } : s))
    );
  };

  const onDelete = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
    if (activeSourceId === id) setQuery({ source: null });
  };

  const onPromote = (id: string) => {
    setSources((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, membership: "in_pack" as const, sort_order: 99 } : s
      )
    );
  };

  const onAssemble = () => {
    setQuery({ state: "assembling", source: null });
  };

  const modal = searchParams.get("modal");

  return (
    <SourcePreviewProvider onJumpToNarrativeForSource={jumpToNarrativeForSource}>
      <AppShell
        className="h-dvh"
        leftNavWidth={288}
        topBar={
          <TopNav
            breadcrumb={
              <Cluster gap="cozy" align="center" wrap={false} className="min-w-0">
                <TextLink href="/submissions" tone="muted" size="sm">
                  Submissions
                </TextLink>
                <MetaText tone="faint" size="sm">
                  /
                </MetaText>
                <MetaText tone="ink" size="sm" className="truncate font-medium">
                  {submission?.name}
                </MetaText>
                <MetaText tone="faint" size="sm">
                  /
                </MetaText>
                <MetaText tone="ink" size="sm" className="truncate">
                  {docMeta?.title}
                </MetaText>
                <MetaText tone="faint" size="sm">
                  {docMeta?.version_label}
                </MetaText>
              </Cluster>
            }
            trailing={<MetaText size="sm">{MOCK_USER.name}</MetaText>}
          />
        }
        leftNav={
          <DocumentFeatureTree
            sections={docSections}
            activeSectionId={activeSectionId}
            activeSourceId={activeSourceId}
            sources={sectionSources}
            sourceFilter={sourceFilter}
            onSourceFilterChange={setSourceFilter}
            onSectionSelect={selectSection}
            onSourceSelect={selectSource}
            onReparent={onReparent}
            onPin={onPin}
            onDelete={onDelete}
            onPromote={onPromote}
            onAssemble={onAssemble}
            onInherit={() => setQuery({ modal: "inherit-pack" })}
            isAssembling={isAssembling}
            packVersion={section?.pack_version}
          />
        }
      >
        <Stack gap="block" className="h-full min-h-0 px-6 pt-5 pb-0 anim-fade-in">
          {section?.pack_state === "stale" && (
            <Banner
              tone="danger"
              title="Pack stale"
              body={`${staleInPack.length} source(s) have newer artifact versions in the index. Review and replace before re-locking.`}
              className="anim-fade-in-0"
            />
          )}

          <PageHeader
            title={section?.title ?? ""}
            titleSize="h2"
            meta={
              <Cluster gap="cozy" align="center" wrap>
                {docVersions.map((d) => (
                  <Pill
                    key={d.id}
                    variant={d.id === documentId ? "accent" : "outlined"}
                    size="sm"
                    leadingIcon={
                      d.id === documentId ? <Dot color="coral" pulse /> : undefined
                    }
                  >
                    {d.version_label}
                  </Pill>
                ))}
                {docVersions.length > 1 && (
                  <LinkButton
                    href={
                      "/submissions/" +
                      submissionId +
                      "/documents/" +
                      docVersions[1]?.id +
                      "?section=" +
                      activeSectionId +
                      "&modal=inherit-pack"
                    }
                    variant="ghost"
                    size="sm"
                  >
                    Inherit from prior version
                  </LinkButton>
                )}
              </Cluster>
            }
            action={
              <Cluster gap="cozy" wrap={false}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuery({ modal: "inherit-pack" })}
                >
                  Inherit pack
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!canLockPack}
                  title={lockDisabledReason ?? "Lock source pack for this section version"}
                  onClick={() => setQuery({ modal: "mark-curated" })}
                >
                  Lock source pack
                </Button>
              </Cluster>
            }
            className="anim-fade-in-1"
          />

          <div className="flex-1 min-h-0 overflow-y-auto scroll-tame pb-8 anim-fade-in-2">
            <Prose variant="article" className="max-w-[52rem]">
              <SectionNarrativeBody
                sectionId={activeSectionId}
                activeSourceId={activeSourceId}
                pulseCiteId={pulseCiteId}
                onSelectCitation={selectSource}
              />
            </Prose>
          </div>
        </Stack>
      </AppShell>

      <WorkspaceModals
        modal={modal}
        docVersionLabel={docMeta?.version_label}
        canLockPack={canLockPack}
        lockDisabledReason={lockDisabledReason}
        staleSourceTitles={staleInPack.map((s) => s.title)}
        pendingReparent={pendingReparent}
        onCloseModal={() => setQuery({ modal: null })}
        onConfirmLock={() => setQuery({ modal: null })}
        onConfirmInherit={() => setQuery({ modal: null })}
        onConfirmMove={confirmReparent}
        onCancelMove={() => {
          setPendingReparent(null);
          setQuery({ modal: null });
        }}
      />
    </SourcePreviewProvider>
  );
}
