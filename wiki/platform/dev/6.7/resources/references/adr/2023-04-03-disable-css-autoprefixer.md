---
id: platform/dev/6.7/resources/references/adr/2023-04-03-disable-css-autoprefixer.md
title: Disable the CSS autoprefixer in the Storefront by default
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-03-disable-css-autoprefixer.html
sourceHash: 12982c0981569309b89a3f0e6bb73a5d1648f5e4
codeCheckedAgainst: "6.7.15.1"
keywords: ["autoprefixer", "css vendor prefixes", "padaliyajay/php-autoprefixer", "scssphp/scssphp", "theme:compile", "storefront.theme.auto_prefix_css", "theme compiler", "ScssPhpCompiler", "browserslist", "all.css", "scss", "adr"]
summary: ADR 2023-04-03 - Storefront theme:compile stops adding CSS vendor prefixes by default; prefix manually in SCSS. Option removed by 6.7.
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2023-04-03, area storefront) that disables automatic CSS vendor prefixing of the compiled Storefront theme CSS by default. Storefront SCSS is compiled by `scssphp/scssphp`; the prefixes were previously added by the `padaliyajay/php-autoprefixer` package.

## When to use

- You rely on vendor-prefixed CSS (`-webkit-...`, `-moz-...`) in a Storefront theme and notice it is missing from the compiled `all.css`.
- You need to decide whether to prefix CSS properties manually in theme SCSS.

## Key steps / config

- `bin/console theme:compile` compiles the theme SCSS with scssphp and writes `all.css` without any vendor prefixes.
- When a prefix is still needed (older browsers, or a property from the ADR's table), write it manually in your SCSS. The ADR recommends this over automatic prefixing anyway.
- Browser support at the time of the decision (`.browserslist`):

```
>= 0.5%
last 2 major versions
not dead
Chrome >= 60
Firefox >= 60
Firefox ESR
iOS >= 12
Safari >= 12
not Explorer <= 11
```

## Essential identifiers

- `theme:compile` (CLI)
- `scssphp/scssphp` (the SCSS compiler package)
- `Shopware\Storefront\Theme\ScssPhpCompiler`

## Gotchas

- Why it was disabled: since the Bootstrap v5 update, most generated prefixes are no longer needed for the supported browsers. The autoprefixer slowed `theme:compile` down noticeably, especially in SaaS. It also hard-coded the properties it prefixed and ignored `.browserslist`.
- Prefixes that the ADR says may still matter, because support is only partial:
  - `-webkit-clip-path` (Safari 7–13, iOS 7–12.5)
  - `-webkit-background-clip: text`
  - `-webkit-hyphens` (Safari/iOS)
  - `-webkit-mask-repeat`, `-webkit-mask-position` and `-webkit-mask-size` (Chrome/Edge)
  - `position: -webkit-sticky` (Safari 7.1–12.1)
  - `-webkit-box-reflect` (not supported in Firefox)
- `flow-from`/`flow-into` are not supported by any current browser, so no prefix helps.
- The ADR does not treat the change as a hard break. Its reasoning: the remaining valid prefixes are mostly cosmetic.

## Version notes

- The ADR made the old prefixing opt-in through the config key `storefront.theme.auto_prefix_css` (in `Storefront/Resources/config/packages/storefront.yaml`). It also announced that auto-prefixing would be deprecated for v6.6.0, leaving SCSS compiling only.
- In 6.7.15.1, neither that key nor the PHP autoprefixer exists in the code. Manual prefixing in SCSS is the only option.
- The Storefront JS build (webpack/PostCSS) uses its own npm `autoprefixer`. That is separate from the PHP theme compiler.

## Code check (6.7.15.1)
- absent `storefront.theme.auto_prefix_css` — no config key or reference anywhere in core/storefront; the opt-in described by the ADR no longer exists
- absent `padaliyajay/php-autoprefixer` — no reference in core/storefront; the PHP autoprefixer is gone
- confirmed `ScssPhpCompiler` — theme SCSS is compiled with scssphp, no prefixing step — vendor/shopware/storefront/Theme/ScssPhpCompiler.php:13
- confirmed `ScssPhp\ScssPhp\Compiler` — the scssphp compiler class is used — vendor/shopware/storefront/Theme/ScssPhpCompiler.php:5
- confirmed `theme:compile` — CLI command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:21
- confirmed `autoprefixer` — npm PostCSS plugin used only by the Storefront JS/SCSS build — vendor/shopware/storefront/Resources/app/storefront/postcss.config.js:6
