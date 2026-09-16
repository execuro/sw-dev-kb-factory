# `dev-33` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-33` · `dev` · `Administration` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-32-41` |
| Core version | `6.7.13.0` |

**Query:** How do I register a custom Administration module from my plugin, and what has to line up for it to actually show up after a build?

**Expected answer — every fact an answer must contain:**

1. The module is registered with `Shopware.Module.register('swag-example', { … })` from the module's `index.js`, which the plugin's admin entry file must import; that entry file has to be exactly `<plugin root>/src/Resources/app/administration/src/main.js` or `main.ts` — no other name is detected. Registration aborts (console warning, no exception) if the module id contains no hyphen, if the id is already registered, or if the manifest declares neither `routes` nor `routeMiddleware`; `display: false` aborts it silently. `type` is not something the answer must set — it defaults to `'plugin'` when omitted.  `[code: administration package — Resources/app/administration/src/core/factory/module.factory.ts:159,170-177,180-189,192-198,202-210]` `[code: Framework/Plugin/BundleConfigGenerator.php:127-139]`
2. Showing up after a build requires the whole chain, not just a green build: the plugin must be **active** to reach `var/plugins.json` (written by `bin/console bundle:dump`, which the Vite build throws without), the Vite build writes the plugin's assets plus `src/Resources/public/administration/.vite/entrypoints.json`, and `bin/console assets:install` must copy `Resources/public` into `public/bundles/<dir>` for the `/bundles/<name>/administration/…` URLs to resolve. If `entrypoints.json` is missing, `ViteFileAccessorDecorator` returns an empty array with no log and the bundle is dropped from the `bundles` key of `/api/_info/config` — the module never loads and nothing warns; only `bin/console system:check` reports it.  `[code: Framework/Plugin/BundleConfigGenerator.php:60-63]` `[code: administration package — Framework/Twig/ViteFileAccessorDecorator.php:98-101]` `[code: administration package — Framework/Api/Subscriber/AdminInfoConfigBundlesSubscriber.php:70-81]` `[code: Framework/Adapter/Asset/AssetInstallCommand.php:21-24,54-58]`
3. A menu entry is a separate thing from the module: a plugin module's navigation entry is dropped unless it declares `parent` (first-level plugin entries are refused) and a non-empty `label`, plugin entries are force-shifted by `position += 1000`, and the entry renders **its own** `icon` — there is no fallback to the module manifest's `icon`, so an entry without one renders `<mt-icon name="undefined">`. A routes-only module without `navigation` still registers and is reachable by URL.  `[code: administration package — src/core/factory/module.factory.ts:284,290-327]` `[code: administration package — src/app/component/structure/sw-admin-menu-item/index.js:127-129]`

**Trap:** The answer must not claim `settingsItem.group` is restricted to `shop` / `system` / `plugins` — no runtime validation exists, `shop` is not even in the 6.7 TypeScript union, and an arbitrary group renders as its own tile group with an untranslated heading.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/administration/module-component-management/add-custom-module.html
<!-- expected:end -->

## Evidence — code (decisive)

Source version `6.7.13.0`. Administration paths are inside the `shopware/administration` package; core paths are relative to `vendor/shopware/core`.

