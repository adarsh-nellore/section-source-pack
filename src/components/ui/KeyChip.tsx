import { Children, type ReactNode, Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Keyboard shortcut chip.
 * Source: Paper sheet · KeyChip (node 5KC-0). Net-new — formalizes the
 * keyboard hint pattern used in SearchInput, DropdownMenu items, Tooltip.
 *
 * For paired shortcuts, wrap multiple <KeyChip> in <KeyChipGroup> (or pass
 * an array via `keys` prop on a single KeyChip).
 */

export type KeyChipSize = "sm" | "md";

export interface KeyChipProps {
  children?: ReactNode;
  /** Convenience: pass an array of keys to render a joined group. */
  keys?: ReactNode[];
  size?: KeyChipSize;
  className?: string;
}

const SIZE: Record<KeyChipSize, string> = {
  sm: "min-w-[20px] h-5 px-1.5 text-[11px] leading-[14px] rounded-sm",
  md: "min-w-[24px] h-6 px-2   text-[12px] leading-[14px] rounded-md",
};

function ChipBox({ size, children }: { size: KeyChipSize; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center bg-paper border border-hairline-strong font-mono font-medium text-ink",
        SIZE[size]
      )}
      style={{ boxShadow: "0 1px 0 var(--color-hairline-strong)" }}
    >
      {children}
    </span>
  );
}

export function KeyChip({ children, keys, size = "md", className }: KeyChipProps) {
  if (keys && keys.length > 1) {
    return (
      <span className={cn("inline-flex items-center gap-1", className)}>
        {keys.map((k, i) => (
          <Fragment key={i}>
            <ChipBox size={size}>{k}</ChipBox>
          </Fragment>
        ))}
      </span>
    );
  }
  const content = children ?? keys?.[0];
  return (
    <span className={cn("inline-flex", className)}>
      <ChipBox size={size}>{content}</ChipBox>
    </span>
  );
}
