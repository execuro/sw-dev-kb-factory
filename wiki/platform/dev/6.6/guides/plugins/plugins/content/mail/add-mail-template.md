---
id: platform/dev/6.6/guides/plugins/plugins/content/mail/add-mail-template.md
title: Add mail templates
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/mail/add-mail-template.html
sourceHash: a2b85259a422765b4a3d0362395db17a6dc6685e
keywords: ["mail_template", "mail_template_translation", "mail_template_type", "mail_template_type_translation", "MigrationStep", "ImportTranslationsTrait", "system_default", "available_entities", "contact form", "custom mail template", "database migration", "mail template type"]
summary: "Ship a custom mail template with a plugin via a database migration into mail_template and mail_template_translation."
lastBuilt: "2026-09-15"
---
## What it is

This guide explains how to ship a mail template with a plugin (instead of creating it via the Administration) by inserting rows into the `mail_template` and `mail_template_translation` tables through a plugin database migration.

## When to use

Use this when a plugin must include a ready-made mail template on install, either reusing an existing mail template type (e.g. "contact form") or defining a brand-new custom mail template type.

## Key steps / config

1. Fetch or create a `mail_template_type` ID (existing type example: `technical_name = "contact_form"`).
2. Insert a row into `mail_template` with `(id, mail_template_type_id, system_default, created_at)` — set `system_default` to `0`.
3. Insert one `mail_template_translation` row per language, with columns `(mail_template_id, language_id, sender_name, subject, description, content_html, content_plain, created_at)`, using `INSERT IGNORE INTO` to avoid exceptions on reinstall.
4. To define a new mail template type, insert into `mail_template_type` with `(id, technical_name, available_entities, created_at)`, where `available_entities` is a JSON-encoded map, e.g. `json_encode(['product' => 'product'])`; add matching `mail_template_type_translation` rows with `(mail_template_type_id, language_id, name, created_at)`.

Migration class extends `Shopware\Core\Framework\Migration\MigrationStep`, implementing `getCreationTimestamp()` and `update(Connection $connection)`.

## Essential identifiers

- `mail_template`, `mail_template_translation`, `mail_template_type`, `mail_template_type_translation`
- `Shopware\Core\Framework\Migration\MigrationStep`
- `Shopware\Core\Framework\Uuid\Uuid`
- `Shopware\Core\Defaults::STORAGE_DATE_TIME_FORMAT`

## Gotchas

Do not remove e-mail templates in a plugin (e.g. on uninstall) — this can cause data inconsistency since templates may be associated with other entities. Always use `INSERT IGNORE INTO` so uninstall/reinstall does not throw.
