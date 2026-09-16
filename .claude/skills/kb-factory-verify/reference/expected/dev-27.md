# `dev-27` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-27` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2117-22-31` |
| Core version | `6.7.13.0` |

**Query:** In Shopware 6.7, how do I extend a Storefront Twig template from my plugin with `{% extends %}` so I keep the core markup and other plugins' changes?

**Expected answer — every fact an answer must contain:**

1. The overriding template's first line must be `{% sw_extends '@Storefront/storefront/…' %}` — `sw_extends` is a Shopware token parser registered by the core, not plain Twig `extends`.  `[code: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:66]`
2. Plain Twig `{% extends %}` is *not* equivalent: the core registers only `sw_extends`, `sw_include` and `return` token parsers and does not replace Twig's built-in `extends`, so `{% extends '@Storefront/…' %}` loads the literal file through the Twig loader, bypasses `TemplateFinder` and drops every other bundle's version of that template.  `[code: Framework/Adapter/Twig/Extension/NodeExtension.php:34]`
3. The plugin file must sit at the identical relative path under the plugin's `Resources/views` directory (a bundle joins the hierarchy only if that directory exists); `sw_extends` then resolves the parent via `TemplateFinder::find()`, which iterates the namespace hierarchy *excluding the requesting bundle first* and loads the original `@Storefront` file last — that is what chains other plugins' and themes' versions in.  `[code: Framework/Adapter/Twig/TemplateFinder.php:72]` `[code: Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:36]`

