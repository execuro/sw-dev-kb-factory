# `dev-53` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-53` · `dev` · `Theme` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** My theme config labels disappeared from the Theme Manager after 6.7 — how do I define `theme.json` config fields and where do their translations go now?

**Expected answer — every fact an answer must contain:**

1. Config fields are declared in the bundle's `Resources/theme.json` (i.e. `<plugin root>/src/Resources/theme.json`) under `config.fields.<fieldName>`; the whole `config` node is stored verbatim, and any field key without a matching setter on `ThemeConfigField` is fatal (`InvalidThemeConfigException`). `[code: shopware/storefront Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:144, Theme/ThemeConfigFieldFactory.php:22-28]` Changes require `bin/console theme:refresh`. `[docs-only]`
2. In 6.7 the translations belong in an **Administration snippet file shipped by the theme**, under the key `sw-theme.<themeTechnicalName>.<tab>.<block>.<section>.<fieldName>.label` (or `.helpText`, or `.<optionIndex>.label` for select options), with the literal `default` substituted for an unnamed tab/block/section. The server emits only `<tab>.<block>.<section>.<fieldName>.label`; the `sw-theme.<technicalName>.` prefix is added by the Theme Manager, which walks the theme's own technical name and then the reversed `configInheritance` chain. `[code: shopware/storefront Theme/ThemeMergedConfigBuilder.php:512-521, :361-397, :539-549; Resources/app/administration/src/modules/sw-theme-manager/page/sw-theme-manager-detail/index.js:248-260, :783-796]`
3. The inline `theme.json` `label`/`helpText` arrays still work in 6.7 — they are used as the administration's fallback when no snippet matches (with a `[DEPRECATED] v6.8.0` console warning) and are only stripped when the `v6.8.0.0` feature flag is active, which is the mechanism behind "labels disappeared"; with no snippet and no fallback the Theme Manager renders the raw technical field name. `[code: shopware/storefront Theme/ThemeConfigField.php:14-19; Theme/ThemeConfigFieldFactory.php:17-20; Theme/ThemeMergedConfigBuilder.php:152-169, :247-250; …/sw-theme-manager-detail/index.js:783-796, :820-834]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/themes/theme-configuration.html
<!-- expected:end -->

Supporting detail the facts above compress (all code-backed, round-2 deep pass):

