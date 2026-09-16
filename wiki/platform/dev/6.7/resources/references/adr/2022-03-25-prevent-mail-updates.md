---
id: platform/dev/6.7/resources/references/adr/2022-03-25-prevent-mail-updates.md
title: Prevent mail updates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-prevent-mail-updates.html
sourceHash: a7a5effe63c0716d265eeb31aa1eed0223d0e581
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware.mail.update_mail_variables_on_send", "update_mail_variables_on_send", "SendMailAction", "FlowAction", "action.mail.send", "mail template type", "templateData", "mail variables", "autocompletion", "flow builder", "database load", "adr"]
summary: "ADR: set shopware.mail.update_mail_variables_on_send: false to stop SendMailAction writing mail template type templateData on every sent mail."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (2022-03-25). To offer variable autocompletion for mail templates in the Administration, sending a mail through the flow action `Shopware\Core\Content\Flow\Dispatching\Action\SendMailAction` writes the current mail data into the mail template type's `templateData`. With many orders and registrations this causes unnecessary database load, so the config `shopware.mail.update_mail_variables_on_send` was added to switch the write off.

## When to use

When shops with high order or registration volume see database load from mail sending, once all mail templates in the store are configured correctly.

## Key steps / config

Set the option in any `config/packages/*.yaml` file:

```yaml
shopware:
    mail:
        update_mail_variables_on_send: false
```

Behaviour in the installed code:

- The option is a boolean with default `true` (`Framework/DependencyInjection/Configuration.php`, also `true` in core `shopware.yaml`).
- It is injected as `%shopware.mail.update_mail_variables_on_send%` into `SendMailAction` (service tagged `flow.action`, key `action.mail.send`, priority 500).
- In `SendMailAction::handleFlow()`, if the mail data has a `templateId`, the private `updateMailTemplateType()` writes `templateData` to the mail template type repository — only when the template has a mail template type id and the option is `true`. The write runs in system scope with sanitised template data.

## Essential identifiers

- `shopware.mail.update_mail_variables_on_send`
- `Shopware\Core\Content\Flow\Dispatching\Action\SendMailAction` (`action.mail.send`)
- `SendMailAction::handleFlow()`

## Gotchas

- Setting the option to `false` means the Administration's mail variable autocompletion no longer picks up new data (including plugin extensions) from sent mails.
- The ADR snippet's `handle(Event $event)` signature is outdated; flow actions implement `handleFlow(StorableFlow $flow)`.

## Version notes

The ADR calls this a temporary solution. In 6.7.13.0 the template-data update is skipped entirely when the `v6.8.0.0` feature flag is active, i.e. the mechanism is going away with 6.8.

## Code check (6.7.13.0)
- confirmed `update_mail_variables_on_send` — booleanNode, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1117
- confirmed `shopware.mail.update_mail_variables_on_send` — injected into SendMailAction — vendor/shopware/core/Content/DependencyInjection/flow.xml:110
- confirmed `action.mail.send` — flow.action tag, priority 500 — vendor/shopware/core/Content/DependencyInjection/flow.xml:111
- confirmed `SendMailAction::$updateMailTemplate` — constructor flag checked before writing — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:223
- corrected `SendMailAction::handleFlow()` — docs: handle(Event $event); code: handleFlow(StorableFlow $flow) — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:87
- corrected `SendMailAction::updateMailTemplateType()` — docs: (FlowEvent, MailAware, MailTemplateEntity); code: (Context, array, MailTemplateEntity), skipped with v6.8.0.0 — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:210
- confirmed `FlowAction::requirements()` — abstract member of FlowAction — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:14
- confirmed `FlowAction::handleFlow()` — abstract member of FlowAction — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
- confirmed `FlowAction::getName()` — abstract static member of FlowAction — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:18
