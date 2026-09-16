/**
 * Tier 0 code index. A deterministic, node-only word/literal/classmap index over the
 * installed `vendor/shopware` packages — no PHP, no docker. Built once per `(coreVersion,
 * vendorHash)` pair and cached; `flagIdentifiers` runs it against wiki markdown to catch
 * stale identifiers before an LLM ever writes a page.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { sha256 } from "../shared/hash.js";
import { readJsonIfExists, writeJson } from "../shared/jsonio.js";
import type { GuidelineCodeCheckout, PlatformConfig } from "../shared/types.js";
import { paths, type Paths } from "../../src/paths.js";

export interface CodeIndex {
  coreVersion: string;
  vendorHash: string;
  /** token -> number of distinct indexed files containing that identifier verbatim. */
  words: Map<string, number>;
  /** quoted dotted strings (tags, config keys) found verbatim anywhere in the index. */
  literals: Set<string>;
  /** fully-qualified `Shopware\(Core|Storefront|Administration)\...` class names from autoload_classmap.php. */
  classes: Set<string>;
  /** every namespace prefix of every class above (never itself flagged absent). */
  namespacePrefixes: Set<string>;
  /** last path segment of every class above (e.g. `EntityExtension`), for short-name `extends`/`implements` matches. */
  shortClassNames: Set<string>;
  /** identifier names (const/method/class/config-node) declared as deprecated. */
  deprecated: Set<string>;
  /** feature-flag name -> number of files reading it (feature.yaml's own declaration excluded). */
  flags: Map<string, number>;
}

interface SerializedCodeIndex {
  coreVersion: string;
  format?: number;
  vendorHash: string;
  words: Record<string, number>;
  literals: string[];
  classes: string[];
  namespacePrefixes: string[];
  shortClassNames: string[];
  deprecated: string[];
  flags: Record<string, number>;
}

const INDEXED_EXTENSIONS = new Set([".php", ".xml", ".yaml", ".yml", ".twig", ".js", ".ts", ".scss"]);
/** Excludes test dirs from the word/literal/deprecated scan (`collectWordsLiteralsDeprecated`)
 *  and from `checkoutContentHash`, so test fixtures never skew word counts or deprecation
 *  detection. Class discovery uses `CLASS_DISCOVERY_EXCLUDED_DIR_NAMES` instead — see there. */
const EXCLUDED_DIR_NAMES = new Set(["node_modules", ".git", "test", "Test", "Tests", "tests"]);
/**
 * Class discovery's own exclusion set (`classesFromCheckoutSource`, `checkoutClassFiles`):
 * `test`/`Test`/`Tests`/`tests` directories are NOT excluded here. In an installed `vendor/`
 * tree, classes came from composer's `autoload_classmap.php`, which this exclusion could
 * never have affected — third-party test helpers never ship there. In a raw git checkout,
 * class discovery walks the filesystem directly, and Shopware ships production test helpers
 * under `Test`/`Tests` (`Shopware\Core\Framework\Test\TestCaseBase\IntegrationTestBehaviour`,
 * `Shopware\Core\Test\Stub\...`) that plugin developers genuinely `use` — excluding them made
 * checkout mode see classes vendor mode never lost. Deliberately a second set, not a loosened
 * `EXCLUDED_DIR_NAMES`: the word/literal/deprecated scan must keep excluding test fixtures.
 */
const CLASS_DISCOVERY_EXCLUDED_DIR_NAMES = new Set(["node_modules", ".git"]);

/**
 * The root holding the installed `vendor/` the Tier-0 code check reads.
 *
 * Replaces the old `findProjectRoot`, which walked up from `process.cwd()` until it found a
 * `vendor/composer/installed.json`. That walk is exactly what made the factory unrunnable from a
 * fresh clone — it only ever worked because the factory happened to sit inside a Shopware project,
 * and it silently picked up whatever project it was started under.
 *
 * Precedence, all anchored on the factory root and never on the cwd:
 *   1. `codeCheck.projectRoot` — the explicit escape hatch, may deliberately leave the repo.
 *   2. `.sources/shopware/<version>` for each configured version, if one carries a vendor tree.
 * `undefined` when neither does, which callers treat as "no code check available".
 */
export function resolveVendorRoot(config: PlatformConfig, p: Paths = paths): string | undefined {
  if (config.codeCheck?.projectRoot) return resolve(p.root, config.codeCheck.projectRoot);
  for (const version of config.guidelines?.versions ?? []) {
    const root = p.shopwareSourceRoot(version);
    if (vendorPresent(root)) return root;
  }
  return undefined;
}

export function vendorPresent(projectRoot: string): boolean {
  return existsSync(resolve(projectRoot, "vendor/composer/installed.json"));
}

function packageRoots(projectRoot: string): string[] {
  return [
    resolve(projectRoot, "vendor/shopware/core"),
    resolve(projectRoot, "vendor/shopware/storefront"),
    resolve(projectRoot, "vendor/shopware/administration/Resources/app/administration/src"),
  ].filter((p) => existsSync(p));
}

