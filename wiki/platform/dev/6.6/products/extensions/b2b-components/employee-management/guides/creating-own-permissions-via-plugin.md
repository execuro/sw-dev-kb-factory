---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md
title: Create permissions via plugin
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.html
sourceHash: 640b91462e2065c4ba41352e4b676bfb952d378b
keywords: ["PermissionCollectorSubscriber", "EventSubscriberInterface", "PermissionCollectorEvent", "PermissionCollector", "isB2bAllowed", "addPermission", "getRole", "can()", "permissions via plugin"]
summary: "Create custom B2B permissions in a plugin via a PermissionCollectorSubscriber on PermissionCollectorEvent, checked with isB2bAllowed or role->can()."
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to create custom B2B permissions in a plugin using a Symfony event subscriber.

## Key steps / config

- Create a class implementing `EventSubscriberInterface`, subscribing to `PermissionCollectorEvent::NAME`:

```php
class PermissionCollectorSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [PermissionCollectorEvent::NAME => ['onAddOwnPermissions', 1000]];
    }
    public function onAddOwnPermissions(PermissionCollectorEvent $event): void
    {
        $event->getCollection()->addPermission(self::OWN_ENTITY_READ, self::OWN_ENTITY_GROUP, []);
    }
}
```

- `PermissionCollector` collects permissions from all subscribers and passes them to the storefront for role assignment.
- In Twig, check permissions with the `isB2bAllowed` function: `{% if isB2bAllowed(constant('PermissionCollectorSubscriber::EMPLOYEE_READ')) %}`.
- In controllers, check via the employee's role: `$context->getCustomer()->getEmployee()->getRole()->can(PermissionCollectorSubscriber::EMPLOYEE_READ)`, throwing a `PermissionDeniedException` otherwise.

## Essential identifiers

- `PermissionCollectorSubscriber`, `EventSubscriberInterface`, `PermissionCollectorEvent`
- `PermissionCollector`, `addPermission()`
- `isB2bAllowed()` Twig function
- `Role::can()`, `PermissionDeniedException`
