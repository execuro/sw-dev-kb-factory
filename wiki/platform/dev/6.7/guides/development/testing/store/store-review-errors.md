---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/store-review-errors.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md
sourceHash: 248140d232f40c45ec9dcd554a6b797aa46239b5
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/store-review-errors.html
title: Store Review Errors
version: "6.7"
versions:
  - "6.7"
keywords: ["store review errors", "composer.json", "extra.shopware-plugin-class", "composer.lock", "minimum-stability", "bootstrap class", "early access", "version constraint", "forbidden statements", "var_dump", "zip structure", "unauthorized files", "rejection"]
summary: Common Shopware Store rejections - composer.json plugin-class mismatch, wildcard constraints, die/exit/var_dump, and dev files in the ZIP.
lastBuilt: 2026-10-21
---
## What it is

A catalogue of the errors that most often fail Shopware Store review for plugins and apps: Composer/bootstrap problems, dependency constraints, static-analysis findings, messaging/cookie issues and unauthorized files in the archive.

## When to use

When a Store review rejected an extension, or as a pre-submission checklist for `composer.json` and the release ZIP.

## Key steps / config

Composer and bootstrap:

- `composer.json` must exist; the Store technical name must match the `composer.json` name.
- `extra.shopware-plugin-class` must point to the correct bootstrap class, namespace matching exactly (case-sensitive). Correct: `Swag\\MyPlugin\\SwagMyPlugin`; incorrect: `Swag\\MyPlugin\\SwagMyPluginSW6`.
- The archive needs the correct root folder structure. A "missing bootstrap class" is typically a wrong ZIP structure, a typo, a case-sensitive filename mismatch or a namespace mismatch. See [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).
- `composer.lock` must NOT be in the archive; it must match `composer.json` before packaging — run `composer update` if outdated.

Dependencies (error shape: `Class Shopware\Storefront\* not found`):

- Declare required Shopware packages explicitly in `require`.
- Avoid `"*"` constraints — they may resolve to Early Access (EA) versions and fail review. Use proper ranges; set `"minimum-stability": "RC"` if needed.

```json
"require": {
  "shopware/core": "~6.1.0",
  "shopware/storefront": "~6.1.0"
},
"minimum-stability": "RC"
```

Code and static analysis:

- Blocked statements: `die`, `exit`, `var_dump`.
- An error like `Call to static method *jsonEncode() on an unknown class*` — use `json_encode()`.
- Remove out-commented code, unused classes and files.

Other:

- Cross-document messages must target the intended domain; unrestricted messaging is rejected.
- Cookies must be set securely; all non-essential cookies must be registered in the Cookie Consent Manager.

Unauthorized files/folders (must not be in the archive): `./tests`, `.DS_Store`, `.editorconfig`, `.eslintrc.js`, `.git`, `.github`, `.gitignore`, `.gitkeep`, `.gitlab-ci.yml`, `.gitpod.Dockerfile`, `.gitpod.yml`, `.phar`, `.php-cs-fixer.cache`, `.php-cs-fixer.dist.php`, `.php_cs.cache`, `.php_cs.dist`, `.prettierrc`, `.stylelintrc`, `.stylelintrc.js`, `.sw-zip-blacklist`, `.tar`, `.tar.gz`, `.travis.yml`, `.zip`, `.zipignore`, `ISSUE_TEMPLATE.md`, `Makefile`, `Thumbs.db`, `__MACOSX`, `auth.json`, `bitbucket-pipelines.yml`, `build.sh`, `composer.lock`, `eslint.config.js`, `grumphp.yml`, `package-lock.json`, `package.json`, `phpdoc.dist.xml`, `phpstan-baseline.neon`, `phpstan.neon`, `phpstan.neon.dist`, `phpunit.sh`, `phpunit.xml.dist`, `phpunitx.xml`, `psalm.xml`, `rector.php`, `shell.nix`, `stylelint.config.js`, `webpack.config.js`.

## Essential identifiers

- `extra.shopware-plugin-class`
- `composer.json`, `composer.lock`
- `"minimum-stability": "RC"`
- `shopware/core`, `shopware/storefront`

## Gotchas

- The source's EA example — `Shopware\Core\System\Snippet\Files\SnippetFileInterface` not found — names a class absent from 6.7 (the snippet file base is `AbstractSnippetFile`); the fix (pin versions, set minimum stability) still applies.
- `~6.1.0` is the source's example range; use one for the Shopware major you support. Its prose also names a `shopware/frontend` package, while its format example uses `shopware/core` and `shopware/storefront`.
- With an invalid `shopware-plugin-class`, the Composer plugin loader skips the package.

## Code check (6.7.15.1)
- absent `Shopware\Core\System\Snippet\Files\SnippetFileInterface` — not present anywhere in 6.7 code
- confirmed `AbstractSnippetFile` — current snippet file base class — vendor/shopware/core/System/Snippet/Files/AbstractSnippetFile.php:8
- confirmed `extra.shopware-plugin-class` — read from `composer.json` extra by the plugin loader — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:43
- confirmed `shopware-plugin-class` — invalid value makes the loader skip the package — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:46
- confirmed `shopware-plugin-class` — extra key used by the plugin finder — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:21
- confirmed `shopware-plugin-class` — scaffolded composer.json sets namespace plus class name — vendor/shopware/core/Framework/Plugin/Command/Scaffolding/stubs/composer.stub:11
- confirmed `Json::encode()` — core also ships a static JSON helper — vendor/shopware/core/Framework/Util/Json.php:14
- deprecated `CookieProviderInterface` — Storefront cookie provider deprecated for 6.8, use `CookieGroupCollectEvent` — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:12
- confirmed `CookieGroupCollectEvent` — event to register cookies in the consent manager — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:18
- unverified `shopware/frontend` — Composer package name, outside the code roots
