#!/usr/bin/env node
/**
 * `npm run setup:docs` — materialises `.sources/docs/{developer,merchant}`.
 *
 * These are the official documentation clones the `docs` corpus serves and `kb-factory-verify`'s
 * fs-docs / mcp-docs options read. They used to live four directory levels above the factory, i.e.
 * the published config pointed at a path no consumer has. Everything this package reads now lives
 * inside it and is resolved from its own root.
 *
 * Two things here are load-bearing rather than incidental:
 *
 *   - **Adoption moves, it never re-clones.** The merchant mirror is a ~1 GB PRIVATE repository.
 *     A host that has it today may not be able to fetch it again, so deleting and re-cloning
 *     would be irreversible. `--adopt-docs` renames the existing clones instead.
 *   - **The merchant seed is written by this script.** Upstream has no root `index.md`; the corpus's
 *     only entry point is hand-made and then added to `.git/info/exclude`, i.e. it is untracked by
 *     both git repositories. Any move that did not know about it would silently destroy the entry
 *     point and leave every `func` case reporting `corpus-missing` — a result that looks legitimate.
 *
 * A missing merchant clone is NOT an error: an unavailable optional private source degrades the
 * setup, it never fails it. The committed `wiki/platform/func/` layer stays usable, and the script
 * says exactly what is and is not available.
 *
 *   node scripts/setup-docs.mjs [--adopt-docs <path>] [--offline] [--force] [--json]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirSizeMb, git, listAllFiles, moveDir } from "./lib/sparse-checkout.mjs";

const ROOT = process.env.KB_FACTORY_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = process.env.KB_SOURCES_ROOT || resolve(ROOT, ".sources");
const DOCS = process.env.KB_DOCS_ROOT || resolve(SOURCES, "docs");
const MANIFEST = resolve(SOURCES, "manifest.json");

const CLONES = {
  developer: {
    url: "https://github.com/shopware/docs.git",
    private: false,
    entryPoint: "index.md",
    note: "developer.shopware.com",
  },
  merchant: {
    url: "https://github.com/shopware/enduser-docs-sbp-sync.git",
    private: true,
    entryPoint: "index.md",
    note: "docs.shopware.com mirror (PRIVATE, optional)",
  },
};

/**
 * The merchant corpus's only root entry point. Upstream ships none — every `index.md` under
 * `content/` is a frontmatter-only ordering stub — so this is hand-written, and it is excluded from
 * the clone's own git, which is why it has to live in this script rather than in the clone.
 */
const MERCHANT_SEED = `---
title: Merchant documentation (official mirror)
---

# Merchant documentation

Mirror of the official Shopware 6 end-user documentation (docs.shopware.com). Articles live under \`content/en/shopware-6/<area>/<topic>/\`; each topic directory holds one Markdown file per article revision named \`v<major>-<minor>-<patch>-<build>.md\`, and the file with the highest version is the current text. \`content/de/\` is the German mirror of the same tree. Areas under \`content/en/shopware-6/\`: catalogues (products, categories, product-overview, reviews), orders, customers, settings (rules, shipping, Paymentmethods, shop, system, taxes, currencies, countries, custom-fields, Flow-Builder, email-templates, …), marketing (promotions), content (ShoppingExperiences, Themes, media), commercial-features, extensions, saas, paas, first-steps, getting-started, tutorials-and-faq, update-guides.
`;

function parseArgs(argv) {
  const o = { adopt: process.env.KB_ADOPT_DOCS, offline: false, force: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--adopt-docs") o.adopt = argv[++i];
    else if (a === "--offline") o.offline = true;
    else if (a === "--force") o.force = true;
    else if (a === "--json") o.json = true;
    else {
      process.stderr.write(`setup-docs: unknown argument ${a}\n`);
      process.exit(2);
    }
  }
  return o;
}

function readManifest() {
  if (!existsSync(MANIFEST)) return { schema: 1, shopware: {}, docs: {} };
  try {
    const m = JSON.parse(readFileSync(MANIFEST, "utf8"));
    m.docs ??= {};
    return m;
  } catch {
    return { schema: 1, shopware: {}, docs: {} };
  }
}

function writeManifest(m) {
  mkdirSync(SOURCES, { recursive: true });
  m.generatedAt = new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n", "utf8");
}

/** Reachable without credentials and without prompting? Decides whether an optional private source is skipped. */
function canReach(url) {
  try {
    execFileSync("git", ["ls-remote", "--exit-code", url, "HEAD"], {
      encoding: "utf8",
      timeout: 20000,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_ASKPASS: "/bin/true" },
    });
    return true;
  } catch {
    return false;
  }
}

/** Silent corpus-killers: the MCP server refuses a root carrying either of these. */
function assertCorpusHygiene(dir, name, problems) {
  for (const f of listAllFiles(dir)) {
    const rel = f.slice(dir.length + 1);
    if (rel.split("/").includes("node_modules")) {
      problems.push(`${name}: node_modules/ present (${rel}) — the MCP server refuses the corpus`);
      break;
    }
  }
  for (const f of listAllFiles(dir)) {
    if (f.endsWith("/CLAUDE.md")) {
      problems.push(`${name}: CLAUDE.md present (${f.slice(dir.length + 1)}) — must not exist inside a corpus`);
      break;
    }
  }
}

