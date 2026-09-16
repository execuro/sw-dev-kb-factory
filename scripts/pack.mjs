#!/usr/bin/env node
/**
 * Packs `@execuro-sw-ecosystem/sw-dev-knowledge-base-mcp` for publication.
 *
 * Packs from a STAGING directory rather than the repository, which is what makes two release
 * requirements satisfiable at once: "npm pack --dry-run ships exactly the allow-list below" and
 * "the packed kb.config.json has no docs corpus". In the repo those conflict — the factory's
 * config legitimately has a `docs` corpus and its package.json legitimately has the two runtime
 * dependencies its own test client imports (test/bundle.test.ts asserts exactly that). Mutating
 * them in a prepack and restoring in a postpack leaves the tree dirty whenever a run fails;
 * staging never touches them.
 *
 *   node scripts/pack.mjs [--dry-run] [--json] [--skip-build] [--out-dir <dir>]
 */
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildPackageConfig } from "./build-package-config.mjs";

const ROOT = process.env.KB_FACTORY_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

/** The allow-list: exactly what the published package ships. `package.json` is added by npm itself and is not part of the list. */
const FILES_ALLOWLIST = ["dist/", "kb.config.json", "wiki/", "README.md", "LICENSE", "THIRD-PARTY-NOTICES.md"];
const ALLOWED_TOP_LEVEL = new Set(["dist", "kb.config.json", "wiki", "README.md", "LICENSE", "THIRD-PARTY-NOTICES.md", "package.json"]);

const NON_PAGE_BASENAMES = new Set(require("../ingest/shared/non-page-files.json").basenames);

/** Same predicate as the sync and lint gates: upstream repository furniture is not documentation. */
function isDocPagePath(p) {
  const segments = p.split("/").filter(Boolean);
  if (segments.some((s) => s.startsWith("."))) return false;
  return !NON_PAGE_BASENAMES.has(segments[segments.length - 1] ?? "");
}

function listFiles(dir, base = dir) {
  const { readdirSync, statSync } = require("node:fs");
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    if (statSync(full).isDirectory()) out.push(...listFiles(full, base));
    else out.push(full.slice(base.length + 1));
  }
  return out;
}

function main() {
  const argv = process.argv.slice(2);
  const opts = { dryRun: false, json: false, skipBuild: false, outDir: resolve(ROOT, "dist-pack") };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--skip-build") opts.skipBuild = true;
    else if (a === "--out-dir") opts.outDir = resolve(argv[++i]);
    else {
      process.stderr.write(`pack: unknown argument ${a}\n`);
      return 2;
    }
  }
  const log = (m) => !opts.json && process.stdout.write(m + "\n");
  const problems = [];

  if (!opts.skipBuild) {
    log("building the bundle ...");
    execFileSync("npm", ["run", "build"], { cwd: ROOT, stdio: opts.json ? "pipe" : "inherit" });
  }

  const staging = mkdtempSync(resolve(tmpdir(), "kb-pack-"));
  try {
    // 1. The shipped tree.
    for (const item of ["dist", "wiki", "README.md", "LICENSE", "THIRD-PARTY-NOTICES.md"]) {
      const from = resolve(ROOT, item);
      if (!existsSync(from)) {
        // Writing LICENSE is not this script's job — but a release without it is unpublishable, so
        // this must be loud rather than silently packing an unlicensed tarball.
        problems.push(`missing ${item} (LICENSE is required before the first publish)`);
        continue;
      }
      cpSync(from, resolve(staging, item), { recursive: true });
    }

    // 2. The derived config: no factory-only corpus.
    const factoryConfig = JSON.parse(readFileSync(resolve(ROOT, "kb.config.json"), "utf8"));
    writeFileSync(resolve(staging, "kb.config.json"), JSON.stringify(buildPackageConfig(factoryConfig), null, 2) + "\n", "utf8");

    // 3. The derived manifest. The published package has NO runtime dependencies — the bundle
    //    inlines the SDK and zod — and it drops `private`, `scripts` and `devDependencies`, which
    //    are development-only: `private` would block publishing outright, and the other two would
    //    advertise commands and packages a consumer's install has no way to run.
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf8"));
    const published = {
      ...pkg,
      files: FILES_ALLOWLIST,
      publishConfig: { access: "public" },
      dependencies: undefined,
      devDependencies: undefined,
      scripts: undefined,
      private: undefined,
    };
    for (const k of Object.keys(published)) if (published[k] === undefined) delete published[k];
    writeFileSync(resolve(staging, "package.json"), JSON.stringify(published, null, 2) + "\n", "utf8");

    // 4. The corpus filter: upstream repository furniture must never ship as documentation pages.
    const wikiDir = resolve(staging, "wiki");
    if (existsSync(wikiDir)) {
      for (const rel of listFiles(wikiDir)) {
        if (!isDocPagePath(rel)) problems.push(`non-page file in the packed corpus: wiki/${rel}`);
      }
    }

    // 5. What npm would actually ship.
    const packOut = execFileSync("npm", ["pack", "--dry-run", "--json"], { cwd: staging, encoding: "utf8" });
    const entries = JSON.parse(packOut)[0]?.files ?? [];
    const tops = new Set(entries.map((f) => f.path.split("/")[0]));
    for (const t of tops) {
      if (!ALLOWED_TOP_LEVEL.has(t)) problems.push(`unexpected entry in the tarball: ${t}/`);
    }
    log(`npm pack: ${entries.length} files, top level: ${[...tops].sort().join(", ")}`);

    // 6. The packed config must REFUSE the factory-only corpus. spawnSync, not execFileSync:
    //    a server that wrongly started would block on stdio rather than throw.
    const probe = spawnSync(process.execPath, [resolve(staging, "dist/server.js")], {
      cwd: staging,
      encoding: "utf8",
      timeout: 20000,
      input: "",
      env: { ...process.env, KB_CORPUS: "docs", KB_CONFIG: resolve(staging, "kb.config.json"), KB_PROJECT_WIKI: "off" },
    });
    const stderr = probe.stderr ?? "";
    if (probe.status === 0 || !/unknown corpus "docs"/.test(stderr)) {
      problems.push(`the packed config still accepts KB_CORPUS=docs (exit ${probe.status}): ${stderr.trim().split("\n")[0] || "(no stderr)"}`);
    } else {
      log('KB_CORPUS=docs is refused by the packed config, as it must be');
    }
  } catch (err) {
    problems.push(err.message);
  }

  let result = { cmd: "pack", problems };
  try {
    if (problems.length === 0 && !opts.dryRun) {
      // npm pack does not create --pack-destination; it fails ENOENT on the tarball it is about
      // to write. --dry-run never reaches here, so only the real pack (the one the release
      // workflow runs) hits it.
      mkdirSync(opts.outDir, { recursive: true });
      const tarball = execFileSync("npm", ["pack", "--pack-destination", opts.outDir], { cwd: staging, encoding: "utf8" }).trim();
      result.tarball = resolve(opts.outDir, tarball);
      log(`packed: ${result.tarball}`);
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }

  for (const p of problems) process.stderr.write(`pack: ERROR ${p}\n`);
  if (opts.json) process.stdout.write(JSON.stringify(result) + "\n");
  else if (problems.length === 0) log("pack: OK");
  return problems.length > 0 ? 1 : 0;
}

process.exit(main());
