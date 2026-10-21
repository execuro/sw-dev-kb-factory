---
id: platform/dev/6.7/guides/plugins/plugins/content/mail/_index.md
title: Mail
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/
sourceHash: 59bfa6a0c97d3d34b94405ea8cd9a633854d395a
codeCheckedAgainst: "6.7.15.1"
keywords: ["mail", "email", "mail template", "mail_template", "mail_template_type", "MailService", "AbstractMailService", "MailBeforeValidateEvent", "template data", "transactional email", "order notification", "plugin"]
summary: Section overview for Shopware 6.7 plugin mail guides - adding data to mail templates and shipping custom mail templates with a plugin.
lastBuilt: 2026-10-21
---
## What it is

Section index for the plugin guides about Shopware mails. Plugins can add data to the variables available in mail templates and ship their own mail templates (text, images, logos and dynamic variables) for transactional emails, order notifications, customer communication and newsletters, each tied to a specific event or trigger.

## When to use

Start here when a plugin must change what data an outgoing Shopware mail can render, or must install its own mail template instead of relying on a merchant creating it in the Administration. The two child guides cover:

- Adding data to mails: decorate the mail service or subscribe to the event fired before mail validation, to extend the template data.
- Adding mail templates: insert rows into the mail template tables from a plugin database migration.

## Essential identifiers

- `Shopware\Core\Content\Mail\Service\MailService` (extends `AbstractMailService`) - sends mails, receives the template data as last `send()` argument.
- `Shopware\Core\Content\MailTemplate\Service\Event\MailBeforeValidateEvent` - dispatched at the start of `MailService::send()`.
- Tables `mail_template`, `mail_template_translation`, `mail_template_type`, `mail_template_type_translation`.

## Code check (6.7.15.1)
- confirmed `MailService` — core implementation of the mail service — vendor/shopware/core/Content/Mail/Service/MailService.php:67
- confirmed `AbstractMailService::send()` — abstract send with `$templateData` last parameter — vendor/shopware/core/Content/Mail/Service/AbstractMailService.php:21
- confirmed `MailBeforeValidateEvent` — dispatched first in `send()` — vendor/shopware/core/Content/Mail/Service/MailService.php:99
- confirmed `mail_template` — entity name of `MailTemplateDefinition` — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:31
- confirmed `mail_template_type` — entity name of `MailTemplateTypeDefinition` — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:27