function walkFiles(dir: string, excludedDirNames: Set<string> = EXCLUDED_DIR_NAMES): string[] {
  const out: string[] = [];
  let entries: import("node:fs").Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (excludedDirNames.has(entry.name)) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, excludedDirNames));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** `walkFiles` for class discovery only (`classesFromCheckoutSource`, `checkoutClassFiles`) —
 *  see `CLASS_DISCOVERY_EXCLUDED_DIR_NAMES`. */
function walkFilesForClassDiscovery(dir: string): string[] {
  return walkFiles(dir, CLASS_DISCOVERY_EXCLUDED_DIR_NAMES);
}

function coreVersionFromInstalled(projectRoot: string): string {
  const installed = readJsonIfExists<{ packages: { name: string; version_normalized?: string; version?: string }[] }>(
    resolve(projectRoot, "vendor/composer/installed.json"),
  );
  const core = installed?.packages.find((p) => p.name === "shopware/core");
  return core?.version_normalized ?? core?.version ?? "0.0.0.0";
}

function classesFromClassmap(projectRoot: string): { classes: Set<string>; namespacePrefixes: Set<string>; shortClassNames: Set<string> } {
  const classes = new Set<string>();
  const namespacePrefixes = new Set<string>();
  const shortClassNames = new Set<string>();
  const path = resolve(projectRoot, "vendor/composer/autoload_classmap.php");
  if (!existsSync(path)) return { classes, namespacePrefixes, shortClassNames };
  const text = readFileSync(path, "utf8");
  for (const m of text.matchAll(/'((?:[A-Za-z0-9_]+\\\\)+[A-Za-z0-9_]+)'\s*=>/g)) {
    const fqcn = m[1].replace(/\\\\/g, "\\");
    if (!/^Shopware\\(Core|Storefront|Administration)\\/.test(fqcn)) continue;
    classes.add(fqcn);
    const parts = fqcn.split("\\");
    for (let i = 1; i < parts.length; i++) namespacePrefixes.add(parts.slice(0, i).join("\\"));
    shortClassNames.add(parts[parts.length - 1]);
  }
  return { classes, namespacePrefixes, shortClassNames };
}

/** Every UPPER_SNAKE flag `- name: FOO` under `feature.yaml`'s `flags:` list. */
function flagNamesFromFeatureYaml(text: string): string[] {
  const names: string[] = [];
  for (const m of text.matchAll(/-\s*name:\s*([A-Z][A-Z0-9_]{2,})\b/g)) names.push(m[1]);
  return names;
}

