---
id: platform/dev/6.6/resources/references/adr/2022-03-25-prevent-mail-updates.md
title: Prevent mail updates
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/references/adr/2022-03-25-prevent-mail-updates.html"
sourceHash: a7a5effe63c0716d265eeb31aa1eed0223d0e581
keywords: ["mail", "flow", "SendMailAction", "updateMailTemplateType", "MailTemplateEntity", "mailTemplateTypeRepository", "shopware.mail.update_mail_variables_on_send", "mail template", "autocompletion", "database load", "flow action", "ADR"]
summary: "Explains the mail-template write-back mechanism behind admin autocomplete and the config flag to disable it under high load."
lastBuilt: "2026-09-15"
---
## What it is

Documents the mechanism Shopware 6 uses to keep mail template autocompletion working in the administration, and the config flag that lets store operators turn the mechanism off. This is an architecture decision record (ADR) mirrored from the `shopware/shopware` repository ADR folder.

## When to use

Relevant when store owners see excessive database write load correlated with sending transactional mails (order confirmations, registration mails, etc.), or when a plugin author needs to understand how mail template variables reach the administration's autocomplete list.

## Key steps / config

- Every time a mail is sent, `Shopware\Core\Content\Flow\Dispatching\Action\SendMailAction::handle()` checks whether the flow event carries a `templateId`, and if so calls its private `updateMailTemplateType()` method.
- `updateMailTemplateType()` writes the current mail template's rendered data back into the database via `$this->mailTemplateTypeRepository->update()`, storing the result under the `templateData` key for the mail template type identified by `$mailTemplate->getMailTemplateTypeId()`.
- This write-back is what populates the administration's autocomplete list of available mail variables, and it also lets plugins extending mail templates get autocomplete support automatically out of the box.
- The write happens on every mail send, which is expensive when there are many orders/registrations, so a config flag can disable it once all mail templates are already fully configured: set `shopware.mail.update_mail_variables_on_send` to `false` in `config/packages/*.yaml`:

```yaml
shopware:
    mail:
        update_mail_variables_on_send: false
```

## Essential identifiers

- `Shopware\Core\Content\Flow\Dispatching\Action\SendMailAction`
- `SendMailAction::handle()`
- `updateMailTemplateType()` (private method)
- `MailTemplateEntity::getMailTemplateTypeId()`
- `mailTemplateTypeRepository`
- config key `shopware.mail.update_mail_variables_on_send`

## Gotchas

Disabling the flag is described as a temporary workaround, not a permanent fix — the ADR states a database-load-free alternative was planned for the future. Turning the flag off should only be done once every mail template in the store is already configured correctly, since the mechanism is what keeps the administration's variable autocomplete in sync with template changes.
