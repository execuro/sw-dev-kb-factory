---
id: platform/dev/6.7/resources/references/telemetry.md
title: Shopware Tools Telemetry
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/telemetry.html
sourceHash: 810cd3e4b71103eab4a61c26bd5f1a65946aa87d
codeCheckedAgainst: "6.7.13.0"
keywords: ["telemetry", "DO_NOT_TRACK", "usage data", "opt out", "shopware-cli", "deployment helper", "web installer", "udp.usage.shopware.io:9000", "core.telemetry.id", "deployment_helper.installed", "web_installer.visit", "tracking"]
summary: "Telemetry sent by Shopware CLI, Deployment Helper and Web Installer via UDP to udp.usage.shopware.io:9000; opt out with DO_NOT_TRACK."
lastBuilt: 2026-09-15
---
## What it is

Describes the limited usage telemetry collected by Shopware's open-source developer tools — Shopware CLI, Deployment Helper and Web Installer — what each sends, how it is transmitted, and how to opt out. It is designed to exclude personal data, secrets, file contents and credentials.

## When to use

When you need to know what a Shopware tool reports in the background, or must disable telemetry (e.g. in CI, air-gapped or privacy-restricted environments).

## Key steps / config

**Opt out (all tools):** set `DO_NOT_TRACK` to any value (follows the Console Do Not Track convention).

```bash
export DO_NOT_TRACK=1
DO_NOT_TRACK=1 shopware-cli project create
```

**Transport (all tools):** UDP, fire-and-forget, to `udp.usage.shopware.io:9000` (operated in Frankfurt, EU). Unencrypted, runs in the background without delaying commands, fails silently.

**Shopware CLI sends:** the command run (e.g. `shopware-cli project create`), CLI version, project configuration (Shopware version, deployment type, CI platform, Docker use), an anonymized random user id, OS and OS version, and whether it runs in CI.

**Deployment Helper sends:** lifecycle event, Shopware version (and previous version on upgrade), PHP version, MySQL/MariaDB version, operation duration in seconds, and an anonymized id persisted in the `system_config` table under `core.telemetry.id`. Events:

- `deployment_helper.php_version`, `deployment_helper.mysql_version`
- `deployment_helper.installed`, `deployment_helper.upgrade`, `deployment_helper.theme_compiled` (after an upgrade)

**Web Installer sends:** lifecycle event, access source (direct or via admin), locale, PHP version, OS family, Shopware version (range for updates), whether Shopware Flex is used, and a per-session random id stored in the PHP session. Events:

- `web_installer.visit`
- `web_installer.install.started`, `web_installer.install.completed`, `web_installer.install.failed`
- `web_installer.update.started`, `web_installer.update.completed`, `web_installer.update.failed`

## Essential identifiers

- `DO_NOT_TRACK`
- `udp.usage.shopware.io:9000`
- `core.telemetry.id`
- `deployment_helper.*` and `web_installer.*` event names above

## Gotchas

- Never collected: usernames/emails, file paths or contents, DB credentials, environment variables, stack traces/raw logs, secrets/API keys, any PII.
- UDP traffic is not encrypted.
- This tool telemetry is unrelated to the `Shopware\Core\Framework\Telemetry` metrics abstraction in core.

## Code check (6.7.13.0)
- unverified `DO_NOT_TRACK` — read by the tools (shopware-cli, deployment-helper), outside the core/storefront/administration roots
- unverified `core.telemetry.id` — stored by the Deployment Helper, not referenced in vendor/shopware/core
- unverified `udp.usage.shopware.io:9000` — endpoint used by external tools, out of scope
- unverified `deployment_helper.installed` — Deployment Helper event, outside the checked roots
- unverified `web_installer.visit` — Web Installer event, outside the checked roots
