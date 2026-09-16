---
id: platform/dev/6.7/products/tools/cli/formatter.md
title: Formatter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/formatter.html
sourceHash: "eabd21d314512b5efd935c58f897a0f3ca29e05b"
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli extension format", "shopware-cli project format", "--dry-run", "--only", "php-cs-fixer", "prettier", "admin-twig", ".php-cs-fixer.dist.php", "validation.ignore_extensions", "PROJECT_ROOT", "code formatting", "coding standard", "formatter"]
summary: "shopware-cli extension/project format: PHP-CS-Fixer, Prettier, Admin Twig formatting; --dry-run, --only flags and config file lookup."
lastBuilt: 2026-09-15
---
## What it is

Shopware CLI formats code through two commands: `extension format` (one extension) and `project format` (extensions and configured bundles across a project). It covers PHP (Shopware Coding Standard via PHP-CS-Fixer), Administration Twig files, and Prettier-supported files (JavaScript, TypeScript, Vue, CSS, SCSS).

## When to use

Before committing or in CI to enforce consistent formatting on a plugin/app or on all local extensions of a Shopware project; use `--dry-run` as a formatting check gate.

## Key steps / config

Formatting tools (without `--only`, every registered verifier tool runs; only these three rewrite files):

| Tool | Formats |
|---|---|
| `php-cs-fixer` | PHP files, Shopware Coding Standard |
| `prettier` | Prettier-supported files in source dirs, CLI-bundled config |
| `admin-twig` | Administration Twig templates |

Format an extension (path required):

```shell
docker run --rm -v "$(pwd)":/ext ghcr.io/shopware/shopware-cli extension format /ext
shopware-cli extension format /path/to/your/extension --dry-run
```

Format a project (path optional):

```shell
docker run --rm -v "$(pwd)":/project ghcr.io/shopware/shopware-cli project format /project
shopware-cli project format /path/to/your/project --dry-run
shopware-cli project format /path/to/your/project --only php-cs-fixer
```

Project format options: `--dry-run` (check without modifying), `--only <tools>` (comma-separated tool list).

Project format behavior:
- Extensions resolved under `vendor/` and those listed in `validation.ignore_extensions` are skipped.
- Without a path, it walks up from the current directory to the nearest Shopware project: Composer metadata referencing `shopware/core` and an existing `bin/console`. `PROJECT_ROOT` overrides discovery.

Configuration:
- PHP-CS-Fixer uses `.php-cs-fixer.dist.php` from the target root if present, otherwise the CLI's bundled config.
- Prettier always uses the CLI-bundled config; a project/extension `.prettierrc` is ignored.
- Admin Twig formatting uses a built-in formatter with no config file.

## Essential identifiers

- `shopware-cli extension format`, `shopware-cli project format`
- `--dry-run`, `--only`
- `php-cs-fixer`, `prettier`, `admin-twig`
- `.php-cs-fixer.dist.php`, `validation.ignore_extensions`, `PROJECT_ROOT`
- Docker image `ghcr.io/shopware/shopware-cli`

## Gotchas

- The CLI propagates the formatter exit status: a non-zero `--dry-run` usually means formatting changes are needed, not that the formatter crashed.
- Docker is recommended because the image ships the runtime dependencies. Local runs need PHP 8.2+ and Node.js 20+; Composer and npm are used to initialize the local tool cache.
- `.prettierrc` files in your project are not honored by `format`.

## Code check (6.7.13.0)
- confirmed `shopware/core` — Composer package name used for project detection — vendor/shopware/core/composer.json:2
- confirmed `php` — core requires `~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0`, consistent with the PHP 8.2+ requirement — vendor/shopware/core/composer.json:51
- confirmed `node` — administration package engines allow Node `^20.0.0` and later majors — vendor/shopware/administration/Resources/app/administration/package.json:224
- confirmed `PROJECT_ROOT` — env var also read by core's kernel factory for the project dir — vendor/shopware/core/Framework/Adapter/Kernel/KernelFactory.php:76
- unverified `project format` — implemented in shopware-cli (Go), not in vendor/shopware
- unverified `php-cs-fixer` — shopware-cli verifier tool, out of scope
- unverified `admin-twig` — shopware-cli verifier tool, out of scope
- unverified `validation.ignore_extensions` — .shopware-project.yml key read by shopware-cli, out of scope
- unverified `.php-cs-fixer.dist.php` — no such file shipped in vendor/shopware/core or storefront; lookup done by shopware-cli
