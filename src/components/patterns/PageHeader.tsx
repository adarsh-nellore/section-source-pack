import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Cluster } from "@/components/layout/Cluster";
import { Stack } from "@/components/layout/Stack";
import { Caption } from "@/components/ui/Caption";
import { MetaLabel } from "@/components/ui/MetaLabel";
import { MetaText } from "@/components/ui/MetaText";
import { Heading, type HeadingSize } from "@/components/typography/Heading";

/**
 * Canonical page-header pattern.
 * Source: composition contract (docs/COMPOSITION.md rule 4) — the only way
 * to render a page header in this codebase. Encapsulates the recurring
 * "kicker + subtitle + Heading + meta-row" composition that previously
 * drifted between doc-editor (mono subtitle) and longform-reader (Fraunces
 * italic subtitle). After PageHeader exists, both templates use the same
 * molecule and look identical.
 *
 * Layout rules (locked here, not in consumers):
 *   - kicker row (MetaLabel + subtitle) uses Cluster gap="comfortable"
 *     align="baseline"
 *   - vertical rhythm between kicker / title / meta is Stack gap="section"
 *   - subtitleVariant="editorial" opts into Fraunces italic Caption for
 *     intentional editorial flourish (longform reading). Default is mono.
 */

export type PageHeaderSubtitleVariant = "default" | "editorial";

export interface PageHeaderProps {
  /** Uppercase mono kicker (e.g. "SECTION 12.4"). */
  kicker?: ReactNode;
  /** Inline subtitle next to the kicker. */
  subtitle?: ReactNode;
  /** Default = mono MetaText; editorial = Fraunces italic Caption. */
  subtitleVariant?: PageHeaderSubtitleVariant;
  /** Page title. Required. */
  title: ReactNode;
  /** Title size (default `h1`). */
  titleSize?: HeadingSize;
  /** Optional meta row beneath the title (Avatar + edit time + word-count, etc.). */
  meta?: ReactNode;
  /** Optional action slot rendered to the right of the title (e.g. a Button). */
  action?: ReactNode;
  className?: string;
}

export function PageHeader({
  kicker,
  subtitle,
  subtitleVariant = "default",
  title,
  titleSize = "h1",
  meta,
  action,
  className,
}: PageHeaderProps) {
  return (
    <Stack gap="section" className={cn("w-full", className)} as="header">
      {(kicker || subtitle) && (
        <Cluster gap="comfortable" align="baseline">
          {kicker && <MetaLabel tone="muted">{kicker}</MetaLabel>}
          {subtitle && (
            subtitleVariant === "editorial"
              ? <Caption size="md" tone="muted">{subtitle}</Caption>
              : <MetaText size="md" tone="faint">{subtitle}</MetaText>
          )}
        </Cluster>
      )}

      {action ? (
        <Cluster justify="between" align="end" gap="block" wrap={false}>
          <Heading size={titleSize}>{title}</Heading>
          <div className="shrink-0">{action}</div>
        </Cluster>
      ) : (
        <Heading size={titleSize}>{title}</Heading>
      )}

      {meta && (
        <Cluster gap="comfortable" align="center">{meta}</Cluster>
      )}
    </Stack>
  );
}
