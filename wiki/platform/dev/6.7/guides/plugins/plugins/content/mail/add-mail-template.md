---
id: platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md
title: Add Mail Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html
sourceHash: fe87b7fb52f4bbe4cba3854434e86defe2349e5d
codeCheckedAgainst: "6.7.13.0"
keywords: ["MigrationStep", "mail_template", "mail_template_translation", "mail_template_type", "mail_template_type_translation", "contact_form", "available_entities", "system_default", "Defaults::STORAGE_DATE_TIME_FORMAT", "email template", "custom mail type", "plugin migration"]
summary: Ship a mail template (and optionally a custom mail template type) with a plugin by inserting mail_template/mail_template_translation rows in a MigrationStep.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

How a plugin ships its own mail template, and optionally a custom mail template type, by writing rows directly into the mail template tables from a plugin database migration instead of creating them in the Administration.

## When to use

Your plugin must provide a mail template on install. Requires knowledge of [database migrations](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md).

## Key steps / config

In a migration class extending `Shopware\Core\Framework\Migration\MigrationStep` (declare `getCreationTimestamp()` and `update()`):

1. Get a mail template type ID — fetch an existing one (`SELECT id FROM mail_template_type WHERE technical_name = "contact_form"`, converted with `Uuid::fromBytesToHex`) or create a new type.
2. Insert into `mail_template` (`id, mail_template_type_id, system_default, created_at`) with `system_default` = `0`.
3. Look up language IDs per locale (`language` joined with `locale` on `locale.code`, e.g. `en-GB`, `de-DE`) and, only if the language exists, insert into `mail_template_translation` (`mail_template_id, language_id, sender_name, subject, description, content_html, content_plain, created_at`). `sender_name` may use Twig, e.g. `{{ salesChannel.name }}`.
4. Use `INSERT IGNORE INTO` for all inserts and `(new DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT)` for `created_at`.

```php
class Migration1616418675AddMailTemplate extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1616418675; }
    public function update(Connection $connection): void
    {
        $mailTemplateTypeId = $this->getMailTemplateTypeId($connection); // or createMailTemplateType()
        $this->createMailTemplate($connection, $mailTemplateTypeId);
    }
}
```

### Custom mail template type

Replace the lookup with `createMailTemplateType()`: insert into `mail_template_type` (`id, technical_name, available_entities, created_at`), e.g. `technical_name` = `custom_mail_template_type`, `available_entities` = `json_encode(['product' => 'product'])`, then one `mail_template_type_translation` row (`mail_template_type_id, language_id, name, created_at`) per existing language. Return the new type ID. `available_entities` defines which entities are available to templates of that type.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep`
- `Shopware\Core\Defaults::STORAGE_DATE_TIME_FORMAT`
- `Shopware\Core\Framework\Uuid\Uuid`
- Tables: `mail_template`, `mail_template_translation`, `mail_template_type`, `mail_template_type_translation`
- Columns: `system_default`, `technical_name`, `available_entities`, `content_html`, `content_plain`, `sender_name`
- Existing type technical name: `contact_form`

## Gotchas

- Do not delete mail templates on plugin uninstall; they may be associated with other entities, causing data inconsistency. `INSERT IGNORE` avoids exceptions on reinstall.
- Check each language exists before inserting translations; not every shop has `de-DE` or `en-GB`.
- The translation definition marks `subject`, `content_html` and `content_plain` as required fields.

## Code check (6.7.13.0)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `Defaults::STORAGE_DATE_TIME_FORMAT` — value Y-m-d H:i:s.v — vendor/shopware/core/Defaults.php:35
- confirmed `mail_template` — MailTemplateDefinition entity name — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:28
- confirmed `system_default` — BoolField on mail_template — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:56
- confirmed `mail_template_translation` — translation entity name — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateTranslation/MailTemplateTranslationDefinition.php:19
- confirmed `content_html` — required LongTextField — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateTranslation/MailTemplateTranslationDefinition.php:52
- confirmed `available_entities` — JsonField on mail_template_type — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:61
- confirmed `mail_template_type_translation` — type translation entity name — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateTypeTranslation/MailTemplateTypeTranslationDefinition.php:17
- confirmed `MailTemplateTypes::MAILTYPE_CONTACT_FORM` — value contact_form — vendor/shopware/core/Content/MailTemplate/MailTemplateTypes.php:90
