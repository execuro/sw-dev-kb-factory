# `edge-02` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-02` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-82-91` |
| Core version | `6.7.13.0` |

**Query:** How do I get the DI container with `Shopware()->Container()` and override the product listing Smarty template in Shopware 6?

**Expected answer — every fact an answer must contain:**

1. States that neither premise holds in Shopware 6: no global `Shopware()` function is declared or called anywhere in the platform, and there is no Smarty engine and no `.tpl` template — both are Shopware 5 concepts. `[code: absent — 0 declarations and 0 usages of `Shopware()` across `vendor/shopware/`; no Smarty package, no `.tpl` file]`
2. Names the Shopware 6 service mechanism: Shopware 6 is a Symfony application whose services are declared in the plugin's service configuration and received by constructor injection from the Symfony DI container. `[code: config/bundles.php:1-20]`
3. Names the Shopware 6 template mechanism: the storefront is Twig (`twig/twig`), the product listing template is `storefront/component/product/listing.html.twig`, and it is overridden by placing a file at the same relative path under the bundle's `Resources/views` and extending the original with `{% sw_extends %}`, overriding the blocks you need. `[code: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:50-68]`

**Trap:** `Shopware()->Container()`, Smarty templates and `sArticles` are Shopware 5 concepts; none exists in Shopware 6.

