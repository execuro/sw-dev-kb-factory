---
id: platform/dev/6.7/products/tools/cli/validation.md
title: Validation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/validation.html
sourceHash: 96f60bc443743e4c30c03061b4745604dbdb2253
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli extension validate", "shopware-cli project validate", "--full", "--check-against", "--format", "validation.ignore", "validation.php_version", ".shopware-extension.yml", ".shopware-project.yml", "ghcr.io/shopware/shopware-cli", "phpstan", "store review", "extension linting", "ci validation"]
summary: "shopware-cli extension/project validate: basic vs --full, --only/--exclude tools, --format, --check-against, validation.ignore in .shopware-extension.yml."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/extension-commands/build.md", "platform/dev/6.7/products/tools/cli/shopware-account-commands/releasing-extension-to-shopware-store.md", "platform/dev/6.7/products/tools/cli/project-commands/upgrade.md", "platform/dev/6.7/products/tools/cli/automatic-refactoring.md"]
---
## What it is

Shopware CLI's built-in validation of extensions (`extension validate`) and projects (`project validate`): automated technical checks (metadata, packaging, PHP linting, static analysis, JS/CSS/Twig linting) to run in development and CI before uploading to the Shopware Store. It is not a replica of the full Store review (no functional testing, listing content or manual review), so passing does not guarantee approval.

## When to use

- Before uploading an extension version to the Store (validate the packaged zip with `--full`).
- In CI pipelines for extensions or projects.
- Before a Shopware upgrade, to detect references to removed/renamed Shopware classes via PHPStan.

## Key steps / config

Modes:
- **Basic (default)**: built-in `sw-cli` checks (metadata, icon, snippets, PHP linting, packaging). Needs no local PHP/Node.js.
- **Full (`--full`)**: basic plus PHPStan, ESLint, Stylelint, Administration and Storefront Twig linters. Direct host execution needs PHP 8.2+, Node.js 20+, Composer, npm.

Commands (Docker image `ghcr.io/shopware/shopware-cli` recommended):

```shell
docker run --rm -v "$(pwd)":/ext ghcr.io/shopware/shopware-cli extension validate --full /ext
shopware-cli extension validate --full /path/to/your/extension --check-against lowest
shopware-cli extension validate --full --only "phpstan,eslint" /path/to/ext
shopware-cli extension validate --full --no-copy /path/to/ext
shopware-cli extension package /path/to/ext --release --output-directory dist --filename extension.zip
shopware-cli extension validate --full dist/extension.zip
shopware-cli project validate /path/to/your/project --local-only
```

- Exit code is non-zero on error-level findings; warnings do not fail.
- Input: a directory (dev feedback; `zip.disallowed_file` auto-ignored; with `--full` copied to a temp dir unless `--no-copy`) or a zip (packaging checks not suppressed).
- `--format`: `summary`, `json`, `junit`, `github`, `gitlab`, `markdown`; auto-detects `github`/`gitlab` in CI, else `summary`. `--reporter` is deprecated.
- `--only` / `--exclude`: comma-separated tool names (`sw-cli`, `phpstan`, `eslint`, `stylelint`, `admin-twig`, `storefront-twig`); unknown names error.
- `--check-against lowest|highest` controls Composer resolution within the extension's constraints (`lowest` adds `--prefer-lowest`).

`.shopware-extension.yml` (or `.shopware-project.yml` for projects, which also supports `validation.ignore_extensions`):

```yaml
validation:
  php_version: '8.4'          # override derived PHP lint profile
  ignore:
    - identifier: 'Shopware.XXXXXX'
      path: 'path/to/file.php'  # optional
    - message: 'Some error message'
```

Basic-mode check identifiers include `metadata.version`, `metadata.name`, `metadata.shopware_version`, `metadata.icon`, `metadata.icon.size`, `php.linter`, `zip.disallowed_php_file`, `zip.disallowed_twig_file`.

## Essential identifiers

- `shopware-cli extension validate`, `shopware-cli project validate`, `shopware-cli extension package`
- `--full`, `--only`, `--exclude`, `--no-copy`, `--format`, `--check-against`, `--local-only`
- `validation.ignore`, `validation.php_version`, `validation.ignore_extensions`
- `ghcr.io/shopware/shopware-cli`
- `PROJECT_ROOT`

## Gotchas

- `--only` does not enable full mode: `extension validate --only phpstan` runs no PHPStan; use `--full --only phpstan`.
- Tool/verb combinations that are no-ops (e.g. `fix --only phpstan`, `fix --only prettier`) are silently ineffective. `rector` rewrites in `fix` but never reports in `validate`.
- Dependency resolution only runs when the validated copy has no `vendor` directory; otherwise `lowest` and `highest` reuse installed deps. Use a clean input.
- `--no-copy` lets tools modify/add files (`vendor/`, `composer.lock`) in your source.
- Full-mode Composer progress is not streamed; the command may look idle. Packages under `suggest` are installed; private packages need Composer auth.
- `project validate` has no `--full` and no `--check-against`, skips `vendor/`-resolved extensions, and does not run `sw-cli` metadata/packaging checks per extension — run `extension validate` for those.
- `project validate` resolves the `shopware/core` constraint against published versions and needs network access even with a single tool.
- A `phpstan.neon`, `phpstan.neon.dist` or `phpstan.dist.neon` in the validated root replaces the CLI's default PHPStan config.
- Missing Storefront/Elasticsearch classes: add `shopware/storefront` / `shopware/elasticsearch` to `require` (or `require-dev` when optional and guarded by `class_exists`).
- Ignored findings are only hidden; `extension fix` does not honour `validation.ignore`.
- Deprecated `Resources/config/services.xml` / `routes.xml` produce warnings; `shopware-cli extension fix` converts them to YAML.
- To pre-check an upgrade, point `shopware/core` in `composer.json` at the target version and validate a checkout without `vendor/`, before the [Upgrade wizard](platform/dev/6.7/products/tools/cli/project-commands/upgrade.md).

## Version notes

- `extension package` is the current packaging command; `extension zip` is a deprecated alias.
- The embedded PHP linter supports profiles PHP 7.2–8.5 (8.6 preview); a derived 7.2 profile is normalised to 7.3.

## Code check (6.7.13.0)
- unverified `shopware-cli extension validate` — external Go CLI, not part of vendor/shopware
- unverified `shopware-cli project validate` — external Go CLI, not part of vendor/shopware
- unverified `validation.ignore` — shopware-cli config schema, out of scope
- unverified `--check-against` — shopware-cli flag, out of scope
- confirmed `src/Resources/config/services.xml` — core 6.7.13.0 plugin scaffolding still generates this file; the deprecation warning is a shopware-cli rule — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:58
- confirmed `src/Resources/config/routes.xml` — likewise still generated by core plugin scaffolding — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/ScaffoldingCollector.php:64
