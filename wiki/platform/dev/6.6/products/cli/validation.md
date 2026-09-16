---
id: platform/dev/6.6/products/cli/validation.md
title: Validation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/validation.html
sourceHash: 49bc4ecc73ffa6d89c260040d4a67303c74c19bc
keywords: ["shopware-cli", "extension validate", "phpstan", "sw-cli", "stylelint", "admin-twig", "php-cs-fixer", "prettier", "eslint", "rector", "check-against", "reporter", ".shopware-extension.yaml", "theme.json"]
summary: "shopware-cli extension validate lints and checks extensions in CI; --full runs all tools, --only picks specific ones."
lastBuilt: "2026-09-15"
---
## What it is

Shopware CLI has built-in extension validation for CI/CD, checking `composer.json`, metadata, PHP lint, `theme.json`, and snippet consistency, with an optional full mode running additional static-analysis and linting tools.

## Key steps / config

Basic validation:

```shell
shopware-cli extension validate /path/to/your/extension
```

Or via Docker:

```shell
docker run --rm -v $(pwd):/ext shopware/shopware-cli extension validate /ext
```

The path may be absolute or relative; the command exits non-zero if validation fails with an error-level message.

Basic mode checks: `composer.json` has a parsable `shopware/core` requirement; metadata `name`, `label` (German/English), `description` (German/English, 150–185 characters) are filled; PHP lints against the minimum PHP version (supported for linting: 7.3, 7.4, 8.1, 8.2, downloaded on demand and run via WebAssembly); `theme.json` parses and its assets exist; all snippet files share the same translation keys.

Full mode against the latest allowed Shopware version:

```shell
shopware-cli extension validate --full /path/to/your/extension
```

Check against a specific bound:

```shell
shopware-cli extension validate --full /ext --check-against lowest
shopware-cli extension validate --full /ext --check-against highest
```

Reporters: `summary` (default), `json`, `junit`, `github`, `markdown`.

Run specific tools with `--only` (comma-separated): `phpstan`, `sw-cli`, `stylelint`, `admin-twig`, `php-cs-fixer`, `prettier`, `eslint`, `rector`.

```shell
shopware-cli extension validate --full /ext --only "phpstan,eslint,stylelint"
```

Ignore errors/warnings with a `.shopware-extension.yaml` (extension) or `.shopware-project.yaml` (project) file:

```yaml
validation:
  ignore:
    - identifier: 'Shopware.XXXXXX'
    - identifier: 'Shopware.XXXXXX'
      path: 'path/to/file.php'
    - message: 'Some error message'
      path: 'path/to/file.php'
    - message: 'Some error message'
```

Scanning an entire project instead of one extension is supported by passing the project root path; place `phpstan.neon` and `.php-cs-fixer.dist.php` in the project root for these checks.

## Essential identifiers

- `shopware-cli extension validate`
- `--full`, `--check-against`, `--reporter`, `--only`
- `.shopware-extension.yaml`, `.shopware-project.yaml`
- `phpstan.neon`, `.php-cs-fixer.dist.php`

## Gotchas

For Shopware 6.7, fixers only activate if the plugin's `composer.json` constrains `shopware/core` to `~6.7.0` (with `"minimum-stability": "dev"`). Classes from Storefront or Elasticsearch require adding `shopware/storefront` or `shopware/elasticsearch` to `require` (or `require-dev` if only used behind `class_exists` checks) so PHPStan can resolve them.
