import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  buildCodeIndex,
  buildCodeIndexFromCheckout,
  codeRootFor,
  resolveVendorRoot,
  flagIdentifiers,
  isPlaceholderIdentifier,
  loadOrBuildCodeIndexForCheckout,
  vendorPresent,
  type CodeIndex,
} from "../ingest/platform/codeIndex.js";
import { createPaths } from "../src/paths.js";

/** Builds a minimal `vendor/shopware/{core,storefront}` fixture tree with a real
 *  `composer/installed.json` + `autoload_classmap.php`, mirroring the shape codeIndex.ts reads. */
function makeFixtureProject(): string {
  const root = mkdtempSync(join(tmpdir(), "kb-codeindex-"));
  mkdirSync(resolve(root, "vendor/composer"), { recursive: true });
  mkdirSync(resolve(root, "vendor/shopware/core/Checkout/Cart"), { recursive: true });
  mkdirSync(resolve(root, "vendor/shopware/core/Framework/Resources/config/packages"), { recursive: true });

  writeFileSync(
    resolve(root, "vendor/composer/installed.json"),
    JSON.stringify({ packages: [{ name: "shopware/core", version_normalized: "6.7.13.0" }] }),
  );
  writeFileSync(
    resolve(root, "vendor/composer/autoload_classmap.php"),
    "<?php\nreturn array(\n  'Shopware\\\\Core\\\\Checkout\\\\Cart\\\\LineItem' => __DIR__ . '/x.php',\n);\n",
  );
  writeFileSync(
    resolve(root, "vendor/shopware/core/Checkout/Cart/LineItem.php"),
    [
      "<?php",
      "class LineItem {",
      "    /**",
      "     * @deprecated tag:v6.8.0 - use getRealName instead",
      "     */",
      "    public function getLabel(): string { return ''; }",
      "",
      "    public function getPrice() { return 1; }",
      "",
      "    public function getRealName() { return ''; }",
      "}",
    ].join("\n"),
  );
  writeFileSync(
    resolve(root, "vendor/shopware/core/Framework/Resources/config/packages/feature.yaml"),
    ["shopware:", "  feature:", "    flags:", "      - name: SOME_UNREAD_FLAG", "        default: true", "      - name: SOME_READ_FLAG", "        default: true"].join(
      "\n",
    ),
  );
  writeFileSync(resolve(root, "vendor/shopware/core/Checkout/Cart/reader.php"), "<?php\n// reads SOME_READ_FLAG somewhere\n");
  writeFileSync(
    resolve(root, "vendor/shopware/core/Checkout/Cart/Configuration.php"),
    ["<?php", "$node", "    ->booleanNode('use_varnish_xkey')", "    ->setDeprecated('shopware/core', '6.8.0', 'no effect')", "    ->end();"].join("\n"),
  );
  writeFileSync(resolve(root, "vendor/shopware/core/Checkout/Cart/cart.xml"), "<argument>%shopware.cart.expire_days%</argument>\n");
  return root;
}

