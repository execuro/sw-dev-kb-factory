/**
 * Assembles a directory `index.md` from page frontmatter (design spec, "Ids = wiki-relative
 * paths" / "Index line format"). One line per page, sorted by path.
 */
export interface IndexablePage {
  path: string; // wiki-root-relative, e.g. platform/dev/6.7/guides/.../page.md
  title: string;
  summary: string;
  keywords: string[];
  versions?: string[]; // used for func/index.md's "[6.6, 6.7]" suffix
}

export function indexLine(page: IndexablePage, isFunc: boolean): string {
  const title = isFunc && page.versions?.length ? `${page.title} [${page.versions.join(", ")}]` : page.title;
  return `${page.path} — ${title} — ${page.summary} — ${page.keywords.join(", ")}`;
}

export function buildDirectoryIndex(
  headerTitle: string,
  headerNote: string,
  pages: IndexablePage[],
  isFunc: boolean,
): string {
  const sorted = [...pages].sort((a, b) => a.path.localeCompare(b.path));
  const lines = sorted.map((p) => indexLine(p, isFunc));
  return [
    `# ${headerTitle}`,
    "",
    headerNote,
    "",
    "One line per page: `path — title — summary — keywords`.",
    "",
    ...lines,
    "",
  ].join("\n");
}
