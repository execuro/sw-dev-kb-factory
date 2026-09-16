# `dev-48` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-48` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** After upgrading, my storefront JavaScript plugin no longer loads — how do I register it asynchronously with `PluginManager` and where does the compiled file have to be shipped?

**Expected answer — every fact an answer must contain:**

1. The only entry point Shopware accepts is `<plugin root>/src/Resources/app/storefront/src/main.ts`, falling back to `main.js`; it is discovered through `var/plugins.json` (written by `bin/console bundle:dump`), and a plugin missing from that file is silently not built. Where the plugin class file itself lives below that directory is convention, not enforced. The class extends the plugin base class — both `const { PluginBaseClass } = window;` (assigned by the storefront runtime) and `import Plugin from 'src/plugin-system/plugin.class';` work in 6.7 — and implements `init()`, which the manager calls on `DOMContentLoaded`; a missing `init()` only produces a console warning.  `[code: storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178]` `[code: core Framework/Plugin/BundleConfigGenerator.php:127]` `[code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:798]` `[code: storefront Resources/app/storefront/src/plugin-system/plugin.class.js:32]`
2. Async registration is the ordinary `PluginManager.register(name, pluginClass, selector, options)` call with a lazy import in place of the class — `PluginManager.register('ExamplePlugin', () => import('./example-plugin/example-plugin.plugin'), '[data-example-plugin]')`. There is no separate async API or `async` option: `register()` infers it from the argument having no `prototype` own-property, so passing a real class still registers eagerly. The import runs only if the selector matches an element on the page, and the imported module **must** have a default export — otherwise the plugin is skipped with a console warning and no error.  `[code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:80]` `[code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:339]` `[code: storefront Resources/app/storefront/src/plugin-system/plugin.manager.js:428]`
3. The compiled file must be shipped at exactly `<plugin root>/src/Resources/app/storefront/dist/storefront/js/<asset-name>/<asset-name>.js`, where `<asset-name>` is the bundle's technical name converted CamelCase → kebab-case (`SwagBasicExample` → `swag-basic-example`). If that file is absent the plugin contributes no scripts at all, silently. The extra chunks that lazy imports produce land in the same `js/<asset-name>/` folder (content-hashed in production) and must be shipped too — theme compilation copies the whole folder.  `[code: storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:129]` `[code: storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:243]` `[code: storefront Resources/app/storefront/webpack.config.js:376]` `[code: storefront Theme/ThemeCompiler.php:262]`

