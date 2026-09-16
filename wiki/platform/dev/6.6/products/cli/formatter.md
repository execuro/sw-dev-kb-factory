---
id: platform/dev/6.6/products/cli/formatter.md
title: Formatter
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/formatter.html
sourceHash: 1375085849709e5f0cd0c581b9b1456f59f9ccfb
keywords: ["shopware-cli", "formatter", "extension format", "project format", "php-cs-fixer", "prettier", "code style", "dry-run", "Shopware Coding Standard", ".php-cs-fixer.dist.php", ".prettierrc", "admin twig"]
summary: "shopware-cli extension format / project format apply PHP, JS, CSS/SCSS and Admin Twig code style, with --dry-run to preview."
lastBuilt: "2026-09-15"
---
## What it is

Shopware-CLI ships a built-in formatter that reformats PHP, JavaScript, CSS, SCSS, and Admin Twig files for an extension or an entire project.

## When to use

Use it to bring an extension or a project's code into the Shopware Coding Standard, or to preview what a format pass would change before committing to it.

## Key steps / config

Format a single extension:

```shell
shopware-cli extension format /path/to/your/extension
shopware-cli extension format /path/to/your/extension --dry-run
```

Or via Docker:

```shell
docker run --rm -v $(pwd):/ext shopware/shopware-cli extension format /ext
docker run --rm -v $(pwd):/ext shopware/shopware-cli extension format /ext --dry-run
```

Format an entire project:

```shell
shopware-cli project format /path/to/your/project
shopware-cli project format /path/to/your/project --dry-run
```

Or via Docker:

```shell
docker run --rm -v $(pwd):/ext shopware/shopware-cli project format /ext
docker run --rm -v $(pwd):/ext shopware/shopware-cli project format /ext --dry-run
```

`--dry-run` shows the changes instead of editing the files. Formatting defaults to the Shopware Coding Standard; it can be customized via a `.php-cs-fixer.dist.php` file in the extension root, or a `.prettierrc` file for JavaScript, CSS, and SCSS.

## Essential identifiers

- `shopware-cli extension format`
- `shopware-cli project format`
- `--dry-run`
- `.php-cs-fixer.dist.php`
- `.prettierrc`
