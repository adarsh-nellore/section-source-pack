"use client";

import type { CitationAnchor } from "@/lib/types";
import { getSource } from "@/lib/mock-data";
import { cn } from "@/lib/cn";
import { Pill } from "@/components/ui/Pill";
import { useSourceHoverHandlers } from "./SourcePreviewContext";

export function NarrativeCitation({
  cite,
  active,
  pulsing,
  onSelect,
}: {
  cite: CitationAnchor;
  active: boolean;
  pulsing: boolean;
  onSelect: () => void;
}) {
  const hover = useSourceHoverHandlers(cite.source_item_id);
  const src = getSource(cite.source_item_id);

  return (
    <span
      {...hover}
      id={`cite-${cite.id}`}
      title={src?.title ?? "Source"}
      className="inline-flex align-baseline mx-0.5"
    >
      <Pill
        variant={active ? "accent" : "outlined"}
        size="sm"
        onClick={onSelect}
        className={cn(active && "ring-2 ring-coral/30", pulsing && "ring-4 ring-coral/40 scale-105")}
      >
        {cite.label}
      </Pill>
    </span>
  );
}
