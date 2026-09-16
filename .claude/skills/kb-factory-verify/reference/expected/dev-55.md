# `dev-55` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-55` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** How do the breaking storefront accessibility changes reach my theme in Shopware 6.7, and what must an extension that overrides the affected Twig blocks do?

**Expected answer — every fact an answer must contain:**

1. In 6.7 the accessibility changes are **unconditional**: the `{% if feature('ACCESSIBILITY_TWEAKS') %}` / `{% else %}` branches that 6.6 shipped are gone and the new markup is the shipped template. The flag itself still exists as a declaration (`major: true`, `default: true`) but nothing in core or storefront reads it — no PHP, Twig, JS or SCSS file — so it cannot be used to keep the old markup; the flag-based advice in the docs describes 6.6, not 6.7. `[code: Framework/Resources/config/packages/feature.yaml:24-28]`
2. The change reaches a theme through `sw_extends`: the parent is resolved by `TemplateFinder` and compiled to a native Twig `extends`, so every block the theme does **not** override picks up the new storefront markup automatically, while every block it **does** override keeps the theme's now-stale markup. Where the accessibility work removed a block (e.g. `layout_header_actions_currency_widget_form_items_element_input`, replaced by a `<button type="submit">` inside `layout_header_actions_currency_widget_form_items_element_label`), the stale override is silently dropped — Twig yields nothing for an unknown block name and Shopware raises no warning; the one loud case is an override that calls `{{ parent() }}`, which throws a Twig `RuntimeError`. `[code: Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:42-63]` `[code: twig/twig src/Template.php:435-479]`
3. The only remedy is re-adopting the new structure block by block — e.g. the cart line-item wrapper is now a plain `<li>` and the product card no longer wraps the image in its own anchor (the name link carries `stretched-link` instead) — and it is not Twig alone: SCSS defaults moved (`$font-size-base: 1rem !default`, so a `bin/console theme:compile` is needed and a theme that set its own value keeps the old one) and JS-generated markup changed (the listing plugin now builds the active-filter label as a `<button>` with `aria-label`). `[code: shopware/storefront Resources/views/storefront/component/line-item/type/product.html.twig:31]` `[code: shopware/storefront Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_bootstrap.scss:63]` `[code: shopware/storefront Resources/app/storefront/src/plugin/listing/listing.plugin.js:352-363]`

**Trap:** An answer that tells the reader to set `ACCESSIBILITY_TWEAKS=1` in `.env`, or that the changes can be switched off again by disabling that flag, is wrong for 6.7 — the flag is inert there.

