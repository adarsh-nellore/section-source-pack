import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph } from "@/components/ui/Glyph";

/**
 * Labeled step sequence.
 * Source: Paper sheet · Stepper (node 8F8-0). Horizontal arrangement for ≤5
 * steps; vertical when each step has a description. Step nodes: done = coral
 * fill with white check, current = coral border + coral-soft halo with inner
 * dot, upcoming = hairline-strong outline on paper.
 */

export type StepperOrientation = "horizontal" | "vertical";

export interface Step {
  id: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface StepperProps {
  steps: Step[];
  /** Index of the current step (0-indexed). */
  current: number;
  orientation?: StepperOrientation;
  /** Callback when a step is clicked (only enabled for completed steps). */
  onStepClick?: (index: number) => void;
  className?: string;
}

type StepState = "done" | "current" | "upcoming";

function stateOf(index: number, current: number): StepState {
  if (index < current) return "done";
  if (index === current) return "current";
  return "upcoming";
}

function StepNode({ state }: { state: StepState }) {
  if (state === "done") {
    return (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-coral shrink-0">
        <Glyph name="check" size={12} strokeWidth={3} className="text-white" />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-paper border-2 border-coral ring-[3px] ring-coral-soft shrink-0">
        <span className="size-2 rounded-full bg-coral" />
      </span>
    );
  }
  return (
    <span className="inline-flex size-6 rounded-full bg-paper border-[1.5px] border-hairline-strong shrink-0" />
  );
}

export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  onStepClick,
  className,
}: StepperProps) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("flex items-start", className)}>
        {steps.map((step, index) => {
          const state = stateOf(index, current);
          const clickable = state === "done" && Boolean(onStepClick);
          return (
            <div key={step.id} className="flex items-start">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(index)}
                className={cn(
                  "flex flex-col items-center w-35 shrink-0 gap-2.5 px-1",
                  clickable ? "cursor-pointer" : "cursor-default"
                )}
              >
                <StepNode state={state} />
                <span
                  className={cn(
                    "font-sans text-[13px] leading-[18px] text-center",
                    state === "current" && "font-medium text-ink",
                    state === "done" && "text-ink",
                    state === "upcoming" && "text-faint"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="font-sans text-[12px] leading-[16px] text-faint text-center">
                    {step.description}
                  </span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className="h-6 flex items-center">
                  <div className="w-20 h-px shrink-0 bg-hairline-strong" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {steps.map((step, index) => {
        const state = stateOf(index, current);
        const isLast = index === steps.length - 1;
        const clickable = state === "done" && Boolean(onStepClick);
        return (
          <div key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center shrink-0 w-6 gap-1">
              <StepNode state={state} />
              {!isLast && <div className="w-px flex-1 min-h-6 bg-hairline-strong" />}
            </div>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick?.(index)}
              className={cn(
                "flex flex-col pt-0.5 pb-4 text-left",
                clickable ? "cursor-pointer" : "cursor-default"
              )}
            >
              <span
                className={cn(
                  "font-sans text-[13px] leading-[18px]",
                  state === "current" && "font-medium text-ink",
                  state === "done" && "text-ink",
                  state === "upcoming" && "text-faint"
                )}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="font-sans text-[12px] leading-[16px] text-faint mt-0.5">
                  {step.description}
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
