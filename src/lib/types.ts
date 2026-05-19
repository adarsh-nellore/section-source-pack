export type PackState =
  | "empty"
  | "draft_suggested"
  | "in_curation"
  | "curated"
  | "stale";

export type SourceItemType = "tfl" | "prior_wording" | "guidance" | "document_chunk";
export type RepoPath = "stats" | "etmf" | "prior_submission" | "guidance";
export type SourceMembership = "in_pack" | "suggested";

export interface Submission {
  id: string;
  name: string;
  program_code: string;
  status: "draft" | "active" | "archived";
}

export interface Document {
  id: string;
  submission_id: string;
  title: string;
  version_label: string;
  study_id: string;
}

export interface Section {
  id: string;
  document_id: string;
  template_key: string;
  title: string;
  module: string;
  pack_state: PackState;
  pack_count: number;
  pack_version?: number;
}

export interface CitationAnchor {
  id: string;
  source_item_id: string;
  label: string;
  section_id: string;
}

export interface SectionNarrative {
  section_id: string;
  body: string;
  citations: CitationAnchor[];
}

export interface SourceItem {
  id: string;
  section_id: string;
  artifact_id: string;
  type: SourceItemType;
  title: string;
  excerpt: string;
  external_uri: string;
  repo_path: RepoPath;
  membership: SourceMembership;
  is_pinned: boolean;
  is_stale?: boolean;
  citation_refs: string[];
  sort_order: number;
  relevance_score?: number;
  rationale?: string;
}

export interface NarrativeParagraph {
  text: string;
  citationIds?: string[];
  unverified?: boolean;
}

export const REPO_LABELS: Record<RepoPath, string> = {
  stats: "Stats / TFLs",
  etmf: "eTMF / CSR",
  prior_submission: "Prior submissions",
  guidance: "Guidance",
};
