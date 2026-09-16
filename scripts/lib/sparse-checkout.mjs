/**
 * Pinned sparse checkouts of a public git repository, used by `npm run setup`.
 *
 * This is the machinery `wiki:sync` used to carry inline, moved out so `npm run setup` owns it and
 * `sync` only verifies. Three things changed in the move, each fixing a real defect:
 *
 *   1. Fetch by COMMIT, not by tag. A tag is a moving target; pinning the sha is what makes a
 *      rebuild reproducible and lets `setup` be an offline no-op when it is already satisfied.
 *   2. Sparse patterns go in on STDIN, not argv. `**` globs on a command line invite quoting
 *      questions and an argv-length ceiling, neither of which is worth risking for free.
 *   3. A post-checkout ASSERTION. The old code returned `{fetched: N}` and nobody ever checked
 *      *which* paths arrived, so a pattern that silently matched nothing was indistinguishable
 *      from success. That is how the 6.6 checkout came to be missing content nobody noticed.
 *
 * Plain ESM with no dependencies: a `.mjs` script cannot import the TypeScript sources, and the
 * release scripts must run from a bare `npm ci` without a build step.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

/**
 * The paths the code index and the code-evidence lanes read.
 *
 * Scoped to `src/**` on purpose: a bare `**​/AGENTS.md` also matches the Shopware repository's OWN
 * root `AGENTS.md`, which is an instruction file for a different repository and has no business
 * inside a tree that agents read as reference material.
 *
 * Note for 6.6: `technical-docs/` and the administration `AGENTS.md` do not exist at v6.6.x — they
 * are 6.7-era additions. The patterns are deliberate no-ops there, which is why `expect` is
 * configured per version rather than shared.
 */
export const CODE_CHECKOUT_INCLUDE_GLOBS = [
  "src/Core/**",
  "src/Storefront/**",
  "src/Administration/Resources/app/administration/src/**",
  "src/Administration/Resources/app/administration/technical-docs/**",
  "src/Administration/Resources/app/administration/AGENTS.md",
  "src/**/AGENTS.md",
];

/** Tests reachable by the code-evidence lane; only fetched with `--with-tests` (adds ~200 MB). */
export const CODE_CHECKOUT_TEST_GLOBS = ["src/Core/**/Test/**", "src/Storefront/**/Test/**", "tests/**"];

export function git(args, opts = {}) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"], ...opts });
}

export function listAllFiles(dir) {
  const out = [];
  const walk = (d) => {
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = resolve(d, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile()) out.push(full);
    }
  };
  walk(dir);
  return out;
}

/** The sentinels a satisfied checkout carries. Written last, so a crash never leaves a false one. */
export function checkoutState(dir) {
  const read = (name) => {
    const p = resolve(dir, name);
    return existsSync(p) ? readFileSync(p, "utf8").trim() : undefined;
  };
  return { tag: read(".tag"), commit: read(".commit") };
}

export function isSatisfied(dir, pin) {
  const s = checkoutState(dir);
  if (s.tag !== pin.tag) return false;
  // A checkout made before commit pinning has a .tag but no .commit. Accept it on the tag alone
  // rather than re-downloading 100 MB; setup stamps the .commit on adoption.
  return s.commit === undefined || s.commit === pin.commit;
}

/**
 * Everything in `expect` must exist and the tree must hold at least `expectMinFiles` files.
 * Returns a list of problems; empty means good.
 */
export function verifyCheckout(dir, pin) {
  const problems = [];
  for (const rel of pin.expect ?? []) {
    if (!existsSync(resolve(dir, rel))) problems.push(`missing: ${rel}`);
  }
  const count = listAllFiles(dir).length;
  if (pin.expectMinFiles !== undefined && count < pin.expectMinFiles) {
    problems.push(`only ${count} files (expected >= ${pin.expectMinFiles})`);
  }
  return problems;
}

