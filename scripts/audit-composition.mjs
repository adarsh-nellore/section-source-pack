#!/usr/bin/env node
// scripts/audit-composition.mjs
//
// Enforces docs/COMPOSITION.md: closed-enum typography + layout + patterns
// in src/app/. Greps for forbidden patterns. Exits non-zero on violations
// so the `prebuild` hook fails the build.
//
// Run: npm run audit
//
// To add a rule, append to RULES below.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("../", import.meta.url).pathname;
// Scope: every user-facing page under src/app/ — landing, /templates gallery,
// every individual template route. The /components showcase is explicitly
// excluded; it's an internal demonstration of raw primitives in isolation,
// not a "real" page subject to the composition contract.
const SCAN_ROOTS = ["src/app"];
const SKIP_PATHS = ["src/app/components"];

/** @type {{ id: string; pattern: RegExp; message: string; ignoreInComments?: boolean }[]} */
const RULES = [
  {
    id: "no-arbitrary-font-size",
    pattern: /text-\[\s*[0-9]+(?:\.[0-9]+)?px\s*\]/,
    message: "Use <Heading size> / <Body size> / <MetaText size> / <MetaLabel> / <Caption> instead of text-[Npx].",
  },
  {
    id: "no-raw-heading",
    pattern: /<h[1-6]\b[^>]*className/,
    message: "Use <Heading size='display|h1|h2|h3|h4'> instead of a raw <hN className=...>.",
  },
  {
    id: "no-raw-paragraph",
    pattern: /<p\s+className=/,
    message: "Use <Body size='lead|body|small'> instead of a raw <p className=...>.",
  },
  {
    id: "no-flex-col-gap",
    pattern: /\bflex\s+flex-col\b[^"'`]*\bgap-[0-9]/,
    message: "Use <Stack gap='tight|cozy|comfortable|block|section|page|hero'> instead of flex flex-col gap-N.",
  },
  {
    id: "no-flex-row-gap",
    pattern: /\bflex\s+items-(?:center|baseline|start|end|stretch)\b[^"'`]*\bgap-[0-9]/,
    message: "Use <Cluster gap='…'> instead of flex items-* gap-N.",
  },
  {
    id: "no-hex-color",
    pattern: /#[0-9a-fA-F]{3,8}\b/,
    message: "Use semantic token classes (text-ink, bg-coral, …) instead of inline hex.",
    ignoreInComments: true,
  },
  {
    id: "no-button-with-href",
    pattern: /<Button[^/>]*\shref\s*=/,
    message: "<Button href=...> doesn't navigate — Button is a <button> element. Use <LinkButton href> instead (composes Button with Next.js Link).",
  },
  {
    id: "no-link-styled-as-button",
    // a plain <a> with button-like background tokens — probably should be LinkButton
    pattern: /<a[^>]*className=[^>]*\b(?:bg-coral|bg-primary)\b/,
    message: "Plain <a> tags styled as buttons drift from the contract. Use <LinkButton href variant='primary'> so Button styling stays canonical.",
  },
  {
    id: "no-long-heading-literal",
    // <Heading ...>literal text > 80 chars</Heading>  — single-line case only
    pattern: /<Heading[^>]*>([^<{}\n]{81,})<\/Heading>/,
    message: "<Heading> is for short identifiers. Long content belongs in <Body size='lead|body'>. Keep heading literal text under ~80 chars.",
  },
  {
    id: "no-fixed-wide-width",
    // w-[Npx] where N >= 300. Negative lookbehind excludes max-w- and min-w-
    // (caps and floors are fine; load-bearing fixed widths are the problem).
    // See docs/LAYOUT.md "Desktop resilience".
    pattern: /(?<![-\w])w-\[\s*(?:[3-9][0-9]{2}|[1-9][0-9]{3,})px\s*\]/,
    message: "Fixed widths ≥300px break at 1280px viewports. Use w-[clamp(min,fluid,max)], <SplitFrame>, or max-w-[Npx] w-full for caps.",
  },
];

function isSkipped(absPath) {
  const rel = relative(ROOT, absPath);
  return SKIP_PATHS.some((skip) => rel === skip || rel.startsWith(skip + "/"));
}

async function* walk(dir) {
  if (isSkipped(dir)) return;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* walk(full);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      if (!isSkipped(full)) yield full;
    }
  }
}

/** Strip /* ... *\/ and // ... line comments so JSDoc-mentioned hexes don't trigger. */
function stripComments(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/(^|[^:])\/\/.*$/gm, (m, p) => p + " ".repeat(Math.max(0, m.length - p.length)));
}

async function main() {
  const violations = [];

  for (const scanRoot of SCAN_ROOTS) {
    const absRoot = join(ROOT, scanRoot);
    for await (const file of walk(absRoot)) {
      const raw = await readFile(file, "utf8");
      const lines = raw.split("\n");
      const stripped = (RULES.some((r) => r.ignoreInComments) ? stripComments(raw) : raw).split("\n");

      for (let i = 0; i < lines.length; i++) {
        for (const rule of RULES) {
          const line = rule.ignoreInComments ? stripped[i] : lines[i];
          if (rule.pattern.test(line)) {
            violations.push({
              file: relative(ROOT, file),
              line: i + 1,
              rule: rule.id,
              snippet: lines[i].trim().slice(0, 160),
              fix: rule.message,
            });
          }
        }
      }
    }
  }

  if (violations.length === 0) {
    console.log("✓ composition audit: 0 violations across " + SCAN_ROOTS.join(", ") + (SKIP_PATHS.length ? " (skipping " + SKIP_PATHS.join(", ") + ")" : ""));
    process.exit(0);
  }

  console.error("✗ composition audit: " + violations.length + " violation(s)\n");
  for (const v of violations) {
    console.error("  " + v.file + ":" + v.line + "  [" + v.rule + "]");
    console.error("    " + v.snippet);
    console.error("    → " + v.fix);
    console.error("");
  }
  console.error("See docs/COMPOSITION.md for the full contract.\n");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