**Official reference URL:** none — Shopware 5 documentation is no longer hosted by Shopware (https://developer.shopware.com/shopware-5 only shows the SafeFive handover banner). For the Shopware 6 mechanism: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-templates.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Shopware 6 is a Symfony application; bundles are registered in `config/bundles.php` and the container is the Symfony DI container | `config/bundles.php:1-20` (project root) | `return [ Symfony\Bundle\FrameworkBundle\FrameworkBundle::class => ['all' => true], Shopware\Core\Framework\Framework::class => ['all' => true], … Shopware\Storefront\Storefront::class => ['all' => true],` |
| The storefront renders Twig | `vendor/shopware/storefront/composer.json:70-75` | `"symfony/twig-bridge": "~7.4.12", … "twig/twig": "^3.26.0"` |
| The product listing template is a Twig file | `vendor/shopware/storefront/Resources/views/storefront/component/product/listing.html.twig:1-5` | `{% set paginationConfig = { page: searchResult.page } %}` |
| Overrides use the Shopware-specific `sw_extends` tag, which the token parser turns into a Twig `extends` against the next template in the namespace hierarchy | `Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:50-68` | `new Token(Token::NAME_TYPE, 'extends', 2), … public function getTag(): string { return 'sw_extends'; }` |
| The override hierarchy is built from bundles that have a `Resources/views` directory, ordered by `Bundle::getTemplatePriority()` | `Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:36-46` | `$directory = $bundlePath . '/Resources/views'; … $bundles[$bundle->getName()] = $bundle->getTemplatePriority();` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `Shopware()->Container()` reaches the DI container in Shopware 6 | absent | `grep -rn "function Shopware("` over `vendor/shopware/` returns nothing — no such global function is declared. `grep -rn "Shopware()->"` returns nothing — the call form appears nowhere in core, storefront or administration. `grep -rln Enlight` matches only a Faker demodata word list. |
| The product listing template is Smarty and can be overridden as `.tpl` | absent | `grep -ril smarty` over core and storefront returns nothing; `find vendor/shopware -name "*.tpl"` returns no files. The 6.6 storefront is Twig-only too: its `composer.json` at `v6.6.10.0` requires `twig/twig ^3.19.0` and no Smarty package. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _none recorded_ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Shopware's own 5→6 migration material states Smarty templates and Shopware 5 plugins are not portable; the storefront is Twig | 6.x | open | https://docs.shopware.com/en/migration-en/UpgradeGuideShopware6 |
| Forum threads from Shopware 5 developers asking for Twig equivalents of Smarty features; answers point to Twig extensions | 6.x | open | https://forum.shopware.com/discussion/63956/eigener-twig-modifier |
| Community guidance reaches services by constructor injection via `services.xml`/`services.php`, not a global accessor | 6.x | open | https://github.com/shopware/docs/blob/main/guides/plugins/plugins/plugin-fundamentals/dependency-injection.md |
| Third-party migration write-ups report the Shopware 6 theme is a full rewrite | 6.x | open | https://www.elixentdigital.com/guides/shopware-5-to-6-migration-guide |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does a global `Shopware()` function exist anywhere in 6.6/6.7? | code lane recursive grep over `vendor/shopware/` | No — 0 declarations, 0 usages. |
| Does the Storefront register a Smarty engine or only Twig? | code lane grep + `vendor/shopware/storefront/composer.json`, plus upstream `v6.6.10.0` composer.json | Twig only, in both 6.6 and 6.7. |
| Any `.tpl` file under the storefront? | code lane `find vendor/shopware -name '*.tpl'` | None. |
| Exact product listing template path and override mechanism in 6.7? | code lane file read + `ExtendsTokenParser` / `BundleHierarchyBuilder` | `storefront/component/product/listing.html.twig`; same-path shadowing under `Resources/views` plus `sw_extends`. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The Storefront uses Twig as its templating engine | "The Storefront component uses Twig as the templating engine and SASS for styling purposes." | `developer/concepts/framework/architecture/storefront-concept.md` | yes |
| A plugin overrides a template by recreating the core directory structure under its own `views` directory | "Starting from the `views` directory, the path is **exactly the same**…" | `developer/guides/plugins/plugins/storefront/templates/customize-templates.md` | yes — `BundleHierarchyBuilder.php:36-46` |
| The plugin view path is `<plugin root>/src/Resources/views` | "By default, Shopware 6 is looking for a directory called `views` in your plugin's `Resources` directory…" | same page | yes |
| The override file extends the original with `sw_extends` and overrides named blocks | "{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}" | same page | yes — `ExtendsTokenParser.php:50-68` |
| Services are obtained by declaring them as constructor parameters | "This guide explains how to inject services into other services…" | `developer/guides/plugins/plugins/services/dependency-injection.md` | yes — Symfony DI container, `config/bundles.php` |
| Dependencies must be injected via the service container | "Dependencies must be injected via the service container." | `developer/guides/plugins/plugins/architecture/dependency-injection-dependency-handling.md` | yes |

Context the docs add that code does not express: overriding a template only becomes visible once the theme is assigned to the sales channel; and since 6.7.11.0 a composable component system exists alongside block overriding. Neither is part of the facts.

Doc-lane caveat: the clones are gitignored, so that lane's recursive `Grep` returned nothing corpus-wide. Its absence-of-a-*page* findings (no Smarty page) rest on `Glob` and stand; absence of an incidental mention inside an unread page is not established. The lane also noted that `customize-templates.md` is version-mixed internally (a worked example links the core template at `v6.6.10.2` while a later section is marked "Since Shopware 6.7.11.0") — the override mechanism itself is code-confirmed identical in both versions, so this does not affect the facts.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| _none — the documentation and the code agree; the divergence in this case is between the Shopware 5 premise in the query and the Shopware 6 source_ | — | — |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that `Shopware()->Container()` and Smarty templates are Shopware 5 concepts with no counterpart in Shopware 6. | rewritten | Kept, and now backed by the code absence checks (0 `Shopware()` declarations/usages, no Smarty package, no `.tpl` file) rather than asserted. |
| Names the Shopware 6 equivalents actually read: services are registered in the plugin's service configuration and injected via the constructor (Symfony DI), storefront templates are Twig and extended with `sw_extends` and blocks. | split and rewritten | Split into two checkable facts; the "actually read" qualifier was dropped and the concrete listing template path added, since that is what makes an answer usable. |
| Invents no compatibility layer, bridge service or Smarty support. | removed | Subsumed by fact 1, which now states the absence positively with its code evidence; a separate negative fact adds nothing a scorer can check independently. |
