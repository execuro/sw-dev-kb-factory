import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { packageDir, serverPath } from "./helpers.js";

const bundle = readFileSync(serverPath, "utf8");

test("B12/B3: bundle has no write, process, network, eval or template-render paths", () => {
  const forbidden: [string, RegExp][] = [
    ["fs.write*", /\b(writeFile|writeFileSync|appendFile|appendFileSync|createWriteStream|writeSync|mkdtemp|mkdtempSync|mkdir|mkdirSync|rm|rmSync|unlink|unlinkSync|rename|renameSync)\s*\(/],
    ["child_process", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?child_process["']/],
    ["worker_threads", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?worker_threads["']/],
    ["net", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?net["']/],
    ["http", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?http["']/],
    ["https", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?https["']/],
    ["dns", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?dns["']/],
    ["vm", /(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](node:)?vm["']/],
    ["fetch()", /\bfetch\s*\(/],
    ["eval()", /\beval\s*\(/],
    ["new Function", /new\s+Function\s*\(/],
    ["ingest", /src\/ingest|from\s*["'][^"']*\/ingest\//],
    ["search libs", /minisearch|flexsearch|lunr|bm25/i],
  ];
  for (const [name, re] of forbidden) {
    const m = re.exec(bundle);
    assert.equal(m, null, `bundle must not contain ${name}: ${m && bundle.slice(Math.max(0, m.index - 60), m.index + 80)}`);
  }
  // fs opens must be read-only
  for (const m of bundle.matchAll(/openSync\(([^)]*)\)/g)) assert.match(m[1], /"r"/);
});

test("bundle is self-contained: every import is a node: builtin (fresh clone needs no node_modules)", () => {
  // Anchored to line-start `import` statements: JSDoc comments survive --minify-syntax and
  // the SDK's ajv-provider docblock contains a literal `from 'ajv'`.
  const specs = [...bundle.matchAll(/^import\b[^\n]*?\bfrom\s*["']([^"']+)["']|^import\s*["']([^"']+)["']/gm)].map((m) => m[1] ?? m[2]);
  assert.ok(specs.length > 0, "no import statements found in bundle");
  for (const spec of specs) assert.ok(spec.startsWith("node:"), `bare import in bundle: ${spec}`);
  assert.doesNotMatch(bundle, /\brequire\s*\(\s*["'](?!node:)[^"']+["']\s*\)/, "bare require() in bundle");
});

test("runtime dependency set is exactly @modelcontextprotocol/sdk + zod; server sources never import ingest", () => {
  const pkg = JSON.parse(readFileSync(join(packageDir, "package.json"), "utf8"));
  assert.deepEqual(Object.keys(pkg.dependencies).sort(), ["@modelcontextprotocol/sdk", "zod"]);
  const tsconfig = JSON.parse(readFileSync(join(packageDir, "tsconfig.json"), "utf8"));
  assert.ok(tsconfig.exclude.includes("src/ingest"));
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  const files = walk(join(packageDir, "src")).filter((f) => f.endsWith(".ts") && !f.includes("/ingest/"));
  assert.ok(files.length > 0);
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    assert.doesNotMatch(src, /from\s*["'][^"']*ingest/, `${f} imports ingest`);
    assert.doesNotMatch(src, /\b(fetch|eval)\s*\(|new\s+Function|child_process|worker_threads/, `${f} forbidden symbol`);
  }
});

// src/paths.ts is the factory-side root resolver (ingest, scripts, tests). The server must keep
// its own chain anchored to the built bundle's own directory, because inside a consumer's
// node_modules/ there is no factory checkout to anchor to and no .sources/ to point at. esbuild
// only pulls what the entry point transitively imports, so "nobody imports it" is the whole
// enforcement mechanism — hence this test rather than a comment.
test("src/paths.ts is never reachable from the server bundle", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? walk(join(dir, n)) : [join(dir, n)]));
  const srcDir = join(packageDir, "src");
  const files = walk(srcDir).filter((f) => f.endsWith(".ts") && f !== join(srcDir, "paths.ts"));
  assert.ok(files.length > 0);
  for (const f of files) {
    assert.doesNotMatch(
      readFileSync(f, "utf8"),
      /from\s*["'][^"']*\bpaths\.js["']/,
      `${f} imports src/paths.ts — that would bundle the factory root resolver into dist/server.js`,
    );
  }
  // Unique needle: paths.ts is the only file naming this variable, so its absence proves the bundle
  // is clean even if some future import path spelling slips past the regex above.
  assert.doesNotMatch(bundle, /KB_FACTORY_ROOT/, "bundle contains KB_FACTORY_ROOT — src/paths.ts got bundled");
});
