---
id: platform/dev/6.7/products/tools/cli/automatic-refactoring.md
title: Automatic Refactoring
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/automatic-refactoring.html
sourceHash: 1809bf4af261519f223ce6942abb2e915e4e96ac
codeCheckedAgainst: "6.7.13.0"
keywords: ["extension fix", "project fix", "shopware-cli", "rector", "eslint", "admin-twig", "stylelint", "symfony-xml", "--only", "--allow-non-git", "automatic refactoring", "upgrade", "migration", "shopware/core"]
summary: "shopware-cli extension fix / project fix apply rector, eslint, admin-twig, stylelint, symfony-xml fixers in place; version from shopware/core constraint."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/products/tools/cli/formatter.md", "platform/dev/6.7/guides/upgrades-migrations/administration/_index.md"]
---
## What it is

Shopware CLI's automatic refactoring: the `extension fix` (single extension) and `project fix` (whole project) commands. There is no separate refactoring command; both call the `Fix()` implementation of each selected verifier tool. They do not guarantee compatibility with a target version — use [validation](platform/dev/6.7/products/tools/cli/validation.md) for remaining manual work.

## When to use

As one step of an upgrade: 1) run validation, 2) set the intended Shopware version constraint, 3) run `extension fix`/`project fix`, 4) review `git diff`, 5) address findings without a fixer, 6) rerun tests and validation, 7) optionally [format](platform/dev/6.7/products/tools/cli/formatter.md).

## Key steps / config

Fixers that modify files (all run when `--only` is omitted):

| Tool | Fixes | Version-aware |
|---|---|---|
| `rector` | PHP breaking changes/modernization (Shopware Rector) | Yes |
| `eslint` | Auto-fixable JS/TS/Vue rules, Administration + Storefront | Yes |
| `admin-twig` | Administration Twig component migrations | Yes |
| `stylelint` | Auto-fixable Administration/Storefront SCSS rules | No |
| `symfony-xml` | Plugin `services.xml`/`routes.xml` to YAML | No |

`php-cs-fixer`, `prettier` (formatting) and `phpstan`, `storefront-twig`, `sw-cli` (validation) change nothing in fix mode.

Commands:

```shell
docker run --rm -v "$(pwd)":/ext ghcr.io/shopware/shopware-cli extension fix /ext
shopware-cli extension fix /path/to/your/extension --only "rector,eslint,admin-twig"
docker run --rm -v "$(pwd)":/project ghcr.io/shopware/shopware-cli project fix /project
shopware-cli project fix --only rector
```

- `--only <tools>` — comma-separated tool list.
- `--allow-non-git` — run when the target root has no `.git`.
- Extension path is required; project path is optional (searches upward for the closest Shopware project). `project fix` covers local extensions and configured bundles, skips extensions under `vendor/`; `symfony-xml` only converts platform plugin configuration.

Version resolution: projects use the `shopware/core` constraint in `composer.json`; extensions use their declared Shopware compatibility. The CLI picks the lowest released version matching the constraint (e.g. `"shopware/core": "^6.7"` selects the earliest 6.7 release, not the installed one). To target an exact release, temporarily pin `shopware/core`, run `fix`, then restore.

## Essential identifiers

- `extension fix`, `project fix`, `--only`, `--allow-non-git`
- Tools: `rector`, `eslint`, `admin-twig`, `stylelint`, `symfony-xml`
- `shopware/core` constraint in `composer.json`
- Docker image `ghcr.io/shopware/shopware-cli`

## Gotchas

- Files are rewritten in place, with no temporary copy and no rollback; tools run concurrently and one failure does not cancel the others, so partial changes are possible. Use a clean Git branch and inspect `git diff`.
- `extension fix` requires `.git` in the extension directory itself; a parent Git project is not enough.
- Rector has no preview: its `Check()` reports nothing during validation.
- Rector selects rules by major.minor; an unresolved constraint silently falls back to `6.7.0.0`; version resolution needs network access.
- The docs call plugin `services.xml`/`routes.xml` deprecated; core 6.7.13.0 scaffolding still generates `src/Resources/config/services.xml`.

## Code check (6.7.13.0)
- confirmed `shopware/core` — package name whose constraint drives version resolution — vendor/shopware/core/composer.json:2
- confirmed `services.xml` — core plugin scaffolding still generates src/Resources/config/services.xml — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:58
- confirmed `routes.xml` — core plugin scaffolding still generates src/Resources/config/routes.xml — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:64
- unverified `symfony-xml` — CLI fixer; the docs' XML deprecation claim is not marked in installed core Framework code
- unverified `rector` — CLI verifier tool, not part of vendor/shopware
- unverified `6.7.0.0` — CLI fallback version, implemented in shopware-cli, out of scope
