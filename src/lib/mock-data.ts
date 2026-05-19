import type {
  CitationAnchor,
  Document,
  NarrativeParagraph,
  PackState,
  RepoPath,
  Section,
  SectionNarrative,
  SourceItem,
  Submission,
} from "./types";

export const MOCK_USER = { name: "Jordan Lee", role: "medical_writer" as const };

export const submissions: Submission[] = [
  {
    id: "8f3a2c1b-9d4e-4a1f-b2c3-d4e5f6a7b8c9",
    name: "NDA — Rivonorex Tablets",
    program_code: "RIV-301",
    status: "active",
  },
];

export const documents: Document[] = [
  {
    id: "d1111111-2222-3333-4444-555555555551",
    submission_id: "8f3a2c1b-9d4e-4a1f-b2c3-d4e5f6a7b8c9",
    title: "Module 2.5 — Clinical Overview",
    version_label: "v3.2",
    study_id: "RIV-301-KEY-01",
  },
  {
    id: "d1111111-2222-3333-4444-555555555552",
    submission_id: "8f3a2c1b-9d4e-4a1f-b2c3-d4e5f6a7b8c9",
    title: "Module 2.5 — Clinical Overview",
    version_label: "v4.0-draft",
    study_id: "RIV-301-KEY-01",
  },
];

export const sections: Section[] = [
  {
    id: "s-efficacy",
    document_id: "d1111111-2222-3333-4444-555555555551",
    template_key: "efficacy-summary",
    title: "2.5.3 Efficacy Summary",
    module: "2.5",
    pack_state: "curated",
    pack_count: 7,
    pack_version: 2,
  },
  {
    id: "s-safety",
    document_id: "d1111111-2222-3333-4444-555555555551",
    template_key: "safety-profile",
    title: "2.5.4 Safety Profile",
    module: "2.5",
    pack_state: "stale",
    pack_count: 6,
    pack_version: 1,
  },
  {
    id: "s-rb",
    document_id: "d1111111-2222-3333-4444-555555555551",
    template_key: "risk-benefit",
    title: "2.5.5 Risk–Benefit",
    module: "2.5",
    pack_state: "empty",
    pack_count: 0,
    pack_version: 0,
  },
];

