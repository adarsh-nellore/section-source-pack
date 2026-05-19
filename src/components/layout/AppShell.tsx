import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Top-level application shell. Slots: topBar (56px) + horizontal flex with
 * leftNav (optional) + main (flex-1) + rightRail (optional).
 *
 * Desktop-resilience contract (see docs/LAYOUT.md):
 *   - Supported minimum viewport width is 1280px.
 *   - Outer container is `overflow-x-hidden` so a runaway child never
 *     produces horizontal page scroll. Wide content (tables, code blocks,
 *     etc.) must opt in to horizontal scroll via its own
 *     `overflow-x-auto min-w-0` wrapper.
 *   - Main column carries `min-w-0` so its flex children can shrink below
 *     their intrinsic content width. Do not remove it.
 *
 * Extracted from Paper artboard v2·0 (PeerAIDesign):
 *   outer:    flex flex-col bg-white
 *   top bar:  h-14 px-6 gap-4 border-b border-[#D5DDE3]
 *   body:     flex grow shrink basis-0 w-full min-h-0
 *   doc col:  flex-1 min-w-0
 *   rightRail width: 340px (Paper measured)
 */

export interface AppShellProps {
  topBar?: ReactNode;
  leftNav?: ReactNode;
  rightRail?: ReactNode;
  children?: ReactNode;
  /** Width of the right rail in pixels. Defaults to 340 (Paper spec). */
  rightRailWidth?: number;
  /** Width of the left nav in pixels. Defaults to 220. */
  leftNavWidth?: number;
  className?: string;
}

export function AppShell({
  topBar,
  leftNav,
  rightRail,
  children,
  rightRailWidth = 340,
  leftNavWidth = 220,
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col overflow-x-hidden bg-surface text-ink antialiased",
        className
      )}
    >
      {topBar && <div className="shrink-0">{topBar}</div>}
      <div className="flex grow shrink basis-0 min-h-0 w-full">
        {leftNav && (
          <aside
            className="shrink-0 border-r border-hairline-strong bg-paper"
            style={{ width: leftNavWidth }}
          >
            {leftNav}
          </aside>
        )}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col">{children}</main>
        {rightRail && (
          <aside
            className="shrink-0 border-l border-hairline-strong bg-paper"
            style={{ width: rightRailWidth }}
          >
            {rightRail}
          </aside>
        )}
      </div>
    </div>
  );
}
