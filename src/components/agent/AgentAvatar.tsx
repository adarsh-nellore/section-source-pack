import { cn } from "@/lib/cn";

/**
 * Branded agent identity. Source: Paper sheet · AgentAvatar (node 6WS-0).
 * Outer coral-soft halo + inner coral dot + name. Replaces generic Avatar
 * when the speaker is an AI agent. Halo color/animation maps to AgentState.
 */

export type AgentAvatarState = "idle" | "thinking" | "awaiting" | "offline";

export interface AgentAvatarProps {
  name?: string;
  state?: AgentAvatarState;
  size?: "sm" | "md";
  trailingNote?: string;
  className?: string;
}

const STATE_HALO: Record<AgentAvatarState, string> = {
  idle:     "bg-coral-soft",
  thinking: "bg-coral-soft ring-2 ring-coral/30 ring-inset animate-pulse",
  awaiting: "bg-gold-soft",
  offline:  "bg-soft",
};

const STATE_DOT: Record<AgentAvatarState, string> = {
  idle:     "bg-coral",
  thinking: "bg-coral",
  awaiting: "bg-gold",
  offline:  "bg-faint",
};

const STATE_NAME: Record<AgentAvatarState, string> = {
  idle:     "text-ink",
  thinking: "text-ink",
  awaiting: "text-ink",
  offline:  "text-faint",
};

const SIZE = {
  sm: { halo: "w-4 h-4",   dot: "w-1.5 h-1.5", text: "text-[14px] leading-[20px]" },
  md: { halo: "w-4.5 h-4.5", dot: "w-2 h-2",   text: "text-[18px] leading-[24px]" },
};

export function AgentAvatar({
  name = "Peer",
  state = "idle",
  size = "md",
  trailingNote,
  className,
}: AgentAvatarProps) {
  const s = SIZE[size];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full shrink-0",
          s.halo,
          STATE_HALO[state]
        )}
      >
        <span className={cn("rounded-full", s.dot, STATE_DOT[state])} />
      </span>
      <span className={cn("font-sans font-medium", s.text, STATE_NAME[state])}>{name}</span>
      {trailingNote && (
        <span className="font-sans text-[13px] text-muted">{trailingNote}</span>
      )}
    </span>
  );
}
