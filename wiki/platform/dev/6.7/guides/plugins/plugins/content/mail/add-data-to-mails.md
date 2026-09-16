---
id: platform/dev/6.7/guides/plugins/plugins/content/mail/add-data-to-mails.md
title: Add Data to Mails
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-data-to-mails.html
sourceHash: 96134fbdb5a76bdafdabf67589ccc8d231e045ca
codeCheckedAgainst: "6.7.13.0"
keywords: ["AbstractMailService", "MailService", "MailBeforeValidateEvent", "templateData", "addTemplateData", "getDecorated", "kernel.event_subscriber", "mail.before.send", "mail template variables", "email data", "decorate mail service", "custom mail data"]
summary: Add custom variables to mail templates by decorating MailService (AbstractMailService::send $templateData) or subscribing to MailBeforeValidateEvent.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

Two ways for a plugin to make extra data (e.g. a custom entity or array) available as Twig variables inside Shopware mail templates: decorating the mail service, or listening to the event dispatched before a mail is validated and sent.

## When to use

A mail template needs data beyond the default set (customer, order, etc.). Prefer the subscriber approach to avoid decoration overhead; decorate when you need to control the whole `send` call. Background on decoration: [Adjusting a service](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

### Option A: decorate `MailService`

Extend `Shopware\Core\Content\Mail\Service\AbstractMailService`, declaring both abstract members; enrich `$templateData` (last parameter of `send`) and delegate to the inner service:

```php
class AddDataToMails extends AbstractMailService
{
    public function __construct(private AbstractMailService $mailService) {}
    public function getDecorated(): AbstractMailService { return $this->mailService; }
    public function send(array $data, Context $context, array $templateData = []): ?Email
    {
        $templateData['myCustomData'] = 'Example data';
        return $this->mailService->send($data, $context, $templateData);
    }
}
```

Register in `services.php`:

```php
$services->set(AddDataToMails::class)
    ->decorate(MailService::class)
    ->args([service('.inner')]);
```

Then `{{ myCustomData }}` in any mail template prints "Example data". Any data type works, e.g. arrays.

### Option B: subscriber on `MailBeforeValidateEvent`

Implement `EventSubscriberInterface`, subscribe `MailBeforeValidateEvent::class => 'beforeMailValidate'`, and in the listener use `$event->getContext()`, `$event->getData()`, `$event->getTemplateData()` and `$event->addTemplateData('key', 'value')`. Register the class with the tag `kernel.event_subscriber`.

## Essential identifiers

- `Shopware\Core\Content\Mail\Service\AbstractMailService` (`getDecorated()`, `send(array $data, Context $context, array $templateData = []): ?Email`)
- `Shopware\Core\Content\Mail\Service\MailService`
- `Shopware\Core\Content\MailTemplate\Service\Event\MailBeforeValidateEvent` (`addTemplateData()`, `addData()`, `getTemplateData()`, `getData()`)
- `kernel.event_subscriber`

## Gotchas

- `MailBeforeValidateEvent`'s event name constant is `mail.before.send`; subscribing by class name (`MailBeforeValidateEvent::class`) as in the docs is what the example uses.
- The event is created inside `MailService::send()`, so a decorator that never calls the inner service also suppresses the event for subscribers.

## Code check (6.7.13.0)
- confirmed `AbstractMailService::getDecorated()` — abstract, must be declared by decorators — vendor/shopware/core/Content/Mail/Service/AbstractMailService.php:12
- confirmed `AbstractMailService::send()` — abstract; $templateData is last parameter — vendor/shopware/core/Content/Mail/Service/AbstractMailService.php:18
- confirmed `MailService` — extends AbstractMailService — vendor/shopware/core/Content/Mail/Service/MailService.php:37
- confirmed `Shopware\Core\Content\Mail\Service\MailService` — registered under its FQCN service id — vendor/shopware/core/Content/DependencyInjection/mail.xml:30
- confirmed `MailBeforeValidateEvent` — dispatched from MailService::send() with data and templateData — vendor/shopware/core/Content/Mail/Service/MailService.php:67
- confirmed `MailBeforeValidateEvent::EVENT_NAME` — value mail.before.send — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:20
- confirmed `MailBeforeValidateEvent::addTemplateData()` — adds a key to template data — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:104
- confirmed `MailBeforeValidateEvent::getTemplateData()` — returns template data array — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:88
- confirmed `MailBeforeValidateEvent::getData()` — returns mail data array — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:59
- unverified `kernel.event_subscriber` — Symfony tag, vendor/symfony out of scope
