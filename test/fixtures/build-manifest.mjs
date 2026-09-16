// Regenerates test/fixtures/wiki/platform/manifest.json (fileHash per page, treeHash).
// treeHash = sha256 over sorted "<path>:<fileHash>" lines joined by "\n".
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "wiki");
const layer = process.argv[2] ?? "platform";
const pages = {};
const walk = (dir) => {
  for (const name of readdirSync(dir).sort()) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs);
    else if (name.endsWith(".md")) {
      const rel = relative(root, abs).split("\\").join("/");
      const fileHash = createHash("sha256").update(readFileSync(abs)).digest("hex");
      const sourceHash = `src-${name.replace(/\.md$/, "").replace(/[^A-Za-z0-9]+/g, "-")}`;
      pages[rel] = { sourceHash, fileHash };
    }
  }
};
walk(join(root, layer));
const lines = Object.keys(pages).sort().map((p) => `${p}:${pages[p].fileHash}`);
const treeHash = createHash("sha256").update(lines.join("\n")).digest("hex");
const manifest = {
  contract: 1,
  versions: ["6.6", "6.7"],
  lastBuilt: "2026-08-30",
  counts: { pages: Object.keys(pages).length, hubs: 2 },
  hubs: ["platform/hubs/plugins.md", "platform/hubs/store-api.md"],
  pages,
  treeHash,
};
writeFileSync(join(root, layer, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`wrote ${layer}/manifest.json with ${Object.keys(pages).length} pages`);
