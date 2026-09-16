/**
 * Factory root resolver — the single place that decides where the factory's roots live, so
 * nothing has to walk up from `process.cwd()` to find them. Walking up used to anchor the roots
 * in whatever project the caller happened to start the command in, which is why a fresh clone
 * could not run at all; this resolver anchors on itself instead.
 *
 * NOT imported by `src/server.ts` or `src/registry.ts`, and `test/bundle.test.ts` enforces that.
 * The published server keeps its own chain anchored on the built bundle's directory, plus the
 * cwd-based project-wiki chain (a consuming project may contribute its own wiki layer, which is
 * deliberate): inside a consumer's `node_modules/` there is no factory repo, so "assert the root
 * is inside it" would be meaningless, and `.sources/` does not exist at all. Consumers here are
 * `ingest/**`, `scripts/*.mjs` and `test/*.ts`.
 *
 * The anchor is this module's own location, never the working directory, which is what lets the
 * factory directory be moved or renamed without an edit here: `src/..` and `dist/..` are both the
 * factory root.
 */
import { existsSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type Env = Record<string, string | undefined>;

/** Config-file values, which outrank the environment. Each is resolved against the factory root. */
export interface PathOverrides {
  sources?: string;
  docs?: string;
  cache?: string;
  /** `ingest/platform/config.json` `wikiRootDefault`, or a `--wiki` CLI flag. */
  wiki?: string;
  reports?: string;
  /** `codeCheck.projectRoot`-style per-version code roots. */
  shopware?: Record<string, string>;
}

export interface Paths {
  /** The factory repo root. */
  readonly root: string;
  sourcesRoot(): string;
  shopwareSourceRoot(version: string): string;
  docsRoot(): string;
  cacheRoot(): string;
  wikiRoot(): string;
  reportsRoot(): string;
  /** `null` when disabled (`KB_PROJECT_WIKI=off`) or not determinable without a host repo. */
  projectWiki(): string | null;
  /** Lexical containment test — see `assertInside`. */
  isInside(p: string): boolean;
  /** Resolve a caller-supplied path against the root, never against the cwd. */
  fromRoot(p: string): string;
}

/** `6.7` -> `KB_SHOPWARE_ROOT_6_7`. */
function shopwareEnvName(version: string): string {
  return `KB_SHOPWARE_ROOT_${version.replace(/[^0-9A-Za-z]/g, "_")}`;
}

const MODULE_DIR = dirname(fileURLToPath(import.meta.url));

/**
 * `KB_FACTORY_ROOT` wins; otherwise the directory above this module. A relative override is a hard
 * error rather than a silent cwd resolution — there is no base to resolve it against that would not
 * reintroduce the cwd dependency this module exists to remove.
 */
export function factoryRoot(env: Env = process.env): string {
  const override = env.KB_FACTORY_ROOT;
  if (override !== undefined && override !== "") {
    if (!isAbsolute(override)) throw new Error(`kb paths: KB_FACTORY_ROOT must be an absolute path (got "${override}")`);
    return resolve(override);
  }
  return resolve(MODULE_DIR, "..");
}

export function createPaths(opts: { root?: string; env?: Env; overrides?: PathOverrides } = {}): Paths {
  const env = opts.env ?? process.env;
  const root = opts.root !== undefined ? resolve(opts.root) : factoryRoot(env);
  const ov = opts.overrides ?? {};

  /**
   * Lexical, never `realpath`. `.sources/` is the one subtree allowed to point outward — during the
   * in-place phase its entries may be symlinks into the surrounding host project — and an eager
   * realpath check would reject exactly that supported arrangement.
   *
   * A value that came from config, the environment or a CLI flag is a deliberate escape and is not
   * checked; only an unset default has to land inside the root.
   */
  function assertInside(key: string, p: string, explicit: boolean, envName: string): string {
    if (explicit) return p;
    const rel = relative(root, p);
    if (rel === "" || rel.startsWith("..") || isAbsolute(rel)) {
      throw new Error(`kb paths: ${key} resolves outside the factory root (${p}); set ${envName} to override`);
    }
    return p;
  }

  /**
   * A resolved root plus whether it got there deliberately. Explicitness is inherited: a key whose
   * default is derived from an explicitly relocated base (`docsRoot` under a moved `sourcesRoot`)
   * is itself explicit, otherwise pointing `.sources/` at another disk would trip the assertion on
   * every key derived from it.
   */
  interface Resolved {
    path: string;
    explicit: boolean;
  }

  /** config override > env var > default, each relative value resolved against the root. */
  function pick(key: string, envName: string, override: string | undefined, fallback: () => Resolved): Resolved {
    if (override !== undefined && override !== "") return { path: assertInside(key, resolve(root, override), true, envName), explicit: true };
    const fromEnv = env[envName];
    if (fromEnv !== undefined && fromEnv !== "") return { path: assertInside(key, resolve(root, fromEnv), true, envName), explicit: true };
    const base = fallback();
    return { path: assertInside(key, base.path, base.explicit, envName), explicit: base.explicit };
  }

  function sources(): Resolved {
    return pick("sourcesRoot", "KB_SOURCES_ROOT", ov.sources, () => ({ path: resolve(root, ".sources"), explicit: false }));
  }

  const paths: Paths = {
    root,

    sourcesRoot() {
      return sources().path;
    },

    shopwareSourceRoot(version: string) {
      const envName = shopwareEnvName(version);
      const override = ov.shopware?.[version];
      if (override !== undefined && override !== "") return resolve(root, override);
      const perVersion = env[envName];
      if (perVersion !== undefined && perVersion !== "") return resolve(root, perVersion);
      const shared = env.KB_SHOPWARE_ROOT;
      if (shared !== undefined && shared !== "") return resolve(root, shared, version);
      const base = sources();
      return assertInside("shopwareSourceRoot", resolve(base.path, "shopware", version), base.explicit, envName);
    },

    docsRoot() {
      return pick("docsRoot", "KB_DOCS_ROOT", ov.docs, () => {
        const base = sources();
        return { path: resolve(base.path, "docs"), explicit: base.explicit };
      }).path;
    },

    cacheRoot() {
      return pick("cacheRoot", "KB_CACHE_ROOT", ov.cache, () => ({ path: resolve(root, ".cache"), explicit: false })).path;
    },

    wikiRoot() {
      return pick("wikiRoot", "KB_WIKI_ROOT", ov.wiki, () => ({ path: resolve(root, "wiki"), explicit: false })).path;
    },

    reportsRoot() {
      return pick("reportsRoot", "KB_REPORTS_ROOT", ov.reports, () => ({
        path: resolve(root, ".claude", "skills", "kb-factory-verify", "reports"),
        explicit: false,
      })).path;
    },

    /**
     * Host-owned by definition — a consuming project may contribute its own wiki layer, found
     * from the working directory — so it is never asserted against the factory root. The
     * server's own `<cwd>/docs/project-wiki` tier stays in `registry.ts` — the factory has no
     * legitimate cwd-derived project wiki, so this returns `null` instead of guessing.
     */
    projectWiki() {
      const fromEnv = env.KB_PROJECT_WIKI;
      if (fromEnv === "off") return null;
      if (fromEnv !== undefined && fromEnv !== "") return isAbsolute(fromEnv) ? fromEnv : resolve(root, fromEnv);
      const projectDir = env.CLAUDE_PROJECT_DIR;
      if (projectDir !== undefined && projectDir !== "") return resolve(projectDir, "docs", "project-wiki");
      return null;
    },

    isInside(p: string) {
      const rel = relative(root, resolve(p));
      return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
    },

    fromRoot(p: string) {
      return resolve(root, p);
    },
  };

  return paths;
}

/** Default instance over `process.env` with no config overrides. */
export const paths: Paths = createPaths();

/** A resolver over the default root with config values layered on top. */
export function withOverrides(overrides: PathOverrides): Paths {
  return createPaths({ overrides });
}

/** True when `<root>` carries anything this factory can read as Shopware code. */
export function sourceRootPresent(root: string): boolean {
  return existsSync(resolve(root, "src", "Core")) || existsSync(resolve(root, "vendor", "composer", "installed.json"));
}
