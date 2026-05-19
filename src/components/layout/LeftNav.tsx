"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Glyph, type GlyphName } from "@/components/ui/Glyph";

/**
 * Vertical sidebar nav. Source: Paper sheet · LeftNav (node 6OV-0).
 * Section headers (MetaLabel) + nav items + footer slot.
 * Width is consumer-controlled (typically via AppShell's `leftNavWidth` prop,
 * default 220px). `collapsed` switches to icon-rail content density.
 * Active item: coral-soft bg + coral text + 2px coral leading edge.
 */

export interface NavItem {
  label: ReactNode;
  icon?: GlyphName;
  badge?: ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface NavSection {
  header?: string;
  items: NavItem[];
}

export interface LeftNavProps {
  brand?: ReactNode;
  sections: NavSection[];
  footer?: ReactNode;
  collapsed?: boolean;
  className?: string;
}

export function LeftNav({
  brand,
  sections,
  footer,
  collapsed = false,
  className,
}: LeftNavProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-paper",
        collapsed ? "items-center px-2 py-4" : "px-3 py-4",
        className
      )}
    >
      {brand && (
        <div
          className={cn(
            "flex items-center gap-2 mb-4",
            collapsed ? "justify-center" : "px-2 py-1.5"
          )}
        >
          {brand}
        </div>
      )}
      <nav className={cn("flex flex-col gap-1", collapsed ? "items-center" : "")}>
        {sections.map((section, si) => (
          <div
            key={si}
            className={cn("flex flex-col", si > 0 && !collapsed && "mt-4")}
          >
            {!collapsed && section.header && (
              <div className="font-mono font-bold uppercase tracking-label text-[10px] leading-[14px] text-faint px-2 pt-2 pb-1">
                {section.header}
              </div>
            )}
            {section.items.map((item, ii) => {
              const Tag = item.href ? "a" : "button";
              return (
                <Tag
                  key={ii}
                  href={item.href}
                  onClick={item.onClick}
                  className={cn(
                    "relative flex items-center transition-colors",
                    collapsed
                      ? "justify-center w-9 h-9 rounded-sm"
                      : "gap-2.5 px-2 py-1.75 rounded-sm text-[13.5px]",
                    item.active
                      ? "bg-coral-soft text-coral"
                      : "text-muted hover:text-ink hover:bg-stripe"
                  )}
                >
                  {item.active && !collapsed && (
                    <span className="absolute -left-3 top-2 bottom-2 w-0.5 bg-coral rounded-r-sm" />
                  )}
                  {item.icon && <Glyph name={item.icon} size={15} className="shrink-0" />}
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="font-mono text-[11px] text-faint">{item.badge}</span>
                      )}
                    </>
                  )}
                </Tag>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="flex-1" />
      {footer && (
        <div
          className={cn(
            "border-t border-hairline pt-3 mt-3",
            collapsed ? "flex justify-center" : "px-1"
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
