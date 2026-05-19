import { cn } from "@/lib/cn";

/**
 * AI confidence indicator. Source: Paper sheet · ConfidenceBadge (node 6WZ-0).
 * Two variants: badge (compact pill) and bar (horizontal track + percent).
 * Tonal mapping: >=80 = success, >=60 = warning, <60 = danger. Overridable.
 */

export type ConfidenceBadgeVariant = "badge" | "bar";
export type ConfidenceBadgeTone = "success" | "warning" | "danger" | "auto";

export interface ConfidenceBadgeProps {
  value: number; // 0–100
  variant?: ConfidenceBadgeVariant;
  tone?: ConfidenceBadgeTone;
  showLabel?: boolean;
  className?: string;
}

const TONE_BG: Record<Exclude<ConfidenceBadgeTone, "auto">, string> = {
  success: "bg-green-soft text-green",
  warning: "bg-gold-soft  text-gold",
  danger:  "bg-coral-soft text-coral",
};

const TONE_DOT: Record<Exclude<ConfidenceBadgeTone, "auto">, string> = {
  success: "bg-green",
  warning: "bg-gold",
  danger:  "bg-coral",
};

function resolveTone(value: number, tone: ConfidenceBadgeTone) {
  if (tone !== "auto") return tone;
  if (value >= 80) return "success";
  if (value >= 60) return "warning";
  return "danger";
}

const TONE_LABEL: Record<Exclude<ConfidenceBadgeTone, "auto">, string> = {
  success: "high",
  warning: "medium",
  danger:  "low",
};

export function ConfidenceBadge({
  value,
  variant = "badge",
  tone = "auto",
  showLabel = false,
  className,
}: ConfidenceBadgeProps) {
  const resolved = resolveTone(value, tone);

  if (variant === "bar") {
    return (
      <span className={cn("inline-flex items-center gap-3 min-w-[160px]", className)}>
        <span className="flex-1 h-1.5 bg-soft rounded-full overflow-hidden">
          <span
            className={cn("block h-full rounded-full", TONE_DOT[resolved])}
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          />
        </span>
        <span
          className={cn(
            "font-mono font-bold text-[11px] leading-[14px] min-w-[40px] text-right",
            resolved === "success" && "text-green",
            resolved === "warning" && "text-gold",
            resolved === "danger"  && "text-coral"
          )}
        >
          {Math.round(value)}%
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full font-mono font-bold text-[10px] leading-[13px]",
        TONE_BG[resolved],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", TONE_DOT[resolved])} />
      <span>
        {Math.round(value)}%
        {showLabel && ` · ${TONE_LABEL[resolved]}`}
      </span>
    </span>
  );
}
