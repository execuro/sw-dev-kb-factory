---
id: platform/dev/6.7/resources/references/adr/2023-04-03-disable-css-autoprefixer.md
title: Disable the CSS autoprefixer in the Storefront by default
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2023-04-03-disable-css-autoprefixer.html
sourceHash: 12982c0981569309b89a3f0e6bb73a5d1648f5e4
codeCheckedAgainst: "6.7.13.0"
keywords: ["theme:compile", "storefront.theme.auto_prefix_css", "padaliyajay/php-autoprefixer", "scssphp/scssphp", "autoprefixer", "vendor prefixes", "css prefix", "browserslist", "all.css", "theme compiler", "scss", "adr"]
summary: "ADR 2023: CSS auto-prefixing of theme:compile output disabled by default; option later removed, prefix manually in SCSS instead."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (2023-04-03, area: storefront) that disables automatic vendor-prefixing of the Storefront CSS compiled by `theme:compile` by default, and plans its deprecation for 6.6.0 so only SCSS compiling remains.

## When to use

When Storefront CSS lacks `-webkit-`/`-moz-` prefixes you expected, when supporting older browsers, or when you need the reasoning behind prefix-free theme compilation.

## Key steps / config

Reasons given:
- Storefront CSS is compiled by `scssphp/scssphp`; the PHP prefixer added little value after the Bootstrap v5 browser-support update.
- The prefixer significantly slowed `theme:compile` (a problem in SaaS).
- It hard-coded the prefixed properties and ignored `.browserslist`.

Browser support at the time of the ADR:

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

What to do on 6.7:
1. Write required vendor prefixes manually in your theme SCSS (the ADR's recommendation).
2. Run `bin/console theme:compile`; the output `all.css` contains no automatic vendor prefixes.

Prefixes the ADR marks as not fully covered by browser support (candidates for manual prefixing): `-webkit-box-reflect`, `-webkit-clip-path` (Safari 7-13, iOS 7-12.5), `-webkit-background-clip` (value `text`), `-webkit-hyphens` (Safari/iOS), `-webkit-mask-repeat`/`-webkit-mask-position`/`-webkit-mask-size` (Chrome, Edge), `position: -webkit-sticky` (Safari 7.1-12.1), `-webkit-flow-from`/`-webkit-flow-into` (no browser support). All listed `-moz-` prefixes are fully covered.

## Essential identifiers

- `theme:compile` (Storefront theme compile command)
- `scssphp/scssphp` (`ScssPhp\ScssPhp\Compiler`)
- `all.css` (compiled theme stylesheet)

## Gotchas

- The ADR says auto-prefixing could be re-enabled via `storefront.theme.auto_prefix_css` in `Storefront/Resources/config/packages/storefront.yaml`. In 6.7.13.0 neither the key nor that file exists; the `storefront.theme` config tree only offers `config_loader_id`, `theme_path_builder_id`, `available_theme_provider`, `file_delete_delay` (deprecated), `allowed_scss_values` and `validate_on_compile`. There is no switch to turn PHP auto-prefixing back on.
- `padaliyajay/php-autoprefixer` is not referenced by the installed Shopware packages.
- Not treated as a hard break: most prefixes are unneeded, some target abandoned properties, the rest are mostly cosmetic.
- The storefront Node build config (`postcss.config.js`) still lists the `autoprefixer` PostCSS plugin; that is the JS/asset build, not the PHP `theme:compile` SCSS step.

## Version notes

- ADR (2023): prefixing disabled by default, still switchable via config; deprecation planned for 6.6.0.
- 6.7.13.0: the config option and the PHP prefixer are gone from the installed code; SCSS compiling only.

## Code check (6.7.13.0)
- absent `storefront.theme.auto_prefix_css` — not in the storefront `theme` config tree nor anywhere in installed vendor/shopware
- absent `padaliyajay/php-autoprefixer` — no reference in installed vendor/shopware packages
- confirmed `storefront.theme.validate_on_compile` — last key of the storefront `theme` config node, no prefix option — vendor/shopware/storefront/DependencyInjection/Configuration.php:36
- confirmed `storefront.theme` — config node definition — vendor/shopware/storefront/DependencyInjection/Configuration.php:23
- confirmed `theme:compile` — console command name — vendor/shopware/storefront/Theme/Command/ThemeCompileCommand.php:19
- confirmed `ScssPhp\ScssPhp\Compiler` — scssphp used for theme SCSS compiling — vendor/shopware/storefront/Theme/ScssPhpCompiler.php:5
- confirmed `autoprefixer` — PostCSS plugin in the storefront Node build config — vendor/shopware/storefront/Resources/app/storefront/postcss.config.js:6
