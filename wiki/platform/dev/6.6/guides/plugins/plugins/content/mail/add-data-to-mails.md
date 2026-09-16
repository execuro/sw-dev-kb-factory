---
id: platform/dev/6.6/guides/plugins/plugins/content/mail/add-data-to-mails.md
title: Add data to mails
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/content/mail/add-data-to-mails.html"
sourceHash: 6cb2509cb00471615b195882c7aa2b96cbe9f167
keywords: ["MailService", "AbstractMailService", "templateData", "send method", "mail template", "decorator", "service decoration", "services.xml", "decorates", "getDecorated", "Twig variable", "custom mail data"]
summary: "Shows decorating MailService's send method to add custom template data usable in Shopware mail templates."
lastBuilt: 2026-09-15
---
## What it is
Guide showing how a plugin can add custom data to Shopware's mail templates, so that data becomes available for use inside those templates.

## When to use
Use this when your plugin has custom entity data that mail templates need access to, alongside the built-in data set (e.g. customer data, order data).

## Key steps / config
1. Prerequisite: a plugin base (Plugin Base Guide) and familiarity with decorating a service (Adjusting a service guide).
2. Decorate the `Shopware\Core\Content\Mail\Service\MailService` service (its abstract type is `AbstractMailService`), extending the `send(array $data, Context $context, array $templateData = [])` method — the last parameter, `$templateData`, is what you enrich.
3. Example decorator class, e.g. `AddDataToMails extends AbstractMailService`:
   - Constructor injects the inner `AbstractMailService` instance.
   - `getDecorated(): AbstractMailService` returns that inner instance.
   - `send()` adds an entry to `$templateData` (e.g. `$templateData['myCustomData'] = 'Example data';`) before delegating to `$this->mailService->send($data, $context, $templateData)`.
4. Register the decorator in `services.xml`:
```xml
<service id="Swag\BasicExample\Service\AddDataToMails" decorates="Shopware\Core\Content\Mail\Service\MailService">
    <argument type="service" id="Swag\BasicExample\Service\AddDataToMails.inner" />
</service>
```
5. Reference the new variable in a mail template with Twig, e.g. `{{ myCustomData }}`, which then renders the value you added (`Example data` in this example).

## Essential identifiers
- `Shopware\Core\Content\Mail\Service\MailService`
- `Shopware\Core\Content\Mail\Service\AbstractMailService`
- `send(array $data, Context $context, array $templateData = [])`
- `getDecorated()`
- `decorates` attribute in `services.xml`

## Gotchas
Any kind of data can be added to `$templateData`, including arrays — not just scalar values.
