# `dev-43` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-43` · `dev` · `Admin migration (Vue 3 / Vite / Pinia / Meteor)` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** My admin plugin still ships a webpack.config.js — how do I move the administration build to Vite for Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. Delete `Resources/app/administration/build/webpack.config.js` and the webpack dependencies: in 6.7 the administration build is Vite-only and unconditional (no `ADMIN_VITE` feature flag exists), and a plugin supplies **no** build config of its own — `build/plugins.vite.ts` synthesises a complete Vite config per extension (`root` = the plugin's `administration/src`, `outDir` = `<plugin>/src/Resources/public/administration` with `manifest: true`, `base` = `/bundles/<technicalFolderName>/administration/`). The only thing a plugin must provide to be built is the entry file `Resources/app/administration/src/main.js` or `main.ts`. `[code: administration: Resources/app/administration/build/plugins.vite.ts:42-64,134-146]` `[code: Framework/Plugin/BundleConfigGenerator.php:126-137]`
2. Custom Vite configuration is optional and goes in `<plugin>/src/Resources/app/administration/src/vite.config.mts` — beside `main.js`, one level deeper than the old `build/` directory and one level below `package.json`. Shopware never passes `configFile`, so Vite performs its implicit lookup relative to that `root`; the file's default export (a config object or a function of `ConfigEnv`) is the **base** and Shopware's inline config is merged over it, so `root`, `build.outDir` and `base` cannot be overridden by the plugin. `[code: administration: Resources/app/administration/build/plugins.vite.ts:61-153,222,266]` `[code: vite v6.4.3 packages/vite/src/node/config.ts:1080-1095,1782-1793]`
3. The build is driven by `var/plugins.json`: `bin/console bundle:dump` writes it, the Vite build throws if it is missing, and only entries with `administration.entryFilePath` are built (the `webpack` key `BundleConfigGenerator` still writes is read by nothing in 6.7). In production the emitted `<plugin>/Resources/public/administration/.vite/entrypoints.json` is read back through `ViteFileAccessorDecorator` (pentatrion/vite-bundle ^8.1) and shipped to the SPA in the `/api/_info/config` `bundles` payload. `[code: administration: Resources/app/administration/build/vite-plugins/utils/index.ts:111-115,175-182]` `[code: administration: Framework/Twig/ViteFileAccessorDecorator.php:71-74]` `[code: administration: Framework/Api/Subscriber/AdminInfoConfigBundlesSubscriber.php:60-82]`

**Trap:** `webpack.config.js` is the pre-6.7 build entry point. In 6.7 it is inert — nothing reads it, so nothing warns — and an answer that keeps it, or that presents `vite.config.mts` as a mandatory drop-in replacement for it, is wrong: the config is optional and lives one directory deeper.

