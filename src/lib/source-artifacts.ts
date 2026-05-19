import type { RepoPath } from "./types";

export type SourceArtifactKind = "text" | "table";

export interface SourceArtifactText {
  id: string;
  kind: "text";
  title: string;
  repo_path: RepoPath;
  version_label: string;
  paragraphs: string[];
  key_pills: string[];
}

export interface SourceArtifactTable {
  id: string;
  kind: "table";
  title: string;
  repo_path: RepoPath;
  version_label: string;
  caption: string;
  columns: string[];
  rows: string[][];
  key_pills: string[];
}

export type SourceArtifact = SourceArtifactText | SourceArtifactTable;

export const sourceArtifacts: Record<string, SourceArtifact> = {
  "art-tfl-primary": {
    id: "art-tfl-primary",
    kind: "table",
    title: "Table 14.2.1 — Primary Endpoint (MMRM)",
    repo_path: "stats",
    version_label: "SAP v4.1 · 18 May 2026",
    caption: "Change from baseline at Week 12 — Full analysis set (N=412)",
    columns: ["Treatment", "n", "LS Mean Δ", "95% CI", "p-value"],
    rows: [
      ["Rivonorex 20 mg", "206", "−2.4", "(−2.9, −1.9)", "<0.001"],
      ["Placebo", "206", "−0.6", "(−1.1, −0.1)", "—"],
      ["Difference", "—", "−1.8", "(−2.4, −1.2)", "<0.001"],
    ],
    key_pills: ["HR −1.8", "n=412", "p<0.001", "Week 12"],
  },
  "art-teae": {
    id: "art-teae",
    kind: "table",
    title: "Table 12.1.5 — TEAEs ≥5%",
    repo_path: "stats",
    version_label: "CSR Tables v2.3 · 16 May 2026",
    caption: "Treatment-emergent adverse events by preferred term",
    columns: ["Preferred term", "Rivonorex (N=206)", "Placebo (N=206)"],
    rows: [
      ["Insomnia", "8.2%", "3.1%"],
      ["Nausea", "6.8%", "4.4%"],
      ["Headache", "5.3%", "5.8%"],
      ["Fatigue", "5.1%", "3.9%"],
    ],
    key_pills: ["Insomnia 8.2%", "n=206/arm", "TEAE ≥5%"],
  },
  "art-subgroup": {
    id: "art-subgroup",
    kind: "table",
    title: "Table 14.3.2 — Subgroup (exploratory)",
    repo_path: "stats",
    version_label: "SAP v4.1 · exploratory",
    caption: "Subgroup analysis — not prespecified",
    columns: ["Subgroup", "n", "Δ vs placebo", "95% CI"],
    rows: [
      ["Age <65", "248", "−1.6", "(−2.3, −0.9)"],
      ["Age ≥65", "164", "−2.1", "(−3.1, −1.1)"],
      ["Female", "221", "−1.7", "(−2.5, −0.9)"],
    ],
    key_pills: ["Exploratory", "Age strata", "Not prespecified"],
  },
  "art-prior-label": {
    id: "art-prior-label",
    kind: "text",
    title: "Prior label — Indications and Usage",
    repo_path: "prior_submission",
    version_label: "USPI v2.0 · approved 2024",
    paragraphs: [
      "INDICATIONS AND USAGE",
      "Rivonorex is indicated for the treatment of moderate to severe chronic condition X in adults.",
      "Limitations of Use: Rivonorex has not been studied in patients under 18 years of age.",
      "The safety and efficacy of Rivonorex for condition Y have not been established.",
    ],
    key_pills: ["USPI v2.0", "Adults", "Condition X"],
  },
  "art-ich-e3": {
    id: "art-ich-e3",
    kind: "text",
    title: "ICH E3 — Section 11 (Efficacy)",
    repo_path: "guidance",
    version_label: "ICH E3 (R1)",
    paragraphs: [
      "11.1 General Considerations",
      "Efficacy results should be presented for all primary and secondary endpoints, with point estimates and confidence intervals.",
      "11.2 Primary Endpoint",
      "The analysis of the primary endpoint should be clearly described, including the statistical model, handling of missing data, and sensitivity analyses.",
    ],
    key_pills: ["ICH E3 (R1)", "§11 Efficacy", "CI required"],
  },
  "art-csr": {
    id: "art-csr",
    kind: "text",
    title: "CSR Section 9.2 — Study Design",
    repo_path: "etmf",
    version_label: "CSR draft v3.2 · 10 May 2026",
    paragraphs: [
      "9.2.1 Overall Design",
      "This was a randomized, double-blind, placebo-controlled, parallel-group study conducted at 42 sites in North America and Europe.",
      "9.2.2 Study Population",
      "Adults aged 18–75 with confirmed diagnosis per protocol criteria. Key exclusion: prior exposure to investigational agents within 90 days.",
    ],
    key_pills: ["42 sites", "RDBPC", "N=412", "CSR v3.2"],
  },
  "art-tfl-secondary": {
    id: "art-tfl-secondary",
    kind: "table",
    title: "Table 14.2.3 — Key Secondary Endpoints",
    repo_path: "stats",
    version_label: "SAP v4.1 · 18 May 2026",
    caption: "PRO and secondary clinical endpoints at Week 12",
    columns: ["Endpoint", "Δ vs placebo", "95% CI", "p-value"],
    rows: [
      ["PRO total score", "−4.2", "(−5.8, −2.6)", "<0.001"],
      ["Time to worsening", "HR 0.72", "(0.58, 0.89)", "0.002"],
    ],
    key_pills: ["PRO −4.2", "Hierarchical", "Week 12"],
  },
  "art-fda-efficacy": {
    id: "art-fda-efficacy",
    kind: "text",
    title: "FDA Guidance — Clinical Studies for Condition X",
    repo_path: "guidance",
    version_label: "Draft guidance · 2024",
    paragraphs: [
      "For continuous primary endpoints, sponsors should prespecify the estimand, intercurrent event handling, and sensitivity analyses.",
      "MMRM is acceptable when missing-at-random assumptions are supported by observed data patterns.",
    ],
    key_pills: ["MMRM", "Estimand", "FDA draft"],
  },
  "art-km-os": {
    id: "art-km-os",
    kind: "table",
    title: "Figure 14.1.2 — Kaplan–Meier",
    repo_path: "stats",
    version_label: "SAP v4.1",
    caption: "Time to worsening — Full analysis set",
    columns: ["Arm", "Events", "Median (weeks)", "HR (95% CI)"],
    rows: [
      ["Rivonorex 20 mg", "48", "NR", "0.72 (0.58, 0.89)"],
      ["Placebo", "62", "NR", "—"],
    ],
    key_pills: ["HR 0.72", "NR", "Secondary"],
  },
  "art-qol": {
    id: "art-qol",
    kind: "table",
    title: "Table 14.4.1 — QoL domain scores",
    repo_path: "stats",
    version_label: "SAP v4.1 · exploratory",
    caption: "SF-36 mental component summary",
    columns: ["Domain", "Δ vs placebo", "95% CI"],
    rows: [["MCS", "+3.1", "(+1.2, +5.0)"]],
    key_pills: ["QoL", "Exploratory"],
  },
  "art-sap-excerpt": {
    id: "art-sap-excerpt",
    kind: "text",
    title: "SAP Section 8.1 — Estimand",
    repo_path: "etmf",
    version_label: "SAP v4.1 · 01 May 2026",
    paragraphs: [
      "The primary estimand is the treatment policy estimand: difference in mean change from baseline at Week 12 regardless of intercurrent events.",
      "MMRM model includes treatment, visit, treatment-by-visit, baseline, and baseline-by-visit with unstructured covariance.",
    ],
    key_pills: ["Treatment policy", "MMRM", "SAP v4.1"],
  },
  "art-prior-csr-efficacy": {
    id: "art-prior-csr-efficacy",
    kind: "text",
    title: "Prior CSR Module 2.5.3",
    repo_path: "prior_submission",
    version_label: "RIV-201 · 2023",
    paragraphs: [
      "Prior cycle efficacy summary for indication Y — not directly transferable to current indication X population.",
    ],
    key_pills: ["RIV-201", "Different indication"],
  },
  "art-sae": {
    id: "art-sae",
    kind: "table",
    title: "Table 12.2.1 — Serious adverse events",
    repo_path: "stats",
    version_label: "CSR Tables v2.3",
    caption: "SAEs by preferred term",
    columns: ["Category", "Rivonorex", "Placebo"],
    rows: [
      ["Any SAE", "4.4%", "5.3%"],
      ["Deaths", "0.5%", "0.5%"],
    ],
    key_pills: ["SAE 4.4%", "Balanced"],
  },
  "art-labs": {
    id: "art-labs",
    kind: "table",
    title: "Table 12.3.4 — Lab shifts",
    repo_path: "stats",
    version_label: "CSR Tables v2.3",
    caption: "Clinically notable laboratory abnormalities",
    columns: ["Parameter", "Rivonorex", "Placebo"],
    rows: [["ALT >3× ULN", "2.4%", "1.9%"]],
    key_pills: ["ALT", "Hepatic"],
  },
  "art-discontinuations": {
    id: "art-discontinuations",
    kind: "table",
    title: "Table 12.1.2 — Discontinuations",
    repo_path: "stats",
    version_label: "CSR Tables v2.3",
    caption: "Discontinuations due to adverse events",
    columns: ["Reason", "Rivonorex", "Placebo"],
    rows: [["AE leading to discontinuation", "7.3%", "4.9%"]],
    key_pills: ["7.3%", "AE disc"],
  },
  "art-prior-safety": {
    id: "art-prior-safety",
    kind: "text",
    title: "Prior label — Warnings",
    repo_path: "prior_submission",
    version_label: "USPI v2.0",
    paragraphs: [
      "Common adverse reactions (≥5%): insomnia, nausea, headache.",
      "Insomnia was reported more frequently with Rivonorex than placebo in clinical trials.",
    ],
    key_pills: ["Insomnia", "USPI"],
  },
  "art-ich-e3-safety": {
    id: "art-ich-e3-safety",
    kind: "text",
    title: "ICH E3 — Section 12",
    repo_path: "guidance",
    version_label: "ICH E3 (R1)",
    paragraphs: [
      "12.1 Display of adverse events by body system and preferred term.",
      "Rates should be presented for treatment and placebo groups with denominators clearly stated.",
    ],
    key_pills: ["ICH E3", "§12 Safety"],
  },
  "art-vitals": {
    id: "art-vitals",
    kind: "table",
    title: "Table 12.4.1 — Vital signs",
    repo_path: "stats",
    version_label: "CSR Tables v2.3",
    caption: "Mean change from baseline in vital signs",
    columns: ["Parameter", "Δ Rivonorex", "Δ Placebo"],
    rows: [
      ["Systolic BP (mmHg)", "+0.2", "+0.4"],
      ["Heart rate (bpm)", "−0.8", "−0.5"],
    ],
    key_pills: ["Vitals", "No signal"],
  },
  "art-sae-detail": {
    id: "art-sae-detail",
    kind: "text",
    title: "CSR Section 12.3 — SAE narratives",
    repo_path: "etmf",
    version_label: "CSR draft v3.2",
    paragraphs: [
      "Narrative summaries for all SAEs reported during the treatment period are provided in Appendix 16.2.",
      "No deaths were considered related to study drug by the investigator.",
    ],
    key_pills: ["SAE narratives", "Appendix 16.2"],
  },
};

export function getArtifact(artifactId: string): SourceArtifact | undefined {
  return sourceArtifacts[artifactId];
}

export function getArtifactForSource(source: { artifact_id: string }): SourceArtifact | undefined {
  return sourceArtifacts[source.artifact_id];
}