**Trap:** The query's premise is wrong. Developers reach for plain Twig `{% extends %}`; it resolves to the one literal template and drops every other plugin's changes. The Storefront requires `sw_extends`.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/templates/customize-templates.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The tag is `sw_extends`, registered by Shopware's own token parser | `Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:66-69` | `public function getTag(): string { return 'sw_extends'; }` |
| `sw_extends` resolves the parent at compile time and injects a plain `extends` token pointing at the resolved template | `Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:43-55` | `$parent = $this->finder->find($options['template'], false, $source);` … `new Token(Token::NAME_TYPE, 'extends', 2), new Token(Token::STRING_TYPE, $parent, 2),` |
| `TemplateFinder::find()` skips the originally requested bundle and walks the hierarchy; the original template is loaded last | `Framework/Adapter/Twig/TemplateFinder.php:72-101` | `// iterate over all bundles but exclude the originally requested bundle` … `// original template is loaded last if ($name === $originalTemplate) { continue; }` |
| Recursion guard: a template extending the same relative path rotates the queue to start after the source bundle | `Framework/Adapter/Twig/TemplateFinder.php:61-70` | `if ($sourceBundleName !== null && $sourcePath === $templatePath) { $index = \array_search($sourceBundleName, $modifiedQueue, true);` |
| A bundle participates only if it has a `Resources/views` directory; namespace is the bundle name | `Framework/Adapter/Twig/NamespaceHierarchy/BundleHierarchyBuilder.php:36-48` | `$directory = $bundlePath . '/Resources/views'; if (!\is_dir($directory)) { continue; }` |
| `Bundle::getTemplatePriority()` defaults to 0 and is the hook for a plugin's position in the hierarchy | `Framework/Bundle.php:108-111` | `public function getTemplatePriority(): int { return 0; }` |
| The hierarchy is extensible via the `shopware.twig.hierarchy_builder` tag (BundleHierarchyBuilder priority 1000) | `Framework/DependencyInjection/services.xml:394,402` | `<argument type="tagged_iterator" tag="shopware.twig.hierarchy_builder"/>` |
| The Storefront ships a second hierarchy builder so themes take part in the same chain | `../storefront/Theme/Twig/ThemeNamespaceHierarchyBuilder.php` | `class ThemeNamespaceHierarchyBuilder implements TemplateNamespaceHierarchyBuilderInterface, ResetInterface` |
| Core Storefront templates themselves use `sw_extends` with the `@Storefront/…` path | `../storefront/Resources/views/storefront/page/content/index.html.twig:1` | `{% sw_extends '@Storefront/storefront/base.html.twig' %}` |
| `sw_extends` optionally takes `template` + `scopes`; a missing `template` throws, default scope is `default` | `Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:74-107` | `throw AdapterException::missingExtendsTemplate(...)` … `$options['scopes'] = [TemplateScopeDetector::DEFAULT_SCOPE];` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Plain Twig `{% extends %}` gives the same multi-plugin-safe inheritance | absent | `NodeExtension` registers only `ExtendsTokenParser` (`sw_extends`), `IncludeTokenParser` and `ReturnNodeTokenParser`; Twig's built-in `extends` parser is not replaced, so `{% extends %}` bypasses `TemplateFinder` — `Framework/Adapter/Twig/Extension/NodeExtension.php:34-41` |
| The Storefront bundle sets a special template priority | absent | `getTemplatePriority()` is overridden only in `Framework.php`, `System.php`, `Profiling.php` and `Administration.php`; `Storefront.php` uses the default 0 — `Framework/Bundle.php:108` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — no `Test/` directory under `Framework/Adapter/Twig` in the dist tree._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Theme overrides from a theme plugin assigned to a *different* sales channel leak into another sales channel's rendering; reported as a 6.7 template-resolution change vs 6.6.10.6 | 6.7.5.1 | closed | https://github.com/shopware/shopware/issues/14292 |
| 6.7.0.0 release notes: new header/footer entry-point templates; extension authors "need to adjust your template extensions" | 6.7 | closed | https://developer.shopware.com/release-notes/6.7/6.7.0.0.html |
| Migration write-ups report 6.6→6.7 Twig overrides of restructured blocks rendering broken markup | 6.7 | open | https://tobias-schaefer.com/blog/shopware-migration-66-to-67/ |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the plugin's `Resources/views` still registered automatically, and where? | code | Yes — `BundleHierarchyBuilder.php:36-48` hardcodes `$bundlePath . '/Resources/views'` |
| Is `sw_extends` still a distinct token parser doing multi-inheritance in 6.7? | code | Yes — `ExtendsTokenParser.php:66` + `TemplateFinder.php:72-101` |
| What decides the chaining order? | code | Reversed bundle registration order, ordered by `Bundle::getTemplatePriority()`; hierarchy extensible via `shopware.twig.hierarchy_builder` |
| Is resolution scoped to the active theme of the current sales channel (issue 14292)? | not settled | Code lane established only that `ThemeNamespaceHierarchyBuilder` exists. Not raised as an open question because no fact above asserts per-sales-channel theme scoping; the signal concerns a theme-assignment bug, not the `sw_extends` mechanism. |
| Do `storefront/layout/header.html.twig` / `footer.html.twig` exist as 6.7 entry points? | not checked | No fact above names a header/footer path, so the point is not load-bearing for this case. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Use `{% sw_extends %}`, not `{% extends %}`, as the first line | "Put this line at the very beginning of your file: `{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}`" | `…/storefront/templates/customize-templates.md` | yes — `ExtendsTokenParser.php:66` |
| `sw_extends` inherits with multi inheritance; "the API is the same like in Twig's default `extends`" | as quoted | `…/storefront/templates/twig-function-reference.md` | partly — multi inheritance confirmed; "same API" is misleading, see divergence |
| Official multi-inheritance support via `sw_*` equivalents since 6.7 | as quoted | `…/twig-function-reference.md` | not checked (version-history claim) |
| The plugin path below `views` must be exactly the same as the core path | "Starting from the `views` directory, the path is **exactly the same**" | `…/customize-templates.md` | yes — `TemplateFinder.php:72-101` matches on the relative path |
| The default view path is `<plugin root>/src/Resources/views` | as quoted | `…/customize-templates.md` | yes — `BundleHierarchyBuilder.php:36` |
| `{{ parent() }}` appends instead of replacing | as quoted | `…/customize-templates.md` | not checked by the code lane |
| A cache clear may be needed | as quoted | `…/customize-templates.md` | not checked by the code lane |
| Templates imported via `{% sw_use %}` may not hold Twig statements outside blocks | as quoted | `…/twig-function-reference.md` | not checked (out of scope for this query) |

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| "The API is the same like in Twig's default `extends`" (twig-function-reference) | The *syntax* overlaps but the semantics differ: `sw_extends` resolves its argument through `TemplateFinder`, skipping the requesting bundle so another bundle's version wins, and additionally accepts an array with `template`/`scopes`. Plain `extends` does none of this. | `Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:43-55`, `:74-107` |
| The Storefront templates docs never state whether plain `{% extends %}` works (docs lane flagged this as unresolved) | Code settles it: `NodeExtension` does not replace Twig's `extends`, so plain `extends` bypasses the hierarchy entirely. | `Framework/Adapter/Twig/Extension/NodeExtension.php:34-41` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `The plugin must mirror the core template path under `<plugin root>/src/Resources/views`, e.g. `src/Resources/views/storefront/layout/header/logo.html.twig` for the core header logo.` | rewritten (now fact 3) | Correct, but the load-bearing half was missing: code shows the directory is what enrols the bundle in the hierarchy and that `TemplateFinder` skips the requesting bundle — that is the mechanism the query asks about. |
| `The template starts with `{% sw_extends '@Storefront/storefront/layout/header/logo.html.twig' %}` and then overrides the named block (e.g. `layout_header_logo_link`) — `sw_extends`, not plain `extends`.` | split into facts 1 and 2 | Confirmed by code; the "not plain `extends`" half is promoted to its own checkable fact with the `NodeExtension` citation, since the query explicitly proposes `{% extends %}`. |
| `` `{{ parent() }}` appends to the original block instead of replacing it, and `./bin/console cache:clear` is required before the change shows. `` | removed | Doc claim only; the code lane checked neither `parent()` semantics nor a cache requirement. Both are code-expressible, so neither qualifies as `[docs-only]` context, and neither decides whether an answer is usable. |
