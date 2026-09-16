---
id: platform/dev/6.7/guides/development/testing/store/code-quality.md
title: Code quality
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/code-quality.html
sourceHash: ff58a02e02c4fc410b6d9ca6f16c529767630649
codeCheckedAgainst: "6.7.13.0"
keywords: ["store code review", "code quality", "phpstan", "sonarqube", "die", "exit", "var_dump", "executeComposerCommands", "composer.json", "composer.lock", "logging", "main.js", "postMessage", "unminified javascript"]
summary: "Store code-review rules: PHPStan/SonarQube blockers (die, exit, var_dump), logging under /var/log/, unminified JS sources, composer.json deps, no composer.lock."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/store/store-review-errors.md", "platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md"]
---
## What it is

The code-quality requirements a Shopware Store extension must meet: automated review (PHPStan, SonarQube) plus manual review for security, standards, UX and behavior. The review configurations are public in the `shopwareLabs/store-plugin-codereview` repository on GitHub.

## When to use

When preparing an extension archive for Store submission, or setting up CI checks that mirror the Store review.

## Key steps / config

**General**

- Do not ship development-only files or unused resources in the archive; include only necessary dependencies.
- Use secure cookie settings (see [Cookies and privacy](platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md)).

**SonarQube blockers** — these fail review: `die`, `exit`, `var_dump` (a full blocker-pattern list is linked from the source page).

**Error messages and logging**

- Log errors and info only under Shopware's log directory `/var/log/`; never write to Shopware's default logs or any path outside the logging system (logs must not be reachable via URL).
- File name pattern: `MyExtension-Year-Month-Day.log`.
- Payment extensions must use the plugin logger service.
- Database logging is allowed; avoid custom log tables. If used, add a scheduled cleanup and keep data at most six months.

**JavaScript delivery**

- Ship uncompiled, readable JavaScript alongside compiled assets, sources in a separate folder; Shopware must always be able to access unminified sources.
- Build `main.js` and minified output as described in [Add custom field: loading JS files / injecting into the Administration](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md).

**Cross-domain communication** — limit to explicit trusted domains; for `postMessage()` verify message origins and never use `*` as target origin.

**Plugins only**

- Declare [Composer dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md) in `composer.json`. If the plugin base class's `executeComposerCommands()` returns `true`, Shopware runs `composer require` on install (and `composer remove` on uninstall), so dependencies need not all be bundled. The base implementation returns `false`.
- Do not include `composer.lock` in the archive; ship production artifacts only in the ZIP.

## Essential identifiers

- `Shopware\Core\Framework\Plugin::executeComposerCommands()`
- `composer.json`, `composer.lock`
- `die`, `exit`, `var_dump`
- `/var/log/`, `MyExtension-Year-Month-Day.log`
- `main.js`, `postMessage()`

## Gotchas

- Bundling `composer.lock` or dev files is a common rejection; see [Common Store review errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md) for ZIP layout and `composer.json` structure.
- Custom log tables without scheduled cleanup (six-month retention) fail review.

## Code check (6.7.13.0)
- confirmed `Plugin::executeComposerCommands()` — base method, defaults to `false`; `true` triggers `composer require` on install — vendor/shopware/core/Framework/Plugin.php:92
- unverified `die` — SonarQube Store review rule, not installed code
- unverified `plugin logger` — no plugin-logger service found under vendor/shopware/core/Framework/Plugin; review requirement only
- unverified `MyExtension-Year-Month-Day.log` — Store naming convention, not enforced by installed code
