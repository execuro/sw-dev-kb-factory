---
id: platform/dev/6.7/products/tools/cli/automatic-refactoring.md
title: Automatic Refactoring
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/automatic-refactoring.html
sourceHash: e502767bce99a3b0db527d6f97627bc15a567876
codeCheckedAgainst: "6.7.15.1"
keywords: ["extension fix", "project fix", "shopware-cli", "automatic refactoring", "rector", "eslint", "stylelint", "symfony-xml", "--only", "--exclude", "--allow-non-git", "validation.ignore_extensions", "upgrade", "codemod"]
summary: "Shopware CLI extension fix and project fix: rector, eslint, stylelint, symfony-xml fixers, --only/--exclude/--allow-non-git, in-place edits."
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/validation.md", "platform/dev/6.7/products/tools/cli/formatter.md", "platform/dev/6.7/guides/upgrades-migrations/administration/_index.md"]
---
## What it is

Shopware CLI does automatic refactoring with two commands. `extension fix` works on one extension and `project fix` works on a whole project. There is no separate refactor command. Both commands use the shared verifier tool registry and call each selected tool's `Fix()`. The fixes cover migrations the CLI can apply without manual edits. They do not guarantee compatibility with a target version.

## When to use

Use it during an upgrade, as one step in this workflow:

1. Run [validation](platform/dev/6.7/products/tools/cli/validation.md).
2. Set the Shopware version constraint you want to target.
3. Run `fix`.
4. Review the changes with `git diff`.
5. Handle the findings that have no fixer.
6. Run the tests and validation again.
7. Run [formatting](platform/dev/6.7/products/tools/cli/formatter.md) separately if you want it.

For Administration migrations, see the [Administration migration guide](platform/dev/6.7/guides/upgrades-migrations/administration/_index.md).

## Key steps / config

By default, every registered fixer runs:

| Tool | Fixes | Version-aware |
|---|---|---|
| `rector` | PHP breaking changes and modernization (Shopware Rector) | yes |
| `eslint` | auto-fixable JS/TS/Vue rules for Administration and Storefront | yes |
| `stylelint` | auto-fixable Administration and Storefront SCSS | no |
| `symfony-xml` | converts plugin XML service and route config to YAML (see Gotchas) | no |

`php-cs-fixer` and `prettier` are formatters. `phpstan`, `storefront-twig`, and `builtin` are validators. Passing any of them to `--only` is an error.

```shell
docker run --rm -v "$(pwd)":/ext ghcr.io/shopware/shopware-cli extension fix /ext
shopware-cli extension fix /path/to/your/extension --only "rector,eslint" --exclude eslint
shopware-cli project fix            # path optional; searches upward for the project
shopware-cli project fix --only rector
```

Flags:

- `--only <tools>`: comma-separated list of fixers to run.
- `--exclude <tools>`: removes fixers from the `--only` set, or from all fixers.
- `--allow-non-git`: run even when the target is not a Git repository.

The command fails before any setup if a name is unknown, if an exclusion is outside the selected set, or if the final selection is empty. `--verbose` logs the directories, the extension names, and the external tool commands.

For a project, `project fix` covers local extensions and configured bundles. It skips extensions under `vendor/` and those listed in `validation.ignore_extensions`. `symfony-xml` only converts platform plugins.

Version-aware fixers use the lowest released version that matches a constraint. For a project, that is the `shopware/core` constraint in `composer.json`. For an extension, it is the declared compatibility. For example, `"shopware/core": "^6.7"` targets the earliest 6.7 release, not the version installed in `vendor/`. To target an exact release, pin the constraint temporarily.

## Gotchas

- Files are rewritten in place. There is no temporary copy, no rollback, and no Rector preview. Tools run concurrently, and a failure does not cancel the others, so a failed run can leave partial changes. Work on a clean Git branch and review the `git diff`.
- For `extension fix`, the extension directory itself must contain `.git`. A parent Git project is not enough, so use `--allow-non-git` in that case.
- The `Fixers:` table shows `invoked` (the fixer was called, which does not mean files changed) or `skipped`. When a fixer fails, the table still prints and the command exits non-zero.
- Rector selects rules by major.minor version. If the constraint cannot be resolved, the CLI falls back to `6.7.0.0` without a warning. Version resolution needs network access.
- `symfony-xml` targets plugin `services.xml` and `routes.xml`. In core 6.7.15.1, these XML files still load but trigger a v6.8.0.0 deprecation. Core's hint suggests PHP format, but the YAML output of `symfony-xml` is also loaded.

## Code check (6.7.15.1)
- confirmed `shopware/core` — package name whose constraint drives version-aware fixes — vendor/shopware/core/composer.json:2
- deprecated `routes.xml` — XML route files trigger a v6.8.0.0 deprecation — vendor/shopware/core/Framework/Bundle.php:85
- deprecated `XmlFileLoader` — XML service definitions are deprecated for v6.8.0 and the YAML and PHP loaders remain — vendor/shopware/core/Framework/Bundle.php:232
- deprecated `Bundle::triggerXmlConfigDeprecation()` — emits the "will not be loaded in v6.8.0.0" notice for `.xml` config — vendor/shopware/core/Framework/Bundle.php:254
- unverified `extension fix` — Shopware CLI command, outside the checked package roots
- unverified `project fix` — Shopware CLI command, outside the checked package roots
- unverified `validation.ignore_extensions` — Shopware CLI config key, outside the checked package roots