**Official reference URL:** https://developer.shopware.com/docs/guides/upgrades-migrations/administration/vite.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| 6.7 administration is built exclusively with Vite; the package root holds `vite.config.mts` and `build.ts` | `administration: Resources/app/administration/vite.config.mts:5-6` | `import { defineConfig, loadEnv } from 'vite';` |
| `npm run build` only sets `VITE_MODE` and runs `build.ts`; no webpack entry point | `administration: Resources/app/administration/package.json:8` | `"build": "export VITE_MODE=production && ts-node -T build.ts",` |
| `build.ts` runs the core Vite build, then spawns `build/plugins.vite.ts` for every extension | `administration: Resources/app/administration/build.ts:41-48` | `await build();` / `await runPluginsBuild();` |
| A plugin supplies no config: `getBaseConfig()` synthesises the whole per-extension config with `root = extension.path` | `administration: Resources/app/administration/build/plugins.vite.ts:42-64` | `return defineConfig({\n        root: extension.path,` |
| Per-plugin output dir, manifest and prod base URL | `administration: Resources/app/administration/build/plugins.vite.ts:134-146` | `outDir: path.resolve(extension.basePath, 'Resources/public/administration'), emptyOutDir: true, manifest: true,` |
| The required entry file is `main.js` or `main.ts` | `Framework/Plugin/BundleConfigGenerator.php:126-137` | `foreach (['js', 'ts'] as $type) { if (\is_file($absolutePath . '/main.' . $type)) {` |
| Discovery reads `var/plugins.json` and keeps only entries with `administration.entryFilePath` | `administration: Resources/app/administration/build/vite-plugins/utils/index.ts:175-182` | `!!definition.administration && !!definition.administration.entryFilePath &&` |
| Missing `var/plugins.json` throws and names `bundle:dump` | `administration: Resources/app/administration/build/vite-plugins/utils/index.ts:111-115` | `throw new Error(\`The file ${extensionFile} could not be found. Try bin/console bundle:dump to create this file.\`);` |
| `bundle:dump` is the command producing it | `Framework/Plugin/Command/BundleDumpCommand.php:14` | `#[AsCommand(name: 'bundle:dump', …)]` |
| **Deep pass Q1:** no `configFile` key anywhere in the synthesised config, nor at the `build()`/`createServer()` call sites — so Vite's implicit lookup runs | `administration: Resources/app/administration/build/plugins.vite.ts:61-153, :222-230, :266` | `return defineConfig({ root: extension.path, logLevel: …` |
| **Deep pass Q1b:** Vite skips the lookup only when `configFile === false`; otherwise the file's config is the base and the inline object the override | `vite v6.4.3 packages/vite/src/node/config.ts:1080-1095, :1782-1793` | `if (configFile !== false) { const loadResult = await loadConfigFromFile(…) … config = mergeConfig(loadResult.config, config)` |
| **Deep pass Q2:** `root` = `PROJECT_ROOT + basePath + administration.path` = `<plugin>/src/Resources/app/administration/src`; default export may be an object or a function of `ConfigEnv` | `administration: Resources/app/administration/build/vite-plugins/utils/index.ts:104-106, :204-210`; `vite v6.4.3 config.ts:1810-1813` | `path: '/…/SwagExtensionStore/src/Resources/app/administration/src'` / `typeof configExport === 'function' ? configExport(configEnv) : configExport` |
| **Deep pass Q4:** production assets flow through pentatrion/vite-bundle; `ViteFileAccessorDecorator` reads each bundle's `.vite/entrypoints.json` | `administration: Framework/Twig/ViteFileAccessorDecorator.php:71-74` | `return '/Resources/public/administration/.vite/' . self::FILES[$fileType];` |
| **Deep pass Q4:** plugin bundles reach the client via the `/api/_info/config` bundles payload, not script tags | `administration: Framework/Api/Subscriber/AdminInfoConfigBundlesSubscriber.php:60-82` | `$viteEntryPoints = $this->viteFileAccessorDecorator->getBundleData($bundle);` |
| **Deep pass Q5:** `bin/build-administration.sh` npm-installs each extension's `package.json` one level above `src`; Vite sets only aliases + `preserveSymlinks` | `bin/build-administration.sh:60-105`; `administration: Resources/app/administration/build/plugins.vite.ts:99-137` | `if [[ -f "$path/package.json" && ! -d "$path/node_modules" … ]]; then … npm install --omit=dev` |
| Plugin builds alias `vue` to a shim over `window.Shopware.Vue` — a plugin must not bundle Vue | `administration: Resources/app/administration/build/vite-plugins/externals-plugin/index.ts:42-43` | `module.exports = window['Shopware']?.['Vue']` |
| `.html.twig` imports keep working: `TwigPlugin()` is part of every extension config | `administration: Resources/app/administration/build/plugins.vite.ts:67-70` | `plugins: [ TwigPlugin(), AssetPlugin(…), AssetPathPlugin(…),` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A plugin's `administration/build/webpack.config.js` is still read in 6.7 | absent | `BundleConfigGenerator` still writes a `webpack` key into `var/plugins.json`, but nothing in the 6.7 tree reads it; grep over the admin `build/`, `src/`, `build.ts` yields only three stale comments in `src/core/application.ts`. `Framework/Plugin/BundleConfigGenerator.php:80` |
| webpack is still a dependency of the administration package | absent | `grep -n webpack package.json` matches only `@eslint/compat`; no webpack in dependencies or devDependencies |
| `plugins.vite.ts` disables plugin-side configs with `configFile: false` | absent | the string `configFile` does not occur in `build/plugins.vite.ts` at all |
| An `ADMIN_VITE` / `FEATURE_ADMIN_VITE` flag gates the Vite admin build in 6.7 | absent | `grep -rni ADMIN_VITE vendor/shopware` returns zero hits; `Framework/Resources/config/packages/feature.yaml` lists no such flag |
| A per-extension `resolve.modules` / node_modules root is configured | absent | `resolve` holds only alias entries and `preserveSymlinks: true` (`plugins.vite.ts:99-115`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| the shape of the extension record the Vite build consumes (worked example in source) | `administration: Resources/app/administration/build/vite-plugins/utils/index.ts:88-105` |
| the admin webpack config existed in v6.6.0.0 and was already gone by v6.6.10.0 | `github.com/shopware/shopware` tree listings at `v6.6.0.0` vs `v6.6.10.0` |
| readiness check fails when a bundle's admin package yields zero entryPoints | `administration: Framework/SystemCheck/AdministrationReadinessCheck.php:112-117` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `bin/build-administration.sh` fails after 6.6 → 6.7 because a webpack-era tilde SCSS import resolves to a non-existent path | 6.7 | closed | https://github.com/shopware/shopware/issues/10754 |
| `bin/watch-administration.sh` reports "Plugin injected successfully" but plugin admin modules are not loaded in dev | 6.7 | closed | https://github.com/shopware/shopware/issues/9393 |
| `[vite:css] [sass] Undefined variable` — webpack-era style resolution no longer holds | 6.7 | closed | https://github.com/shopware/shopware/issues/9481 |
| Blog post: plugin Vite config lives at `…/administration/src/vite.config.mts`, one directory deeper than `build/webpack.config.js` | 6.7 | open | https://www.xictron.com/en/blog/shopware-plugins-6-7-migration-symfony-vite-2026/ |
| Storefront component dev server ignores a plugin's `vite.components.config.mts` | unclear | open | https://github.com/shopware/shopware/issues/19032 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Where does the build look for a plugin config, and is a plugin-side config honoured at all? | deep pass Q1/Q1b/Q2 | Honoured. Shopware never sets `configFile`, so Vite's implicit lookup runs against `root` = `<plugin>/src/Resources/app/administration/src`; the file is the base, Shopware's inline config the override. |
| Is a plugin `webpack.config.js` still read in 6.7? | code lane absence | No, and no warning is emitted — it is inert. |
| Does `ADMIN_VITE` still exist and gate anything? | deep pass Q3 | No such flag exists in 6.7.13.0; the Vite build is unconditional. |
| Which mechanism loads admin assets in production? | deep pass Q4 | Both ends of one chain: per-plugin `Resources/public/administration` output feeding pentatrion/vite-bundle via `ViteFileAccessorDecorator`. |
| Are a plugin's own npm dependencies installed and resolvable? | deep pass Q5 | Yes — installed by `bin/build-administration.sh` into `<plugin>/src/Resources/app/administration/node_modules`, resolved by ordinary Node upward lookup. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Administration build switched to Vite with 6.7 | "That's why we decided to switch to Vite with Shopware 6.7." | `guides/upgrades-migrations/administration/vite.md:19` | yes |
| Plugins only need to act if they supply their own `webpack.config.js`; apps unaffected | "For plugins, you only need to get active if you currently extend the webpack config…" | `…/vite.md:23` | yes |
| Migration steps: create `vite.config.mts` in `…/administration/src`, remove the old webpack config and its dependencies | "1. Create a new config file `vite.config.mts` … Previously, you had a `webpack.config.js` in … `administration/build/`" | `…/vite.md:29-32` | partly — the directory is right, but the file is optional, not a required step |
| Config sits beside the entry file in `src/`; `package.json` stays one level up | "create a `vite.config.mts` file in the `<plugin root>/src/Resources/app/administration/src/` directory … Note that `package.json` stays in …" | `guides/plugins/plugins/dependencies/using-npm-dependencies.md:42` | yes |
| No custom config needed merely to consume npm packages | "Vite resolves npm packages from your plugin's `node_modules` directory automatically…" | `…/using-npm-dependencies.md:28` | yes |
| Bundle list produced by `BundleDumpCommand` into `var/plugins.json` | "…written to `<shopwareRoot>/var/plugins.json` by the `…\BundleDumpCommand`." | `…/vite.md:74` | yes |
| Vite's `build` auto-loads `vite.config` files from the entry file path | "The `build` function of Vite will automatically load `vite.config` files from the path of the entry file." | `…/vite.md:90-92` | yes (via Vite's implicit lookup against `root`) |
| The system sits behind the feature flag `ADMIN_VITE` | "The system is already in place and can be tested by activating the feature flag: `ADMIN_VITE`." | `…/vite.md:70` | no — no such flag exists in 6.7.13.0 |
| Vue imports in plugins are rewritten to destructure from `Shopware.Vue` | "This solves the problem of having multiple Vue instances." | `…/vite.md:128` | yes |
| The Administration uses Webpack; extend it via `administration/build/webpack.config.js` | "The Shopware 6 Administration uses Webpack as a static module bundler." | `guides/plugins/plugins/administration/advanced-configuration/extending-webpack.md:12-16` | no — contradicted by code |
| The Storefront build still uses Webpack | "The Storefront build system continues to use Webpack." | `…/using-npm-dependencies.md:67` | not examined (out of scope for this query) |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `vite.md` is framed as "Future Development Roadmap" and says Vite "can be tested by activating the feature flag: `ADMIN_VITE`" | No `ADMIN_VITE` flag exists anywhere in `vendor/shopware`; `feature.yaml` lists none, and the only build script is the Vite one. The Vite admin build is unconditional in 6.7. | `Framework/Resources/config/packages/feature.yaml`; `administration: Resources/app/administration/package.json` |
| `extending-webpack.md` still documents `administration/build/webpack.config.js` as the way to extend the Administration build, with no deprecation note | No webpack config and no webpack dependency ship in the 6.7 administration package; the `webpack` key `BundleConfigGenerator` writes into `var/plugins.json` is read by nothing. A plugin `webpack.config.js` is inert. | `Framework/Plugin/BundleConfigGenerator.php:80` |
| `vite.md` step 1 presents creating `vite.config.mts` as a required migration step, a like-for-like replacement of the webpack config | The build synthesises the full config itself; a plugin-side config is optional, and where present it is merged **under** Shopware's inline config, so `root`, `build.outDir` and `base` cannot be overridden. | `administration: Resources/app/administration/build/plugins.vite.ts:42-64`; `vite v6.4.3 config.ts:1080-1095` |
| The live page (fetched 2026-09-12) still carries the roadmap framing, while `using-npm-dependencies.md` states flatly that the migration happened in 6.7 | The code settles it: migrated, unflagged, in 6.7.13.0. | `administration: Resources/app/administration/vite.config.mts:5-6` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Create `vite.config.mts` in `YourApp/src/Resources/app/administration/src` (the old `webpack.config.js` lived in `YourApp/src/Resources/app/administration/build/`), remove the webpack config and its webpack dependencies from `package.json`. | rewritten (facts 1 + 2) | The directory is correct, but the fact wrongly made the config mandatory. Code shows `build/plugins.vite.ts` synthesises the whole config and requires only `src/main.js|ts`; a plugin config is optional and is merged as the base under Shopware's inline overrides. |
| Bundle info is written to `<shopwareRoot>/var/plugins.json` by `Shopware\Core\Framework\Plugin\Command\BundleDumpCommand`, triggerable with `php bin/console bundle:dump` and also run as part of `composer build:js:admin` and `composer watch:admin`. | kept, retagged (fact 3) | Confirmed by `BundleDumpCommand.php:14` and by the loader that throws when the file is missing. |
| The switch is behind the `ADMIN_VITE` feature flag; in production assets are loaded through the `pentatrion_vite` Symfony bundle and `vite-plugin-symfony`'s `entrypoints.json`. | split — flag clause removed, pentatrion clause kept | No `ADMIN_VITE` flag exists in 6.7.13.0 (grep over `vendor/shopware` returns zero hits; `feature.yaml` lists none): the Vite build is unconditional. The pentatrion/`entrypoints.json` half is confirmed and is now folded into fact 3 together with the per-plugin `Resources/public/administration` output that feeds it. |
