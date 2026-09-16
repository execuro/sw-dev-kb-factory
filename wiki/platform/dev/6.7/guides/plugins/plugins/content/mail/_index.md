---
id: platform/dev/6.7/guides/plugins/plugins/content/mail/_index.md
title: Mail
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/
sourceHash: 59bfa6a0c97d3d34b94405ea8cd9a633854d395a
codeCheckedAgainst: "6.7.13.0"
keywords: ["mail", "email", "mail template", "mail_template", "mail_template_type", "MailService", "MailBeforeValidateEvent", "MailTemplateTypes", "transactional email", "order notification", "newsletter", "e-mail vorlage"]
summary: Overview of Shopware mail plugin guides - adding data to mail templates and shipping custom mail templates for transactional and customer emails.
lastBuilt: 2026-09-15
---
## What it is

Section overview for Shopware mail handling in plugins. Shopware mail lets you add mail data and configure mail templates for the e-mail communication of the shop: transactional emails, order notifications, customer communication, marketing campaigns and newsletters. Templates can be tied to specific events or triggers so customers get timely, personalised messages.

Mail templates hold the content and formatting of an email — text, images, logos and dynamic variables — which keeps branding consistent across outgoing emails.

## When to use

Read the guides in this section when a plugin must either ship its own mail template (or mail template type) or make additional data available as variables inside existing mail templates, e.g. to keep customers informed about order updates or promotions.

## Key steps / config

In the installed core the relevant building blocks are:

- Templates are stored in the `mail_template` entity with translations in `mail_template_translation`; each template belongs to a `mail_template_type` (technical names such as `contact_form` are listed as constants in `Shopware\Core\Content\MailTemplate\MailTemplateTypes`).
- Sending goes through `Shopware\Core\Content\Mail\Service\MailService`, which dispatches `Shopware\Core\Content\MailTemplate\Service\Event\MailBeforeValidateEvent` carrying the mail data and template data — the usual hook for adding template variables.

## Essential identifiers

- `mail_template`, `mail_template_translation`, `mail_template_type`
- `Shopware\Core\Content\Mail\Service\MailService`
- `Shopware\Core\Content\MailTemplate\Service\Event\MailBeforeValidateEvent`
- `Shopware\Core\Content\MailTemplate\MailTemplateTypes`

## Code check (6.7.13.0)
- confirmed `mail_template` — MailTemplateDefinition entity name — vendor/shopware/core/Content/MailTemplate/MailTemplateDefinition.php:28
- confirmed `mail_template_type` — MailTemplateTypeDefinition entity name — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateType/MailTemplateTypeDefinition.php:27
- confirmed `mail_template_translation` — translation entity name — vendor/shopware/core/Content/MailTemplate/Aggregate/MailTemplateTranslation/MailTemplateTranslationDefinition.php:19
- confirmed `MailTemplateTypes::MAILTYPE_CONTACT_FORM` — value contact_form — vendor/shopware/core/Content/MailTemplate/MailTemplateTypes.php:90
- confirmed `MailService` — extends AbstractMailService — vendor/shopware/core/Content/Mail/Service/MailService.php:37
- confirmed `MailBeforeValidateEvent` — created in MailService::send() — vendor/shopware/core/Content/Mail/Service/MailService.php:67
