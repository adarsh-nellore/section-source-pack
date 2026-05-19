import Link from "next/link";
import { Button, type ButtonProps } from "@/components/ui/Button";

/**
 * LinkButton — code-only composition primitive (no Paper sheet).
 *
 * `LinkButton` is the canonical way to render a navigation Button. It pairs
 * `<Button>` with either Next.js `<Link>` (internal) or `<a target="_blank">`
 * (external) so a navigation Button can't be unwired. Use this anywhere a
 * Button needs to change route. For in-page commands (open a Modal, submit
 * a form, toggle state), use plain `<Button>` with `onClick`.
 */

export interface LinkButtonProps extends Omit<ButtonProps, "onClick"> {
  /** Required href. Internal routes use Next.js Link; external (http/https) renders <a>. */
  href: string;
  /** Open in new tab; sets target="_blank" + rel="noopener noreferrer". */
  external?: boolean;
}

export function LinkButton({ href, external, ...buttonProps }: LinkButtonProps) {
  const isExternal = external || /^https?:\/\//.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex">
        <Button {...buttonProps} />
      </a>
    );
  }

  return (
    <Link href={href} className="inline-flex">
      <Button {...buttonProps} />
    </Link>
  );
}