test("resolveVendorRoot: explicit config root, else .sources/shopware/<version>, never a cwd walk-up", () => {
  const root = makeFixtureProject();
  try {
    assert.equal(vendorPresent(root), true);
    assert.equal(vendorPresent(resolve(root, "vendor/shopware")), false);

    const cfg = (extra: Record<string, unknown> = {}) =>
      ({ codeCheck: { enabled: true, batchSize: 5 }, guidelines: { versions: ["6.7", "6.6"] }, ...extra }) as never;

    // 1. codeCheck.projectRoot wins and is resolved against the FACTORY root, not the cwd.
    const p = createPaths({ root: "/factory", env: {} });
    assert.equal(
      resolveVendorRoot(cfg({ codeCheck: { enabled: true, batchSize: 5, projectRoot: root } }), p),
      root,
    );

    // 2. Otherwise the configured versions' .sources roots are probed, in order.
    const sources = createPaths({ root: "/factory", env: { KB_SHOPWARE_ROOT_6_6: root } });
    assert.equal(resolveVendorRoot(cfg(), sources), root, "picks the version that actually has a vendor tree");

    // 3. No vendor anywhere is `undefined`, never a walk up the filesystem into whatever Shopware
    //    project happens to enclose this package: that walk broke fresh clones, because the root
    //    it found belonged to the host project rather than to this package.
    assert.equal(resolveVendorRoot(cfg(), createPaths({ root: "/factory", env: {} })), undefined);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

let index: CodeIndex;
let fixtureRoot: string;
test.before(() => {
  fixtureRoot = makeFixtureProject();
  index = buildCodeIndex(fixtureRoot);
});
test.after(() => rmSync(fixtureRoot, { recursive: true, force: true }));

test("codeIndex: coreVersion + classes + namespace prefixes from the fixture classmap", () => {
  assert.equal(index.coreVersion, "6.7.13.0");
  assert.equal(index.classes.has("Shopware\\Core\\Checkout\\Cart\\LineItem"), true);
  assert.equal(index.namespacePrefixes.has("Shopware\\Core\\Checkout\\Cart"), true);
  assert.equal(index.classes.has("Shopware\\Core\\Checkout\\Cart"), false); // a namespace, not a class
});

test("codeIndex: deprecated method captured within 3 lines of @deprecated", () => {
  assert.equal(index.deprecated.has("getLabel"), true);
  assert.equal(index.deprecated.has("getRealName"), false);
});

test("codeIndex: flags map counts readers, excluding the declaring feature.yaml line itself", () => {
  assert.equal(index.flags.get("SOME_UNREAD_FLAG"), 0);
  assert.equal((index.flags.get("SOME_READ_FLAG") ?? 0) > 0, true);
});

test("flagIdentifiers: absent FQCN under Shopware\\Core\\... that is neither a class nor a namespace", () => {
  const r = flagIdentifiers("See `Shopware\\Core\\Checkout\\Cart\\GhostClass` for details.", index);
  assert.deepEqual(r.absent, ["Shopware\\Core\\Checkout\\Cart\\GhostClass"]);
});

test("flagIdentifiers: a real namespace prefix is never flagged", () => {
  const r = flagIdentifiers("The `Shopware\\Core\\Checkout\\Cart` namespace holds cart classes.", index);
  assert.deepEqual(r.absent, []);
});

test("flagIdentifiers: a known class is never flagged, even without the deprecated member", () => {
  const r = flagIdentifiers("See `Shopware\\Core\\Checkout\\Cart\\LineItem` for details.", index);
  assert.deepEqual(r.absent, []);
  assert.deepEqual(r.deprecated, []);
});

test("flagIdentifiers: InstalledClass::member absent when the member has 0 word hits", () => {
  const r = flagIdentifiers("Call `LineItem::getNoSuchMethod()` to do it.", index);
  assert.deepEqual(r.absent, ["getNoSuchMethod"]);
});

test("flagIdentifiers: members of classes outside the index and ->calls on unknown receivers are not flagged", () => {
  const r = flagIdentifiers("Use `Request::getNoSuchMethod()` and `$client->getNoSuchMethod()`.", index);
  assert.deepEqual(r.absent, []);
});

test("flagIdentifiers: a deprecated member is not flagged by bare name (names collide across classes)", () => {
  const r = flagIdentifiers("Call `LineItem::getLabel()` to read it.", index);
  assert.deepEqual(r.absent, []);
  assert.deepEqual(r.deprecated, []);
});

test("flagIdentifiers: example placeholder methods in a fenced subclass are not flagged", () => {
  const md = ["```php", "class MyLineItem extends LineItem", "{", "    public function getExampleData(): string { return ''; }", "}", "```"].join("\n");
  assert.deepEqual(flagIdentifiers(md, index).absent, []);
});

test("flagIdentifiers: a namespace written with a trailing backslash is never flagged", () => {
  assert.deepEqual(flagIdentifiers("Classes live in `Shopware\\Core\\Checkout\\Cart\\`.", index).absent, []);
});

test("flagIdentifiers: a shopware.* key used only as an unquoted container parameter is present", () => {
  assert.deepEqual(flagIdentifiers("Set `shopware.cart.expire_days` to 120.", index).absent, []);
  assert.deepEqual(flagIdentifiers("Set `shopware.cart.redis_urlx` instead.", index).absent, ["shopware.cart.redis_urlx"]);
});

test("flagIdentifiers: a config key marked ->setDeprecated is deprecated in yaml and dotted form", () => {
  const md = ["```yaml", "shopware:", "  http_cache:", "    use_varnish_xkey: true", "```", "Or `shopware.http_cache.reverse_proxy.use_varnish_xkey`."].join("\n");
  const r = flagIdentifiers(md, index);
  assert.equal(r.deprecated.includes("use_varnish_xkey"), true);
  assert.equal(r.deprecated.includes("shopware.http_cache.reverse_proxy.use_varnish_xkey"), true);
});

test("flagIdentifiers: function declared in a fenced block extending a known class, 0 word hits -> absent", () => {
  const md = ["```php", "class MyLineItem extends LineItem", "{", "    public function getDefinitionClass(): string { return ''; }", "}", "```"].join("\n");
  const r = flagIdentifiers(md, index);
  assert.equal(r.absent.includes("getDefinitionClass"), true);
});

test("flagIdentifiers: an UPPER_SNAKE flag with 0 readers is unread", () => {
  const r = flagIdentifiers("Enable it with the `SOME_UNREAD_FLAG` feature flag.", index);
  assert.deepEqual(r.unread, ["SOME_UNREAD_FLAG"]);
});

test("flagIdentifiers: YAML map keys are never flagged absent (often user-chosen names)", () => {
  const md = ["```yaml", "shopware:", "    some_totally_made_up_key: true", "```"].join("\n");
  assert.equal(flagIdentifiers(md, index).absent.includes("some_totally_made_up_key"), false);
});

test("flagIdentifiers: same shape outside a yaml fence is not scanned (scoped to yaml-tagged fences only)", () => {
  const r = flagIdentifiers("Some prose mentions `some_totally_made_up_key` in passing.", index);
  assert.deepEqual(r.absent.filter((a) => a === "some_totally_made_up_key"), []);
});

/** Builds a minimal `.cache/code/<v>/` checkout tree (sync.ts's shape): `src/Core/...`, a
 *  `feature.yaml`, no composer classmap/installed.json (checkout mode never reads those). */
function makeCheckoutFixture(): string {
  const root = mkdtempSync(join(tmpdir(), "kb-codeindex-checkout-"));
  mkdirSync(resolve(root, "src/Core/Checkout/Cart"), { recursive: true });
  mkdirSync(resolve(root, "src/Core/Framework/Resources/config/packages"), { recursive: true });
  writeFileSync(
    resolve(root, "src/Core/Checkout/Cart/LineItem.php"),
    ["<?php", "namespace Shopware\\Core\\Checkout\\Cart;", "", "class LineItem", "{", "    public function getPrice() { return 1; }", "}"].join("\n"),
  );
  writeFileSync(
    resolve(root, "src/Core/Framework/Resources/config/packages/feature.yaml"),
    ["shopware:", "  feature:", "    flags:", "      - name: SOME_CHECKOUT_FLAG", "        default: true"].join("\n"),
  );
  return root;
}

test("buildCodeIndexFromCheckout: coreVersion strips leading v; classes derived from namespace+class decl", () => {
  const checkoutRoot = makeCheckoutFixture();
  try {
    const checkoutIndex = buildCodeIndexFromCheckout(checkoutRoot, "v6.6.10.1");
    assert.equal(checkoutIndex.coreVersion, "6.6.10.1");
    assert.equal(checkoutIndex.classes.has("Shopware\\Core\\Checkout\\Cart\\LineItem"), true);
    assert.equal(checkoutIndex.namespacePrefixes.has("Shopware\\Core\\Checkout\\Cart"), true);
    assert.equal(checkoutIndex.shortClassNames.has("LineItem"), true);
    assert.equal(checkoutIndex.words.has("getPrice"), true);
    assert.equal(checkoutIndex.flags.get("SOME_CHECKOUT_FLAG"), 0);
    assert.equal(checkoutIndex.vendorHash.length, 64); // sha256 hex
  } finally {
    rmSync(checkoutRoot, { recursive: true, force: true });
  }
});

test("buildCodeIndexFromCheckout: class discovery indexes classes under a Test/Tests directory (Fix 1)", () => {
  const checkoutRoot = makeCheckoutFixture();
  try {
    mkdirSync(resolve(checkoutRoot, "src/Core/Framework/Test/TestCaseBase"), { recursive: true });
    writeFileSync(
      resolve(checkoutRoot, "src/Core/Framework/Test/TestCaseBase/IntegrationTestBehaviour.php"),
      ["<?php", "namespace Shopware\\Core\\Framework\\Test\\TestCaseBase;", "", "trait IntegrationTestBehaviour", "{", "}"].join("\n"),
    );
    const checkoutIndex = buildCodeIndexFromCheckout(checkoutRoot, "v6.6.10.1");
    assert.equal(checkoutIndex.classes.has("Shopware\\Core\\Framework\\Test\\TestCaseBase\\IntegrationTestBehaviour"), true);
    assert.equal(checkoutIndex.shortClassNames.has("IntegrationTestBehaviour"), true);
  } finally {
    rmSync(checkoutRoot, { recursive: true, force: true });
  }
});

test("loadOrBuildCodeIndexForCheckout: caches by (coreVersion, tag) under codeCacheDir", () => {
  const checkoutRoot = makeCheckoutFixture();
  const cacheDir = mkdtempSync(join(tmpdir(), "kb-codeindex-cache-"));
  try {
    const built = loadOrBuildCodeIndexForCheckout(checkoutRoot, "v6.6.10.1", cacheDir);
    assert.equal(existsSync(resolve(cacheDir, "checkout-6.6.10.1.json")), true);
    // Second call must return the cached copy without needing the checkout tree again.
    rmSync(resolve(checkoutRoot, "src"), { recursive: true, force: true });
    const cached = loadOrBuildCodeIndexForCheckout(checkoutRoot, "v6.6.10.1", cacheDir);
    assert.equal(cached.vendorHash, built.vendorHash);
    assert.equal(cached.classes.has("Shopware\\Core\\Checkout\\Cart\\LineItem"), true);
  } finally {
    rmSync(checkoutRoot, { recursive: true, force: true });
    rmSync(cacheDir, { recursive: true, force: true });
  }
});

test("codeRootFor: installed major -> vendor mode with vendor/shopware/<pkg> roots", () => {
  const projectRoot = makeFixtureProject(); // installed shopware/core 6.7.13.0
  const codeCacheDir = mkdtempSync(join(tmpdir(), "kb-coderoot-cache-"));
  try {
    const result = codeRootFor("6.7", { guidelines: { codeCheckouts: {} } }, projectRoot, codeCacheDir);
    assert.ok(result);
    assert.equal(result!.mode, "vendor");
    assert.equal(result!.packageRoots.core, resolve(projectRoot, "vendor/shopware/core"));
    assert.match(result!.codeVersion, /^6\.7\.13\.0\+[0-9a-f]{8}$/);
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
    rmSync(codeCacheDir, { recursive: true, force: true });
  }
});

test("codeRootFor: configured checkout version -> checkout mode with .cache/code/<v>/src/... roots", () => {
  const projectRoot = makeFixtureProject(); // installed major is 6.7, not 6.6
  const codeCacheDir = mkdtempSync(join(tmpdir(), "kb-coderoot-cache-"));
  try {
    const checkoutRoot = resolve(codeCacheDir, "6.6");
    mkdirSync(resolve(checkoutRoot, "src/Core/Checkout/Cart"), { recursive: true });
    writeFileSync(resolve(checkoutRoot, ".tag"), "v6.6.10.1\n");
    writeFileSync(
      resolve(checkoutRoot, "src/Core/Checkout/Cart/LineItem.php"),
      ["<?php", "namespace Shopware\\Core\\Checkout\\Cart;", "class LineItem {}"].join("\n"),
    );
    // Scoped to an empty .sources root on purpose: with the process-wide one the resolver would
    // find the machine's real .sources/shopware/6.6 and this would silently stop testing the
    // legacy .cache/code fallback it is named for.
    const isolated = createPaths({ root: mkdtempSync(join(tmpdir(), "kb-coderoot-empty-")), env: {} });
    const result = codeRootFor("6.6", { guidelines: { codeCheckouts: { "6.6": { repo: "shopware/shopware", tagPattern: "v6.6.*" } } } }, projectRoot, codeCacheDir, isolated);
    assert.ok(result);
    assert.equal(result!.mode, "checkout");
    assert.equal(result!.packageRoots.core, resolve(checkoutRoot, "src/Core"));
    assert.equal(result!.codeVersion.startsWith("6.6.10.1+"), true);
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
    rmSync(codeCacheDir, { recursive: true, force: true });
  }
});

test("codeRootFor: version neither installed major nor a configured checkout -> null", () => {
  const projectRoot = makeFixtureProject();
  const codeCacheDir = mkdtempSync(join(tmpdir(), "kb-coderoot-cache-"));
  try {
    const result = codeRootFor("6.5", { guidelines: { codeCheckouts: { "6.6": { repo: "shopware/shopware", tagPattern: "v6.6.*" } } } }, projectRoot, codeCacheDir);
    assert.equal(result, null);
  } finally {
    rmSync(projectRoot, { recursive: true, force: true });
    rmSync(codeCacheDir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------------------
// isPlaceholderIdentifier (docs-only guideline flagging reuses this filter for
// placeholder identifiers)
// --------------------------------------------------------------------------------

test("isPlaceholderIdentifier: Your*/Example*/My*/Foo/Bar/Acme and <...> are placeholders; real identifiers are not", () => {
  for (const name of ["YourPlugin", "ExampleEntity", "MyPlugin", "Foo", "Bar", "FooBar", "AcmePlugin", "<your-plugin-name>"]) {
    assert.equal(isPlaceholderIdentifier(name), true, name);
  }
  for (const name of ["LineItem", "EntityIndexer", "shopware.cart.expire_days", "Barcode", "Toolbar"]) {
    assert.equal(isPlaceholderIdentifier(name), false, name);
  }
});

test("isPlaceholderIdentifier: judged on the last namespace/dotted-key segment", () => {
  assert.equal(isPlaceholderIdentifier("Shopware\\Core\\Checkout\\Cart\\YourPlugin"), true);
  assert.equal(isPlaceholderIdentifier("Shopware\\Core\\Checkout\\Cart\\LineItem"), false);
  assert.equal(isPlaceholderIdentifier("shopware.custom.your_field"), true);
  assert.equal(isPlaceholderIdentifier("shopware.cart.storage"), false);
});

test("flagIdentifiers: a placeholder FQCN/dotted key in docs is never flagged absent", () => {
  const index: CodeIndex = {
    coreVersion: "6.7.13.0",
    vendorHash: "abc",
    words: new Map(),
    literals: new Set(),
    classes: new Set(["Shopware\\Core\\Checkout\\Cart\\LineItem"]),
    namespacePrefixes: new Set(["Shopware", "Shopware\\Core", "Shopware\\Core\\Checkout", "Shopware\\Core\\Checkout\\Cart"]),
    shortClassNames: new Set(["LineItem"]),
    deprecated: new Set(),
    flags: new Map(),
  };
  const markdown = "Extend `Shopware\\Core\\Checkout\\Cart\\YourPlugin\\YourEntity` and set `shopware.custom.your_field`.";
  const result = flagIdentifiers(markdown, index);
  assert.deepEqual(result.absent, []);
});
