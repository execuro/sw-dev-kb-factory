# `dev-05` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-05` · `dev` · `Theme` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** How does theme inheritance work in Shopware — theme.json and SCSS overrides?

**Expected answer — every fact an answer must contain:**

1. Inheritance is declared in `<bundle>/Resources/theme.json` (a plugin theme: `src/Resources/theme.json`) by putting another theme's `@`-placeholder — `@Storefront`, or a technical name such as `@SwagBasicExampleTheme` — into the `views`, `style`, `script`, `asset` and `configInheritance` arrays before the current theme. There is no `parent` or `extends` key: the parser reads only `name`, `author`, `style`, `script`, `asset`, `previewMedia`, `config`, `views`, `configInheritance`, `iconSets`, and `configInheritance` is what sets the database parent theme — its last entry that is neither `@Storefront` nor the theme itself is stored as `parentThemeId`, while Storefront config is inherited even with no `configInheritance` entry.  `[code: vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:70-116]` `[code: vendor/shopware/storefront/Theme/ThemeLifecycleService.php:565-588]` `[code: vendor/shopware/storefront/Theme/ConfigLoader/DatabaseConfigLoader.php:328-336]`
2. `"views": ["@Storefront", "@Plugins", "@<BaseTheme>", "@<ThisTheme>"]` is the Twig template hierarchy and is a mechanism separate from `style`/`script`: `ThemeInheritanceBuilder` reorders the bundle hierarchy by this array, drops every bundle not named explicitly into the `@Plugins` wildcard slot, and reverses the result so the **last** entry has the highest priority. With no `views` array the default order is `@Storefront` first, then the active themes.  `[code: vendor/shopware/storefront/Theme/Twig/ThemeInheritanceBuilder.php:28-81,88-113]`
3. SCSS inheritance is **ordered concatenation, not file-by-file overriding**: `ThemeFileResolver` walks the `style` array in order, expanding each `@Name` entry recursively in place (`@Plugins` = every non-theme storefront plugin, `@StorefrontBootstrap` = the Storefront's own `base.scss`, `@Bundle/path/file.scss` = one file) and adding each absolute path at most once. A child file at the same relative path does **not** replace a parent's file — overriding happens through the SCSS cascade, which is why the generated theme lists `app/storefront/src/scss/overrides.scss` *before* `@Storefront` and `base.scss` after it: Bootstrap/Storefront variables are declared with `!default`, so an override must be parsed first.  `[code: vendor/shopware/storefront/Theme/ThemeFileResolver.php:157-170,288-305,383-391]` `[code: vendor/shopware/storefront/Theme/Command/ThemeCreateCommand.php:186-223]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/themes/inheritance/add-theme-inheritance.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| A bundle is a theme only when its class implements `ThemeInterface` (empty marker); an app is a theme when it ships `Resources/theme.json` | `vendor/shopware/storefront/Theme/StorefrontPluginConfiguration/StorefrontPluginConfigurationFactory.php:35-64`; `Framework/ThemeInterface.php:8-10` | `if ($bundle instanceof ThemeInterface) { return $this->createThemeConfig(...); }` |
| `theme.json` must be at `<bundle>/Resources/theme.json`; missing file → `invalidThemeBundle`, malformed JSON → `themeCompileException` | `…/StorefrontPluginConfigurationFactory.php:142-160` | `$pathname = $path . DIRECTORY_SEPARATOR . 'Resources/theme.json';` |
| Keys read: name, author, style, script, asset, previewMedia, config, views, configInheritance, iconSets; name/author unconditional | `…/StorefrontPluginConfigurationFactory.php:70-116` | `$config->setName($data['name']); $config->setAuthor($data['author']); if (array_key_exists('style', …))` |
| SCSS/JS inheritance is ordering: `@`-prefixed entries are namespace references expanded in place, others are paths relative to `Resources` | `Theme/ThemeFileResolver.php:157-170,395-398` | `private function isInclude(string $file): bool { return str_starts_with($file, '@'); }` |
| Three namespace forms: `@Plugins`, `@StorefrontBootstrap`, `@<ThemeName>`; `@Bundle/path/file.scss` pulls a single file | `Theme/ThemeFileResolver.php:288-305,339-348,404-421` | `if ($filepath === '@Plugins') {…} if ($filepath === '@StorefrontBootstrap') {…} $this->addFilesFromTheme(…)` |
| Each absolute path added once; each theme config expanded once — circular includes yield an empty collection | `Theme/ThemeFileResolver.php:136-141,383-391` | `if (isset($processedConfigs[$configName])) { return new FileCollection(); }` |
| Generated skeleton is the canonical order: `overrides.scss`, `@Storefront`, `base.scss`; views `@Storefront`, `@Plugins`, `@<Theme>` | `Theme/Command/ThemeCreateCommand.php:186-208` | `"style": ["app/storefront/src/scss/overrides.scss", "@Storefront", "app/storefront/src/scss/base.scss"]` |
| The reason is `!default`: core says so in the generated comment, and core variables carry `!default` | `Theme/Command/ThemeCreateCommand.php:214-223`; `Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_theme.scss:10` | `Because of the !default flags, theme variable overrides have to be declared beforehand.` / `$sw-color-brand-primary: #0042a0 !default;` |
| `config.fields` become SCSS variables (`$<key>: <value>;`) prepended to the concatenated styles; `"scss": false` skips a field | `Theme/ThemeCompiler.php:688-731,617-620,674-681` | `$cssOutput = $this->scssCompiler->compileString($compilerConfig, $features . $variables . $concatenatedStyles);` |
| The dump is written as `theme-variables.scss`; `ThemeCompilerEnrichScssVariablesEvent` lets third parties add variables | `Theme/ThemeCompiler.php:731-746` | `$this->eventDispatcher->dispatch($themeVariablesEvent);` |
| Twig hierarchy is separate: `ThemeInheritanceBuilder` reorders bundles by `views`, `@Plugins` takes the rest, result reversed so last = highest priority | `Theme/Twig/ThemeInheritanceBuilder.php:28-81`; `Theme/Twig/ThemeNamespaceHierarchyBuilder.php:100-108` | `$inheritance['@Plugins'][] = $bundle; … $flat = array_reverse($flat);` |
| With no `views` array the default is `@Storefront` first, then active themes, plugin wildcard injected | `Theme/Twig/ThemeInheritanceBuilder.php:88-113` | `$default = ['@Storefront' => []];` |
| Theme *config value* inheritance is DB-level: base config, then each parent theme's config, then own, via `array_replace_recursive` | `Theme/ConfigLoader/DatabaseConfigLoader.php:95-114` | `$baseThemeConfig = array_replace_recursive($baseThemeConfig, $configuredParentTheme);` |
| Every theme except the base Storefront theme inherits config from `@Storefront` even without `configInheritance` | `Theme/ConfigLoader/DatabaseConfigLoader.php:328-336` | `if ($mainTheme->getTechnicalName() !== StorefrontPluginRegistry::BASE_THEME_NAME) { return ['@' . …BASE_THEME_NAME]; }` |
| `configInheritance` sets `parentThemeId`: the last entry that is neither `@Storefront` nor the theme itself | `Theme/ThemeLifecycleService.php:565-588` | `foreach (array_reverse($configuration->getConfigInheritance()) as $themeName) { … $lastNotSameTheme = str_replace('@', '', $themeName); }` |
| A non-theme storefront plugin needs no theme.json — `base.scss` (depth 0) and the compiled dist JS are auto-detected | `…/StorefrontPluginConfigurationFactory.php:118-136,177-208` | `$finder->files()->name('base.scss')->in($path)->depth('0');` |
| A missing direct (non-`@`) style/script file aborts compilation with "Did you forget to build the theme?" | `Theme/ThemeFileResolver.php:239-266` | `'Did you forget to build the theme? Try running ./bin/build-storefront.sh'` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `theme.json` has a `parent` / `extends` key naming the parent theme | absent | `createFromThemeJson` reads only the ten listed keys; parentage comes from `@`-entries and `configInheritance` (`…Factory.php:70-116`) |
| A parent theme's SCSS file is overridden by a child file at the same relative path | absent | no path-shadowing logic; dedup is by absolute path only, files are concatenated (`ThemeFileResolver.php:383-391`, `ThemeCompiler.php:617-620`) |
| Twig view inheritance is driven by the `style` array | absent | templates come from `views`/`viewInheritance` consumed by `ThemeInheritanceBuilder`, which never reads style/script (`ThemeInheritanceBuilder.php:104`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A theme omitting `@Plugins` still gets plugin SCSS/JS when a parent expands them | `github.com/shopware/shopware@6.7.13.x tests/unit/Storefront/Theme/ThemeFileResolverTest.php#L340` |
| Pinned behaviours: circular includes, dedup, `@StorefrontBootstrap`, bundle-relative paths | `github.com/shopware/shopware@6.7.13.x tests/unit/Storefront/Theme/ThemeFileResolverTest.php` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Agency post: a grandparent theme's `override.scss` is not implicitly compiled into a leaf theme; fix was to reference it by relative path | 6.4/6.5-era | open | https://winkelwagen.de/2023/09/06/shopware-6-theme-inheritance-and-override-scss/ |
| Multi-level `configInheritance`: snippets follow the DB parent id, intermediate parents ignored | 6.6.8.2 | closed | https://github.com/shopware/shopware/issues/6331 |
| Same class of report for nested child themes losing grandparent snippets | 6.5.8.7 | closed | https://github.com/shopware/shopware/issues/4961 |
| Child theme config empty — merging only with base Storefront theme, not intermediate parents | 6.3.0.1 | closed (not planned) | https://github.com/shopware/shopware/issues/1227 |
| Documented style order does not propagate derived Bootstrap variables (`$input-btn-padding-x` → `$btn-padding-x`) | 6.5.3.3 | closed | https://github.com/shopware/shopware/issues/3377 |
| Bootstrap's utility-override pattern unusable: `bootstrap/scss/utilities/api` is imported before theme overrides | 6.7.1.2 | open | https://github.com/shopware/shopware/issues/12210 |
| theme.json `label`/`helpText` merging breaks under the `V6_8_0_0` flag | trunk / 6.7 | closed | https://github.com/shopware/shopware/issues/9900 |
| SCSS validation of theme config values regressed for `hsl()`/`rgba()` | 6.7.3.0 | closed | https://github.com/shopware/shopware/issues/12947 |
| theme.json order ignored when `$source` is passed to `TemplateFinder::find()` | 6.2-era | closed | https://github.com/shopware/shopware/issues/1089 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is a parent's `override(s).scss` pulled in automatically? | code | Only through the `@`-entry: `@ParentTheme` expands that theme's whole `style` array in order; there is no separate implicit override channel, and each absolute path is added once (`ThemeFileResolver.php:288-305,383-391`). Listing a parent file explicitly by `@Bundle/path` is the documented single-file form. |
| Are `@Storefront`, `@StorefrontBootstrap`, `@Plugins` still the recognised placeholders in 6.7? | code | Yes — exactly those three forms plus `@Bundle/path/file.scss` (`ThemeFileResolver.php:288-305,404-421`) |
| Does inheritance follow `configInheritance` or the DB `parent_theme_id`? | code | Both, in sequence: `configInheritance` determines `parentThemeId` at install/refresh (last non-Storefront, non-self entry), and config merging then walks the DB parent chain (`ThemeLifecycleService.php:565-588`, `DatabaseConfigLoader.php:95-114`) |
| Does merged config include intermediate parent themes in 6.7? | code | Yes — `getParentThemeIds()` is iterated and each parent's config merged before the theme's own (`DatabaseConfigLoader.php:95-114`); the 6.3-era report #1227 does not hold for 6.7 |
| Where does a theme's style land relative to `bootstrap/scss/utilities/api`? | not settled | Not examined; no fact depends on it |
| Are `label`/`helpText` in theme.json still read in 6.7? | not settled | Not examined; no fact depends on it (6.8-flag behaviour is out of the 6.7 pin) |
| Does `TemplateFinder` still rotate the hierarchy around `$source`? | not settled | Not examined; fact 2 states the hierarchy `ThemeInheritanceBuilder` produces, which the code does confirm |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| theme.json lives in `<plugin root>/src/Resources`; `views`/`style`/`script`/`asset` all carry `@Storefront`, so every theme inherits the default theme | `Every theme inherits the default theme of Shopware called @Storefront.` | `…/themes/inheritance/add-theme-inheritance.md` | yes — `…Factory.php:142-160`, `ThemeCreateCommand.php:186-208` |
| Inheriting from another theme = adding its technical name as an `@`-placeholder; order in `views` decides rendering precedence, current theme last | `In the views section we added the placeholder @SwagBasicExampleTheme right before our current theme…` | same | yes — `ThemeInheritanceBuilder.php:28-81` |
| The `style` section differs because the override entry point can affect SCSS variables, so it is at the top | `The only difference here is the override.css can affect SCSS variables e.g. $border-radius.` | same | partly — order confirmed (`ThemeCreateCommand.php:186-223`); the file is `overrides.scss`, not `override.css` |
| `configInheritance` uses the listed themes' field configuration; the last theme different from the current one becomes the parent; Storefront is always inherited | `…defines the last of the themes, that is different from the current theme, as the parent theme.` | same | yes — `ThemeLifecycleService.php:565-588`, `DatabaseConfigLoader.php:328-336` |
| `configInheritance` is available from 6.4.8.0 | `The configInheritance is available from Shopware Version 6.4.8.0` | `…/configuration/theme-configuration.md` | not checked (version floor below the 6.7 pin) |
| Config is always merged with the Storefront config, so only changed values need supplying | `You always inherit from the storefront config and both configurations are merged.` | same | yes — `DatabaseConfigLoader.php:95-114,328-336` |
| The inheritance relationship is created at install; `theme:refresh` updates it | `The relationship of the inheritance is only created while installing the theme.` | same | yes — `parentThemeId` is written by `ThemeLifecycleService` on refresh/install (`:565-588`) |
| A whole namespace or a single file from a namespace can be referenced in `style`/`script`, changing import order | `you can also reference single files from a specific namespace` | same | yes — `ThemeFileResolver.php:404-421` |
| `scss: false` prevents injection as a SCSS variable; `label`/`helpText` deprecated for v6.8 | `(Deprecated for v6.8: Translations are now handled via Administration snippets)` | same | `scss: false` yes (`ThemeCompiler.php:688-731`); the v6.8 deprecation not checked |
| `overrides.scss` is a separate entry point declared before `@Storefront` to override `!default` variables | `there is an additional SCSS entry point defined in your theme.json which is declared before @Storefront` | `…/styling/override-bootstrap-variables-in-a-theme.md` | yes — `ThemeCreateCommand.php:186-223`, `_theme.scss:10` |
| A PHP SASS compiler reads the files declared in `style` | `the PHP SASS compiler will look up the files declared in the style section` | `…/styling/add-css-js-to-theme.md` | yes — `ThemeCompiler.php:617-620` |
| `@StorefrontBootstrap` may be used only in `style`, not combined with `@Storefront`, and does not include `@Plugins` | `You can only use either @StorefrontBootstrap or @Storefront.` | `…/inheritance/add-theme-inheritance-without-resources.md` | partly — `@StorefrontBootstrap` resolving to the Storefront `base.scss` is confirmed (`ThemeFileResolver.php:288-305,339-348`); the usage restrictions were not checked |
| A field redefined in the extending theme's theme.json is not inherited | `this field will not be inherited regardless that it is already defined in the SwagBasicExampleTheme` | `…/configuration/theme-inheritance-configuration.md` | yes, by mechanism — `array_replace_recursive` lets the child's value win key by key (`DatabaseConfigLoader.php:95-114`) |

Intent/business context code cannot express:

- Inheritance exists so a bought or corporate base theme can be varied per sales channel or season without forking it.
- Overriding a third-party theme's variables can break compilation when that theme renames them.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `add-theme-inheritance.md` calls the override entry point `override.css` | The generated theme and the compiler use `app/storefront/src/scss/overrides.scss`; the entry is SCSS, not CSS | `Theme/Command/ThemeCreateCommand.php:186-208` |
| The docs present the `style` list as an inheritance declaration comparable to `views` | `style` is an ordered file list concatenated into one SCSS input with per-path dedup; it has no relation to the Twig hierarchy, which is driven only by `views` | `Theme/ThemeFileResolver.php:157-170,383-391`; `Theme/Twig/ThemeInheritanceBuilder.php:104` |
| The docs never state how a parent theme's SCSS is "overridden" | There is no file-level override: a child file at the same relative path is simply another file in the concatenation; overriding is the SCSS cascade plus `!default` ordering | `Theme/ThemeFileResolver.php:383-391`; `Theme/ThemeCompiler.php:617-620` |
| `theme-configuration.md` gives the asset default path as `<plugin root>/app/storefront/src/assets` (no `src/Resources` segment) | Theme paths are resolved relative to `<bundle>/Resources` | `Theme/ThemeFileResolver.php:157-170`; `…/StorefrontPluginConfigurationFactory.php:142-160` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Inheritance is declared in `<plugin root>/src/Resources/theme.json` by adding the base theme's placeholder (e.g. `@SwagBasicExampleTheme`) into the `views`, `style`, `script`, `asset` and `configInheritance` sections, right before the current theme. | rewritten | kept and extended: code confirms the file location and the `@`-placeholder mechanism, and additionally shows the exact key set with no `parent`/`extends` key (`…Factory.php:70-116`) |
| `"views": ["@Storefront", "@Plugins", "@<BaseTheme>", "@<ThisTheme>"]` is the template rendering/override order; `@Storefront` is the always-inherited default theme and `@Plugins` the placeholder for plugin extensions. | rewritten | correct; made precise — the array is reversed so the last entry has highest priority, non-listed bundles fall into `@Plugins`, and the fallback order without `views` is stated (`ThemeInheritanceBuilder.php:28-81,88-113`) |
| `configInheritance` inherits theme configuration fields from the listed themes (the last one different from the current theme becomes the parent); the Storefront configuration is inherited even without an entry. | merged into fact 1 | fully confirmed (`ThemeLifecycleService.php:565-588`, `DatabaseConfigLoader.php:328-336`) but folded into the theme.json fact to make room for the SCSS-ordering fact the query asks for |
| — | added (fact 3) | the query asks about SCSS overrides and the old set never said how they work; code shows SCSS inheritance is ordered concatenation with no file-level shadowing, and that `overrides.scss` precedes `@Storefront` because of `!default` (`ThemeFileResolver.php:383-391`, `ThemeCreateCommand.php:186-223`) |