export const sourceItems: SourceItem[] = [
  // —— Efficacy in-pack (7) ——
  {
    id: "src-tfl-primary",
    section_id: "s-efficacy",
    artifact_id: "art-tfl-primary",
    type: "tfl",
    title: "Table 14.2.1 — Primary Endpoint (MMRM)",
    excerpt: "Difference vs placebo: −1.8 (95% CI −2.4, −1.2); p<0.001 at Week 12",
    external_uri: "mock://stats/tfl/14.2.1",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: true,
    citation_refs: ["cite-1"],
    sort_order: 0,
    relevance_score: 0.92,
    rationale: "Primary efficacy endpoint for summary claims",
  },
  {
    id: "src-tfl-secondary",
    section_id: "s-efficacy",
    artifact_id: "art-tfl-secondary",
    type: "tfl",
    title: "Table 14.2.3 — Key Secondary Endpoints",
    excerpt: "PRO total score Δ −4.2 vs placebo (95% CI −5.8, −2.6); p<0.001",
    external_uri: "mock://stats/tfl/14.2.3",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: true,
    citation_refs: ["cite-3"],
    sort_order: 1,
    relevance_score: 0.86,
    rationale: "Supports secondary endpoint narrative",
  },
  {
    id: "src-prior-label",
    section_id: "s-efficacy",
    artifact_id: "art-prior-label",
    type: "prior_wording",
    title: "Prior label — Indications and Usage",
    excerpt: "Previously approved wording for adult population with condition X",
    external_uri: "mock://prior/label",
    repo_path: "prior_submission",
    membership: "in_pack",
    is_pinned: true,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.68,
    rationale: "Cross-cycle indication consistency",
  },
  {
    id: "src-ich-e3",
    section_id: "s-efficacy",
    artifact_id: "art-ich-e3",
    type: "guidance",
    title: "ICH E3 — Section 11 (Efficacy)",
    excerpt: "Guidance on presenting efficacy results with CIs and sensitivity analyses",
    external_uri: "mock://guidance/ich-e3",
    repo_path: "guidance",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: ["cite-2"],
    sort_order: 0,
    relevance_score: 0.71,
    rationale: "Structure for efficacy summaries",
  },
  {
    id: "src-csr",
    section_id: "s-efficacy",
    artifact_id: "art-csr",
    type: "document_chunk",
    title: "CSR Section 9.2 — Study Design",
    excerpt: "Randomized, double-blind, placebo-controlled study; N=412; 42 sites",
    external_uri: "mock://etmf/csr-9.2",
    repo_path: "etmf",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: ["cite-4"],
    sort_order: 0,
    relevance_score: 0.79,
    rationale: "Design context for efficacy interpretation",
  },
  {
    id: "src-fda-efficacy",
    section_id: "s-efficacy",
    artifact_id: "art-fda-efficacy",
    type: "guidance",
    title: "FDA Guidance — Clinical Studies for Condition X",
    excerpt: "Recommends MMRM for continuous endpoints with intercurrent events policy",
    external_uri: "mock://guidance/fda-condition-x",
    repo_path: "guidance",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 1,
    relevance_score: 0.74,
    rationale: "Regulatory framing for endpoint analysis",
  },
  {
    id: "src-km-os",
    section_id: "s-efficacy",
    artifact_id: "art-km-os",
    type: "tfl",
    title: "Figure 14.1.2 — Kaplan–Meier (time to event)",
    excerpt: "HR 0.72 (95% CI 0.58, 0.89); median not reached in either arm",
    external_uri: "mock://stats/tfl/14.1.2",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: ["cite-5"],
    sort_order: 2,
    relevance_score: 0.81,
    rationale: "Time-to-event supportive evidence",
  },
  // —— Efficacy suggested (4) ——
  {
    id: "src-suggested",
    section_id: "s-efficacy",
    artifact_id: "art-subgroup",
    type: "tfl",
    title: "Table 14.3.2 — Subgroup (exploratory)",
    excerpt: "Exploratory subgroup; not prespecified in SAP v4.1",
    external_uri: "mock://stats/tfl/14.3.2",
    repo_path: "stats",
    membership: "suggested",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.58,
    rationale: "Exploratory — review before adding to pack",
  },
  {
    id: "src-suggested-qol",
    section_id: "s-efficacy",
    artifact_id: "art-qol",
    type: "tfl",
    title: "Table 14.4.1 — QoL domain scores",
    excerpt: "Mental component summary +3.1 vs placebo at Week 12",
    external_uri: "mock://stats/tfl/14.4.1",
    repo_path: "stats",
    membership: "suggested",
    is_pinned: false,
    citation_refs: [],
    sort_order: 1,
    relevance_score: 0.62,
    rationale: "Patient-reported outcome supplement",
  },
  {
    id: "src-suggested-sap",
    section_id: "s-efficacy",
    artifact_id: "art-sap-excerpt",
    type: "document_chunk",
    title: "SAP Section 8.1 — Estimand definition",
    excerpt: "Treatment policy estimand; MMRM with unstructured covariance",
    external_uri: "mock://etmf/sap-8.1",
    repo_path: "etmf",
    membership: "suggested",
    is_pinned: false,
    citation_refs: [],
    sort_order: 2,
    relevance_score: 0.55,
    rationale: "Methodology cross-check for primary analysis",
  },
  {
    id: "src-suggested-prior-csr",
    section_id: "s-efficacy",
    artifact_id: "art-prior-csr-efficacy",
    type: "prior_wording",
    title: "Prior CSR Module 2.5.3 — Efficacy (RIV-201)",
    excerpt: "Prior cycle efficacy wording for same molecule, different indication",
    external_uri: "mock://prior/csr-25.3",
    repo_path: "prior_submission",
    membership: "suggested",
    is_pinned: false,
    citation_refs: [],
    sort_order: 3,
    relevance_score: 0.48,
    rationale: "Low relevance — different indication",
  },
  // —— Safety in-pack (6) ——
  {
    id: "src-teae",
    section_id: "s-safety",
    artifact_id: "art-teae",
    type: "tfl",
    title: "Table 12.1.5 — TEAEs ≥5%",
    excerpt: "Insomnia 8.2% vs 3.1% placebo; SAP index now v4.1 (stale)",
    external_uri: "mock://stats/tfl/12.1.5",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: true,
    is_stale: true,
    citation_refs: ["cite-s1"],
    sort_order: 0,
    relevance_score: 0.88,
    rationale: "Core safety summary table",
  },
  {
    id: "src-sae",
    section_id: "s-safety",
    artifact_id: "art-sae",
    type: "tfl",
    title: "Table 12.2.1 — Serious adverse events",
    excerpt: "SAE rate 4.4% Rivonorex vs 5.3% placebo; no imbalance in deaths",
    external_uri: "mock://stats/tfl/12.2.1",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: true,
    citation_refs: ["cite-s2"],
    sort_order: 1,
    relevance_score: 0.9,
    rationale: "SAE overview for safety summary",
  },
  {
    id: "src-labs",
    section_id: "s-safety",
    artifact_id: "art-labs",
    type: "tfl",
    title: "Table 12.3.4 — Clinically notable lab shifts",
    excerpt: "ALT >3× ULN: 2.4% active vs 1.9% placebo",
    external_uri: "mock://stats/tfl/12.3.4",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: ["cite-s3"],
    sort_order: 0,
    relevance_score: 0.77,
    rationale: "Hepatic lab monitoring narrative",
  },
  {
    id: "src-discontinuations",
    section_id: "s-safety",
    artifact_id: "art-discontinuations",
    type: "tfl",
    title: "Table 12.1.2 — Discontinuations due to AE",
    excerpt: "7.3% active vs 4.9% placebo discontinued for adverse events",
    external_uri: "mock://stats/tfl/12.1.2",
    repo_path: "stats",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 2,
    relevance_score: 0.72,
    rationale: "Treatment discontinuation context",
  },
  {
    id: "src-prior-safety",
    section_id: "s-safety",
    artifact_id: "art-prior-safety",
    type: "prior_wording",
    title: "Prior label — Warnings (insomnia)",
    excerpt: "Insomnia listed as common adverse reaction in prior USPI",
    external_uri: "mock://prior/label-warnings",
    repo_path: "prior_submission",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.65,
    rationale: "Label consistency for insomnia signal",
  },
  {
    id: "src-ich-e3-safety",
    section_id: "s-safety",
    artifact_id: "art-ich-e3-safety",
    type: "guidance",
    title: "ICH E3 — Section 12 (Safety)",
    excerpt: "Presentation of adverse events by SOC and preferred term",
    external_uri: "mock://guidance/ich-e3-s12",
    repo_path: "guidance",
    membership: "in_pack",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.7,
    rationale: "Safety presentation structure",
  },
  // —— Safety suggested (2) ——
  {
    id: "src-suggested-vitals",
    section_id: "s-safety",
    artifact_id: "art-vitals",
    type: "tfl",
    title: "Table 12.4.1 — Vital signs summary",
    excerpt: "No clinically meaningful changes in BP or HR vs placebo",
    external_uri: "mock://stats/tfl/12.4.1",
    repo_path: "stats",
    membership: "suggested",
    is_pinned: false,
    citation_refs: [],
    sort_order: 0,
    relevance_score: 0.61,
    rationale: "Optional vitals supplement",
  },
  {
    id: "src-suggested-ae-serious-detail",
    section_id: "s-safety",
    artifact_id: "art-sae-detail",
    type: "document_chunk",
    title: "CSR Section 12.3 — SAE narratives",
    excerpt: "Individual SAE narratives for treatment-emergent events",
    external_uri: "mock://etmf/csr-12.3",
    repo_path: "etmf",
    membership: "suggested",
    is_pinned: false,
    citation_refs: [],
    sort_order: 1,
    relevance_score: 0.54,
    rationale: "Detail behind aggregate SAE table",
  },
];

