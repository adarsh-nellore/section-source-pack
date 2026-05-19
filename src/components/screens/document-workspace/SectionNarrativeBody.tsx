"use client";

import type { CitationAnchor } from "@/lib/types";
import { getNarrative, getNarrativeParagraphs } from "@/lib/mock-data";
import { Stack } from "@/components/layout/Stack";
import { Body } from "@/components/typography/Body";
import { HallucinationFlag } from "@/components/agent/HallucinationFlag";
import { NarrativeCitation } from "./source-preview/NarrativeCitation";

export function SectionNarrativeBody({
  sectionId,
  activeSourceId,
  pulseCiteId,
  onSelectCitation,
}: {
  sectionId: string;
  activeSourceId: string | null;
  pulseCiteId: string | null;
  onSelectCitation: (sourceId: string, opts?: { newTab?: boolean }) => void;
}) {
  const paragraphs = getNarrativeParagraphs(sectionId);
  const narrative = getNarrative(sectionId);
  const citeMap = new Map<string, CitationAnchor>(
    narrative?.citations.map((c) => [c.id, c]) ?? []
  );

  if (paragraphs?.length) {
    return (
      <Stack gap="block" className="anim-fade-in-1">
        {paragraphs.map((para, i) => (
          <Body key={i} size="body">
            {para.text}{" "}
            {para.citationIds?.map((citeId) => {
              const cite = citeMap.get(citeId);
              if (!cite) return null;
              return (
                <NarrativeCitation
                  key={cite.id}
                  cite={cite}
                  active={activeSourceId === cite.source_item_id}
                  pulsing={pulseCiteId === cite.id}
                  onSelect={(opts) => onSelectCitation(cite.source_item_id, opts)}
                />
              );
            })}
            {para.unverified ? (
              <span className="inline-flex align-baseline ml-1">
                <HallucinationFlag
                  variant="badge"
                  tone="warning"
                  label="Review source"
                />
              </span>
            ) : null}
          </Body>
        ))}
      </Stack>
    );
  }

  return (
    <Body size="body">
      {narrative?.body}{" "}
      {narrative?.citations.map((cite) => (
        <NarrativeCitation
          key={cite.id}
          cite={cite}
          active={activeSourceId === cite.source_item_id}
          pulsing={pulseCiteId === cite.id}
          onSelect={(opts) => onSelectCitation(cite.source_item_id, opts)}
        />
      ))}
    </Body>
  );
}
