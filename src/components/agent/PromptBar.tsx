"use client";

import { useState, type ReactNode, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";
import { KeyChip } from "@/components/ui/KeyChip";

/**
 * Chat input for copilot rails. Source: Paper sheet · PromptBar (node 75Y-0).
 * Textarea + attach IconButton + send IconButton. Optional attachments row,
 * slash-commands hint, and ⌘↵ submit shortcut display.
 */

export interface PromptBarAttachment {
  id: string;
  label: ReactNode;
  kindBadge?: ReactNode;
}

export interface PromptBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onAttach?: () => void;
  attachments?: PromptBarAttachment[];
  onRemoveAttachment?: (id: string) => void;
  placeholder?: string;
  showShortcut?: boolean;
  showSlashHint?: boolean;
  className?: string;
}

export function PromptBar({
  value,
  onChange,
  onSubmit,
  onAttach,
  attachments,
  onRemoveAttachment,
  placeholder = "Ask Peer…",
  showShortcut = true,
  showSlashHint = true,
  className,
}: PromptBarProps) {
  const [internal, setInternal] = useState("");
  const current = value ?? internal;
  const setCurrent = (v: string) => {
    onChange?.(v);
    if (value === undefined) setInternal(v);
  };
  const hasContent = current.trim().length > 0 || (attachments?.length ?? 0) > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasContent) onSubmit?.(current);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-2 p-3 bg-paper rounded-card border transition-colors focus-within:border-coral focus-within:border-[1.5px]",
        "border-hairline-strong",
        className
      )}
    >
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attachments.map((a) => (
            <span
              key={a.id}
              className="inline-flex items-center gap-1.5 py-1 px-2 bg-stripe border border-hairline-strong rounded-md font-mono text-[11px] text-ink"
            >
              {a.kindBadge}
              <span>{a.label}</span>
              {onRemoveAttachment && (
                <button
                  type="button"
                  aria-label="Remove"
                  onClick={() => onRemoveAttachment(a.id)}
                  className="ml-0.5 font-mono text-[13px] leading-none text-faint hover:text-ink"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      <textarea
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && hasContent) {
            e.preventDefault();
            onSubmit?.(current);
          }
        }}
        rows={2}
        placeholder={placeholder}
        className="w-full resize-none bg-transparent outline-none font-sans text-[13.5px] leading-[20px] text-ink placeholder:text-faint"
      />
      <div className="flex items-center gap-2">
        {onAttach && (
          <button
            type="button"
            onClick={onAttach}
            aria-label="Attach"
            className="inline-flex items-center justify-center size-6 rounded-sm text-muted hover:text-ink hover:bg-stripe"
          >
            <Glyph name="plus" size={14} strokeWidth={2} />
          </button>
        )}
        {showSlashHint && (
          <span className="font-mono text-[11px] text-faint">/ for commands</span>
        )}
        <span className="flex-1" />
        {showShortcut && hasContent && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-faint">
            <KeyChip keys={["⌘", "↵"]} size="sm" />
            send
          </span>
        )}
        <button
          type="submit"
          aria-label="Send"
          disabled={!hasContent}
          className={cn(
            "inline-flex items-center justify-center size-7 rounded-sm transition-colors",
            hasContent
              ? "bg-coral text-white hover:bg-coral/90"
              : "bg-soft text-faint pointer-events-none"
          )}
        >
          <Glyph name="arrow-right" size={12} strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