- The snippet file is found by scanning `<plugin root>/Resources/app/administration/src` (and `Resources/app/meteor-app`) **recursively**; the matched file names are exactly `administration.json` and `<locale>.json`. `src/app/snippet/` is a convention, not a requirement. Two passes run — base language (`en.json`, `de.json`) and country-specific (`en-GB.json`, `de-DE.json`) — merged with `array_replace_recursive`, so `en-GB.json` overrides `en.json` key by key.
- Plugin themes **are** served to the administration: `SnippetFinder::addPluginPaths()` feeds every active plugin bundle into the same catalogue that serves apps. The app route differs only in transport (`app_administration_snippet` table, HTML-sanitised, `en-GB` required, core-collision check).
- `scss: false` excludes a field from the generated SCSS variables and CSS custom properties at four independent points; the default (`null`) injects. A field with no `type` is skipped as well.
- `type` is an unvalidated `?string` — there is no enum and no closed list; unknown types fall through `SCSSValidator`'s `default` branch and the renderer's `?? 'mt-text-field'` fallback.

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Config fields are declared under `config.fields.<fieldName>` in the bundle's `Resources/theme.json` | `Resources/theme.json:31-46` (shopware/storefront) | `"config": { "fields": { "sw-color-brand-primary": { "type": "color", "value": "#0042a0", "editable": true, "block": "themeColors", "order": 100 },` |
| `theme.json` is read from `Resources/theme.json`; the whole `config` node is stored verbatim | `Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:98-99,144` | `$config->setThemeConfig($data['config']);` … `$pathname = $path . DIRECTORY_SEPARATOR . 'Resources/theme.json';` |
| Unknown keys in a config field are fatal | `Theme/ThemeConfigFieldFactory.php:22-28` | `if (!method_exists($configField, $setter)) { throw new InvalidThemeConfigException($key); }` |
| Inline `label`/`helpText` still exist in 6.7, deprecated for 6.8 | `Theme/ThemeConfigField.php:14-19,83-88` | `@deprecated tag:v6.8.0 - Property will be removed. Use translations via labelSnippetKey instead` |
| With the v6.8.0.0 flag active, `label`/`helpText` are dropped before mapping — the "labels disappeared" mechanism | `Theme/ThemeConfigFieldFactory.php:17-20` | `if (Feature::isActive('v6.8.0.0')) { unset($configFieldArray['label'], $configFieldArray['helpText']); }` |
| With the flag active the plain theme-configuration API response is also stripped of block/field labels | `Theme/ThemeMergedConfigBuilder.php:152-169` | `// labels are still stored in the database, but we don't want to expose them in the response` |
| The merged config builder emits `labelSnippetKey`/`helpTextSnippetKey` for every field; legacy `label`/`helpText` only when the flag is off | `Theme/ThemeMergedConfigBuilder.php:223-252` | `'labelSnippetKey' => $this->buildSnippetKey(...)` … `if (!Feature::isActive('v6.8.0.0')) { $field['label'] = $fieldConfig['label']; }` |
| The server-generated key is the dot-joined `<tab>.<block>.<section>.<field>.label`; `$themeTechnicalName` is accepted but **not** included | `Theme/ThemeMergedConfigBuilder.php:512-521` | `return implode('.', [...$parts, $isHelpText ? 'helpText' : 'label']);` |
| Tabs, blocks and sections get their own `labelSnippetKey` | `Theme/ThemeMergedConfigBuilder.php:571-578` | `$outputStructure['tabs'][$tab]['blocks'][$block]['labelSnippetKey'] = $blockSnippetKey;` |
| Missing tab/block/section default to the literal `default` | `Theme/ThemeMergedConfigBuilder.php:361-397` | `$tab = 'default';` … `$block = 'default';` … `$section = 'default';` |
| Select-option labels append the option index | `Theme/ThemeMergedConfigBuilder.php:539-549` | `$option['labelSnippetKey'] = $this->buildSnippetKey(..., $fieldName, (string) $optionIndex);` |
| The administration prefixes `sw-theme.<themeTechnicalName>.`, walks the inheritance chain, and falls back to the deprecated inline label with a console warning | `…/sw-theme-manager-detail/index.js:783-796` | ``const snippetKey = `sw-theme.${themeName}.${key}`;`` |
| The prefix list is the theme's own technical name followed by the reversed `configInheritance` chain | `…/sw-theme-manager-detail/index.js:248-260` | `this.inheritedSnippetPrefixes = configInheritance.reverse().reduce(..., [fields.themeTechnicalName]);` |
| When neither snippet nor fallback resolves, the Theme Manager renders the technical field name | `…/sw-theme-manager-detail/index.js:820-834` | `if (label.length < 1 \|\| label === fieldName) { return fieldName; }` |
| **Plugin** admin snippets are loaded: every active plugin bundle is added to the same scan that builds the admin `$t` catalogue, then merged with the app table | `shopware/administration Snippet/SnippetFinder.php:51-64,120-145` | `$activePlugins = $this->kernel->getPluginLoader()->getPluginInstances()->getActives();` … `return array_replace_recursive($countryAgnosticSnippets, $countrySpecificSnippets, $this->getAppAdministrationSnippets($locale));` |
| The scanned root for a plugin is `Resources/app/administration/src` (plus `Resources/app/meteor-app`), searched recursively; matched file names are `administration.json` and `<locale>.json`, in a base-language pass (`en.json`) and a country-specific pass (`en-GB.json`) | `shopware/administration Snippet/SnippetFinder.php:66-107,326-346` | `if ($isBaseLanguage) { $locale = explode('-', $locale)[0]; }` … `$snippetNames = ['administration.json']; $snippetNames[] = sprintf('%s.json', $locale);` |
| App snippets take the other route: imported into `app_administration_snippet`, HTML-sanitised, `en-GB` mandatory, core first-level collision rejected; plugin files are read from disk unsanitised and unvalidated | `shopware/administration Snippet/AppAdministrationSnippetPersister.php:51-58,109-120`; `Snippet/SnippetFinder.php:253-265,303-319` | `throw SnippetException::extendOrOverwriteCore($duplicatedKeys);` … `// a single broken snippet file (e.g. from a plugin) must not take down the whole administration` |
| App snippets are re-imported on **update** as well as install (upsert + delete of dropped locales + `admin-snippet` cache invalidation) | `shopware/administration Snippet/AppLifecycleSubscriber.php:26-58`; `Snippet/AppAdministrationSnippetPersister.php:89-96` | `AppInstalledEvent::class => 'onAppUpdate', AppUpdatedEvent::class => 'onAppUpdate',` … `$this->cacheInvalidator->invalidate([CachedSnippetFinder::CACHE_TAG], true);` |
| The catalogue is cached per locale (`cache.object`, key `admin_snippet_<locale>`, tag `admin-snippet`) and served via `GET /api/_admin/snippets` | `shopware/administration Snippet/CachedSnippetFinder.php:11,25-41`; `Controller/AdministrationController.php:163-181` | cache key `admin_snippet_<locale>`, tag `admin-snippet` |
| The core Storefront theme ships its labels in an administration snippet file nested under `sw-theme.<TechnicalName>.…`, in the base-language form `en.json`/`de.json` | `Resources/app/administration/src/modules/sw-theme-manager/snippet/en.json:1-21` | `{ "sw-theme": { "Storefront": { "default": { "themeColors": { "label": "Theme colours", …` |
| The core Storefront `theme.json` contains zero `"label"` keys in 6.7 | `Resources/theme.json` (`grep -c '"label"'` → 0) | — |
| `scss: false` excludes a field from the SCSS variables and CSS custom properties at four sites; the default (`?bool $scss = null`) injects; a field with no `type` is skipped too | `Theme/ThemeCompiler.php:694-700`; `Theme/ThemeConfigValueAccessor.php:50-55,79-86`; `Theme/ConfigLoader/DatabaseConfigLoader.php:259,285`; `Theme/ThemeService.php:298`; `Theme/ThemeConfigField.php:64` | `(\array_key_exists('scss', $data) && $data['scss'] === false) \|\| !isset($data['type'])` → `continue;` |
| `type` is an unvalidated `?string`; it only branches behaviour in the SCSS validator, the variable dumper and the admin component map, each with a permissive fallback | `Theme/ThemeConfigField.php:32,122-130`; `Theme/Validator/SCSSValidator.php:34-46`; `Theme/ThemeCompiler.php:715-724`; `shopware/administration …/sw-form-field-renderer/index.js:324-356` | `default => $data['value'],` … `return components[type] ?? 'mt-text-field';` |
| The legacy path (labels persisted into `theme_translation` by `ThemeLifecycleService`) still runs in 6.7; accessors deprecated for 6.8 | `Theme/ThemeLifecycleService.php:99,229-247`; `Theme/ThemeEntity.php:114-121` | `@deprecated tag:v6.8.0 - Will be removed. Use label snippet keys from structured fields instead` |
| `theme:create` scaffolds a `theme.json` with **no** config block and no labels | `Theme/Command/ThemeCreateCommand.php:186-209` | template contains only `name`, `author`, `views`, `style`, `script`, `asset` |

