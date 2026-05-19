"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph, type GlyphName } from "@/components/ui/Glyph";
import { KeyChip } from "@/components/ui/KeyChip";
import { Hairline } from "@/components/ui/Hairline";

/**
 * Composable action menu. Source: Paper sheet · DropdownMenu (node 68U-0).
 * Trigger + popover with items, section headers, separators, and right-aligned
 * KeyChip hints. Items support leading glyph and danger tone.
 *
 * Stateless option: pass `open` to control externally.
 * Stateful default: clicking trigger toggles the menu.
 */

export interface DropdownMenuItem {
  label: ReactNode;
  icon?: GlyphName;
  shortcut?: ReactNode[];
  trailing?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuSection {
  header?: string;
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  sections: DropdownMenuSection[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "end";
  className?: string;
}

export function DropdownMenu({
  trigger,
  sections,
  open: controlledOpen,
  onOpenChange,
  align = "start",
  className,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    onOpenChange?.(next);
    if (controlledOpen === undefined) setInternalOpen(next);
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <span onClick={() => setOpen(!open)}>{trigger}</span>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-full mt-1.5 z-30 min-w-[240px] p-1.5 bg-paper border border-hairline-strong rounded-input shadow-modal",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="flex flex-col">
              {sIdx > 0 && <Hairline className="my-1" />}
              {section.header && (
                <div className="px-2.5 pt-2 pb-1 font-mono font-bold uppercase tracking-label text-[10px] leading-[14px] text-faint">
                  {section.header}
                </div>
              )}
              {section.items.map((item, iIdx) => (
                <button
                  key={iIdx}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onSelect?.();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 py-2 px-2.5 rounded-sm text-left text-[13.5px] transition-colors",
                    item.danger
                      ? "text-coral hover:bg-coral-soft"
                      : "text-ink hover:bg-stripe",
                    item.disabled && "opacity-50 pointer-events-none"
                  )}
                >
                  {item.icon && (
                    <Glyph
                      name={item.icon}
                      size={14}
                      className={cn("shrink-0", item.danger ? "text-coral" : "text-muted")}
                    />
                  )}
                  <span className="flex-1">{item.label}</span>
                  {item.shortcut && <KeyChip keys={item.shortcut} size="sm" />}
                  {item.trailing && (
                    <span className="font-mono text-[11px] text-faint">{item.trailing}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
