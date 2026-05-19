"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { Radio } from "@/components/ui/Radio";

/**
 * Clarifying-question card. Source: Paper sheet · MultiStepFlow (node 75V-0).
 * Walkthrough origin: ClarifyCardView (Clarify Q1-Q3 frames).
 * ProgressDots header + question + option list + submit/skip footer.
 */

export interface MultiStepOption {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}

export interface MultiStepFlowProps {
  total: number;
  current: number; // 1-indexed
  stepLabel?: ReactNode;
  question: ReactNode;
  options: MultiStepOption[];
  value?: string;
  onChange?: (value: string) => void;
  onContinue?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  continueLabel?: ReactNode;
  className?: string;
}

export function MultiStepFlow({
  total,
  current,
  stepLabel,
  question,
  options,
  value,
  onChange,
  onContinue,
  onBack,
  onSkip,
  continueLabel = "Continue",
  className,
}: MultiStepFlowProps) {
  const [internal, setInternal] = useState<string | undefined>(value);
  const selected = value ?? internal;
  const handleSelect = (v: string) => {
    onChange?.(v);
    if (value === undefined) setInternal(v);
  };

  return (
    <div
      className={cn(
        "flex flex-col w-[380px] bg-paper border border-hairline-strong rounded-lg overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-2 py-2.5 px-3.5 border-b border-hairline">
        <ProgressDots total={total} current={current} />
        {stepLabel && (
          <span className="font-mono font-bold uppercase tracking-label text-[10px] text-muted">
            {stepLabel}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4 py-4 px-4">
        <div className="font-display italic text-[16px] leading-[22px] text-ink">
          {question}
        </div>
        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <label
                key={opt.value}
                className={cn(
                  "flex items-start gap-2.5 py-2 px-2.5 rounded-sm cursor-pointer transition-colors",
                  isSelected
                    ? "bg-stripe border border-hairline-strong"
                    : "hover:bg-stripe"
                )}
              >
                <Radio
                  className="mt-0.5"
                  checked={isSelected}
                  onChange={() => handleSelect(opt.value)}
                  name="multistep-flow"
                  value={opt.value}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-sans font-medium text-[13px] text-ink">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span className="font-sans text-[12.5px] leading-[17px] text-muted">
                      {opt.description}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between py-2.5 px-3.5 bg-stripe border-t border-hairline">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="py-1.5 px-2.5 font-sans font-medium text-[12.5px] text-muted hover:text-ink"
          >
            Skip
          </button>
        )}
        <div className="ml-auto flex gap-1.5">
          {onBack && current > 1 && (
            <button
              type="button"
              onClick={onBack}
              className="py-1.5 px-3 bg-paper border border-hairline-strong rounded-md font-sans font-medium text-[12.5px] text-ink hover:bg-stripe"
            >
              Back
            </button>
          )}
          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              disabled={!selected}
              className={cn(
                "py-1.5 px-3 rounded-md font-sans font-medium text-[12.5px] text-white",
                selected ? "bg-coral hover:bg-coral/90" : "bg-coral opacity-50 pointer-events-none"
              )}
            >
              {continueLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
