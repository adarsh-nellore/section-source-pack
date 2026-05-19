"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Inline numbered citation in narrative text.
 * Source: Paper sheet · CitationLink (node 6WV-0). Coral-soft mini-pill by
 * default; fills coral on hover and reveals a popover (typically a SourceChip).
 */

export interface CitationLinkProps {
  number: number;
  preview?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function CitationLink({
  number,
  preview,
  href,
  onClick,
  className,
}: CitationLinkProps) {
  const [open, setOpen] = useState(false);
  const Tag = href ? "a" : "button";

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <Tag
        href={href}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center align-super mx-0.5 px-1 min-w-[16px] h-[14px] rounded-xs font-mono font-bold text-[9px] leading-[12px] cursor-pointer transition-colors",
          open
            ? "bg-coral text-white"
            : "bg-coral-soft text-coral hover:bg-coral hover:text-white",
          className
        )}
      >
        {number}
      </Tag>
      {open && preview && (
        <span
          role="tooltip"
          className="absolute top-full left-0 mt-1.5 z-30 pointer-events-none"
        >
          {preview}
        </span>
      )}
    </span>
  );
}
