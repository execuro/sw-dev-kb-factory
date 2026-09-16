---
id: platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.md
title: Create permissions via plugin
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-plugin.html
sourceHash: 640b91462e2065c4ba41352e4b676bfb952d378b
codeCheckedAgainst: "6.7.13.0"
keywords: ["PermissionCollectorEvent", "PermissionCollector", "PermissionCollectorSubscriber", "addPermission", "isB2bAllowed", "PermissionDeniedException", "EventSubscriberInterface", "b2b permissions", "employee role", "custom permission", "employee management", "permission check"]
summary: "B2B plugin permissions: subscribe to PermissionCollectorEvent, call addPermission(); check with isB2bAllowed() in Twig or the employee role's can() in PHP."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/extensions/b2b-components/employee-management/guides/creating-own-permissions-via-app.md"]
---
## What it is

How a plugin registers custom permissions for B2B Employee Management roles by listening to `PermissionCollectorEvent`, and how to check those permissions in Twig templates and controllers.

## When to use

Your plugin adds B2B functionality (e.g. a custom entity) whose read/edit/create/delete actions business partners should be able to grant to employee roles.

## Key steps / config

1. Create a Symfony event subscriber (`Symfony\Component\EventDispatcher\EventSubscriberInterface`) that defines a group name and permission names as constants and listens to `PermissionCollectorEvent::NAME` (the source uses priority `1000`).
2. In the listener, get the collection from the event and call `addPermission(<name>, <group>, <dependencies[]>)` for each permission. The third argument lists permissions this one depends on.

```php
public const OWN_ENTITY_GROUP = 'own_entity';
public const OWN_ENTITY_READ = 'own_entity.read';
public const OWN_ENTITY_EDIT = 'own_entity.edit';

public static function getSubscribedEvents(): array
{
    return [PermissionCollectorEvent::NAME => ['onAddOwnPermissions', 1000]];
}

public function onAddOwnPermissions(PermissionCollectorEvent $event): void
{
    $collection = $event->getCollection();
    $collection->addPermission(self::OWN_ENTITY_READ, self::OWN_ENTITY_GROUP, []);
    $collection->addPermission(self::OWN_ENTITY_EDIT, self::OWN_ENTITY_GROUP, [self::OWN_ENTITY_READ]);
}
```

3. `PermissionCollector` gathers the permissions from all subscribers and passes them to the Storefront, where users attach them to roles.
4. Template check: `{% if isB2bAllowed(constant('PermissionCollectorSubscriber::OWN_ENTITY_READ')) %}...{% endif %}` inside a `sw_extends` template.
5. Controller check goes through the employee's role: `$context->getCustomer()->getEmployee()->getRole()->can(<permission>)`; throw `PermissionDeniedException` when it returns false.

## Essential identifiers

- `PermissionCollectorEvent`, `PermissionCollectorEvent::NAME`
- `PermissionCollector`
- `addPermission()` on the event's collection (`getCollection()`)
- `isB2bAllowed` (Twig function)
- `getEmployee()->getRole()->can()`
- `Shopware\Core\Framework\Api\Controller\Exception\PermissionDeniedException`

## Gotchas

- The source snippet declares `OWN_ENTITY_*` constants but then calls `addPermission()` and `isB2bAllowed` with undeclared `EMPLOYEE_READ`/`EMPLOYEE_EDIT`/`EMPLOYEE_CREATE`/`EMPLOYEE_DELETE` constants; use the constants you actually define.
- The source's Twig example extends `@Storefront/storefront/page/checkout/checkout-item.html.twig`, which does not exist in the installed Storefront; line items render from `@Storefront/storefront/component/line-item/line-item.html.twig`.
- `PermissionDeniedException` in core takes no constructor arguments and responds with HTTP 403 (`FRAMEWORK__PERMISSION_DENIED`).
- Permission names must be unique across Shopware, plugins and apps.

## Code check (6.7.13.0)
- unverified `PermissionCollectorEvent` — B2B Components class, package not installed in vendor/shopware roots
- unverified `PermissionCollector` — B2B Components service, not installed
- unverified `isB2bAllowed` — Twig function from B2B Components, no match in installed vendor roots
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
- confirmed `PermissionDeniedException` — core exception, no-arg constructor — vendor/shopware/core/Framework/Api/Controller/Exception/PermissionDeniedException.php:13
- confirmed `PermissionDeniedException::getStatusCode()` — returns HTTP 403 — vendor/shopware/core/Framework/Api/Controller/Exception/PermissionDeniedException.php:25
- confirmed `SalesChannelContext::getCustomer()` — returns nullable CustomerEntity — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:132
- confirmed `sw_extends` — core Twig token parser — vendor/shopware/core/Framework/Adapter/Twig/TokenParser/ExtendsTokenParser.php:68
- absent `checkout-item.html.twig` — docs extend this template; no such file or reference in installed Storefront
