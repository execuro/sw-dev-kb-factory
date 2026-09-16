#!/usr/bin/env node
/**
 * `npm run setup:sources` — materialises `.sources/shopware/<version>/`.
 *
 * This is what makes a fresh clone of the factory usable: before it, the code check found its
 * Shopware source by walking up from the working directory until it hit a `vendor/`, which only
 * worked because the factory happened to live inside a Shopware project.
 *
 * Deliberately NOT `composer install`. A composer install was the obvious route, but composer needs
 * PHP, and a pinned sparse git checkout gives the code index everything it reads while needing only git —
 * `codeIndex.ts` has had a complete checkout mode since the 6.6 guideline work, so this is the path
 * half the factory already used. Nothing here needs PHP to exist anywhere.
 *
 * Idempotent, resumable and an offline no-op when already satisfied: each version is guarded by its
 * own `.tag`/`.commit` sentinel pair, written last, so an interrupted run redoes exactly the version
 * it was working on and nothing else.
 *
 *   node scripts/setup-sources.mjs [--version 6.7] [--with-tests] [--offline] [--force] [--json]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { checkoutState, dirSizeMb, isSatisfied, moveDir, performSparseCheckout, verifyCheckout } from "./lib/sparse-checkout.mjs";

const ROOT = process.env.KB_FACTORY_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES = process.env.KB_SOURCES_ROOT || resolve(ROOT, ".sources");
const SHOPWARE = resolve(SOURCES, "shopware");
const MANIFEST = resolve(SOURCES, "manifest.json");
/** Where `wiki:sync` used to put the 6.6 checkout, and where setup adopts it from instead of re-downloading. */
const LEGACY_CACHE = resolve(ROOT, "ingest/platform/.cache/code");

function parseArgs(argv) {
  const o = { versions: [], withTests: false, offline: false, force: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--version") o.versions.push(argv[++i]);
    else if (a === "--with-tests") o.withTests = true;
    else if (a === "--offline") o.offline = true;
    else if (a === "--force") o.force = true;
    else if (a === "--json") o.json = true;
    else {
      process.stderr.write(`setup-sources: unknown argument ${a}\n`);
      process.exit(2);
    }
  }
  return o;
}

function loadPins() {
  const config = JSON.parse(readFileSync(resolve(ROOT, "ingest/platform/config.json"), "utf8"));
  const checkouts = config.guidelines?.codeCheckouts ?? {};
  const pins = {};
  for (const [version, c] of Object.entries(checkouts)) {
    if (!c.tag || !c.commit) continue; // unpinned legacy entry: setup does not guess, sync's old path still handles it
    pins[version] = { version, ...c };
  }
  return pins;
}

function readManifest() {
  if (!existsSync(MANIFEST)) return { schema: 1, shopware: {}, docs: {} };
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf8"));
  } catch {
    return { schema: 1, shopware: {}, docs: {} };
  }
}

export function writeManifest(m) {
  mkdirSync(SOURCES, { recursive: true });
  m.generatedAt = new Date().toISOString();
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n", "utf8");
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const pins = loadPins();
  const wanted = opts.versions.length > 0 ? opts.versions : Object.keys(pins);
  const manifest = readManifest();
  const results = [];
  let failed = false;

  for (const version of wanted) {
    const pin = pins[version];
    if (!pin) {
      process.stderr.write(`setup-sources: no pinned checkout configured for ${version}\n`);
      failed = true;
      continue;
    }
    const dir = resolve(SHOPWARE, version);
    const log = (m) => !opts.json && process.stdout.write(`  ${m}\n`);

    if (!opts.force && existsSync(dir) && isSatisfied(dir, pin)) {
      const problems = verifyCheckout(dir, pin);
      if (problems.length === 0) {
        !opts.json && process.stdout.write(`shopware ${version}: satisfied (${pin.tag})\n`);
        results.push({ version, tag: pin.tag, status: "satisfied", fetched: 0 });
        manifest.shopware[version] = { ...(manifest.shopware[version] ?? {}), tag: pin.tag, commit: pin.commit, status: "ok" };
        continue;
      }
      // A sentinel that says "done" over a tree that is not is worse than no sentinel: it is what
      // let the 6.6 content gap persist. Say so loudly rather than trusting the marker.
      process.stderr.write(`setup-sources: ${version} is marked ${pin.tag} but is incomplete:\n${problems.map((p) => `    ${p}`).join("\n")}\n`);
      if (!opts.force) {
        process.stderr.write(`  re-run with --force to discard and re-fetch it\n`);
        failed = true;
        continue;
      }
    }

    // Adopt the tree wiki:sync left behind rather than re-downloading ~100 MB. The legacy path is
    // named explicitly - discovering it by walking up is the very habit this package removed when
    // it was made to resolve every path from its own root.
    const legacy = resolve(LEGACY_CACHE, version);
    if (!opts.force && !existsSync(dir) && existsSync(legacy) && checkoutState(legacy).tag === pin.tag) {
      const problems = verifyCheckout(legacy, pin);
      if (problems.length === 0) {
        const how = moveDir(legacy, dir);
        writeFileSync(resolve(dir, ".commit"), pin.commit + "\n", "utf8");
        const mb = dirSizeMb(dir);
        !opts.json && process.stdout.write(`shopware ${version}: adopted from ingest/platform/.cache/code/${version} (${pin.tag}, ${mb} MB, ${how}, no download)\n`);
        results.push({ version, tag: pin.tag, status: "adopted", fetched: 0 });
        manifest.shopware[version] = { tag: pin.tag, commit: pin.commit, source: "adopted", withTests: false, fetchedAt: new Date().toISOString(), status: "ok" };
        continue;
      }
      !opts.json && process.stdout.write(`shopware ${version}: legacy cache at ${pin.tag} is incomplete, re-fetching\n`);
    }

    if (opts.offline) {
      process.stderr.write(`setup-sources: ${version} is not set up and --offline was given (want ${pin.tag})\n`);
      failed = true;
      continue;
    }

    !opts.json && process.stdout.write(`shopware ${version}:\n`);
    try {
      const { fetched } = performSparseCheckout(dir, pin, { withTests: opts.withTests, log });
      const mb = dirSizeMb(dir);
      !opts.json && process.stdout.write(`  done: ${fetched} files, ${mb} MB\n`);
      results.push({ version, tag: pin.tag, status: "fetched", fetched });
      manifest.shopware[version] = { tag: pin.tag, commit: pin.commit, source: "clone", files: fetched, withTests: opts.withTests, fetchedAt: new Date().toISOString(), status: "ok" };
    } catch (err) {
      process.stderr.write(`setup-sources: ${version}: ${err.message}\n`);
      results.push({ version, tag: pin.tag, status: "failed", error: err.message });
      manifest.shopware[version] = { tag: pin.tag, commit: pin.commit, status: "failed", error: err.message };
      failed = true;
    }
  }

  writeManifest(manifest);
  if (opts.json) process.stdout.write(JSON.stringify({ cmd: "setup-sources", results }) + "\n");
  return failed ? 1 : 0;
}

process.exit(main());
