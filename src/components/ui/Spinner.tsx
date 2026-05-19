import { cn } from "@/lib/cn";

/**
 * Indeterminate progress ring. Source: Paper sheet · Spinner (node 8DX-0).
 * Three-quarter stroke arc that rotates; coral / muted / faintest tones.
 */

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerTone = "coral" | "muted" | "faintest" | "inverse";

export interface SpinnerProps {
  size?: SpinnerSize;
  tone?: SpinnerTone;
  /** Accessible label for screen readers (defaults to "Loading"). */
  label?: string;
  className?: string;
}

const SIZE_PX: Record<SpinnerSize, number> = {
  sm: 12,
  md: 16,
  lg: 24,
};

const TONE: Record<SpinnerTone, string> = {
  coral:    "text-coral",
  muted:    "text-muted",
  faintest: "text-faintest",
  inverse:  "text-paper",
};

export function Spinner({
  size = "md",
  tone = "coral",
  label = "Loading",
  className,
}: SpinnerProps) {
  const px = SIZE_PX[size];
  return (
    <svg
      role="status"
      aria-label={label}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin shrink-0", TONE[tone], className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="48 64"
        strokeLinecap="round"
      />
    </svg>
  );
}