**Official reference URL:** https://developer.shopware.com/docs/guides/development/accessibility/storefront-accessibility.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The flag is declared but read nowhere in 6.7 | `Framework/Resources/config/packages/feature.yaml:24-28` | `- name: ACCESSIBILITY_TWEAKS\n  default: true\n  major: true\n  toggleable: true` |
| 6.6 gated the line-item wrapper on the flag; 6.7 ships a plain `<li>` | 6.6: `v6.6.10.0 src/Storefront/…/line-item/type/product.html.twig:22-28` — 6.7: `shopware/storefront Resources/views/storefront/component/line-item/type/product.html.twig:31` | 6.6 `{%- if feature('ACCESSIBILITY_TWEAKS') -%}<li …>{%- else -%}<div … role="listitem">` → 6.7 `<li class="{{ lineItemClasses }}">` |
| Blocks were removed, not only re-marked-up | 6.6: `v6.6.10.0 …/layout/header/actions/currency-widget.html.twig:56-65` — 6.7: same file `:38-43` | 6.6 `{% block layout_header_actions_currency_widget_form_items_element_input %}` (deprecated tag:v6.7.0) → 6.7 `<button class="dropdown-item …" type="submit" …>` inside `…_element_label` |
| `sw_extends` compiles to native `extends` after `TemplateFinder` resolves the parent | `Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:42-63` | `$parent = $this->finder->find($options['template'], false, $source);` |
| An override of a non-existent parent block yields nothing, silently | `twig/twig src/Template.php:435-448` | `if ($useBlocks && isset($blocks[$name])) { … } else { $template = null; $block = null; }` |
| …unless it calls `parent()`, which throws | `twig/twig src/Template.php:478-479` | `throw new RuntimeError(sprintf('Block "%s" should not call parent() in "%s" as the block does not exist in the parent template "%s".' …` |
| A removed *template* (not block) fails loudly at `sw_extends` | `Framework/Adapter/Twig/TemplateFinder.php:88-107` | `throw new LoaderError(sprintf('Unable to load template "%s". (Looked into: %s)' …` |
| Product card: image anchor gone, name link carries `stretched-link` | `shopware/storefront Resources/views/storefront/component/product/card/box-standard.html.twig:125,132` | `class="product-name stretched-link">` |
| SCSS default moved and is a `!default` | `shopware/storefront Resources/app/storefront/src/scss/skin/shopware/abstract/variables/_bootstrap.scss:63` | `$font-size-base: 1rem !default;` |
| JS-generated active-filter label is now a `<button>` with `aria-label` | `shopware/storefront Resources/app/storefront/src/plugin/listing/listing.plugin.js:352-363` | `<button class="${this.options.activeFilterLabelClasses}" … aria-label="…">` |
| New a11y structures added that an override of the surrounding block would swallow | `shopware/storefront Resources/views/storefront/base.html.twig:36-40` | `{% block base_body_skip_to_content %}` |
| The same class of break is already announced for 6.8 in 6.7's templates | `shopware/storefront …/component/product/card/box-standard.html.twig:40-42` | `{# @deprecated tag:v6.8.0 - Block will be removed. …#}` |
| Upstream upgrade guide enumerates the affected templates, its flag note written from the 6.6 standpoint | `github.com/shopware/shopware blob v6.7.0.0 UPGRADE-6.7.md:281-400` | `**Note:** Those changes can be activated separately with the ACCESSIBILITY_TWEAKS feature flag.` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| In 6.7 you can keep the old markup by disabling `ACCESSIBILITY_TWEAKS` | absent | `grep -rn ACCESSIBILITY_TWEAKS vendor/shopware` returns exactly one hit — the declaration in `feature.yaml:24`; no PHP/Twig/JS/SCSS reads it |
| Shopware warns at runtime or build time when a theme overrides a removed block | absent | no block-deprecation mechanism exists; removals are announced only as `{# @deprecated #}` comments in the *previous* version's templates, and `yieldBlock` yields nothing for an unknown name (`twig/twig src/Template.php:435-479`) |
| A migration/compatibility layer or legacy template set for the a11y markup | absent | none found; the only mechanism is re-adopting the new block structure |

Test anchors, where found: none — the change is template markup, not covered by a unit test in the vendor distribution.

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Upgraders expected the flag to still be a toggle; answer: it is the default and cannot be deactivated, only overridden | 6.7 | open | forum.shopware.com/t/…/107787 |
| Docs warn the tweaks change HTML/Twig and can break overriding extensions | 6.6 \| 6.7 | open | developer.shopware.com storefront-accessibility |
| Real functional regression from the stretched link on the wishlist | 6.6 \| 6.7 | closed | shopware/shopware#8684 (fixed by #9412) |
| Filter markup changes broke the shipped filter design | 6.6 | closed | shopware/shopware#10218 |
| Release notes enumerate the concrete markup changes an override must follow | 6.7 | open | release-notes/6.7/6.7.0.0 |
| Checking a non-existent feature flag throws a critical Twig error in dev mode | 6.7 | closed | shopware/shopware#16275 |
| Theme vendor: an update alone does not carry the a11y work into a theme; removed elements must be re-integrated | 6.7 | open | service.themeware.design 6.7 note |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `ACCESSIBILITY_TWEAKS` still exist and does any template read it in 6.7? | code | declared in `feature.yaml` only; nothing reads it — the changes cannot be switched off |
| Are the currency/language items now `<button>`, and did block names change? | code | yes; `…_form_items_element_input` was removed, the `…_element_label` block now holds the `<button type="submit">` |
| What replaced the product-card image link block? | code | the image anchor is gone; `product-name stretched-link` on the name link |
| Is there a migration/compatibility layer for the template changes? | code | no — re-adoption is the only mechanism |
| Does Twig throw or silently ignore an override of a removed block? | code | silently ignores; only `{{ parent() }}` in such a block throws `RuntimeError` |

