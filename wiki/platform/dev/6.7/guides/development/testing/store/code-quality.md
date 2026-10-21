---
id: platform/dev/6.7/guides/development/testing/store/code-quality.md
title: Code quality
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/code-quality.html
sourceHash: ff58a02e02c4fc410b6d9ca6f16c529767630649
codeCheckedAgainst: "6.7.15.1"
keywords: ["store review", "code review", "phpstan", "sonarqube", "var_dump", "die", "exit", "executeComposerCommands", "composer.json", "composer.lock", "plugin logger", "var/log", "postMessage", "unminified javascript", "extension quality"]
summary: Shopware Store code-quality rules - PHPStan/SonarQube blockers, logging under var/log, readable JS sources, composer.json and ZIP rules
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md", "platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md", "platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md", "platform/dev/6.7/guides/development/testing/store/store-review-errors.md"]
---
## What it is

The code-quality requirements an extension must meet to pass Shopware Store review: automated review (PHPStan, SonarQube) plus manual review for security, standards, UX and behavior. The review configurations are public at `https://github.com/shopwareLabs/store-plugin-codereview`.

## When to use

Before submitting a plugin or app to the Shopware Store, or when a submission was rejected for code-quality reasons.

## Key steps / config

General:

- Do not ship development-only files or unused resources in the archive; include only necessary dependencies.
- Use secure cookie settings (see [Cookies and privacy](platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md)).

SonarQube blockers (fail review): `die`, `exit`, `var_dump`. The full list of blocker patterns is linked from the source page.

Error messages and logging:

- Log only under Shopware's log directory (`/var/log/`); never write to Shopware's default logs or to paths outside the logging system — logs must not be reachable via URL.
- File name pattern: `MyExtension-Year-Month-Day.log`.
- Payment extensions must use the **plugin logger** service.
- Database logging is allowed, but avoid custom log tables; if you use them, add a scheduled cleanup and keep data at most **six months**.

JavaScript delivery:

- Ship **uncompiled, readable** JavaScript alongside compiled assets, sources in a **separate folder** for review; unminified sources must always be accessible.
- Build `main.js` and minified output as described in [Loading the JS files / Injecting into the Administration](platform/dev/6.7/guides/plugins/plugins/administration/module-component-management/add-custom-field.md).

Cross-domain communication: restrict to explicit, trusted domains. For `postMessage()` and similar APIs, verify message origins and never use `*` as target origin.

Plugin-specific requirements (plugins only):

- Declare [Composer dependencies](platform/dev/6.7/guides/plugins/plugins/dependencies/using-composer-dependencies.md) in `composer.json`. If the plugin base class's `executeComposerCommands()` returns `true`, Shopware runs `composer require` on install (and `composer remove` on uninstall), so dependencies need not all be bundled. The base implementation returns `false`.
- Do **not** include `composer.lock` in the archive; ship **production** artifacts only in the ZIP.
- Write unified logs under `/var/log/`.

For `composer.json` structure, ZIP layout and common mistakes see [Common Store review errors](platform/dev/6.7/guides/development/testing/store/store-review-errors.md).

## Essential identifiers

- `executeComposerCommands()` (on `Shopware\Core\Framework\Plugin`)
- `composer.json`, `composer.lock`
- `die`, `exit`, `var_dump` (SonarQube blockers)
- `postMessage()`
- `/var/log/`, `MyExtension-Year-Month-Day.log`

## Gotchas

- `executeComposerCommands()` defaults to `false`; without overriding it, bundle every runtime dependency in the ZIP.
- The log directory can be relocated by the `APP_LOG_DIR` env var, so resolve the kernel log dir rather than hard-coding a path.

## Code check (6.7.15.1)
- confirmed `Plugin::executeComposerCommands()` — returns `false` by default; `true` triggers `composer require` on install — vendor/shopware/core/Framework/Plugin.php:92
- confirmed `APP_LOG_DIR` — Kernel log dir overridable by env, falls back to parent `getLogDir()` — vendor/shopware/core/Kernel.php:191
- unverified `var_dump` — SonarQube blocker rule, external review tooling, not in Shopware code
- unverified `postMessage()` — browser API usage rule, not a Shopware identifier
- unverified `MyExtension-Year-Month-Day.log` — review naming convention, not enforced by core code
