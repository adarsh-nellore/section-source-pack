import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Bounded centered column. Source: Paper sheet · PageContainer (node 6OZ-0).
 * Max-width sm 640 / md 800 / lg 1024. Use for settings, forms, marketing prose.
 */

export type PageContainerSize = "sm" | "md" | "lg";

export interface PageContainerProps {
  size?: PageContainerSize;
  children?: ReactNode;
  className?: string;
}

const SIZE: Record<PageContainerSize, string> = {
  sm: "max-w-[640px]  py-10 px-8",
  md: "max-w-[800px]  py-14 px-10",
  lg: "max-w-[1024px] py-16 px-12",
};

export function PageContainer({
  size = "sm",
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn("w-full mx-auto", SIZE[size], className)}>{children}</div>
  );
}
