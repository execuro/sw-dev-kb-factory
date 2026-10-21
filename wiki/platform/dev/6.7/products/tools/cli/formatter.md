---
id: platform/dev/6.7/products/tools/cli/formatter.md
title: Formatter
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/formatter.html
sourceHash: 9211c180d534f78628b21aed7a51071fc261afa4
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli extension format", "shopware-cli project format", "php-cs-fixer", "prettier", "--dry-run", "--only", "--exclude", ".php-cs-fixer.dist.php", "validation.ignore_extensions", "PROJECT_ROOT", "code formatting", "coding standard", "code style"]
summary: Shopware CLI extension format / project format commands - php-cs-fixer and Prettier formatters, --only/--exclude/--dry-run flags, config lookup.
lastBuilt: 2026-10-21
---
## What it is

Shopware CLI ships two `format` commands: `extension format` formats a single extension, `project format` formats the local extensions and configured bundles of a whole Shopware project. PHP files are formatted with the Shopware Coding Standard (via PHP-CS-Fixer); JavaScript, TypeScript, Vue, CSS and SCSS are formatted with Prettier.

## When to use

- Before committing or in CI, to apply or check (`--dry-run`) the Shopware code style on an extension or a project.
- When only one tool should run (e.g. PHP only) or one should be skipped.

## Key steps / config

Formatters (all run by default):

| Tool | Formats |
|---|---|
| `php-cs-fixer` | PHP source files, Shopware Coding Standard |
| `prettier` | Prettier-supported files in source directories, CLI-bundled config |

Commands (Docker is recommended — the image has all runtime dependencies):

```shell
docker run --rm -v "$(pwd)":/ext ghcr.io/shopware/shopware-cli extension format /ext [--dry-run]
docker run --rm -v "$(pwd)":/project ghcr.io/shopware/shopware-cli project format /project [--dry-run]
shopware-cli extension format /path/to/your/extension --only "php-cs-fixer,prettier"
shopware-cli project format /path/to/your/project --only "prettier,php-cs-fixer" --exclude prettier
```

Flags (both commands):

| Flag | Meaning |
|---|---|
| `--only <tools>` | Run only these comma-separated formatters |
| `--exclude <tools>` | Remove formatters from all formatters or from the `--only` selection |
| `--dry-run` | Check formatting without modifying files |
| `--verbose` | Log source directories, extension names, external tool commands and arguments |

Path argument: required for `extension format`, optional for `project format`. Without a path, `project format` walks up from the current directory to the nearest Shopware project — a directory whose Composer metadata references `shopware/core` and that has `bin/console`. `PROJECT_ROOT` overrides this discovery.

`project format` skips extensions resolved under `vendor/` and extensions listed in `validation.ignore_extensions`.

Configuration:

- PHP-CS-Fixer uses `.php-cs-fixer.dist.php` from the target root if present, otherwise the bundled config.
- Prettier always uses the configuration bundled with Shopware CLI.

Local (non-Docker) execution requires PHP 8.2+ and Node.js 20+; Composer and npm are used to initialize the CLI's local tool cache.

## Essential identifiers

- `shopware-cli extension format`, `shopware-cli project format`
- `php-cs-fixer`, `prettier`
- `--only`, `--exclude`, `--dry-run`, `--verbose`
- `.php-cs-fixer.dist.php`, `validation.ignore_extensions`, `PROJECT_ROOT`

## Gotchas

- The exit status of the formatter is propagated: a non-zero `--dry-run` usually means formatting changes are needed, not that the tool crashed.
- A project or extension `.prettierrc` is ignored by the `format` commands.
- Tools without formatting support cannot be passed to `--only`; the command errors and lists available formatters.
- Unknown names, excluding a formatter outside the selected set, or excluding every selected formatter is an error — raised before any tool setup or file change.
- A `Formatters:` table is printed after the run (also on execution errors, with non-zero exit). `invoked` only means the tool was called, not that it analyzed or changed files; `skipped` means deselected by `--only` or removed by `--exclude`.

## Code check (6.7.15.1)
- confirmed `shopware/core` — Composer package name the project detection looks for — vendor/shopware/core/composer.json:2
- confirmed `php` — core itself requires PHP ~8.2 or later, consistent with the local tooling requirement — vendor/shopware/core/composer.json:36
- confirmed `PROJECT_ROOT` — env var also read by the core kernel for the project dir — vendor/shopware/core/Framework/Adapter/Kernel/KernelFactory.php:83
- unverified `shopware-cli extension format` — Go CLI (shopware-cli), outside the Shopware package roots
- unverified `shopware-cli project format` — Go CLI, out of scope
- unverified `php-cs-fixer` — formatter wiring lives in shopware-cli, out of scope
- unverified `prettier` — formatter wiring lives in shopware-cli, out of scope
- unverified `.php-cs-fixer.dist.php` — no such file in the core package; CLI-side lookup, out of scope
- unverified `validation.ignore_extensions` — shopware-cli project config key, out of scope