export const narratives: Record<string, SectionNarrative> = {
  "s-efficacy": {
    section_id: "s-efficacy",
    body:
      "The primary endpoint demonstrated statistically significant improvement versus placebo at Week 12. Treatment effect was consistent across prespecified subgroups.",
    citations: [
      { id: "cite-1", source_item_id: "src-tfl-primary", label: "[1]", section_id: "s-efficacy" },
      { id: "cite-2", source_item_id: "src-ich-e3", label: "[2]", section_id: "s-efficacy" },
      { id: "cite-3", source_item_id: "src-tfl-secondary", label: "[3]", section_id: "s-efficacy" },
      { id: "cite-4", source_item_id: "src-csr", label: "[4]", section_id: "s-efficacy" },
      { id: "cite-5", source_item_id: "src-km-os", label: "[5]", section_id: "s-efficacy" },
    ],
  },
  "s-safety": {
    section_id: "s-safety",
    body: "Treatment-emergent adverse events were generally mild to moderate. Insomnia was more frequent in the active arm.",
    citations: [
      { id: "cite-s1", source_item_id: "src-teae", label: "[1]", section_id: "s-safety" },
      { id: "cite-s2", source_item_id: "src-sae", label: "[2]", section_id: "s-safety" },
      { id: "cite-s3", source_item_id: "src-labs", label: "[3]", section_id: "s-safety" },
    ],
  },
  "s-rb": {
    section_id: "s-rb",
    body: "Overall benefit-risk remains favorable based on efficacy and safety findings.",
    citations: [],
  },
};

