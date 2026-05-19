import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph, type GlyphName } from "@/components/ui/Glyph";

/**
 * Inline agent error / refusal / rate-limit message.
 * Source: Paper sheet · AgentErrorCard (node 75X-0).
 * Covers error, rate_limited, and refusal agent states.
 */

export type AgentErrorTone = "error" | "rate-limited" | "refusal";

export interface AgentErrorCardProps {
  tone?: AgentErrorTone;
  title: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  icon?: GlyphName;
  className?: string;
}

const TONE: Record<AgentErrorTone, { bg: string; border: string; ink: string; defaultIcon: GlyphName }> = {
  error:         { bg: "bg-coral-soft", border: "border-coral", ink: "text-coral", defaultIcon: "x" },
  "rate-limited":{ bg: "bg-gold-soft",  border: "border-gold",  ink: "text-gold",  defaultIcon: "more" },
  refusal:       { bg: "bg-stripe",     border: "border-hairline-strong", ink: "text-muted", defaultIcon: "x" },
};

export function AgentErrorCard({
  tone = "error",
  title,
  body,
  actions,
  icon,
  className,
}: AgentErrorCardProps) {
  const t = TONE[tone];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 py-3 px-3.5 rounded-input border max-w-[480px]",
        t.bg,
        t.border,
        className
      )}
    >
      <Glyph
        name={icon ?? t.defaultIcon}
        size={16}
        strokeWidth={2.5}
        className={cn("mt-0.5 shrink-0", t.ink)}
      />
      <div className="flex-1 flex flex-col gap-1">
        <div className="font-sans font-semibold text-[13.5px] leading-[18px] text-ink">
          {title}
        </div>
        {body && (
          <div className="font-sans text-[12.5px] leading-[18px] text-muted">{body}</div>
        )}
        {actions && <div className="flex gap-2 mt-1">{actions}</div>}
      </div>
    </div>
  );
}