**Trap:** Plugin storefront JS is still built by **webpack** in 6.7 — the Vite switch applies to the administration, not to the plugin storefront bundle. An answer that tells the author to move to `vite.config.mts` for the storefront is wrong. Second trap: there is no `registerAsync()` and no `{ async: true }` option.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/add-custom-javascript.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `register()` keeps the same four parameters; the JSDoc now types the class argument as an import function | `storefront …/src/plugin-system/plugin.manager.js:659-668` | `@param {function(): Promise<{readonly default?: *}>} pluginClass` |
| Async-ness is inferred from a missing `prototype`, not declared | `storefront …/src/plugin-system/plugin.manager.js:74-85` | `// If we cannot find the prototype of the class, we assume it will be loaded async` … `return this._registry.set(pluginName, pluginClass, selector, options, true);` |
| The registry stores the flag under `async` | `storefront …/src/plugin-system/plugin.registry.js:47-55` | `if (async) { pluginMap.set('async', true);` |
| The lazy import runs only when the selector matches | `storefront …/src/plugin-system/plugin.manager.js:339-362` | `if (selector.length > 0) { queue.push({ pluginName, pluginClassPromise: plugin.get('class') }); }` |
| A missing default export skips the plugin with a warning | `storefront …/src/plugin-system/plugin.manager.js:428-441` | `if (!module?.default) { console.warn(\`The async plugin "${pluginName}" could not be loaded and will be skipped.\`); return null; }` |
| A failed import does not abort the page | `storefront …/src/plugin-system/plugin.manager.js:237-248` | `if (this._isUnresolvedAsyncPlugin(plugin)) { continue; }` |
| Core registers nearly every plugin with the lazy form | `storefront …/src/main.js:53-55` | `PluginManager.register('ScrollUp', () => import('src/plugin/scroll-up/scroll-up.plugin'), '[data-scroll-up]');` |
| Initialization is wired to `DOMContentLoaded` and awaits the async fetch | `storefront …/src/main.js:198-199`; `plugin.manager.js:237-256` | `document.addEventListener('DOMContentLoaded', () => { PluginManager.initializePlugins();` … `await this._fetchAsyncPlugins();` |
| `init()` is a warning stub, not abstract | `storefront …/src/plugin-system/plugin.class.js:32-58` | `init() { console.warn(\`The "init" method for the plugin "${this._pluginName}" is not defined. The plugin will not be initialized.\`); }` |
| `window.PluginBaseClass` is assigned at module scope by the manager | `storefront …/src/plugin-system/plugin.manager.js:798-799` | `window.PluginManager = PluginManager;` / `window.PluginBaseClass = PluginBaseClass;` |
| …and it is the same default export of `plugin.class`, present in the minified dist | `storefront …/src/plugin-system/plugin.manager.js:3`; `dist/storefront/storefront.js` | `import PluginBaseClass from 'src/plugin-system/plugin.class';` / `window.PluginManager=nM,window.PluginBaseClass=nS.A;` |
| Core's own plugins use the import form, never the window global | `storefront …/src/plugin/scroll-up/scroll-up.plugin.js:1,7` | `import Plugin from 'src/plugin-system/plugin.class';` … `export default class ScrollUpPlugin extends Plugin {` |
| The import form resolves in a plugin bundle because the `src` alias comes from the merged core config | `storefront …/webpack.config.js:319-325` | `alias: { src: path.resolve(__dirname, 'src'), …}` |
| Entry file: `main.ts` preferred, `main.js` fallback | `storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178-191` | `if (\is_file($path . '/main.ts')) { return 'app/storefront/src/main.ts'; }` |
| …the same two-name probe on the bundle-config side, rooted at `Resources/app/storefront/src` | `core Framework/Plugin/BundleConfigGenerator.php:81-86,127-139` | `'path' => 'Resources/app/storefront/src',` … `foreach (['js', 'ts'] as $type) { if (\is_file($absolutePath . '/main.' . $type)) {` |
| That root is `<plugin root>/src` because it hangs off Symfony's `Bundle::getPath()` | `vendor/symfony/http-kernel/Bundle/Bundle.php:99-106` | `$this->path = \dirname($reflected->getFileName());` |
| Compiled file location, and silence when it is missing | `storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:129-140` | `$scriptPath = $path . \sprintf('/Resources/app/storefront/dist/storefront/js/%s/%s.js', $assetName, $assetName); if (\is_file($scriptPath)) { … } return $config;` |
| `<asset-name>` = technical name, CamelCase → kebab-case | `storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfiguration.php:243-248` | `return \str_replace('_', '-', $normalizer->normalize($this->technicalName));` |
| The webpack build emits exactly that layout, with hashed chunks in production | `storefront …/webpack.config.js:376-392` | `filename: … \`./js/${plugin.technicalName}/[name].js\`` / `chunkFilename: … \`./js/${plugin.technicalName}/[name].[chunkhash:6].js\`` |
| Theme compilation copies the whole `js/<folder>` directory, chunks included | `storefront Theme/ThemeCompiler.php:262-289` | `$pathToJsFiles .= '/js/' . $folderName;` … `$targetPath = $themePath . '/js/' . $folderName;` |
| Chunk URLs resolve from `window.themeJsPublicPath`, set by the core bundle | `storefront …/src/main.js:218-220`; `Resources/views/storefront/layout/meta.html.twig:322-329` | `window.__webpack_public_path__ = window.themeJsPublicPath;` / `window.themeJsPublicPath = '{{ asset('js/', 'theme') }}';` |
| The build discovers plugin entries from `var/plugins.json` | `storefront …/webpack.config.js:60-71` | `The file ${pluginFile} could not be found. Try bin/console bundle:dump to create this file.` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dedicated async API (`registerAsync`, or `register(..., { async: true })`) | absent | `plugin.manager.js` exposes only `register/deregister/extend/override/initializePlugin(s)`; the flag is internal, derived in `register()` and stored by the registry (`plugin.manager.js:80-82`). |
| Vite builds plugin storefront JavaScript in 6.7 | absent | the `production` npm script still runs webpack for the storefront/plugin bundles; the Vite configs cover Shopware's own component library (`Resources/app/storefront/package.json:26`). |
| Synchronous registration with a plugin class no longer works | absent | `register()` falls through to the non-async path whenever the argument has a `prototype`, and core still imports three plugins synchronously (`src/main.js:32-36`). |
| Core storefront plugins obtain the base class from `window.PluginBaseClass` | absent | 0 files under `src/plugin/` reference it; 60 use `from 'src/plugin-system/plugin.class'`. The identifier appears only twice in `src/`, both in `plugin.manager.js` (`:3`, `:799`). |
| The `<plugin-name>/<plugin-name>.plugin.js` file naming is enforced | absent | `BundleConfigGenerator::getEntryFile()` probes only `main.js`/`main.ts` directly under `Resources/app/storefront/src`, and webpack derives the entry solely from that `entryFilePath` (`BundleConfigGenerator.php:127-139`). |
| `init()` is abstract or throws | absent | its whole body is a `console.warn`; `_init()` sets `_initialized = true` regardless (`plugin.class.js:32-37`). |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Async registration and initialization end to end | `storefront …/test/plugin-system/plugin.manager.test.js:181-194` |
| A failing async import warns and is skipped; other plugins still initialise | `storefront …/test/plugin-system/plugin.manager.test.js:237-261` |
| The storefront entry publishes `PluginManager` and `PluginBaseClass` on `window` | `storefront …/test/main.test.js:14,26-27` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A single missing compiled async JS file caused a hard error that stopped every other storefront plugin | 6.6/6.7, fix merged 2026-05 | closed | github.com/shopware/shopware/issues/11592 |
| Merged fix: "Storefront JS crash on failed plugin load" | 6.7 line | merged | github.com/shopware/shopware/pull/16999 |
| Colliding webpack chunk ids between two plugins silently dropped one from the registry | 6.5.8.9 (all.js era) | closed | github.com/shopware/shopware/issues/10977 |
| Docs tell authors to use `window.PluginBaseClass` but "basically no Shopware JS plugin currently does this" | 6.6 guidance, open 2026-07 | open | github.com/shopware/shopware/issues/14577 |
| "Plugin is already registered" from a single `register()` call, attributed to duplicate bundling | 6.4.20 | open | forum.shopware.com/t/…/99365 |
| Vite watch mode reported plugins injected but not loading | 6.7.0.0.RC.3 | closed | github.com/shopware/shopware/issues/9393 |
| Third-party write-ups frame 6.7 as "webpack replaced by Vite" — both scope it to the administration directory | 6.7 | open | xictron.com; tobias-schaefer.com |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Webpack or Vite for the storefront in 6.7? | code lane | Webpack — the `production` script and `webpack.config.js` build plugin entries. |
| Exact compiled-JS path? | code lane | `Resources/app/storefront/dist/storefront/js/<asset-name>/<asset-name>.js`, asset name kebab-cased. |
| Does an aggregated `all.js` still exist? | code lane | Not produced by the 6.7 build; output is per-plugin `js/<technicalName>/`. |
| Signature of `register()`? | code lane | `(pluginName, pluginClass, selector = document, options = {})`; the second argument takes a class or a lazy import function. |
| Is `initializePlugins()` async? | code lane | Yes — `async initializePlugins()` awaits `_fetchAsyncPlugins()`. |
| Is a failed dynamic import caught? | code lane | Yes — warns and skips; the remaining plugins still initialise. |
| Does `register()` throw on a duplicate name? | code lane | No — `console.warn` and return. |
| Is `window.PluginBaseClass` assigned, and does core use it? | deep pass | Assigned at `plugin.manager.js:798-799` and present in the minified dist; core itself uses the import instead (0 of 60 files use the global). |
| Where do lazy chunks land? | code lane | Same `js/<technicalName>/` folder, content-hashed in production; `ThemeCompiler` copies the whole folder. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Entry point is an auto-discovered `main.js` under `<plugin root>/src/Resources/app/storefront/src` | "Shopware is automatically looking for a `main.js` file in a directory …" | add-custom-javascript.md:69 | partly — `main.ts` is probed first |
| Synchronous form `PluginManager.register('ExamplePlugin', ExamplePlugin, '[data-example-plugin]')` | quoted | add-custom-javascript.md:98 | yes |
| Async plugin = dynamic import callback as second argument | "you can provide a dynamic import inside `PluginManager.register()`" | add-custom-javascript.md:105-106 | yes |
| The exact async form | `PluginManager.register('ExamplePlugin', () => import('./example-plugin/example-plugin.plugin'), '[data-example-plugin]');` | add-custom-javascript.md:113 | yes |
| Detected automatically, excluded from `storefront.js`, downloaded only when the selector is present | quoted | add-custom-javascript.md:116-117 | yes |
| `const { PluginBaseClass } = window;` | quoted | add-custom-javascript.md:32 | yes — the global is assigned; but core itself uses the import |
| Every plugin must implement `init()`, which runs on `DOMContentLoaded` | quoted | add-custom-javascript.md:40 | `DOMContentLoaded`: yes. "Must": only a console warning, no error |
| Compiled file at `.../dist/storefront/js/<plugin-name>/<plugin-name>.js`, recognised automatically, must be shipped | quoted | add-custom-javascript.md:244-246 | yes, with `<asset-name>` = kebab-cased technical name |
| Build with `shopware-cli project storefront-build` or `composer run build:js:storefront` | quoted | add-custom-javascript.md:256 | not examined in the source tree |
| Theme page spells the path with lowercase `resources` | quoted | add-css-js-to-theme.md:94 | no — the factory checks `Resources` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Shopware automatically looks for a `main.js` file as the entry point | `main.ts` is probed first and `main.js` is only the fallback; nothing else is accepted | `storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:178-191`; `core Framework/Plugin/BundleConfigGenerator.php:127-139` |
| The compiled file is at `.../js/<plugin-name>/<plugin-name>.js`, and the theme page spells the same path with lowercase `resources` | The factory checks exactly `<plugin>/Resources/app/storefront/dist/storefront/js/<asset-name>/<asset-name>.js` with `<asset-name>` the CamelCase→kebab-case technical name; the lowercase spelling would not match, and a missing file yields no scripts and no error | `…StorefrontPluginConfigurationFactory.php:129-140`; `StorefrontPluginConfiguration.php:243-248` |
| Community write-ups say 6.7 replaced webpack with Vite for plugin builds | Plugin storefront entries are still compiled by `webpack.config.js`; the `production` script runs webpack and the Vite configs cover Shopware's own component library | `storefront Resources/app/storefront/package.json:26`; `webpack.config.js:376-392` |
| The docs prescribe `const { PluginBaseClass } = window;` | The global exists and works, but shipped core uses `import Plugin from 'src/plugin-system/plugin.class'` in all 60 of its plugin files — and since the plugin webpack config declares no `externals`, the import compiles a second copy of the class rather than reusing the one inside `storefront.js`. Both forms work for `extends`; only the window form is identical to core's copy. | `storefront …/plugin.manager.js:3,798-799`; `src/plugin/scroll-up/scroll-up.plugin.js:1,7`; `webpack.config.js:376-408` |
| The docs state every plugin "has to implement" `init()` | The base class defines `init()` as a stub that only warns; `_init()` marks the instance initialized regardless — no throw | `storefront …/src/plugin-system/plugin.class.js:32-58` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The plugin class extends `PluginBaseClass` taken from `window` (`const { PluginBaseClass } = window;`) and lives at `<plugin root>/src/Resources/app/storefront/src/<plugin-name>/<plugin-name>.plugin.js`; `init()` runs on `DOMContentLoaded`. | revised | The `<plugin-name>/<plugin-name>.plugin.js` path is not enforced anywhere — only `main.ts`/`main.js` directly under `Resources/app/storefront/src` is probed, so the old text presents convention as a requirement. The window form is confirmed to work but is not the only working form: shipped core uses the import in all 60 of its plugin files. `main.ts` preference and the `var/plugins.json`/`bundle:dump` prerequisite added; the `init()` claim softened to what the code does (warn, not fail). |
| Registration happens in the auto-discovered entry point `<plugin root>/src/Resources/app/storefront/src/main.js`; asynchronous registration is `PluginManager.register('ExamplePlugin', () => import('./example-plugin/example-plugin.plugin'), '[data-example-plugin]')`, and such plugins are excluded from the `storefront.js` bundle and load on demand. | revised | Correct as far as it went, but it omitted the two things that actually decide whether the async form works: async-ness is inferred from the missing `prototype` (there is no async API or option, and a class still registers eagerly), and the imported module must have a default export or the plugin is silently skipped with a console warning — the exact "no longer loads" symptom this query describes. |
| The compiled file must be shipped at `<plugin root>/src/Resources/app/storefront/dist/storefront/js/<plugin-name>/<plugin-name>.js`, built with `shopware-cli project storefront-build` or `composer run build:js:storefront`. | revised | `<plugin-name>` sharpened to `<asset-name>` — the bundle technical name converted CamelCase → kebab-case, which is what the factory computes. Added that the file's absence is silent, and that the lazy-import chunks in the same folder must also be shipped. The build-command clause was dropped from the fact: no lane examined either command against the source, so it is not evidence-backed. |
| **Trap:** Plugins written before 6.6 statically imported the plugin class into an always-bundled `all.js`; the page documents the current `window.PluginBaseClass` + dynamic-import registration and the `dist` output path instead. | removed | No lane found an `all.js` artefact in 6.7 — the community reference to it is from the 6.5 era (issue #10977), and the 6.7 build emits per-plugin `js/<technicalName>/` output. Replaced by the trap the code does support: the storefront is still webpack, not Vite, and there is no dedicated async registration API. |
