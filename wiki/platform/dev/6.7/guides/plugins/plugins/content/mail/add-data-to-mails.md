---
id: platform/dev/6.7/guides/plugins/plugins/content/mail/add-data-to-mails.md
title: Add Data to Mails
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/mail/add-data-to-mails.html
sourceHash: 96134fbdb5a76bdafdabf67589ccc8d231e045ca
codeCheckedAgainst: "6.7.15.1"
keywords: ["MailService", "AbstractMailService", "MailBeforeValidateEvent", "addTemplateData", "getTemplateData", "templateData", "getDecorated", "decorator", "event subscriber", "mail template variables", "kernel.event_subscriber", "custom mail data"]
summary: Add custom variables to Shopware mail templates by decorating AbstractMailService::send() or subscribing to MailBeforeValidateEvent.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md"]
---
## What it is

How a plugin adds its own data (e.g. a custom entity or an array) to the data set that mail templates can render, so a template can print e.g. `{{ myCustomData }}`. Two options: decorate the mail service, or listen to `MailBeforeValidateEvent`.

## When to use

When an existing mail template (order, customer, etc.) needs extra variables your plugin provides. The subscriber approach avoids the overhead of decorating the mail service and is suitable in many cases. Decoration requires knowing the [decoration pattern](platform/dev/6.7/guides/plugins/plugins/services/adjusting-service.md).

## Key steps / config

### Option A: decorate the mail service

Extend `Shopware\Core\Content\Mail\Service\AbstractMailService`; enrich `$templateData` (last parameter of `send`) and delegate to the inner service:

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

`Email` is `Symfony\Component\Mime\Email`; `MailService` is `Shopware\Core\Content\Mail\Service\MailService`.

### Option B: subscribe to the event

Listen to `Shopware\Core\Content\MailTemplate\Service\Event\MailBeforeValidateEvent` in an `EventSubscriberInterface`:

```php
public static function getSubscribedEvents(): array
{
    return [MailBeforeValidateEvent::class => 'beforeMailValidate'];
}
public function beforeMailValidate(MailBeforeValidateEvent $event): void
{
    $event->addTemplateData('key', 'value');
}
```

Available on the event: `getContext()`, `getData()` (mail data), `getTemplateData()`, `addTemplateData()`, plus `addData()`/`setTemplateData()`. Register the subscriber with `->tag('kernel.event_subscriber')`.

## Essential identifiers

- `Shopware\Core\Content\Mail\Service\AbstractMailService` (`getDecorated()`, `send()`)
- `Shopware\Core\Content\Mail\Service\MailService`
- `Shopware\Core\Content\MailTemplate\Service\Event\MailBeforeValidateEvent`
- `MailBeforeValidateEvent::addTemplateData()`, `getTemplateData()`, `getData()`
- `kernel.event_subscriber`

## Gotchas

- The core `MailService::getDecorated()` throws `DecorationPatternException`; your decorator must return the inner service.
- `MailService::send()` dispatches `MailBeforeValidateEvent` before validation and reads back `getData()`/`getTemplateData()` from it; stopping propagation on the event makes `send()` return `null` (no mail sent).

## Code check (6.7.15.1)
- confirmed `AbstractMailService::getDecorated()` — abstract, must be declared — vendor/shopware/core/Content/Mail/Service/AbstractMailService.php:15
- confirmed `AbstractMailService::send()` — signature `send(array $data, Context $context, array $templateData = []): ?Email` — vendor/shopware/core/Content/Mail/Service/AbstractMailService.php:21
- confirmed `MailService` — service id registered as class name — vendor/shopware/core/Content/DependencyInjection/mail.php:68
- confirmed `MailService::getDecorated()` — throws DecorationPatternException — vendor/shopware/core/Content/Mail/Service/MailService.php:92
- confirmed `MailBeforeValidateEvent` — dispatched at start of send, propagation stop returns null — vendor/shopware/core/Content/Mail/Service/MailService.php:99
- confirmed `MailBeforeValidateEvent::addTemplateData()` — adds a key to template data — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:111
- confirmed `MailBeforeValidateEvent::getTemplateData()` — returns template data — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:95
- confirmed `MailBeforeValidateEvent::getData()` — returns mail data — vendor/shopware/core/Content/MailTemplate/Service/Event/MailBeforeValidateEvent.php:65
- unverified `kernel.event_subscriber` — Symfony tag, vendor/symfony out of scope