function ensureMerchantSeed(dir, log) {
  const seed = resolve(dir, "index.md");
  if (!existsSync(seed)) {
    writeFileSync(seed, MERCHANT_SEED, "utf8");
    log("wrote the hand-made root index.md (upstream has none)");
  }
  // Keep it out of the clone's own git, as the manual procedure did.
  const exclude = resolve(dir, ".git/info/exclude");
  if (existsSync(dirname(exclude))) {
    const current = existsSync(exclude) ? readFileSync(exclude, "utf8") : "";
    if (!current.split("\n").some((l) => l.trim() === "index.md")) {
      appendFileSync(exclude, "index.md\n", "utf8");
    }
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const manifest = readManifest();
  const problems = [];
  const results = [];
  let failed = false;
  const out = (m) => !opts.json && process.stdout.write(m + "\n");

  mkdirSync(DOCS, { recursive: true });

  for (const [name, spec] of Object.entries(CLONES)) {
    const dest = resolve(DOCS, name);
    const log = (m) => out(`  ${m}`);

    if (existsSync(dest) && !opts.force) {
      const head = (() => {
        try {
          return git(["rev-parse", "HEAD"], { cwd: dest }).trim();
        } catch {
          return null;
        }
      })();
      if (name === "merchant") ensureMerchantSeed(dest, log);
      assertCorpusHygiene(dest, name, problems);
      const ok = existsSync(resolve(dest, spec.entryPoint));
      if (!ok) problems.push(`${name}: entry point ${spec.entryPoint} is missing`);
      out(`${name}: satisfied (${head ? head.slice(0, 8) : "no git"}, ${dirSizeMb(dest)} MB)`);
      manifest.docs[name] = { url: spec.url, commit: head, private: spec.private, status: "ok" };
      results.push({ name, status: "satisfied", commit: head });
      continue;
    }

    // Adopt an existing clone rather than re-cloning. For merchant this is not an optimisation:
    // it is a private repository, so a delete-and-refetch may be unrecoverable on this host.
    const legacy = opts.adopt ? resolve(opts.adopt, name) : undefined;
    if (legacy && existsSync(legacy) && !existsSync(dest)) {
      const how = moveDir(legacy, dest);
      const head = (() => {
        try {
          return git(["rev-parse", "HEAD"], { cwd: dest }).trim();
        } catch {
          return null;
        }
      })();
      if (!spec.private) {
        // Public clone: prefer HTTPS so a keyless host can still pull. The private one keeps SSH,
        // where HTTPS would not help anyway without credentials.
        try {
          git(["remote", "set-url", "origin", spec.url], { cwd: dest });
        } catch {
          /* no remote, fine */
        }
      }
      if (name === "merchant") ensureMerchantSeed(dest, log);
      assertCorpusHygiene(dest, name, problems);
      out(`${name}: adopted from ${legacy} (${head ? head.slice(0, 8) : "no git"}, ${dirSizeMb(dest)} MB, ${how}, no download)`);
      manifest.docs[name] = { url: spec.url, commit: head, private: spec.private, source: "adopted", status: "ok", fetchedAt: new Date().toISOString() };
      results.push({ name, status: "adopted", commit: head });
      continue;
    }

    if (opts.offline) {
      out(`${name}: SKIPPED — not present and --offline was given`);
      manifest.docs[name] = { url: spec.url, commit: null, private: spec.private, status: "skipped", reason: "offline" };
      results.push({ name, status: "skipped" });
      if (!spec.private) failed = true;
      continue;
    }

    if (!canReach(spec.url)) {
      if (spec.private) {
        // An expected, documented condition for an optional private source — never a failure.
        out(`${name}: SKIPPED — ${spec.url} is private and not reachable from this host.`);
        out(`  This is expected and is not an error.`);
        out(`  Still usable: the committed wiki/platform/func/ layer, and every layer built from public sources.`);
        out(`  Unavailable until you have access and re-run setup:`);
        out(`    - wiki:sync --source merchant  (reports skipped, never fails)`);
        out(`    - the docs corpus merchant entry point (.sources/docs/merchant/index.md)`);
        out(`    - kb-factory-verify fs-docs / mcp-docs "func" cases  -> reported corpus-missing`);
        manifest.docs[name] = { url: spec.url, commit: null, private: true, status: "skipped", reason: "no access" };
        results.push({ name, status: "skipped" });
        continue;
      }
      process.stderr.write(`setup-docs: ${name}: ${spec.url} is not reachable\n`);
      manifest.docs[name] = { url: spec.url, commit: null, private: false, status: "failed", reason: "unreachable" };
      results.push({ name, status: "failed" });
      failed = true;
      continue;
    }

    out(`${name}: cloning ${spec.url} ...`);
    try {
      git(["clone", "--depth", "1", spec.url, dest]);
      const head = git(["rev-parse", "HEAD"], { cwd: dest }).trim();
      if (name === "merchant") ensureMerchantSeed(dest, log);
      assertCorpusHygiene(dest, name, problems);
      if (!existsSync(resolve(dest, spec.entryPoint))) problems.push(`${name}: entry point ${spec.entryPoint} is missing after clone`);
      out(`  done: ${head.slice(0, 8)}, ${dirSizeMb(dest)} MB`);
      manifest.docs[name] = { url: spec.url, commit: head, private: spec.private, source: "clone", status: "ok", fetchedAt: new Date().toISOString() };
      results.push({ name, status: "cloned", commit: head });
    } catch (err) {
      process.stderr.write(`setup-docs: ${name}: ${err.message}\n`);
      manifest.docs[name] = { url: spec.url, commit: null, private: spec.private, status: "failed", reason: err.message };
      results.push({ name, status: "failed" });
      failed = true;
    }
  }

  writeManifest(manifest);

  if (problems.length > 0) {
    for (const p of problems) process.stderr.write(`setup-docs: ERROR ${p}\n`);
    failed = true;
  }
  if (opts.json) process.stdout.write(JSON.stringify({ cmd: "setup-docs", results, problems }) + "\n");
  return failed ? 1 : 0;
}

process.exit(main());
