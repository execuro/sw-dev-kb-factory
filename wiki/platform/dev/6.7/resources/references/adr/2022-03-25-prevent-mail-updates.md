---
id: platform/dev/6.7/resources/references/adr/2022-03-25-prevent-mail-updates.md
title: Prevent mail updates
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2022-03-25-prevent-mail-updates.html
sourceHash: a7a5effe63c0716d265eeb31aa1eed0223d0e581
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware.mail.update_mail_variables_on_send", "update_mail_variables_on_send", "SendMailAction", "updateMailTemplateType", "mail_template_type", "templateData", "FlowAction", "action.mail.send", "mail template variables", "autocompletion", "database load", "flow builder mail"]
summary: "ADR: shopware.mail.update_mail_variables_on_send=false stops SendMailAction writing templateData to mail_template_type on every sent mail."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2022-03-25) on the mechanism that writes the current mail's variables into the database each time a mail is sent, and the config switch `shopware.mail.update_mail_variables_on_send` that turns it off. The written data (`templateData` on the mail template type) feeds variable autocompletion for mail templates in the Administration and covers plugin-added variables automatically.

## When to use

When a shop with many orders and registrations suffers database load from mail sending. Once all mail templates in the store are configured correctly, the ADR recommends disabling the update.

## Key steps / config

1. Where it happens: the flow action `Shopware\Core\Content\Flow\Dispatching\Action\SendMailAction` (action name `action.mail.send`). After dispatching `FlowSendMailActionEvent` and when the action config has a `templateId`, it calls `updateMailTemplateType()`, which updates `mail_template_type.templateData` (in system scope) unless the template has no type or the switch is off. Shape in 6.7:

```php
class SendMailAction extends FlowAction implements DelayableAction
{
    public static function getName(): string { /* 'action.mail.send' */ }
    public function requirements(): array { /* [MailAware::class] */ }
    public function handleFlow(StorableFlow $flow): void { /* ... updateMailTemplateType() ... */ }
}
```

2. Disable the update in any `config/packages/*.yaml`:

```yaml
shopware:
    mail:
        update_mail_variables_on_send: false
```

3. The value is injected into `SendMailAction` as the constructor flag `$updateMailTemplate` via the container parameter `shopware.mail.update_mail_variables_on_send`. Default is `true`.

## Essential identifiers

- `shopware.mail.update_mail_variables_on_send` (bool, default `true`)
- `Shopware\Core\Content\Flow\Dispatching\Action\SendMailAction`, `SendMailAction::handleFlow()`
- `mail_template_type` / `templateData`

## Gotchas

- With the switch off, newly added variables (including plugin extensions) no longer appear in the Administration's mail template autocompletion.
- The ADR calls this a temporary solution; a database-independent alternative was announced.
- The ADR's snippet shows `handle(Event $event)` and an `updateMailTemplateType(FlowEvent, MailAware, ...)` signature; the installed action uses `handleFlow(StorableFlow $flow)` and `updateMailTemplateType(Context, array, MailTemplateEntity)`.

## Version notes

In 6.7.15.1 the update runs only while the `v6.8.0.0` feature flag is inactive — `SendMailAction` skips it entirely when that flag is active, so the mechanism is removed with 6.8.

## Code check (6.7.15.1)
- confirmed `update_mail_variables_on_send` — boolean node, `defaultTrue()` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1153
- confirmed `update_mail_variables_on_send` — shipped default `true` in core shopware.yaml — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:471
- confirmed `shopware.mail.update_mail_variables_on_send` — parameter injected into SendMailAction — vendor/shopware/core/Content/DependencyInjection/flow.php:228
- confirmed `SendMailAction` — extends `FlowAction`, implements `DelayableAction` — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:37
- corrected `SendMailAction::handleFlow()` — docs: `handle(Event $event)` — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:83
- confirmed `SendMailAction::getName()` — returns `action.mail.send` — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:66
- confirmed `SendMailAction::requirements()` — returns `[MailAware::class]` — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:74
- corrected `SendMailAction::updateMailTemplateType()` — docs: `(FlowEvent, MailAware, MailTemplateEntity)`; now `(Context, array, MailTemplateEntity)`, skipped when `v6.8.0.0` is active — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:201
- confirmed `SendMailAction::$updateMailTemplate` — guard returns early when false — vendor/shopware/core/Content/Flow/Dispatching/Action/SendMailAction.php:214
- confirmed `FlowAction::handleFlow()` — abstract, with `requirements()` and `getName()` — vendor/shopware/core/Content/Flow/Dispatching/Action/FlowAction.php:16
