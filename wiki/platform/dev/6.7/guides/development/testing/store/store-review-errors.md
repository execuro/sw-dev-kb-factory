---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/testing/store/store-review-errors.md
sourceHash: 248140d232f40c45ec9dcd554a6b797aa46239b5
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/store-review-errors.html
title: Store Review Errors
version: "6.7"
versions:
  - "6.7"
keywords: ["store review", "review errors", "composer.json", "shopware-plugin-class", "composer.lock", "minimum-stability", "shopware/core", "shopware/storefront", "var_dump", "forbidden files", "zip structure", "cookie consent"]
summary: "Common Store review rejections: composer.json and bootstrap class, version constraints, forbidden statements, cookies, disallowed archive files."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

The errors that most often fail Shopware Store review for plugins and apps, with causes and fixes: composer/bootstrap problems, dependency constraints, static-analysis findings, messaging, cookies, and forbidden files in the archive.

## When to use

When packaging an extension ZIP for Store submission, or when a review report names one of these errors.

## Key steps / config

Composer and bootstrap:

- `composer.json` must exist and its `name` must match the Store technical name.
- `extra.shopware-plugin-class` must point to the bootstrap class with an exactly matching (case-sensitive) namespace: correct `Swag\\MyPlugin\\SwagMyPlugin`, incorrect `Swag\\MyPlugin\\SwagMyPluginSW6`. Core skips a package whose value is empty or not an existing class. Reference: [plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md).
- "Missing bootstrap class" usually means wrong ZIP root structure, a typo, a filename case mismatch, or a namespace mismatch.
- `composer.lock` must NOT be in the archive; keep it in sync with `composer.json` (`composer update` if outdated).

Dependencies:

- Require Shopware packages explicitly by their real names `shopware/core` and `shopware/storefront` (`Class Shopware\Storefront\* not found` means the storefront package is missing).
- Avoid `*` constraints — they can resolve to Early Access (EA) versions and fail review. Use ranges; set `minimum-stability` if needed:

```json
"require": {
  "shopware/core": "~6.1.0",
  "shopware/storefront": "~6.1.0"
},
"minimum-stability": "RC"
```

Code and static analysis:

- Blocked: `die`, `exit`, `var_dump`.
- `Call to static method *jsonEncode() on an unknown class*`: use `json_encode()`.
- Remove commented-out code and unused classes/files.

Security: cross-document messages must target the intended domain; cookies must be set securely and every non-essential cookie registered in the Cookie Consent Manager.

Forbidden in the archive: `./tests`, `.DS_Store`, `.editorconfig`, `.eslintrc.js`, `.git`, `.github`, `.gitignore`, `.gitkeep`, `.gitlab-ci.yml`, `.gitpod.Dockerfile`, `.gitpod.yml`, `.phar`, `.php-cs-fixer.cache`, `.php-cs-fixer.dist.php`, `.php_cs.cache`, `.php_cs.dist`, `.prettierrc`, `.stylelintrc`, `.stylelintrc.js`, `.sw-zip-blacklist`, `.tar`, `.tar.gz`, `.travis.yml`, `.zip`, `.zipignore`, `ISSUE_TEMPLATE.md`, `Makefile`, `Thumbs.db`, `__MACOSX`, `auth.json`, `bitbucket-pipelines.yml`, `build.sh`, `composer.lock`, `eslint.config.js`, `grumphp.yml`, `package-lock.json`, `package.json`, `phpdoc.dist.xml`, `phpstan-baseline.neon`, `phpstan.neon`, `phpstan.neon.dist`, `phpunit.sh`, `phpunit.xml.dist`, `phpunitx.xml`, `psalm.xml`, `rector.php`, `shell.nix`, `stylelint.config.js`, `webpack.config.js`.

## Essential identifiers

- `extra.shopware-plugin-class`
- `composer.json`, `composer.lock`, `minimum-stability`
- `shopware/core`, `shopware/storefront`

## Gotchas

- The doc's example `"shopware/frontend": "*"` names a package that does not exist; the Storefront package is `shopware/storefront`. The `~6.1.0` ranges are historic — constrain to the version you target (installed core: 6.7.13.0).
- The EA example class `Shopware\Core\System\Snippet\Files\SnippetFileInterface` does not exist in 6.7.13.0; snippet files extend `Shopware\Core\System\Snippet\Files\AbstractSnippetFile`.
- `Shopware\Storefront\Framework\Cookie\CookieProviderInterface` is deprecated for 6.8.0; register cookies via `CookieGroupCollectEvent`.

## Code check (6.7.13.0)
- absent `Shopware\Core\System\Snippet\Files\SnippetFileInterface` — not in the installed code; replaced by `AbstractSnippetFile`
- confirmed `AbstractSnippetFile` — abstract base for snippet files — vendor/shopware/core/System/Snippet/Files/AbstractSnippetFile.php:8
- confirmed `shopware-plugin-class` — composer extra key read to find the plugin base class — vendor/shopware/core/Framework/Plugin/Util/PluginFinder.php:21
- confirmed `shopware-plugin-class` — package skipped if empty or class does not exist — vendor/shopware/core/Framework/Plugin/KernelPluginLoader/ComposerPluginLoader.php:45
- corrected `shopware/storefront` — docs: `shopware/frontend` — vendor/shopware/storefront/composer.json:2
- confirmed `shopware/core` — core package name — vendor/shopware/core/composer.json:2
- deprecated `CookieProviderInterface` — removed in 6.8.0, use `CookieGroupCollectEvent` — vendor/shopware/storefront/Framework/Cookie/CookieProviderInterface.php:12
- confirmed `CookieGroupCollectEvent` — event for introducing cookies — vendor/shopware/core/Content/Cookie/Event/CookieGroupCollectEvent.php:15
- confirmed `Json::encode()` — core JSON helper — vendor/shopware/core/Framework/Util/Json.php:14
- unverified `var_dump` — Store review static-analysis rule, not enforced in vendor code
