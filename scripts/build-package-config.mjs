#!/usr/bin/env node
/**
 * The published `kb.config.json` for the npm package.
 *
 * The factory's own config carries a `docs` corpus pointing at `.sources/docs` — the official
 * documentation clones the benchmark compares against. Consumers have no such directory, so
 * shipping it would leave `KB_CORPUS=docs` resolving to a path that does not exist. This derives the
 * consumer config from the factory one, so there is a single hand-edited source of truth and no
 * second file to keep in step.
 *
 * Note it is an ALLOW-LIST, not a `delete corpora.docs`: a corpus added later is excluded by
 * default and has to be named to ship, rather than leaking because nobody remembered to exclude it.
 *
 *   node scripts/build-package-config.mjs [--in <file>] [--out <file>] [--check <file>] [--stdout]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.env.KB_FACTORY_ROOT || resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Corpora a published package may serve. Everything else is factory-only. */
const PUBLISHED_CORPORA = ["wiki"];

export function buildPackageConfig(config, { wikiRoot } = {}) {
  const corpora = {};
  for (const name of PUBLISHED_CORPORA) {
    if (config.corpora?.[name]) corpora[name] = config.corpora[name];
  }
  if (Object.keys(corpora).length === 0) {
    throw new Error(`no publishable corpus found; expected one of ${PUBLISHED_CORPORA.join(", ")}`);
  }

  const corpus = config.corpus;
  if (!corpora[corpus]) {
    throw new Error(`the configured corpus "${corpus}" is not publishable (publishable: ${Object.keys(corpora).join(", ")})`);
  }

  for (const [name, c] of Object.entries(corpora)) {
    if (isAbsolute(c.root)) throw new Error(`corpus "${name}" root must be relative, got ${c.root}`);
    // Roots resolve against the BUNDLE directory (dist/), not the package root — so "../wiki" is
    // correct and anything that climbs further escapes the published tarball.
    const resolved = resolve("/pkg/dist", c.root);
    const rel = relative("/pkg", resolved);
    if (rel.startsWith("..") || isAbsolute(rel)) {
      throw new Error(`corpus "${name}" root ${c.root} resolves outside the package (${rel})`);
    }
    // Entry points must exist in the tree that will be packed, or the server reports the layer
    // unserved and the release is dead on arrival.
    const base = wikiRoot ?? resolve(ROOT, c.root.replace(/^\.\.\//, ""));
    for (const ep of c.entryPoints ?? []) {
      if (!existsSync(resolve(base, ep))) throw new Error(`corpus "${name}" entry point is missing on disk: ${ep} (looked in ${base})`);
    }
  }

  return { corpus, corpora };
}

function main() {
  const argv = process.argv.slice(2);
  let inFile = resolve(ROOT, "kb.config.json");
  let outFile;
  let checkFile;
  let toStdout = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--in") inFile = resolve(argv[++i]);
    else if (a === "--out") outFile = resolve(argv[++i]);
    else if (a === "--check") checkFile = resolve(argv[++i]);
    else if (a === "--stdout") toStdout = true;
    else {
      process.stderr.write(`build-package-config: unknown argument ${a}\n`);
      return 2;
    }
  }

  let text;
  try {
    const config = JSON.parse(readFileSync(inFile, "utf8"));
    text = JSON.stringify(buildPackageConfig(config), null, 2) + "\n";
  } catch (err) {
    process.stderr.write(`build-package-config: ${err.message}\n`);
    return 1;
  }

  if (checkFile) {
    const current = existsSync(checkFile) ? readFileSync(checkFile, "utf8") : "";
    if (current !== text) {
      process.stderr.write(`build-package-config: ${checkFile} is stale — regenerate it with --out\n`);
      return 1;
    }
    process.stdout.write("unchanged\n");
    return 0;
  }
  if (outFile) writeFileSync(outFile, text, "utf8");
  if (toStdout || !outFile) process.stdout.write(text);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  process.exit(main());
}