/**
 * Materialises `pin` into `dir`, atomically: build in a temp sibling, verify, then rename over the
 * target and write the sentinels. A reader never observes a half-populated or unverified checkout.
 */
export function performSparseCheckout(dir, pin, { withTests = false, log = () => {} } = {}) {
  const parent = dirname(dir);
  mkdirSync(parent, { recursive: true });
  const tmp = resolve(parent, `.tmp-${basename(dir)}-${process.pid}-${Date.now()}`);
  rmSync(tmp, { recursive: true, force: true });

  const cleanup = () => rmSync(tmp, { recursive: true, force: true });
  process.once("SIGINT", cleanup);

  try {
    const url = `https://github.com/${pin.repo}.git`;
    const patterns = [...CODE_CHECKOUT_INCLUDE_GLOBS, ...(withTests ? CODE_CHECKOUT_TEST_GLOBS : [])];

    mkdirSync(tmp, { recursive: true });
    git(["init", "-q", "-b", "main", tmp]);
    git(["remote", "add", "origin", url], { cwd: tmp });
    git(["sparse-checkout", "init", "--no-cone"], { cwd: tmp });
    git(["sparse-checkout", "set", "--no-cone", "--stdin"], { cwd: tmp, input: patterns.join("\n") + "\n" });

    log(`fetching ${pin.repo}@${pin.tag} (${pin.commit.slice(0, 8)}) ...`);
    try {
      git(["fetch", "--depth", "1", "--filter=blob:none", "origin", pin.commit], { cwd: tmp });
      git(["checkout", "--detach", "FETCH_HEAD"], { cwd: tmp });
    } catch {
      // Some hosts refuse a reachable-SHA fetch. Fall back to the tag, then prove it resolved to
      // the pin anyway — a fallback that silently accepted a moved tag would defeat the pinning.
      log(`  sha fetch refused, retrying by tag ${pin.tag}`);
      git(["fetch", "--depth", "1", "--filter=blob:none", "origin", `refs/tags/${pin.tag}`], { cwd: tmp });
      git(["checkout", "--detach", "FETCH_HEAD"], { cwd: tmp });
    }

    const head = git(["rev-parse", "HEAD"], { cwd: tmp }).trim();
    if (head !== pin.commit) {
      throw new Error(`${pin.repo}@${pin.tag} resolved to ${head}, not the pinned ${pin.commit}`);
    }

    rmSync(resolve(tmp, ".git"), { recursive: true, force: true });

    const problems = verifyCheckout(tmp, pin);
    if (problems.length > 0) {
      throw new Error(
        `checkout of ${pin.repo}@${pin.tag} is incomplete:\n` +
          problems.map((p) => `    ${p}`).join("\n") +
          `\n  The sparse pattern list did not deliver these paths for this tag.\n` +
          `  Either the patterns or the pin is wrong - refusing to write this checkout.`,
      );
    }

    const fetched = listAllFiles(tmp).length;
    rmSync(dir, { recursive: true, force: true });
    renameSync(tmp, dir);
    // Sentinels last, and only now that the tree is at its final path and verified.
    writeFileSync(resolve(dir, ".tag"), pin.tag + "\n", "utf8");
    writeFileSync(resolve(dir, ".commit"), pin.commit + "\n", "utf8");
    return { fetched };
  } finally {
    cleanup();
    process.removeListener("SIGINT", cleanup);
  }
}

/** Same filesystem: O(1). Falls back to a copy when the move crosses devices. */
export function moveDir(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  try {
    renameSync(from, to);
    return "renamed";
  } catch (err) {
    if (err.code !== "EXDEV") throw err;
    execFileSync("cp", ["-a", from + "/.", to]);
    rmSync(from, { recursive: true, force: true });
    return "copied";
  }
}

export function dirSizeMb(dir) {
  let bytes = 0;
  for (const f of listAllFiles(dir)) {
    try {
      bytes += statSync(f).size;
    } catch {
      /* raced away */
    }
  }
  return Math.round(bytes / 1024 / 1024);
}