| fact | citation | excerpt |
| --- | --- | --- |
| Registration goes through the module factory's `registerModule(moduleId, module)` | `…/src/core/factory/module.factory.ts:159` | `function registerModule(moduleId: string, module: ModuleManifest): false \| ModuleDefinition {` |
| The module id must contain a hyphen (`[namespace]-[name]`), else registration aborts | `…/module.factory.ts:180-189` | `if (splitModuleId.length < 2) { warn(…'Abort registration.'); return false; }` |
| A duplicate module id aborts registration | `…/module.factory.ts:170-177` | `A module with the identifier "${moduleId}" is registered already. Abort registration.` |
| A module with neither `routes` nor `routeMiddleware` is not registered | `…/module.factory.ts:202-210` | `if (!hasOwnProperty(module, 'routes') && !module.routeMiddleware) { … return false; }` |
| `display: false` silently prevents registration | `…/module.factory.ts:192-198` | `if (!module.display) { return false; }` |
| `type` **defaults** to `plugin` when the manifest omits it | `…/module.factory.ts:160` | `const type = module.type \|\| 'plugin';` |
| Route name/path derive from the module id (`swag-example` + `index` → `swag.example.index`, `/swag/example/index`) unless `routePrefixName`/`routePrefixPath` override | `…/module.factory.ts:218-231` | `route.name = \`${routePrefixName}.${routeKey}\`; … route.path = \`/${routePrefixPath}/${route.path}\`;` |
| Routes reference a component by its registered **name** string | `…/module.factory.ts:406-430` | `route.components = { default: route.component as string };` |
| A plugin module's navigation entry must declare `parent` | `…/module.factory.ts:293-300` | `if (module.type === 'plugin' && !navigationEntry.parent) { warn(…); return false; }` |
| A navigation entry without `label` is dropped | `…/module.factory.ts:312-315` | `if (!navigationEntry.label \|\| !navigationEntry.label.length) { … return false; }` |
| Plugin navigation positions are shifted by +1000 (or set to 1000) | `…/module.factory.ts:317-324` | `navigationEntry.position += 1000;` |
| `navigation` is passed through untouched; the menu service spreads it verbatim | `…/module.factory.ts:327`; `…/src/app/service/menu.service.js:24-34` | `moduleDefinition.navigation = module.navigation;` |
| The menu item renders the icon of the **entry**, via an identity helper — no manifest fallback | `…/sw-admin-menu-item/sw-admin-menu-item.html.twig:23-29`; `…/sw-admin-menu-item/index.js:127-129` | `:name="getIconName(entry.icon)"` · `getIconName(name) { return \`${name}\`; }` |
| Entries nested at level 4 or deeper are dropped with a console error | `…/src/app/component/structure/sw-admin-menu/index.js:113-121` | `is nested on level 4 or higher` |
| A manifest `flag` removes the module from the registry when the feature flag is inactive | `…/module.factory.ts:145-151` | `if (hasOwnProperty(value.manifest, 'flag') && !Shopware.Feature.isActive(…)) { modules.delete(key); }` |
| A `settingsItem` is dropped (warn only) unless it has `group` **and** `to` **and** (`icon` or `iconComponent`) | `…/module.factory.ts:509-546` | `if (settingsItem.group && settingsItem.to && (settingsItem.icon \|\| settingsItem.iconComponent)) {` |
| The settings store creates a bucket for any unknown group string on demand | `…/src/app/store/settings-item.store.ts:60-62` | `if (!hasOwnProperty(this.settingsGroups, group)) { this.settingsGroups[group] = []; }` |
| An unknown group's heading degrades to an untranslated key | `…/src/module/sw-settings/page/sw-settings-index/index.ts:194-197` | `return this.$t(\`sw-settings.index.tab${upper}\`);` |
| The plugin's admin entry file must be exactly `Resources/app/administration/src/main.js` or `main.ts` | `Framework/Plugin/BundleConfigGenerator.php:127-139` | `foreach (['js', 'ts'] as $type) { if (\is_file($absolutePath . '/main.' . $type)) {` |
| Only **active** plugins are written into the bundle config the build consumes | `Framework/Plugin/BundleConfigGenerator.php:60-63` | `// dont include deactivated plugins` |
| The Vite build reads `var/plugins.json` and throws if missing | `…/build/vite-plugins/utils/index.ts:111-115` | `Try bin/console bundle:dump to create this file.` |
| A bundle is built as an admin plugin only with `administration.entryFilePath` set and no `SKIP_<TECHNICAL_NAME>` env var | `…/build/vite-plugins/utils/index.ts:174-183` | `!!definition.administration.entryFilePath && !process.env.hasOwnProperty(\`SKIP_…\`)` |
| Built assets are emitted under base `/bundles/<technicalFolderName>/administration/` | `…/build/plugins.vite.ts:73,120-121` | `base: \`/bundles/${extension.technicalFolderName}/administration/\`` |
| `ViteFileAccessorDecorator` reads `<bundle>/Resources/public/administration/.vite/entrypoints.json` from the **source** path and returns `[]` silently when absent | `…/Framework/Twig/ViteFileAccessorDecorator.php:71-74,98-101` | `if (!$this->filesystem->exists($viteEntryPointsPath)) { return $this->content[…] = []; }` |
| An empty bundle is omitted from the admin config's `bundles` key entirely | `…/Framework/Api/Subscriber/AdminInfoConfigBundlesSubscriber.php:63-84` | `if ($styles === [] && $scripts === [] && $baseUrl === null) { continue; }` |
| Only `bin/console system:check` surfaces the missing artefact | `…/Framework/SystemCheck/AdministrationReadinessCheck.php:99-121` | `if ($administrationPackageExists && \count($entrypoints) === 0) { $missingJsBundles[] = …; }` |
| `assets:install` copies each bundle's `Resources/public` into `public/bundles/<targetDirectory>`, which is what makes the URLs resolve | `Framework/Adapter/Asset/AssetInstallCommand.php:21-24,54-58`; `Framework/Plugin/Util/AssetService.php:41,247-252` | `#[AsCommand(name: 'assets:install', …)]` · `$this->assetService->copyAssets($bundle, …)` |
| The decorator rewrites the entrypoint base to the Symfony asset path | `…/Framework/Twig/ViteFileAccessorDecorator.php:106-107` | `// Replace the base generated by Vite with the symfony asset path` |
| Entrypoints **JSON key** normalisation: `str_replace('_', '-', getContainerPrefix())`, identical on producer and consumer | `…/ViteFileAccessorDecorator.php:85-88`; `…/AdminInfoConfigBundlesSubscriber.php:131-134`; `Framework/Plugin/BundleConfigGenerator.php:75`; `Framework/Bundle.php:73-76` | `return str_replace('_', '-', $bundle->getContainerPrefix());` |
| URL **folder** normalisation is a different pair, also matched end to end | `…/build/vite-plugins/utils/index.ts:196-203`; `Framework/Plugin/Util/AssetService.php:247-252` | `name.toLowerCase().replace(/bundle$/, '').replace(/(-)/g, '')` · `preg_replace('/bundle$/', '', mb_strtolower($name))` |
| At boot the admin injects each bundle's js/css; dev mode reads `./sw-plugin-dev.json`; failures are swallowed | `…/src/core/application.ts:611-626,704-746` | `const response = await fetch('./sw-plugin-dev.json');` |
| Admin snippets are collected server-side by **file name** (`administration.json` / `<locale>.json`) anywhere under `Resources/app/administration/src` | `…/Snippet/SnippetFinder.php:79-81,120-137,331-339` | `$snippetNames[] = \sprintf('%s.json', $locale);` |
| A broken plugin snippet file is logged and skipped, not fatal | `…/Snippet/SnippetFinder.php:255-262` | `must not take down the whole administration` |
| The manifest `snippets` key still exists and is merged across modules in 6.7.13.0 | `…/module.factory.ts:477-503` | `function getModuleSnippets(): { [lang: string]: Snippets \| undefined } {` |
| This project's build entry points are shell scripts, not composer scripts: `bundle:dump` → `feature:dump` → npm installs → `npm run build` (`VITE_MODE=production`) → `assets:install` | `bin/build-administration.sh:52-114`; `…/Resources/app/administration/package.json:8,16`; `bin/watch-administration.sh:82` | `[[ ${SHOPWARE_SKIP_ASSET_COPY:-""} ]] \|\|"${BIN_TOOL}" assets:install` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `settingsItem.group` must be one of `shop` / `system` / `plugins` | absent | No runtime check; the compile-time union is `general\|localization\|customer\|commerce\|content\|automation\|system\|account\|plugins` and does not contain `shop`; the store buckets any string — `…/module.factory.ts:66-76`; `…/src/app/store/settings-item.store.ts:60-62` |
| A navigation entry falls back to the module manifest's `icon` | absent | No fallback anywhere in the chain; `getIconName` is the identity function — `…/sw-admin-menu-item/index.js:127-129` |
| A missing `.vite/entrypoints.json` produces a runtime warning or error | absent | `getContent()` returns `[]` without logging; the subscriber `continue`s past the bundle — `…/ViteFileAccessorDecorator.php:98-101` |
| Webpack is still the admin build system in 6.7 | superseded | The admin build directory holds only `plugins.vite.ts` and `vite-plugins/`; `BundleConfigGenerator` still detects a plugin-supplied webpack config, but the admin's own entry point is Vite — `…/build/plugins.vite.ts:1-11`; `BundleConfigGenerator.php:141-155` |
| `registerModule` validates that a route's component name exists in the registry | absent | `createRouteComponentList` only checks the value is truthy; a typo registers fine and fails at render — `…/module.factory.ts:414-436` |
| A module must declare `navigation` to be reachable | absent | `navigation` is read only behind `hasOwnProperty`; a routes-only module is reachable by URL — `…/module.factory.ts:284` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Working core module of exactly this shape (component registered by name, `Module.register` with routes, `settingsItem`, privileges) | `…/src/module/sw-settings-tag/index.js:1-44` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Plugin module registered fine but produced no menu entry when shipped as a ZIP; traced to the hidden `Resources/public/administration/.vite` directory being stripped by packaging. A Shopware contributor confirmed `.vite/entrypoints.json` decides which entrypoints load, and closed it as working-as-intended | 6.7 | closed | https://github.com/shopware/shopware/issues/10701 |
| Symfony-bundle extension: assets land in `public/bundles/my/` but the generated entrypoints path is `/bundles/mybundle/administration/`; module never loads | 6.7 | closed | https://github.com/shopware/shopware/issues/8271 |
| Same mismatch reported for plugin names containing an underscore | 6.7 (RC3) | closed | https://github.com/shopware/shopware/issues/8976 |
| Shopware-filed issue: since 6.7.3.0 snippet registration via the admin module attribute is considered obsolete and proposed for removal | 6.7.3.0+ | open | https://github.com/shopware/shopware/issues/12983 |
| App admin `main.ts` not loaded at all following the official guide, so nothing registered | 6.7.1.2 | closed | https://github.com/shopware/shopware/issues/11934 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the manifest `snippets` key still honoured on 6.7 despite issue 12983? | code lane | Settled: `getModuleSnippets()` still reads and merges it at `…/module.factory.ts:477-503` in 6.7.13.0 |
| Does `Module.register()` still validate the manifest keys used in issue 10701, and is a route required for a navigation entry? | code lane | Settled: routes-or-`routeMiddleware` is mandatory; plugin navigation entries need `parent` and `label` |
| Which file does the admin read to decide which plugin entrypoints to load, and is its absence silent? | deep pass | Settled: `Resources/public/administration/.vite/entrypoints.json`, read by `ViteFileAccessorDecorator`; absence is silent at runtime — only `system:check` reports it. Fact 2 |
| Does the bundle-name normalisation in the entrypoints path match the directory the asset install step writes (case, underscores)? | deep pass | Settled: two *different* normalisations exist, but each matches its own counterpart, so underscores do not break either. The JSON key (`str_replace('_','-',getContainerPrefix())`) is not the URL folder (`toLowerCase().replace(/bundle$/,'').replace(/-/g,'')`) — the reported breakage is the two being confused, not a producer/consumer mismatch |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Registration is `Shopware.Module.register()`, wrapping the ModuleFactory's `registerModule` | "Instead, you're using the `Shopware.Module.register()` method" | `…/add-custom-module.md` | yes — `module.factory.ts:159` |
| `main.js` is the plugin's admin entry point and must import the module | "The entry point of your plugin is the `main.js` file." | same page | yes — `BundleConfigGenerator.php:127-139` |
| `main.js` must sit in `src/Resources/app/administration/src` | "It has to be placed into a `<plugin root>/src/Resources/app/administration/src` directory" | `…/add-custom-component.md` | yes — `BundleConfigGenerator.php:127-139` |
| Each module needs its own directory under `src/module` with an `index.js`, which Shopware auto-requires | "This is necessary, because Shopware 6 is automatically requiring an `index.js` file for each module." | `…/add-custom-module.md` | no — not examined by either code pass |
| `type: 'plugin'` is a convention, not a validated value | "So it is more a convention and not a real validation which throws an error" | `…/add-custom-module.md` | yes in substance — `type` defaults to `plugin` and only the plugin branch is special-cased (`module.factory.ts:160,293-300,317-324`) |
| Route full name derives from module id + route key, dashes to dots | "the module's id is `custom-module` (Notice that all dashes are automatically replaced by dots…)" | `…/add-custom-route.md` | yes — `module.factory.ts:218-231` |
| A navigation entry needs `parent` and an `id` to render | "we're not supporting plugin modules to add new menu entries on the first level" | `…/add-menu-entry.md` | `parent` yes (`module.factory.ts:293-300`); the deep pass shows the id/path/parent/link check is a disjunction, not an `id` requirement |
| The module `icon` is not the menu-entry icon | "This is not the icon being used for a menu entry!" | `…/add-custom-module.md` | yes — `sw-admin-menu-item.html.twig:23-29`; `sw-admin-menu-item/index.js:127-129` |
| `settingsItem.group` accepts only `shop`, `system`, `plugins` | "Valid options are 'shop', 'system' and 'plugins'." | `…/add-custom-module.md` | no — disproved by the deep pass |
| Build command is `shopware-cli project admin-build` / `composer run build:js:admin`, and the plugin must be active | "Your plugin has to be activated for this to work." | `…/add-custom-module.md` | activation yes (`BundleConfigGenerator.php:60-63`); the command names do not match this project, which uses `bin/build-administration.sh` |
| The built JS lands at `<plugin root>/src/Resources/public/administration/js/<plugin-name>.js` | "would be located under `…/public/administration/js/administration-new-module.js`" | `…/add-custom-module.md` | no — Vite emits under base `/bundles/<technicalFolderName>/administration/` plus a `.vite/` directory |
| A successful build is not sufficient; import, registration, routes/components and snippets must line up | "The Administration build is the build boundary, not the whole feature lifecycle." | `…/add-custom-module.md` | consistent, and the deep pass adds the `.vite/entrypoints.json` + `assets:install` links the docs omit |
| Active bundles are dumped to `var/plugins.json` by `bundle:dump` | "written to `<shopwareRoot>/var/plugins.json` by … `BundleDumpCommand`" | `…/vite.md` | yes — `…/build/vite-plugins/utils/index.ts:111-115` |
| Production asset information comes from `/api/_info/config` | "Information is taken from the `/api/_info/config` call" | `…/vite.md` | yes — `AdminInfoConfigBundlesSubscriber.php:63-84`; `application.ts:611-626` |
| The Vite system is behind the `ADMIN_VITE` feature flag | "can be tested by activating the feature flag: `ADMIN_VITE`" | `…/vite.md` | no — in 6.7.13.0 the admin build directory contains only the Vite entry point |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `settingsItem.group` is restricted to `shop`, `system`, `plugins` | No runtime validation; `shop` is not even in the TypeScript union, and any string gets its own group bucket with an untranslated heading | `…/module.factory.ts:66-76`; `…/src/app/store/settings-item.store.ts:60-62` |
| The build output is a single minified file at `<plugin root>/src/Resources/public/administration/js/<plugin-name>.js` | Vite emits per-plugin assets under base `/bundles/<technicalFolderName>/administration/` plus a `.vite/entrypoints.json` the runtime depends on | `…/build/plugins.vite.ts:73,120-121`; `…/ViteFileAccessorDecorator.php:71-74` |
| Vite is gated behind the `ADMIN_VITE` feature flag | The administration's only build entry point in 6.7.13.0 is Vite | `…/build/plugins.vite.ts:1-11` |
| `type: 'plugin'` must be set by third-party modules | `type` defaults to `'plugin'` when omitted | `…/module.factory.ts:160` |
| Snippet files are loaded automatically "based on the folder structure" | The finder matches by **file name** (`administration.json` / `<locale>.json`) anywhere under the admin `src` tree | `…/Snippet/SnippetFinder.php:79-81,331-339` |
| Build commands are `shopware-cli project admin-build` / `composer run build:js:admin` | Neither exists in this project; `bin/build-administration.sh` drives `bundle:dump` → `npm run build` → `assets:install`, and `shopware-cli` is not referenced | `bin/build-administration.sh:52-114`; project `composer.json` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The module is registered with `Shopware.Module.register('swag-example', { … })` from `src/Resources/app/administration/src/module/swag-example/index.js`, which `main.js` must import; `type` must be `plugin` for third-party modules because `core` is reserved. | rewritten | The registration and entry-point halves are confirmed, but `type` is not mandatory: it defaults to `'plugin'` (`module.factory.ts:160`) and no validation of the value was found. Replaced with the checks that actually abort registration (hyphenated id, duplicate id, routes/routeMiddleware, `display`). |
| Assets are built with `shopware-cli project admin-build` (or `composer run build:js:admin`) into `<plugin root>/src/Resources/public/administration/js/<plugin-name>.js`, and a successful build alone does not make the module appear — the entry-point import, registration, routes and snippets must all be wired. | rewritten | Code disproves the output path (Vite, `/bundles/<technicalFolderName>/administration/`) and neither command exists in this project. The "build is not enough" point is kept and made checkable: active plugin → `var/plugins.json` → `.vite/entrypoints.json` → `assets:install`, with the silent-failure path named. |
| The `icon` configured on the module is not the menu-entry icon; the menu icon is set separately on the navigation entry, and `settingsItem.group` accepts only `shop`, `system` or `plugins`. | rewritten | First half confirmed and strengthened (no fallback exists at all). The `settingsItem.group` half is disproved — no runtime check, and `shop` is not in the 6.7 union — so it moved out of the facts and into the trap. |
