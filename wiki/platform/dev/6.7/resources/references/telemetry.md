---
id: platform/dev/6.7/resources/references/telemetry.md
title: Shopware Tools Telemetry
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/telemetry.html
sourceHash: 810cd3e4b71103eab4a61c26bd5f1a65946aa87d
codeCheckedAgainst: "6.7.15.1"
keywords: ["telemetry", "DO_NOT_TRACK", "opt out", "shopware-cli", "deployment helper", "web installer", "udp.usage.shopware.io", "core.telemetry.id", "usage data", "tracking", "privacy"]
summary: What Shopware CLI, Deployment Helper and Web Installer send as UDP telemetry, and how to opt out with DO_NOT_TRACK.
lastBuilt: 2026-10-21
---
## What it is

A reference for the usage telemetry collected by three Shopware open-source developer tools — Shopware CLI, Deployment Helper and Web Installer — what each one sends, how it is transmitted, and how to disable it. The telemetry is designed to exclude personal data, secrets, file contents and credentials.

## When to use

When you need to know what data these tools transmit (e.g. for a privacy or compliance review), or want to switch telemetry off locally or in CI.

## Key steps / config

**Opt out** — set `DO_NOT_TRACK` to any value; all tools respect it (Console Do Not Track convention):

```bash
export DO_NOT_TRACK=1
DO_NOT_TRACK=1 shopware-cli project create
```

**Transport (all tools)**: UDP, fire-and-forget, to `udp.usage.shopware.io:9000` (operated in Frankfurt, Germany, EU). Runs in the background, adds no delay, fails quickly and silently (e.g. offline). UDP is unencrypted.

**Shopware CLI** collects: the command being run (e.g. `shopware-cli project create`), CLI version, project config (Shopware version, deployment type, CI platform, Docker usage), an anonymized random user id, OS and OS version, and whether it runs in CI.

**Deployment Helper** collects: lifecycle event, installed/upgraded Shopware version, previous version on upgrade, PHP version, MySQL/MariaDB version, operation duration in seconds, and an anonymized id persisted under `core.telemetry.id` in the `system_config` table. Events:

- `deployment_helper.php_version`, `deployment_helper.mysql_version`
- `deployment_helper.installed`, `deployment_helper.upgrade`, `deployment_helper.theme_compiled`

**Web Installer** collects: lifecycle event, access source (direct or via admin panel), locale, PHP version, OS family, Shopware version (range for updates), whether the project uses Shopware Flex, and a per-session random id stored in the PHP session. Events:

- `web_installer.visit`
- `web_installer.install.started`, `web_installer.install.completed`, `web_installer.install.failed`
- `web_installer.update.started`, `web_installer.update.completed`, `web_installer.update.failed`

**Not collected**: usernames/emails, file paths or contents, database credentials or connection strings, environment variables, stack traces or raw error logs, secrets/API keys, any PII.

## Essential identifiers

- `DO_NOT_TRACK`
- `udp.usage.shopware.io:9000`
- `core.telemetry.id` (`system_config`)
- `deployment_helper.*` and `web_installer.*` event names

## Gotchas

- Telemetry traffic is plain UDP and unencrypted.
- The Deployment Helper id persists in the database across runs; the Web Installer id is regenerated per session.

## Code check (6.7.15.1)
- unverified `DO_NOT_TRACK` — read by Shopware CLI/Deployment Helper/Web Installer, none of which is in the checked core/storefront/administration roots
- unverified `core.telemetry.id` — written by the Deployment Helper; no occurrence in the checked package roots
- unverified `udp.usage.shopware.io` — endpoint used by external tools, not referenced in the checked package roots
