/** Extracts markdown links `[text](path)` whose target looks like a wiki-relative path. */
export function extractLinks(markdown: string): string[] {
  const out: string[] = [];
  const re = /\]\((platform\/[^\s)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) out.push(m[1]);
  return out;
}

/** `extractLinks` targets with any `#anchor` stripped — anchors point into a page, existence
 *  is checked per page. Shared by lint and the ingest gates so there is one link-target
 *  extractor, not a second copy of the `#`-stripping logic at each call site. */
export function wikiLinkTargets(markdown: string): string[] {
  return extractLinks(markdown).map((link) => link.split("#")[0]);
}

export interface LinkCheckResult {
  total: number;
  unresolved: { source: string; link: string }[];
}

/**
 * Validates every link found in `filesToScan` resolves to a path in `knownPaths`
 * and stays under `platform/` (design spec, "One path rule"; refresh spec Phase 5.3).
 */
export function checkLinks(
  filesToScan: { path: string; markdown: string }[],
  knownPaths: Set<string>,
): LinkCheckResult {
  const unresolved: { source: string; link: string }[] = [];
  let total = 0;
  for (const { path, markdown } of filesToScan) {
    for (const link of extractLinks(markdown)) {
      total++;
      const target = link.split("#")[0]; // anchors point into a page; existence is per page
      if (!target.startsWith("platform/") || !knownPaths.has(target)) {
        unresolved.push({ source: path, link });
      }
    }
  }
  return { total, unresolved };
}