/** Multi-paragraph narrative blocks (additive; preferred for rendering). */
export const narrativeParagraphs: Record<string, NarrativeParagraph[]> = {
  "s-efficacy": [
    {
      text: "Study RIV-301-KEY-01 was a randomized, double-blind, placebo-controlled trial in adults with moderate to severe condition X (N=412; 42 sites). The primary endpoint was change from baseline in the validated disease score at Week 12, analyzed using MMRM with treatment policy estimand per SAP v4.1.",
      citationIds: ["cite-4"],
    },
    {
      text: "Rivonorex 20 mg demonstrated a statistically significant treatment effect versus placebo on the primary endpoint at Week 12. The least-squares mean difference was −1.8 points (95% CI −2.4, −1.2; p<0.001), consistent with the prespecified analysis and supportive of a clinically meaningful benefit.",
      citationIds: ["cite-1", "cite-2"],
    },
    {
      text: "Key secondary endpoints, including the patient-reported outcome total score, favored Rivonorex versus placebo with differences that met hierarchical testing criteria. Results were directionally consistent across age, sex, and baseline severity subgroups defined in the SAP.",
      citationIds: ["cite-3"],
    },
    {
      text: "Time-to-event analyses showed a hazard ratio of 0.72 (95% CI 0.58, 0.89) for the key secondary time-to-worsening endpoint; medians were not reached in either arm. Sensitivity analyses using alternative missing-data assumptions did not materially change the primary result.",
      citationIds: ["cite-5"],
    },
    {
      text: "No new efficacy concerns were identified relative to prior submissions for Rivonorex in condition X. Wording for indication scope remains aligned with the approved USPI while reflecting the current study population.",
    },
    {
      text: "The efficacy profile supports the proposed indication in the target population; detailed safety and benefit-risk integration are presented in Sections 2.5.4 and 2.5.5.",
      unverified: true,
    },
  ],
  "s-safety": [
    {
      text: "The safety population comprised all randomized patients who received at least one dose of study drug (N=412). Overall exposure was balanced between Rivonorex 20 mg and placebo, with median treatment duration of 84 days in both arms.",
    },
    {
      text: "Treatment-emergent adverse events (TEAEs) were reported in 78.2% of Rivonorex-treated patients and 74.3% of placebo-treated patients. Most events were mild or moderate in severity; serious adverse events occurred at comparable rates between arms.",
      citationIds: ["cite-s2"],
    },
    {
      text: "Insomnia was the only TEAE reported at ≥5% frequency with a ≥2% absolute difference favoring Rivonorex (8.2% vs 3.1% placebo). This signal is consistent with the known product profile and prior labeling.",
      citationIds: ["cite-s1"],
    },
    {
      text: "Clinically notable laboratory abnormalities were infrequent. Hepatic transaminase elevations >3× ULN occurred in 2.4% of Rivonorex patients versus 1.9% on placebo, without Hy's law cases or treatment-related liver injury narratives.",
      citationIds: ["cite-s3"],
    },
  ],
  "s-rb": [
    {
      text: "The benefit-risk assessment for Rivonorex 20 mg integrates the favorable efficacy findings from Study RIV-301-KEY-01 with the safety profile characterized in the pooled Phase 3 dataset.",
    },
    {
      text: "Clinically meaningful improvement on the primary and key secondary endpoints supports approval for the proposed indication. Identified risks are manageable with routine monitoring and are reflected in proposed labeling language.",
    },
    {
      text: "On balance, the efficacy benefits outweigh the identified risks in the intended adult population with condition X, subject to the warnings and precautions described in Module 2.5.4.",
    },
  ],
};