const TOKEN_RE = /[A-Za-z_][A-Za-z0-9_]*/g;
const LITERAL_RE = /(['"])([A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)+)\1/g;
const SHOPWARE_DOTTED_RE = /\bshopware\.[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+/g;
/** Bump when the serialized index shape or its extraction rules change, so stale caches are rebuilt. */
const INDEX_FORMAT = 4;
const DEPRECATED_DOC_RE = /@deprecated|#\[Deprecated/;
const SET_DEPRECATED_RE = /->setDeprecated\(/;
const NODE_NAME_RE = /->\w+Node\(\s*['"]([\w.\-]+)['"]\)/;
const NAME_AFTER_DOC_RES = [
  /(?:public|protected|private)?\s*const\s+([A-Z_][A-Z0-9_]*)/,
  /function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/,
  /class\s+([A-Za-z_][A-Za-z0-9_]*)/,
];

/** Shared word/literal/deprecated pass over a set of package roots — every indexed file is
 *  read exactly once. Used by both `buildCodeIndex` (installed `vendor/`) and
 *  `buildCodeIndexFromCheckout` (pinned tag checkout). */
function collectWordsLiteralsDeprecated(roots: string[]): { words: Map<string, number>; literals: Set<string>; deprecated: Set<string> } {
  const words = new Map<string, number>();
  const literals = new Set<string>();
  const deprecated = new Set<string>();

  for (const root of roots) {
    for (const file of walkFiles(root)) {
      const ext = file.slice(file.lastIndexOf("."));
      if (!INDEXED_EXTENSIONS.has(ext)) continue;
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }

      const seen = new Set<string>();
      for (const m of text.matchAll(TOKEN_RE)) seen.add(m[0]);
      for (const token of seen) words.set(token, (words.get(token) ?? 0) + 1);

      for (const m of text.matchAll(LITERAL_RE)) literals.add(m[2]);
      // Unquoted too: container parameters (`%shopware.cart.expire_days%`) and XML text nodes.
      for (const m of text.matchAll(SHOPWARE_DOTTED_RE)) literals.add(m[0]);

      collectDeprecated(text, deprecated);
    }
  }

  return { words, literals, deprecated };
}

/** `- name: FOO` reader count, excluding `feature.yaml`'s own declaring line (shared by both
 *  modes: feature.yaml is always one of the indexed files, so `words` always counts it once). */
function flagsFromWords(words: Map<string, number>, flagNames: string[]): Map<string, number> {
  const flags = new Map<string, number>();
  for (const name of flagNames) flags.set(name, Math.max(0, (words.get(name) ?? 0) - 1));
  return flags;
}

/** Builds the raw (un-cached) index by walking every package root once. */
export function buildCodeIndex(projectRoot: string): CodeIndex {
  const coreVersion = coreVersionFromInstalled(projectRoot);
  const installedJsonPath = resolve(projectRoot, "vendor/composer/installed.json");
  const classmapPath = resolve(projectRoot, "vendor/composer/autoload_classmap.php");
  const vendorHash = sha256(
    (existsSync(installedJsonPath) ? readFileSync(installedJsonPath) : Buffer.alloc(0)).toString("utf8") +
      (existsSync(classmapPath) ? readFileSync(classmapPath) : Buffer.alloc(0)).toString("utf8"),
  );

  const { classes, namespacePrefixes, shortClassNames } = classesFromClassmap(projectRoot);
  const { words, literals, deprecated } = collectWordsLiteralsDeprecated(packageRoots(projectRoot));

  const featureYamlPath = resolve(projectRoot, "vendor/shopware/core/Framework/Resources/config/packages/feature.yaml");
  const flagNames = existsSync(featureYamlPath) ? flagNamesFromFeatureYaml(readFileSync(featureYamlPath, "utf8")) : [];
  const flags = flagsFromWords(words, flagNames);

  return { coreVersion, vendorHash, words, literals, classes, namespacePrefixes, shortClassNames, deprecated, flags };
}

/** Package roots inside a pinned-tag checkout (`sync.ts`'s `.cache/code/<v>/`), mirroring
 *  `packageRoots`'s installed-`vendor/` layout one level up (no `vendor/shopware/<pkg>` prefix —
 *  the checkout's own `src/` is the package root). */
function checkoutPackageRoots(checkoutRoot: string): string[] {
  return [
    resolve(checkoutRoot, "src/Core"),
    resolve(checkoutRoot, "src/Storefront"),
    resolve(checkoutRoot, "src/Administration/Resources/app/administration/src"),
  ].filter((p) => existsSync(p));
}

const NAMESPACE_DECL_RE = /^namespace\s+([A-Za-z0-9_\\]+);/m;
const TYPE_DECL_RE = /^[ \t]*(?:abstract\s+|final\s+|readonly\s+)*(?:class|interface|trait|enum)\s+([A-Za-z_][A-Za-z0-9_]*)/gm;

/**
 * `classesFromClassmap`'s checkout-mode equivalent: there is no composer-generated
 * `autoload_classmap.php` in a raw git checkout, so classes are derived straight from each
 * PHP file's own `namespace`/`class`/`interface`/`trait`/`enum` declarations instead.
 */
function classesFromCheckoutSource(checkoutRoot: string): { classes: Set<string>; namespacePrefixes: Set<string>; shortClassNames: Set<string> } {
  const classes = new Set<string>();
  const namespacePrefixes = new Set<string>();
  const shortClassNames = new Set<string>();
  for (const root of checkoutPackageRoots(checkoutRoot)) {
    for (const file of walkFilesForClassDiscovery(root)) {
      if (!file.endsWith(".php")) continue;
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const nsMatch = NAMESPACE_DECL_RE.exec(text);
      if (!nsMatch || !/^Shopware\\(Core|Storefront|Administration)\\/.test(nsMatch[1] + "\\")) continue;
      for (const m of text.matchAll(TYPE_DECL_RE)) {
        const fqcn = `${nsMatch[1]}\\${m[1]}`;
        classes.add(fqcn);
        const parts = fqcn.split("\\");
        for (let i = 1; i < parts.length; i++) namespacePrefixes.add(parts.slice(0, i).join("\\"));
        shortClassNames.add(parts[parts.length - 1]);
      }
    }
  }
  return { classes, namespacePrefixes, shortClassNames };
}

/** Deterministic `vendorHash`-analog for a checkout: sha256 over the sorted
 *  `relativePath:sha256(content)` of every indexed file. Chosen over re-deriving the tag's
 *  commit sha (which would cost another GitHub API round trip) because every one of these
 *  files is already read in full to build the index — this is the bytes the index was
 *  actually built from, at no extra I/O cost. */
function checkoutContentHash(checkoutRoot: string): string {
  const entries: string[] = [];
  for (const root of checkoutPackageRoots(checkoutRoot)) {
    for (const file of walkFiles(root)) {
      const ext = file.slice(file.lastIndexOf("."));
      if (!INDEXED_EXTENSIONS.has(ext)) continue;
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      entries.push(`${file.slice(checkoutRoot.length)}:${sha256(text)}`);
    }
  }
  entries.sort();
  return sha256(entries.join("\n"));
}

/** Checkout-mode entry point, the default for a version served by a pinned checkout: `coreVersion` is the tag name with a
 *  leading `v` stripped, `vendorHash` is `checkoutContentHash`. Keeps the installed-`vendor/`
 *  path (`buildCodeIndex`) untouched. */
export function buildCodeIndexFromCheckout(checkoutRoot: string, tag: string): CodeIndex {
  const coreVersion = tag.replace(/^v/, "");
  const vendorHash = checkoutContentHash(checkoutRoot);
  const { classes, namespacePrefixes, shortClassNames } = classesFromCheckoutSource(checkoutRoot);
  const { words, literals, deprecated } = collectWordsLiteralsDeprecated(checkoutPackageRoots(checkoutRoot));

  const featureYamlPath = resolve(checkoutRoot, "src/Core/Framework/Resources/config/packages/feature.yaml");
  const flagNames = existsSync(featureYamlPath) ? flagNamesFromFeatureYaml(readFileSync(featureYamlPath, "utf8")) : [];
  const flags = flagsFromWords(words, flagNames);

  return { coreVersion, vendorHash, words, literals, classes, namespacePrefixes, shortClassNames, deprecated, flags };
}

/** Loads the cached checkout index, keyed by `(coreVersion, tag)` — cheaper than re-validating
 *  by `vendorHash`, since computing that hash already costs the whole walk this cache exists
 *  to avoid; the `.tag` file `sync.ts` writes is the freshness signal instead. */
export function loadOrBuildCodeIndexForCheckout(checkoutRoot: string, tag: string, cacheDir: string): CodeIndex {
  const coreVersion = tag.replace(/^v/, "");
  const cacheFile = resolve(cacheDir, `checkout-${coreVersion}.json`);
  const cached = readJsonIfExists<SerializedCodeIndex & { tag?: string }>(cacheFile);
  if (cached && cached.format === INDEX_FORMAT && cached.tag === tag) return deserialize(cached);

  const index = buildCodeIndexFromCheckout(checkoutRoot, tag);
  writeJson(cacheFile, { ...serialize(index), tag });
  return index;
}

function codeMajorOf(version: string): string {
  return version.split(".").slice(0, 2).join(".");
}

/**
 * Where `version`'s pinned source checkout actually lives.
 *
 * `.sources/shopware/<version>` is where `npm run setup` puts it;
 * `.cache/code/<version>` is where `wiki:sync` used to. Prefer the former, fall back to the latter,
 * so the two can land in either order and an un-adopted cache keeps working.
 *
 * Exported because every caller must agree: recomputing the root from a bare cache dir is how
 * `resolveGuidelineCodeContext` came to read a `.tag` that setup had already moved away.
 */
export function checkoutRootFor(version: string, codeCacheDir: string, p: Paths = paths): string | undefined {
  return [p.shopwareSourceRoot(version), resolve(codeCacheDir, version)].find((c) => existsSync(resolve(c, ".tag")));
}

export interface CodeRoot {
  mode: "vendor" | "checkout";
  packageRoots: { core: string; storefront: string; administration: string };
  /** `${coreVersion}+${vendorHash.slice(0,8)}` — same shape as pages.ts's `codeCheckedAgainst`
   *  hash and `StatePageEntry.codeHash`. */
  codeVersion: string;
}

/**
 * Resolves which of the installed `vendor/` or a pinned `guidelines.codeCheckouts` checkout
 * backs `version`'s code-check. One
 * resolver shared by both modes: `null` when `version` is neither the installed major nor a
 * configured checkout with a synced `.tag`.
 */
export function codeRootFor(
  version: string,
  config: { guidelines?: { codeCheckouts: Record<string, GuidelineCodeCheckout> } },
  projectRoot: string,
  codeCacheDir: string,
  p: Paths = paths,
): CodeRoot | null {
  if (vendorPresent(projectRoot)) {
    const installedMajor = codeMajorOf(coreVersionFromInstalled(projectRoot));
    if (version === installedMajor) {
      const index = loadOrBuildCodeIndex(projectRoot, codeCacheDir);
      return {
        mode: "vendor",
        packageRoots: {
          core: resolve(projectRoot, "vendor/shopware/core"),
          storefront: resolve(projectRoot, "vendor/shopware/storefront"),
          administration: resolve(projectRoot, "vendor/shopware/administration/Resources/app/administration/src"),
        },
        codeVersion: `${index.coreVersion}+${index.vendorHash.slice(0, 8)}`,
      };
    }
  }

  const checkout = config.guidelines?.codeCheckouts?.[version];
  if (!checkout) return null;
  // `.sources/shopware/<version>` is where `npm run setup` puts a pinned checkout;
  // `.cache/code/<version>` is where `wiki:sync` used to put it. Prefer the former and fall back to
  // the latter, so the two steps can land in either order and an existing cache keeps working until
  // setup adopts it.
  const checkoutRoot = checkoutRootFor(version, codeCacheDir, p);
  if (!checkoutRoot) return null;
  const tag = readFileSync(resolve(checkoutRoot, ".tag"), "utf8").trim();
  const index = loadOrBuildCodeIndexForCheckout(checkoutRoot, tag, codeCacheDir);
  return {
    mode: "checkout",
    packageRoots: {
      core: resolve(checkoutRoot, "src/Core"),
      storefront: resolve(checkoutRoot, "src/Storefront"),
      administration: resolve(checkoutRoot, "src/Administration/Resources/app/administration/src"),
    },
    codeVersion: `${index.coreVersion}+${index.vendorHash.slice(0, 8)}`,
  };
}

export interface CodeContext {
  root: CodeRoot;
  index: CodeIndex;
}

/**
 * Resolves both the `CodeRoot` and its backing `CodeIndex` for `version`, in whichever mode
 * `codeRootFor` picks — the shared resolver every phase that runs Tier 0 (pages.ts, build.ts,
 * lint.ts) needs, so none of them has to duplicate `codeRootFor`'s own internal index load.
 * `guidelines.ts` keeps its own richer `resolveGuidelineCodeContext` (it also needs the wider
 * `code:` sourceInput package roots, not just the narrower index-scan dirs `CodeRoot` carries).
 */
export function resolveCodeIndexContext(
  version: string,
  config: { guidelines?: { codeCheckouts: Record<string, GuidelineCodeCheckout> } },
  projectRoot: string,
  codeCacheDir: string,
  p: Paths = paths,
): CodeContext | undefined {
  const root = codeRootFor(version, config, projectRoot, codeCacheDir, p);
  if (!root) return undefined;
  if (root.mode === "vendor") return { root, index: loadOrBuildCodeIndex(projectRoot, codeCacheDir) };
  const checkoutRoot = checkoutRootFor(version, codeCacheDir, p);
  if (!checkoutRoot) return undefined; // codeRootFor already found one; kept defensive, not reachable in practice
  const tag = readFileSync(resolve(checkoutRoot, ".tag"), "utf8").trim();
  return { root, index: loadOrBuildCodeIndexForCheckout(checkoutRoot, tag, codeCacheDir) };
}

/** `vendor/shopware/<pkg>/<rest>` prefixes the page.md prompt and the committed corpus write
 *  citations against, longest (administration's, which nests a package) first so a shorter
 *  prefix never shadows it. */
const CITATION_PACKAGE_PREFIXES: { prefix: string; pkg: keyof CodeRoot["packageRoots"] }[] = [
  { prefix: "vendor/shopware/administration/Resources/app/administration/src/", pkg: "administration" },
  { prefix: "vendor/shopware/core/", pkg: "core" },
  { prefix: "vendor/shopware/storefront/", pkg: "storefront" },
];

/**
 * Maps a `## Code check` citation written in the `vendor/shopware/...` vocabulary (page.md,
 * the committed corpus) onto the real file backing `root` — the installed `vendor/` tree
 * (vendor mode) or the pinned checkout (checkout mode). `vendor/shopware/...` stays the one
 * citation vocabulary writers and the corpus use in both modes; only the resolution target
 * moves, mirroring how `guidelines.ts`'s `resolveGuidelineCitationPath` maps its own
 * `<core|storefront|administration>/...` vocabulary onto `packageRoots`. `undefined` for a
 * citation that does not start with one of the three known package prefixes.
 */
export function resolveCodeCitationPath(root: CodeRoot, citationPath: string): string | undefined {
  for (const { prefix, pkg } of CITATION_PACKAGE_PREFIXES) {
    if (citationPath.startsWith(prefix)) return resolve(root.packageRoots[pkg], citationPath.slice(prefix.length));
  }
  return undefined;
}

function collectDeprecated(text: string, deprecated: Set<string>): void {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (DEPRECATED_DOC_RE.test(line)) {
      for (let j = i; j <= Math.min(i + 3, lines.length - 1); j++) {
        for (const re of NAME_AFTER_DOC_RES) {
          const m = re.exec(lines[j]);
          if (m) deprecated.add(m[1]);
        }
      }
    }
    if (SET_DEPRECATED_RE.test(line)) {
      for (let j = i; j >= Math.max(0, i - 3); j--) {
        const m = NODE_NAME_RE.exec(lines[j]);
        if (m) {
          // Bare name for the gate's "confirmed on a deprecated token" check; `config:` form so
          // config-key flagging never matches an unrelated @deprecated method of the same name.
          deprecated.add(m[1]);
          deprecated.add(`config:${m[1]}`);
          break;
        }
      }
    }
  }
}

export function cacheFilePathFor(cacheDir: string, coreVersion: string, vendorHash: string): string {
  return resolve(cacheDir, `${coreVersion}-${vendorHash.slice(0, 8)}.json`);
}

function serialize(index: CodeIndex): SerializedCodeIndex {
  return {
    format: INDEX_FORMAT,
    coreVersion: index.coreVersion,
    vendorHash: index.vendorHash,
    words: Object.fromEntries(index.words),
    literals: [...index.literals],
    classes: [...index.classes],
    namespacePrefixes: [...index.namespacePrefixes],
    shortClassNames: [...index.shortClassNames],
    deprecated: [...index.deprecated],
    flags: Object.fromEntries(index.flags),
  };
}

function deserialize(s: SerializedCodeIndex): CodeIndex {
  return {
    coreVersion: s.coreVersion,
    vendorHash: s.vendorHash,
    words: new Map(Object.entries(s.words)),
    literals: new Set(s.literals),
    classes: new Set(s.classes),
    namespacePrefixes: new Set(s.namespacePrefixes),
    shortClassNames: new Set(s.shortClassNames),
    deprecated: new Set(s.deprecated),
    flags: new Map(Object.entries(s.flags)),
  };
}

/** Loads the cached index for `projectRoot`'s current `(coreVersion, vendorHash)`, building and caching it if absent or stale. */
export function loadOrBuildCodeIndex(projectRoot: string, cacheDir: string): CodeIndex {
  const coreVersion = coreVersionFromInstalled(projectRoot);
  const installedJsonPath = resolve(projectRoot, "vendor/composer/installed.json");
  const classmapPath = resolve(projectRoot, "vendor/composer/autoload_classmap.php");
  const vendorHash = sha256(
    (existsSync(installedJsonPath) ? readFileSync(installedJsonPath) : Buffer.alloc(0)).toString("utf8") +
      (existsSync(classmapPath) ? readFileSync(classmapPath) : Buffer.alloc(0)).toString("utf8"),
  );
  const cacheFile = cacheFilePathFor(cacheDir, coreVersion, vendorHash);
  const cached = readJsonIfExists<SerializedCodeIndex>(cacheFile);
  if (cached && cached.vendorHash === vendorHash && cached.format === INDEX_FORMAT) return deserialize(cached);

  const index = buildCodeIndex(projectRoot);
  writeJson(cacheFile, serialize(index));
  return index;
}

export interface FlagResult {
  absent: string[];
  deprecated: string[];
  unread: string[];
}

/** Tier 0 flags a `## Code check` section must cover. */
export function flagCount(flags: FlagResult): number {
  return flags.absent.length + flags.deprecated.length + flags.unread.length;
}

const FQCN_RE = /\bShopware\\(?:Core|Storefront|Administration)\\[A-Za-z0-9_\\]+/g;
const CLASS_MEMBER_RE = /\b([A-Za-z_][A-Za-z0-9_\\]*)::([A-Za-z_][A-Za-z0-9_]*)/g;
const EXTENDS_IMPLEMENTS_RE = /\b(?:extends|implements)\s+([A-Za-z0-9_\\]+)/;
/** `your`/`example`/`custom`/`acme` anywhere in the leaf (original filter's substring shape,
 *  kept for `getExampleData`-style docs method names). */
const PLACEHOLDER_SUBSTRING_RE = /your|example|custom|acme/i;
/** `Foo`/`Bar`/`My` only as their own camelCase/PascalCase segment (`FooBar`, `MyPlugin`,
 *  bare `Foo`) — unlike the substring words above, these are common enough as real-word
 *  fragments (`Barcode`, `Toolbar`) that a bare substring match would false-positive. */
const PLACEHOLDER_SEGMENT_RE = /(?:^|[a-z0-9_])(?:Foo|Bar|My)(?=[A-Z]|_|$)/;

/**
 * Whether `name` (a bare identifier, a `Shopware\...\X` FQCN, or a dotted config key) is a
 * docs-example placeholder rather than a real code identifier — `Your*`/`Example*`/`My*`/
 * `Foo`/`Bar`/`Acme`, judged on the identifier's own last segment (namespace/dotted-key
 * aware), plus a literal `<...>` placeholder token. The guidelines phase reuses this filter for
 * its docs-only flagging, to keep the number of flags down. */
export function isPlaceholderIdentifier(name: string): boolean {
  const trimmed = name.trim();
  if (/^<[^<>]*>$/.test(trimmed)) return true;
  const leaf = trimmed.split(/[\\.]/).filter(Boolean).pop() ?? trimmed;
  return PLACEHOLDER_SUBSTRING_RE.test(leaf) || PLACEHOLDER_SEGMENT_RE.test(leaf);
}
/** Public/protected only: a private method in a docs example cannot be an override of the base class. */
const FUNCTION_DECL_RE = /\b(?:public|protected)\s+(?:static\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
const DOTTED_KEY_RE = /\bshopware\.[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+\b/g;
const UPPER_SNAKE_RE = /\b[A-Z][A-Z0-9_]{3,}\b/g;

interface CodeSpan {
  content: string;
  lang?: string;
}

function extractCodeSpans(markdown: string): CodeSpan[] {
  const spans: CodeSpan[] = [];
  for (const m of markdown.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)) spans.push({ content: m[2], lang: m[1].trim().toLowerCase() });
  for (const m of markdown.matchAll(/`([^`\n]+)`/g)) spans.push({ content: m[1] });
  return spans;
}

/**
 * YAML keys that carry a value (`key: value`). Section headers (`http_cache:`) are skipped: config
 * deprecations are indexed by leaf name only, and section names repeat at different tree depths.
 */
const YAML_KEY_RE = /^[ \t]*([a-z][a-z0-9]*(?:_[a-z0-9]+)*)[ \t]*:(?!:)[ \t]*[^\s#]/gm;

function trimTrailingPunct(token: string): string {
  return token.replace(/[^A-Za-z0-9_\\]+$/, "");
}

function isInstalledClass(name: string, index: CodeIndex): boolean {
  return index.classes.has(name.replace(/^\\/, "")) || index.shortClassNames.has(name.split("\\").pop()!);
}

function isWordPresent(index: CodeIndex, name: string): boolean {
  return (index.words.get(name) ?? 0) > 0;
}

/**
 * Flags Shopware-shaped identifiers in `markdown` that the installed code contradicts
 * (plan "Design > Tier 0"). Conservative by construction: member/config-key checks are
 * scoped to fenced/inline code spans, so ordinary prose never triggers a false absent.
 */
export function flagIdentifiers(markdown: string, index: CodeIndex): FlagResult {
  const absent = new Set<string>();
  const deprecatedOut = new Set<string>();
  const unread = new Set<string>();
  const literalPrefixes = new Set<string>();
  for (const l of index.literals) {
    for (let i = l.indexOf("."); i > 0; i = l.indexOf(".", i + 1)) literalPrefixes.add(l.slice(0, i));
  }

  for (const raw of markdown.matchAll(FQCN_RE)) {
    const fqcn = trimTrailingPunct(raw[0]).replace(/\\+$/, "");
    if (index.classes.has(fqcn)) {
      if (index.deprecated.has(fqcn) || index.deprecated.has(fqcn.split("\\").pop()!)) deprecatedOut.add(fqcn);
      continue;
    }
    if (index.namespacePrefixes.has(fqcn)) continue; // a namespace, not a class — never flagged
    if (isPlaceholderIdentifier(fqcn)) continue; // e.g. Shopware\Core\...\YourPlugin — a docs example, not a claim
    absent.add(fqcn);
  }

  const spans = extractCodeSpans(markdown);
  for (const { content, lang } of spans) {
    // Only members of a class the installed code defines: other receivers (Symfony, Doctrine,
    // extensions outside vendor/shopware) are not in the index and would be false absents.
    for (const m of content.matchAll(CLASS_MEMBER_RE)) {
      if (m[2] === "class" || !isInstalledClass(trimTrailingPunct(m[1]), index)) continue;
      classifyMember(m[2], index, absent, deprecatedOut);
    }
    // YAML keys only under a top-level `shopware:` tree — framework/doctrine/etc. keys are not indexed.
    if ((lang === "yaml" || lang === "yml") && /^shopware:/m.test(content)) {
      // Deprecation only: YAML map keys are often user-chosen names (connection or policy names), so
      // "absent" would be noise; the dotted-key rule below covers absent config keys.
      for (const m of content.matchAll(YAML_KEY_RE)) {
        if (index.deprecated.has(`config:${m[1]}`)) deprecatedOut.add(m[1]);
      }
    }

    const extendsMatch = EXTENDS_IMPLEMENTS_RE.exec(content);
    if (extendsMatch) {
      const base = trimTrailingPunct(extendsMatch[1]);
      if (isInstalledClass(base, index)) {
        for (const m of content.matchAll(FUNCTION_DECL_RE)) {
          if (isPlaceholderIdentifier(m[1])) continue; // the docs' own example methods, not overrides
          classifyMember(m[1], index, absent, deprecatedOut);
        }
      }
    }
  }

  for (const m of markdown.matchAll(DOTTED_KEY_RE)) {
    const key = m[0];
    if (isPlaceholderIdentifier(key)) continue;
    if (index.literals.has(key)) continue;
    // A parent of a known key (`shopware.cart.storage` of `shopware.cart.storage.type`) is real.
    // No sibling rule: config-tree keys defined only by the Symfony builder never appear as
    // literals, so "siblings exist, this leaf is not a literal" would flag real keys.
    if (literalPrefixes.has(key)) continue;
    const leaf = key.slice(key.lastIndexOf(".") + 1);
    if (isWordPresent(index, leaf)) {
      if (index.deprecated.has(`config:${leaf}`)) deprecatedOut.add(key);
      continue;
    }
    absent.add(key);
  }

  for (const m of markdown.matchAll(UPPER_SNAKE_RE)) {
    const name = m[0];
    if (!index.flags.has(name)) continue;
    if ((index.flags.get(name) ?? 0) === 0) unread.add(name);
  }

  return { absent: [...absent], deprecated: [...deprecatedOut], unread: [...unread] };
}

/**
 * `checkDeprecated` is off for PHP members: the deprecated set is keyed by bare name, and common
 * method names (`get`, `handle`, `__construct`) collide across unrelated classes.
 */
function classifyMember(name: string, index: CodeIndex, absent: Set<string>, deprecatedOut: Set<string>, checkDeprecated = false): void {
  if (isPlaceholderIdentifier(name)) return;
  if (!isWordPresent(index, name)) {
    absent.add(name);
    return;
  }
  if (checkDeprecated && index.deprecated.has(name)) deprecatedOut.add(name);
}

const classFileMaps = new Map<string, Map<string, string>>();

/** `FQCN -> absolute file path` for the installed Shopware packages, parsed once per `vendor/`
 *  dir from composer's autoload classmap. */
function installedClassFiles(vendorDir: string): Map<string, string> {
  let map = classFileMaps.get(vendorDir);
  if (map) return map;
  map = new Map();
  const path = resolve(vendorDir, "composer/autoload_classmap.php");
  if (existsSync(path)) {
    const text = readFileSync(path, "utf8");
    for (const m of text.matchAll(/'((?:[A-Za-z0-9_]+\\\\)+[A-Za-z0-9_]+)'\s*=>\s*\$vendorDir\s*\.\s*'([^']+)'/g)) {
      const fqcn = m[1].replace(/\\\\/g, "\\");
      if (/^Shopware\\(Core|Storefront|Administration)\\/.test(fqcn)) map.set(fqcn, resolve(vendorDir, `.${m[2]}`));
    }
  }
  classFileMaps.set(vendorDir, map);
  return map;
}

/** `installedClassFiles`'s checkout-mode equivalent (mirrors `classesFromCheckoutSource`):
 *  there is no composer classmap in a raw git checkout, so `FQCN -> absolute file path` is
 *  read straight from each PHP file's own `namespace`/type declarations instead. */
function checkoutClassFiles(checkoutRoot: string): Map<string, string> {
  let map = classFileMaps.get(checkoutRoot);
  if (map) return map;
  map = new Map();
  for (const root of checkoutPackageRoots(checkoutRoot)) {
    for (const file of walkFilesForClassDiscovery(root)) {
      if (!file.endsWith(".php")) continue;
      let text: string;
      try {
        text = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const nsMatch = NAMESPACE_DECL_RE.exec(text);
      if (!nsMatch || !/^Shopware\\(Core|Storefront|Administration)\\/.test(nsMatch[1] + "\\")) continue;
      for (const m of text.matchAll(TYPE_DECL_RE)) map.set(`${nsMatch[1]}\\${m[1]}`, file);
    }
  }
  classFileMaps.set(checkoutRoot, map);
  return map;
}

/** `FQCN -> absolute file path` across both code-root modes — `root.packageRoots.core` is two
 *  levels under the mode's real anchor in both layouts (`<projectRoot>/vendor/shopware/core`,
 *  `<checkoutRoot>/src/Core`), so the same two-levels-up walk recovers each mode's own anchor. */
function classFilesFor(root: CodeRoot): Map<string, string> {
  const anchor = resolve(root.packageRoots.core, "..", "..");
  return root.mode === "vendor" ? installedClassFiles(anchor) : checkoutClassFiles(anchor);
}

/** Resolves a base name as written in a snippet (`EntityIndexer`, `\Shopware\...\EntityIndexer`) to its vendor file, or undefined when unknown/ambiguous. */
function resolveBaseFile(name: string, snippet: string, files: Map<string, string>): string | undefined {
  const bare = name.replace(/^\\/, "");
  if (bare.includes("\\")) return files.get(bare);
  const use = new RegExp(`^\\s*use\\s+([A-Za-z0-9_\\\\]+\\\\${bare})\\s*;`, "m").exec(snippet);
  if (use) return files.get(use[1].replace(/^\\/, ""));
  const matches = [...files.keys()].filter((f) => f.endsWith(`\\${bare}`));
  return matches.length === 1 ? files.get(matches[0]) : undefined;
}

const SNIPPET_CLASS_RE = /\bclass\s+\w+(?:\s+extends\s+([A-Za-z0-9_\\]+))?(?:\s+implements\s+([A-Za-z0-9_\\,\s]+?))?\s*\{/g;

/**
 * The members an installed base class or interface obliges a snippet's class to declare: the `abstract`
 * methods of a class, or every method of an interface (its parents are not followed). Keyed by the base
 * name as the snippet writes it. This is the one fact writers most often get wrong (docs listing 4 of
 * `EntityIndexer`'s 6 abstract members), and it is read straight from the vendor file.
 */
export function requiredMembers(markdown: string, root: CodeRoot): Record<string, string[]> {
  const files = classFilesFor(root);
  const out: Record<string, string[]> = {};
  for (const block of markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    const snippet = block[1];
    for (const m of snippet.matchAll(SNIPPET_CLASS_RE)) {
      const bases = [m[1], ...(m[2] ?? "").split(",")].map((b) => b?.trim()).filter((b): b is string => !!b);
      for (const base of bases) {
        const abs = resolveBaseFile(base, snippet, files);
        if (!abs || !existsSync(abs)) continue;
        const source = readFileSync(abs, "utf8");
        const isInterface = new RegExp(`^\\s*interface\\s+${base.split("\\").pop()}\\b`, "m").test(source);
        const re = isInterface ? /^\s*public\s+(?:static\s+)?function\s+(\w+)\s*\(/gm : /\babstract\s+(?:public|protected)\s+(?:static\s+)?function\s+(\w+)\s*\(/g;
        const members = [...new Set([...source.matchAll(re)].map((x) => x[1]))];
        if (members.length) out[base] = members;
      }
    }
  }
  return out;
}

/** For each class snippet in `markdown`, the required members it does not declare (`Base: [missing]`). */
export function missingRequiredMembers(markdown: string, root: CodeRoot): string[] {
  const problems: string[] = [];
  for (const block of markdown.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
    const snippet = block[1];
    for (const [base, members] of Object.entries(requiredMembers("```\n" + snippet + "```", root))) {
      const missing = members.filter((name) => !new RegExp(`function\\s+${name}\\s*\\(`).test(snippet));
      if (missing.length) problems.push(`${base}: ${missing.join(", ")}`);
    }
  }
  return problems;
}
