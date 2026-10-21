---
id: platform/dev/6.7/guides/plugins/plugins/content/mail/add-mail-template.md
title: Add Mail Templates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-mail-template.html
sourceHash: fe87b7fb52f4bbe4cba3854434e86defe2349e5d
codeCheckedAgainst: "6.7.15.1"
keywords: ["mail template", "mail_template", "mail_template_translation", "mail_template_type", "mail_template_type_translation", "MigrationStep", "contact_form", "available_entities", "system_default", "INSERT IGNORE", "plugin migration", "custom mail type"]
summary: Ship a mail template (and optionally a custom mail template type) from a Shopware plugin via a MigrationStep inserting into the mail_template tables.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md"]
---
## What it is

How a plugin ships its own mail template by inserting rows with a plugin [database migration](platform/dev/6.7/guides/plugins/plugins/database/database-migrations.md) instead of creating the template in the Administration. Optionally the migration also creates a custom mail template type.

## When to use

When a plugin needs a mail template present right after installation, e.g. an extra template for the existing "contact form" type or a template for a plugin-specific mail type.

## Key steps / config

1. Create or look up a mail template type ID.
2. Insert a row into `mail_template` with that type ID.
3. Insert one `mail_template_translation` row per supported language.

Migration skeleton (`Shopware\Core\Framework\Migration\MigrationStep`):

```php
class Migration1616418675AddMailTemplate extends MigrationStep
{
    public function getCreationTimestamp(): int { return 1616418675; }
    public function update(Connection $connection): void
    {
        $typeId = $this->getMailTemplateTypeId($connection); // or createMailTemplateType()
        $this->createMailTemplate($connection, $typeId);
    }
}
```

Existing type lookup: `SELECT id FROM mail_template_type WHERE technical_name = "contact_form"`, converted with `Uuid::fromBytesToHex()`. Language IDs are looked up by joining `language` with `locale` on `locale.code` (`en-GB`, `de-DE`); insert a translation only if the language exists.

Inserted columns:

```sql
INSERT IGNORE INTO `mail_template`
  (id, mail_template_type_id, system_default, created_at)
INSERT IGNORE INTO `mail_template_translation`
  (mail_template_id, language_id, sender_name, subject, description,
   content_html, content_plain, created_at)
```

Set `system_default` to `0`. `created_at` uses `(new DateTime())->format(Defaults::STORAGE_DATE_TIME_FORMAT)`; IDs are bound with `Uuid::fromHexToBytes()`. `sender_name` can be a Twig expression such as `{{ salesChannel.name }}`.

### Custom mail template type

Replace the lookup with a `createMailTemplateType()` method that inserts:

```sql
INSERT IGNORE INTO `mail_template_type`
  (id, technical_name, available_entities, created_at)
INSERT IGNORE INTO `mail_template_type_translation`
  (mail_template_type_id, language_id, name, created_at)
```

with e.g. `technical_name` `custom_mail_template_type` and `available_entities` = `json_encode(['product' => 'product'])` (the entities available to the template) and return the new type ID.

## Essential identifiers

- `Shopware\Core\Framework\Migration\MigrationStep` (`getCreationTimestamp()`, `update()`)
- Tables `mail_template`, `mail_template_translation`, `mail_template_type`, `mail_template_type_translation`
- `contact_form` (technical name), `available_entities`, `system_default`
- `Shopware\Core\Defaults::STORAGE_DATE_TIME_FORMAT`, `Shopware\Core\Framework\Uuid\Uuid`

## Gotchas

- Do not remove mail templates in your plugin (e.g. on uninstall): they can be associated with other entities, causing data inconsistency.
- Use `INSERT IGNORE INTO` so uninstalling and reinstalling the plugin does not throw.
- In DAL terms `subject`, `content_html` and `content_plain` are required translation fields; `technical_name` is required on the type.

## Code check (6.7.15.1)
- confirmed `MigrationStep::getCreationTimestamp()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:28
- confirmed `MigrationStep::update()` — abstract, must be declared — vendor/shopware/core/Framework/Migration/MigrationStep.php:33
- confirmed `contact_form` — `MailTemplateTypes::MAILTYPE_CONTACT_FORM` — vendor/shopware/core/Content/MailTemplate/MailTemplateTypes.php:92
- confirmed `system_default` — BoolField on mail_template — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:59
- confirmed `mail_template_type_id` — required FK on mail_template — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:58
- confirmed `mail_template_translation` — translation entity name — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateTranslation/MailTemplateTranslationDefinition.php:22
- confirmed `content_html` — required LongTextField — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateTranslation/MailTemplateTranslationDefinition.php:55
- confirmed `available_entities` — JsonField on mail_template_type — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:61
- confirmed `technical_name` — required StringField on mail_template_type — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:60
- confirmed `Defaults::STORAGE_DATE_TIME_FORMAT` — value `Y-m-d H:i:s.v` — vendor/shopware/core/Defaults.php:35