(Storefront paths are relative to `vendor/shopware/storefront`, administration paths to `vendor/shopware/administration`.)

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Plugin themes' `sw-theme.*` snippets are not served to the administration / use a different internal resolution | contradicted | `SnippetFinder::addPluginPaths()` adds every active plugin's `Resources/app/administration/src` to the same scan; both routes land in the same `$t` catalogue and neither special-cases `sw-theme` — `shopware/administration Snippet/SnippetFinder.php:51-64,120-145` |
| An app must be uninstalled and reinstalled for administration snippets to reload | contradicted | `AppUpdatedEvent` is subscribed alongside `AppInstalledEvent` and runs the identical re-import — `shopware/administration Snippet/AppLifecycleSubscriber.php:26-39` |
| Plugin lifecycle (install/update/activate) refreshes the administration snippet cache | absent | `CachedSnippetFinder::CACHE_TAG` has exactly one consumer in the whole vendor tree, `AppAdministrationSnippetPersister` (apps only); a plugin theme's changed labels stay invisible until `admin_snippet_<locale>` expires or `cache:clear` runs — `shopware/administration Snippet/CachedSnippetFinder.php:11`; `Framework/Plugin/PluginLifecycleService.php:737-739` |
| `ThemeConfigField` validates or enumerates the allowed `type` values | absent | no constant, enum or match on `$type`; `setType(?string $type)` accepts any string, the factory validates keys not values — `Theme/ThemeConfigField.php:32,127-130` |
| `theme.json` config labels were removed in 6.7 | absent | `ThemeConfigField` still declares `$label`/`$helpText` and the builder still emits them when the flag is off; removal is tagged `v6.8.0` — `Theme/ThemeConfigField.php:17-28`, `Theme/ThemeMergedConfigBuilder.php:247-250` |
| The generated `labelSnippetKey` includes the theme technical name | absent | `buildSnippetKey()` never uses `$themeTechnicalName` — `Theme/ThemeMergedConfigBuilder.php:512-521` |
| `theme:create` scaffolds a config block or a snippet file for labels | absent | `Theme/Command/ThemeCreateCommand.php:84-130,184-209` |
| Storefront snippets (`Resources/snippet/…`) carry theme config labels | absent | the `sw-theme.*` namespace appears only in `modules/sw-theme-manager/snippet/{de,en}.json` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| An active plugin's local admin snippet files are discovered and merged into the admin catalogue | `shopware/shopware @ trunk — tests/unit/Administration/Snippet/SnippetFinderTest.php::testDefaultSnippetFileLoading` |
| The fixture proves the scanned placement: a bare `<locale>.json` directly under `Resources/app/administration/src`, not under `src/app/snippet` | `shopware/shopware @ trunk — tests/unit/Administration/Snippet/fixtures/activePlugin/Resources/app/administration/src/jp-JP.json` |
| Plugin snippets override core snippets in shared namespaces; a file for another locale is not merged | `shopware/shopware @ trunk — tests/integration/Administration/Snippet/SnippetFinderTest.php::testValidSnippetMergeWithOnlySameLanguageFiles` |
| App snippets arrive via `app_administration_snippet` and are HTML-sanitised, unlike plugin files | `shopware/shopware @ trunk — tests/integration/Administration/Snippet/SnippetFinderTest.php::testSnippetFinderSanitizesAppSnippets` |
| A broken plugin snippet file is logged and skipped rather than breaking the admin | `shopware/shopware @ trunk — tests/unit/Administration/Snippet/SnippetFinderTest.php::testInvalidSnippetFileIsSkippedAndLogged` |
| Snippet-key-first label resolution with technical-name fallback | `…/sw-theme-manager-detail/sw-theme-manager-detail.spec.js:398-401` |
| Structured-fields fixture with tabs keyed by `labelSnippetKey` | `…/sw-theme-manager-detail/sw-theme-manager-detail.spec.js:173-175` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware employee reports dynamic theme snippet keys are supported only in **app**-based themes, not plugin themes, on 6.6 and 6.7 | 6.7 | closed | https://github.com/shopware/shopware/issues/13563 |
| Vendor reports theme config labels from external snippet files stopped resolving in 6.7.5.0 (raw keys shown) after working in 6.7.3/6.7.4 | 6.7 | closed | https://github.com/shopware/shopware/issues/13799 |
| Maintainer: app snippets with dynamic keys are stored in a DB table, so the extension must be **reinstalled**; an update does not reload them | 6.7 | closed | https://github.com/shopware/shopware/issues/13799#issuecomment-3685507199 |
| Maintainer concedes plugin themes "are doing a different approach internally than app-snippets" — an oversight, unification only planned | 6.7 | closed | https://github.com/shopware/shopware/issues/13799#issuecomment-3636448732 |
| HTML tags in label/helpText were stripped when moved into snippets; fixed by a merged PR | 6.7 | closed | https://github.com/shopware/shopware/issues/13080 |
| Theme Manager did not render `theme.json` tabs on 6.7.4.2 (regression from #13316, fixed by #13767) | 6.7 | closed | https://github.com/shopware/shopware/issues/13751 |
| Forum: block/section snippet labels showed raw keys; diagnosed as a duplicated `sw-theme` key and a wrong snippet file path | 6.7 | open | https://forum.shopware.com/t/shopware-6-7-uebersetzungen-im-theme-manager/109170 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact snippet key shape and the `default` substitution | `Theme/ThemeMergedConfigBuilder.php:512-521,361-397`; `…/sw-theme-manager-detail/index.js:783-796` | Settled: server key is `<tab>.<block>.<section>.<field>.label`; the admin prefixes `sw-theme.<technicalName>.`; unnamed levels become `default` |
| Is an inline `label`/`helpText` still supported in 6.7, and which wins? | `Theme/ThemeConfigField.php:14-19`; `ThemeConfigFieldFactory.php:17-20`; `…/index.js:783-796` | Settled: still supported in 6.7 and used as fallback; dropped under the v6.8.0.0 flag — the snippet wins when present |
| Do plugin themes and app themes resolve theme-config snippets through different mechanisms? | `shopware/administration Snippet/SnippetFinder.php:51-64,120-145` (deep pass) | Settled: **both are served**. The mechanisms differ only in transport (disk scan vs `app_administration_snippet`, with sanitising/validation on the app side); the community claim that plugin snippets are not resolved is contradicted |
| Which snippet file locations does the loader scan for a plugin theme? | `shopware/administration Snippet/SnippetFinder.php:66-107,120-145,326-346` (deep pass) | Settled: root `Resources/app/administration/src`, recursive; file names `administration.json` and `<locale>.json`; base-language pass (`en.json`) plus country-specific pass (`en-GB.json`) which overrides it |
| Does the app/plugin lifecycle refresh snippets on update or only on install? | `Snippet/AppLifecycleSubscriber.php:26-58`; `Snippet/CachedSnippetFinder.php:11` (deep pass) | Settled: apps re-import on install **and** update; plugins never import at all, and nothing invalidates the `admin-snippet` cache tag on plugin lifecycle — a plugin theme's changed labels need a cache clear |
| What `type` values are accepted, and is `scss: false` backed by the compiler? | `Theme/ThemeConfigField.php:32,122-130`; `Theme/ThemeCompiler.php:694-700,715-724` (deep pass) | Settled: `type` is unvalidated and the set is open; `scss: false` is enforced at four sites, default injects |
| Is HTML permitted in snippet values after the sanitizer fix? | not pursued — not load-bearing for any fact in this case | dropped |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `theme.json` lives in `<plugin root>/src/Resources` | "The theme configuration for a theme is located in the `theme.json` file `<plugin root>/src/Resources` folder." | `themes/configuration/theme-configuration.md:26` | yes — `StorefrontPluginConfigurationFactory.php:144` |
| Changes take effect only after `bin/console theme:refresh` | "you must then execute the `theme:refresh` command to put them into effect" | `…:64` | not examined by either code pass — admitted as `[docs-only]` |
| `config` holds tabs, blocks, sections and fields; the field key is the technical name | "The `theme.json` contains a `config` property which contains a list of tabs, blocks, sections and fields." | `…:234` | yes — `Resources/theme.json:31-46`, `ThemeMergedConfigBuilder.php:361-397` |
| `type` restricted to color/text/number/fontFamily/media/checkbox/switch/url | "Possible values: color, text, number, fontFamily, media, checkbox, switch and url" | `…:244` | **no** — the set is open and unvalidated (`ThemeConfigField.php:32,127-130`); the listed values are usable but the list is neither closed nor enforced, and it omits textarea, boolean/bool, date and the numeric types the renderer understands |
| `label`/`helpText` arrays are deprecated for v6.8; translations handled via Administration snippets | "*(Deprecated for v6.8: Translations are now handled via Administration snippets)*" | `…:242` | yes — `ThemeConfigField.php:14-19` |
| Snippet keys were chosen so Theme Manager labels inherit | "we decided to use snippet keys for translating the configuration in order to ensure inheritance" | `…:255` | consistent — `…/index.js:248-260` builds prefixes from `configInheritance` |
| Snippet files live at `<plugin root>/src/Resources/app/administration/src/app/snippet/{de,en}.json`, with `de-DE.json`/`en-GB.json` overriding | "Store these snippet keys in Administration snippet files, for example, …" | `…:257` | yes, with a caveat — the scan root is `Resources/app/administration/src` searched **recursively**, so `app/snippet/` is a working convention rather than a requirement; the base/country override order is confirmed — `SnippetFinder.php:66-107,326-346` |
| Key begins with `sw-theme`, then technical name (or parent), then tab/block/section/field, `default` for unnamed, numeric index for options | "Each snippet key begins with `sw-theme`, followed by the theme's technical name…" | `…:259,265-271` | yes — `ThemeMergedConfigBuilder.php:512-521,539-549`; the `sw-theme.<name>.` prefix comes from the admin (`…/index.js:783-796`) |
| A theme always inherits the Storefront config; configs are merged | "You always inherit from the storefront config and both configurations are merged." | `…:228` | not examined by the code lanes |
| `configInheritance` relationships are created at install; `theme:refresh` updates them later | "The relationship of the inheritance is only created while installing the theme." | `…:1016` | not examined by the code lanes |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| The page's "Since v6.7.1.0" examples present the snippet mechanism as replacing in-file labels from 6.7.1.0 onward, while the table marks `label`/`helpText` deprecated only for v6.8 — the page never says whether in-file labels still work in 6.7 | In 6.7 inline `label`/`helpText` still work and are used as the admin's fallback; they are dropped only when the `v6.8.0.0` feature flag is active | `Theme/ThemeConfigField.php:14-19`; `Theme/ThemeConfigFieldFactory.php:17-20`; `Theme/ThemeMergedConfigBuilder.php:247-250` |
| `type` has a fixed set of "possible values" | `$type` is an unvalidated `?string`; unknown types are stored, pass `SCSSValidator`'s `default` branch untouched and render through the `?? 'mt-text-field'` fallback | `Theme/ThemeConfigField.php:32,122-130`; `Theme/Validator/SCSSValidator.php:34-46`; `…/sw-form-field-renderer/index.js:324-356` |
| Snippet files are placed at `…/app/administration/src/app/snippet/*.json` | The scan root is `…/app/administration/src` searched recursively for files named `administration.json` or `<locale>.json` — any depth works, and the upstream test fixture puts the file directly under `src` | `shopware/administration Snippet/SnippetFinder.php:66-107,120-145` |
| The documented key "begins with `sw-theme`, followed by the theme's technical name" reads as one key built by the server | The server builds only `<tab>.<block>.<section>.<field>.label`; the `sw-theme.<technicalName>.` prefix is prepended by the administration, which also tries each inherited theme name | `Theme/ThemeMergedConfigBuilder.php:512-521`; `…/sw-theme-manager-detail/index.js:248-260,783-796` |
| The page does not mention that unknown keys in a config field are fatal | `ThemeConfigFieldFactory` throws `InvalidThemeConfigException` for any key without a matching setter | `Theme/ThemeConfigFieldFactory.php:22-28` |
| The page does not mention any caching of administration snippets | The catalogue is cached per locale under `admin_snippet_<locale>`, and **nothing** invalidates the `admin-snippet` tag on plugin install/update/activate — only app lifecycle does | `shopware/administration Snippet/CachedSnippetFinder.php:11,25-41`; `Snippet/AppAdministrationSnippetPersister.php:89-96` |
| The page's guidance implies a scaffolded theme starts with config and labels | `theme:create` emits no `config` block and no snippet directory at all | `Theme/Command/ThemeCreateCommand.php:84-130,184-209` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `theme.json` lives at `<plugin root>/src/Resources/theme.json`; after editing it, `bin/console theme:refresh` must be run for config/inheritance changes (`theme:compile` rebuilds assets). | rewritten | Location confirmed by code (`StorefrontPluginConfigurationFactory.php:144`); `theme:refresh` is not backed by any code finding and is retained tagged `[docs-only]`; the `theme:compile` clause is unverified and dropped; the code-shown fatality of unknown field keys is added |
| Config-field translations go into Administration snippet files (e.g. `<plugin root>/src/Resources/app/administration/src/app/snippet/en-GB.json`) under the key pattern `sw-theme.<technicalName>.<tab>.<block>.<section>.<field>.label` (or `.helpText`), with `default` replacing an unnamed tab/block/section; since v6.7.1.0 labels are no longer written in `theme.json` and `label`/`helpText` are deprecated for v6.8.0.0. | rewritten, split | The key pattern and `default` substitution are confirmed. The clause "since v6.7.1.0 labels are no longer written in `theme.json`" is wrong for 6.7 — inline labels still resolve as the admin fallback until the v6.8.0.0 flag is on; that half moved into fact 3. The split of server key vs client-side `sw-theme.<name>.` prefix is added, since an answer naming a server-side key including the prefix is wrong |
| Each `config.fields` entry supports `type` (`color`, `text`, `number`, `fontFamily`, `media`, `checkbox`, `switch`, `url`), `editable`, `tab`, `block`, `section`, `custom`, `scss` (`false` = not injected as an SCSS variable) and `fullWidth`; the `script` field references compiled `dist` files. | removed | The type enumeration is a doc claim the code disproves as a closed list: `$type` is an unvalidated `?string` with no enum, the listed set omits `textarea`/`boolean`/`bool`/date and numeric types the renderer handles, and unknown types fall through permissive defaults (`Theme/ThemeConfigField.php:32,127-130`). The `scss: false` semantics is confirmed and retained in the supporting-detail list rather than as one of the three scoring facts; the trailing `script`/`dist` clause belongs to the theme's asset configuration, not to `config.fields`, and was not examined |
| — | added | Fact 3 states the 6.7 fallback behaviour and the `v6.8.0.0` flag as the actual "labels disappeared" mechanism — the point the query turns on, missing from the old set |
