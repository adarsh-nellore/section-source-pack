import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AgentAvatar } from "@/components/agent/AgentAvatar";
import { ThinkingIndicator } from "@/components/agent/ThinkingIndicator";
import { StreamingCursor } from "@/components/agent/StreamingCursor";

/**
 * Chat turn. Source: Paper sheet · MessageBubble (node 75Q-0).
 * Walkthrough origin: nodes 2GZ-0 (user) and 2H3-0 (assistant).
 * Variants: user (right, stripe bg) · assistant (left, AgentAvatar + meta + body)
 * · thinking · streaming.
 */

export type MessageRole = "user" | "assistant";
export type MessageState = "default" | "thinking" | "streaming";

export interface MessageBubbleProps {
  role?: MessageRole;
  state?: MessageState;
  author?: string;
  timestamp?: string;
  children?: ReactNode;
  className?: string;
}

export function MessageBubble({
  role = "assistant",
  state = "default",
  author,
  timestamp,
  children,
  className,
}: MessageBubbleProps) {
  if (role === "user") {
    return (
      <div className={cn("flex flex-col gap-1 items-end max-w-[320px] ml-auto", className)}>
        <div className="font-mono text-[11px] text-faint">
          {(author ?? "you") + (timestamp ? ` · ${timestamp}` : "")}
        </div>
        <div className="py-2 px-3.5 bg-soft rounded-lg font-sans text-[13px] leading-[19px] text-ink">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 max-w-[360px]", className)}>
      <div className="flex items-center gap-1.5">
        <AgentAvatar size="sm" name={author ?? "peer"} />
        {timestamp && (
          <span className="font-mono text-[11px] text-muted">· {timestamp}</span>
        )}
      </div>
      {state === "thinking" ? (
        <div className="inline-flex self-start py-2 px-3.5 bg-soft rounded-lg">
          <ThinkingIndicator />
        </div>
      ) : (
        <div className="font-sans text-[13px] leading-[20px] text-ink">
          {children}
          {state === "streaming" && <StreamingCursor />}
        </div>
      )}
    </div>
  );
}
