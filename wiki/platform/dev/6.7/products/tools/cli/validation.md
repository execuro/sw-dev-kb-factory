---
id: platform/dev/6.7/products/tools/cli/validation.md
title: Validation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/validation.html
sourceHash: ced018bb494e866395434079ecb79aa6955a7d12
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli extension validate", "shopware-cli project validate", "builtin", "--only", "--exclude", "--check-against", "--format", "--no-copy", "validation.ignore", "validation.php_version", "validation.ignore_extensions", "phpstan", "store review", "lint extension", "ci validation"]
summary: Shopware CLI extension/project validate - checkers, --only/--exclude selection, output formats, validation ignores, zip vs directory input.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/extension-commands/build.md", "platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md", "platform/dev/6.7/products/tools/cli/project-commands/upgrade.md", "platform/dev/6.7/products/tools/cli/automatic-refactoring.md"]
---
## What it is

Shopware CLI's built-in validation for extensions (`extension validate`) and whole projects (`project validate`). It automates technical checks (metadata, packaging, static analysis, linting) before a Store upload. It is not a replica of the Shopware Store review, which also does functional testing, Store page content review and manual review — passing does not guarantee approval.

## When to use

- During development and in CI/CD to catch technical problems early.
- Before uploading a release: validate the packaged zip you intend to submit.
- Before a Shopware upgrade: `project validate` (PHPStan) detects references to removed/renamed Shopware classes, interfaces and traits.

## Key steps / config

Recommended: run through the Docker image `ghcr.io/shopware/shopware-cli`. Direct host execution of PHPStan/ESLint/Stylelint needs PHP 8.2+, Node.js 20+, Composer and npm.

```shell
docker run --rm -v "$(pwd)":/ext ghcr.io/shopware/shopware-cli extension validate /ext
shopware-cli extension validate /path/to/your/extension --only builtin
shopware-cli extension validate /path/to/your/extension --only "builtin,phpstan,eslint" --exclude eslint
shopware-cli extension validate /path/to/your/extension --check-against lowest
shopware-cli project validate /path/to/your/project --local-only
```

- All checkers run by default. `--only` selects first, `--exclude` removes from that selection (comma-separated). Excluding everything is an error.
- Checkers in `validate`: `builtin` (metadata, icon, snippets, PHP lint, packaging), `phpstan` (skips apps without `composer.json`), `eslint`, `stylelint`, `storefront-twig`. `rector` and `symfony-xml` only rewrite in `fix`; `php-cs-fixer` and `prettier` only run in `format`.
- Non-zero exit code on an error-level finding; warnings do not fail.
- `--format`: `summary`, `json`, `junit`, `github`, `gitlab`, `markdown`; auto-detected (`github` in GitHub Actions, `gitlab` in GitLab CI, else `summary`).
- `--check-against lowest|highest` steers Composer resolution within the extension constraints (`lowest` adds `--prefer-lowest`); `extension validate` only.
- Directory input ignores `zip.disallowed_file` and is copied to a temp dir when PHPStan/ESLint/Stylelint runs (`--no-copy` runs in place); zip input runs packaging checks.

Release check:

```shell
shopware-cli extension package /path/to/your/extension --release --output-directory dist --filename extension.zip
shopware-cli extension validate dist/extension.zip
```

Ignores and PHP lint profile in `.config/shopware-extension.yml` (project: `.config/shopware-project.yml`, plus `validation.ignore_extensions`):

```yaml
validation:
  php_version: '8.4'
  ignore:
    - identifier: 'Shopware.XXXXXX'
      path: 'path/to/file.php'
    - message: 'Some error message'
```

## Essential identifiers

- `shopware-cli extension validate`, `shopware-cli project validate`, `shopware-cli extension package`
- Flags: `--only`, `--exclude`, `--format`, `--check-against`, `--no-copy`, `--local-only`, `--verbose`
- Finding ids: `metadata.version`, `metadata.name`, `metadata.shopware_version`, `metadata.icon`, `metadata.icon.size`, `php.linter`, `zip.disallowed_php_file`, `zip.disallowed_twig_file`
- Config: `validation.ignore`, `validation.php_version`, `validation.ignore_extensions`; env `PROJECT_ROOT`
- Rule packages: `@shopware-ag/admin-eslint-rules`, `@shopware-ag/storefront-eslint-rules`, `@shopware-ag/admin-stylelint-rules`

## Gotchas

- Scripts that used to omit `--full` now also run PHPStan, ESLint, Stylelint and Twig checkers; use `--only builtin` to keep the old default.
- If the validated copy already has `vendor/`, `lowest` and `highest` reuse it — use a clean input. Composer progress is not streamed.
- Ignored findings are hidden, not fixed (`0 problems` possible). `extension fix` does not honour `validation.ignore`.
- A root `phpstan.neon`, `phpstan.neon.dist` or `phpstan.dist.neon` replaces the CLI's default PHPStan config.
- Using Storefront/Elasticsearch classes: require `shopware/storefront` / `shopware/elasticsearch` (or `require-dev` if guarded by `class_exists`).
- `project validate` skips Composer-managed extensions under `vendor/` and needs network access to resolve the `shopware/core` constraint. For upgrade checks, point `shopware/core` at the target version and validate a clean checkout without `vendor/`, then use the [Upgrade wizard](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md) and [Automatic Refactoring](platform/dev/6.7/products/tools/cli/automatic-refactoring.md).
- Deprecated XML `Resources/config/services.xml` / `routes.xml` are reported as warnings; `shopware-cli extension fix` converts them to YAML. Core 6.7.15.1 emits its own deprecation for them (not loaded in v6.8.0), suggesting PHP format.

## Version notes

- `sw-cli` is a deprecated alias of `builtin` (warning); reports use `builtin`.
- `--full` is deprecated with no effect; `--reporter` is replaced by `--format`; `extension zip` is a deprecated alias of `extension package`.
- The `admin-twig` tool was removed; naming it is an unknown-tool error.
- Embedded Go PHP linter: profiles PHP 7.2–8.5 (8.6 preview); derived 7.2 is normalized to 7.3.

## Code check (6.7.15.1)
- unverified `shopware-cli extension validate` — Shopware CLI (Go tool), not in vendor/shopware, out of scope
- unverified `shopware-cli project validate` — Shopware CLI command, out of scope
- unverified `validation.ignore` — Shopware CLI config key, out of scope
- unverified `validation.php_version` — Shopware CLI config key, out of scope
- unverified `--check-against` — Shopware CLI flag, out of scope
- unverified `builtin` — Shopware CLI checker name, out of scope
- deprecated `routes.xml` — bundle XML route files trigger a v6.8.0 deprecation, hint migrates to PHP — vendor/shopware/core/Framework/Bundle.php:85
- deprecated `Bundle::triggerXmlConfigDeprecation()` — XML service definitions under Resources/config are deprecated and not loaded in v6.8.0 — vendor/shopware/core/Framework/Bundle.php:254
