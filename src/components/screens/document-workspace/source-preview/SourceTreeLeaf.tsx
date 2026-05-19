"use client";

import type { DragEvent } from "react";
import type { SourceItem } from "@/lib/types";
import { Cluster } from "@/components/layout/Cluster";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { MetaText } from "@/components/ui/MetaText";
import { Body } from "@/components/typography/Body";
import { IconGrip, IconPin, IconTrash } from "@/components/ui/icons";
import { useSourceHoverHandlers } from "./SourcePreviewContext";
import { cn } from "@/lib/cn";

export function SourceTreeLeaf({
  item,
  selected,
  onSelect,
  onPin,
  onDelete,
  onDragReorder,
  isSuggested,
  onPromote,
}: {
  item: SourceItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onPin: (id: string) => void;
  onDelete: (id: string) => void;
  onDragReorder: (sourceId: string) => void;
  isSuggested?: boolean;
  onPromote?: (id: string) => void;
}) {
  const hover = useSourceHoverHandlers(item.id);
  const inText = item.citation_refs.length > 0;

  return (
    <div className="ml-4 group/leaf">
      <div
        {...hover}
        className={cn(
          "flex items-start gap-0.5 rounded px-1 py-1 border-l-2",
          selected
            ? "border-ink bg-soft"
            : "border-transparent hover:bg-paper"
        )}
      >
        <button
          type="button"
          draggable
          onDragStart={(e: DragEvent) => {
            e.dataTransfer.setData("sourceId", item.id);
            e.dataTransfer.setData("reorderOnly", "1");
            onDragReorder(item.id);
          }}
          className="shrink-0 opacity-0 group-hover/leaf:opacity-40 hover:!opacity-100 cursor-grab active:cursor-grabbing p-0.5 text-faint"
          aria-label="Reorder source"
          title="Drag to reorder"
        >
          <IconGrip className="w-3 h-3" />
        </button>

        <button
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex flex-1 items-start gap-1 min-w-0 text-left cursor-pointer"
        >
          <StackColumn item={item} inText={inText} />
        </button>

        <Cluster
          gap="tight"
          className="shrink-0 opacity-0 group-hover/leaf:opacity-100 transition-opacity"
        >
          {isSuggested && onPromote && (
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPromote(item.id);
              }}
            >
              Add
            </Button>
          )}
          {!isSuggested && (
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={item.is_pinned ? "Unpin in folder" : "Pin in folder"}
              title={item.is_pinned ? "Unpin in folder" : "Pin to top of folder"}
              onClick={(e) => {
                e.stopPropagation();
                onPin(item.id);
              }}
              className={item.is_pinned ? "text-green" : undefined}
            >
              <IconPin className="w-3 h-3" />
            </IconButton>
          )}
          {!isSuggested && (
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="Remove from pack"
              title={inText ? "Remove (cited in narrative)" : "Remove from pack"}
              onClick={(e) => {
                e.stopPropagation();
                if (
                  inText &&
                  !globalThis.confirm("This source is cited in the narrative. Remove anyway?")
                )
                  return;
                onDelete(item.id);
              }}
              className="text-faint hover:text-coral"
            >
              <IconTrash className="w-3 h-3" />
            </IconButton>
          )}
        </Cluster>
      </div>
    </div>
  );
}

function StackColumn({ item, inText }: { item: SourceItem; inText: boolean }) {
  return (
    <span className="flex-1 min-w-0">
      <Body size="small" className="block truncate font-medium leading-snug">
        {item.title}
      </Body>
      <Cluster gap="tight" className="mt-0.5 flex-wrap">
        {item.is_pinned && (
          <Badge tone="success" size="sm">
            pinned
          </Badge>
        )}
        {inText && (
          <Badge tone="accent" size="sm">
            in text
          </Badge>
        )}
        {item.is_stale && (
          <Badge tone="danger" size="sm">
            stale
          </Badge>
        )}
        {item.membership === "suggested" && (
          <Badge tone="info" size="sm">
            ai
          </Badge>
        )}
        {item.relevance_score != null &&
          item.relevance_score >= 0.5 &&
          item.relevance_score < 0.75 && (
            <Badge tone="warning" size="sm">
              review
            </Badge>
          )}
      </Cluster>
    </span>
  );
}