export interface PackAuditEvent {
  id: string;
  section_id: string;
  action: string;
  actor: string;
  at: string;
  detail: string;
}

export const packAuditEvents: PackAuditEvent[] = [
  {
    id: "audit-1",
    section_id: "s-efficacy",
    action: "mark_curated",
    actor: "Jordan Lee",
    at: "2026-05-10T16:22:00Z",
    detail: "Locked source pack v2 for Module 2.5 v3.2",
  },
  {
    id: "audit-2",
    section_id: "s-safety",
    action: "ack_stale",
    actor: "Jordan Lee",
    at: "2026-05-14T09:15:00Z",
    detail: "Stale flag on Table 12.1.5 — SAP v4.1 indexed",
  },
  {
    id: "audit-3",
    section_id: "s-efficacy",
    action: "pin",
    actor: "Jordan Lee",
    at: "2026-05-09T11:04:00Z",
    detail: "Pinned Table 14.2.1 — Primary Endpoint",
  },
];

export const sourceMeta: Record<
  string,
  { last_accessed: string; citation_count?: number; study_id: string }
> = {
  "src-tfl-primary": { last_accessed: "2026-05-18T08:12:00Z", citation_count: 3, study_id: "RIV-301-KEY-01" },
  "src-teae": { last_accessed: "2026-05-17T14:30:00Z", citation_count: 1, study_id: "RIV-301-KEY-01" },
  "src-ich-e3": { last_accessed: "2026-05-16T10:00:00Z", study_id: "RIV-301-KEY-01" },
};

export function getSubmission(id: string) {
  return submissions.find((s) => s.id === id);
}

export function getDocument(id: string) {
  return documents.find((d) => d.id === id);
}

export function getDocumentsForSubmission(submissionId: string) {
  return documents.filter((d) => d.submission_id === submissionId);
}

export function getSectionsForDocument(documentId: string) {
  return sections.filter((s) => s.document_id === documentId);
}

export function getSection(id: string) {
  return sections.find((s) => s.id === id);
}

export function getSourcesForSection(sectionId: string) {
  return sourceItems.filter((i) => i.section_id === sectionId);
}

export function getNarrative(sectionId: string) {
  return narratives[sectionId];
}

export function getNarrativeParagraphs(sectionId: string): NarrativeParagraph[] | undefined {
  return narrativeParagraphs[sectionId];
}

export function groupSourcesByRepo(items: SourceItem[]) {
  const inPack = items.filter((i) => i.membership === "in_pack");
  const suggested = items.filter((i) => i.membership === "suggested");
  const byRepo = (list: SourceItem[]) => {
    const map = new Map<RepoPath, SourceItem[]>();
    for (const item of list) {
      const arr = map.get(item.repo_path) ?? [];
      arr.push(item);
      map.set(item.repo_path, arr);
    }
    return map;
  };
  return { inPackByRepo: byRepo(inPack), suggested };
}

export function getSource(id: string) {
  return sourceItems.find((s) => s.id === id);
}

export function getSourcesForCitation(citationId: string, sectionId: string) {
  const narrative = narratives[sectionId];
  if (!narrative) return [];
  const cite = narrative.citations.find((c) => c.id === citationId);
  if (!cite) return [];
  const primary = getSource(cite.source_item_id);
  return primary ? [primary] : [];
}

export function getPackAuditForSubmission(submissionId: string) {
  const docIds = documents.filter((d) => d.submission_id === submissionId).map((d) => d.id);
  const sectionIds = sections.filter((s) => docIds.includes(s.document_id)).map((s) => s.id);
  return packAuditEvents.filter((e) => sectionIds.includes(e.section_id));
}

export function getSubmissionPackStats(submissionId: string) {
  const doc = documents.find((d) => d.submission_id === submissionId);
  if (!doc) return { curated: 0, stale: 0, empty: 0, totalSources: 0 };
  const secs = getSectionsForDocument(doc.id);
  const curated = secs.filter((s) => s.pack_state === "curated").length;
  const stale = secs.filter((s) => s.pack_state === "stale").length;
  const empty = secs.filter((s) => s.pack_state === "empty").length;
  const totalSources = sourceItems.filter((i) =>
    secs.some((s) => s.id === i.section_id && i.membership === "in_pack")
  ).length;
  return { curated, stale, empty, totalSources };
}