Not settled by code, carried as context only: whether third-party plugin code still evaluates `feature('ACCESSIBILITY_TWEAKS')` meaningfully (only `vendor/` was checked), and the complete list of blocks removed by the a11y work (three representative removals were verified directly).

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Breaking a11y changes are not enabled by default, they sit behind a feature flag | "breaking accessibility changes are not enabled by default … implemented behind a feature flag" | storefront-accessibility.md | no — true for 6.6, false for 6.7 |
| `ACCESSIBILITY_TWEAKS` is activated in `.env`, like `V6_7_0_0` | "The feature flag `ACCESSIBILITY_TWEAKS` can be activated in your `.env` …" | storefront-accessibility.md | no — inert in 6.7 |
| With v6.7.0 all improvements become the default | "With the major version v6.7.0, all accessibility improvements will become the default." | storefront-accessibility.md | yes |
| Template pattern: `{% if feature('ACCESSIBILITY_TWEAKS') %}` renders a new block name next to the deprecated old one | "{% if feature('ACCESSIBILITY_TWEAKS') %} <ul class=\"sidebar-list\"> {% block component_list_items_inner %}" | storefront-accessibility.md | no — that duplicated pattern existed in 6.6 and is removed from 6.7's templates |
| An extension must adopt the new block and may drop the old override after v6.7.0 | "{# This can be removed after v6.7.0 #} {% block component_list_items %}" | storefront-accessibility.md | yes in substance — on 6.7 the old override is simply dead markup |
| Not following the new structure produces incorrect HTML | "the extension still assumes a `<div class=\"list-item\">` which would likely result in incorrect HTML" | storefront-accessibility.md | yes — with the correction that a removed block renders nothing rather than wrong markup |
| A theme recompilation is needed for styling improvements such as font sizes | "Once `ACCESSIBILITY_TWEAKS` is enabled, a theme recompilation is needed …" | storefront-accessibility.md | yes on the recompile, via the `$font-size-base` `!default` change; the flag precondition does not hold in 6.7 |
| Always test extensions with `ACCESSIBILITY_TWEAKS` enabled | "Always test extensions with the `ACCESSIBILITY_TWEAKS` feature flag enabled …" | accessibility/index.md | no — meaningless on 6.7 |

Intent/business context the code cannot express: the driver is legal compliance (WCAG 2.1 AA, BITV 2.0, EAA); the docs place responsibility for accessible markup on the extension developer, not only on core; the flag was intended as a preparation window for extension authors, never a permanent toggle.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The breaking a11y changes are disabled by default behind `ACCESSIBILITY_TWEAKS` | in 6.7 the flag is declared `default: true` and read by nothing; the conditional branches were removed from the templates | `Framework/Resources/config/packages/feature.yaml:24-28` |
| Templates carry both branches, old deprecated block plus new `*_inner` block | 6.7 ships only the new markup; the deprecated branch and, in places, the old block name itself are gone | `shopware/storefront …/currency-widget.html.twig:38-43` |
| The doc page's guidance is addressed to 6.7+ readers ("enable the flag to activate all breaking changes") | that guidance only applies to 6.6; the page never shows what a 6.7 template looks like after the deprecated branch was dropped | `shopware/storefront …/line-item/type/product.html.twig:31` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Breaking accessibility changes ship inside regular minor releases disabled by default behind the feature flag `ACCESSIBILITY_TWEAKS=1` set in `.env` (like major flags such as `V6_7_0_0`); with v6.7.0 all of them become the default. | removed | describes 6.6. In 6.7.13.0 nothing reads the flag — a single grep hit, the declaration itself — so the changes are unconditional and cannot be disabled. Replaced by fact 1 |
| The core pattern duplicates the Twig block: `{% if feature('ACCESSIBILITY_TWEAKS') %}` renders the new `<ul>`/`<li>` block `component_list_items_inner`, the `{% else %}` branch keeps the old `<div>` block `component_list_items`, each marked `@deprecated tag:v6.7.0`. | removed | that duplicated pattern is the 6.6 shape; 6.7's templates ship only the new markup and some old block names no longer exist at all. Replaced by fact 2, which states how the new markup actually reaches a theme and what happens to a stale override |
| An extension that still extends `component_list_items` produces wrong markup once the flag is default and must adopt `component_list_items_inner`; after enabling the flag run `bin/console theme:compile`. | rewritten | the remedy (adopt the new block, recompile the theme) is right, but the outcome is wrong: an override of a removed block renders nothing silently rather than producing wrong markup, and `{{ parent() }}` in it throws. Fact 3 keeps the recompile and adds the SCSS and JS dimensions the old set missed |
