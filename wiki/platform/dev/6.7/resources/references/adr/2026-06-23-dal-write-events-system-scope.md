---
id: platform/dev/6.7/resources/references/adr/2026-06-23-dal-write-events-system-scope.md
title: Dispatch DAL Write Events in System Scope
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-23-dal-write-events-system-scope.html
sourceHash: 4a5c3114d9cb47337eec970e3b4f04c7b72567da
codeCheckedAgainst: "6.7.13.0"
keywords: ["Context::SYSTEM_SCOPE_DAL_WRITE_EVENT", "Context::SYSTEM_SCOPE", "EntityWrittenContainerEvent", "EntityWrittenEvent", "EntityDeletedEvent", "Context::isAllowed", "SystemSource", "product.written", "dal write events", "acl", "system scope", "entity listener permissions", "api privileges"]
summary: "DAL post-write events (EntityWrittenContainerEvent, entity.written/deleted) dispatch in system scope with SYSTEM_SCOPE_DAL_WRITE_EVENT marker, source kept"
lastBuilt: 2026-09-15
---
## What it is

An accepted ADR (2026-06-23, area framework) stating that DAL post-write events are dispatched in `Context::SYSTEM_SCOPE` on the same `Context` instance (source preserved, not replaced by `SystemSource`), with the temporary context state `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` set during dispatch. Listener follow-up writes therefore no longer require the API caller to hold extension-internal ACL privileges.

## When to use

- An extension listens to `product.written` (or any `<entity>.written`/`<entity>.deleted`) and writes its own entities; API clients were failing with missing privileges such as `custom_extension_entity:create`.
- A listener branches on scope, checks permissions, or reads private media inside a write-event listener.

## Key steps / config

- Dispatch sites in the installed code wrap the container-event dispatch in system scope and pass `[Context::SYSTEM_SCOPE_DAL_WRITE_EVENT]` as temporary states: `EntityRepository` write/delete/version methods, the Sync API (`SyncService`) and `VersionManager` create/merge.
- Because nested `EntityWrittenEvent` (`<entity>.written`) and `EntityDeletedEvent` (`<entity>.deleted`) are dispatched from `EntityWrittenContainerEvent`, subscribers to either see the same scoped context.
- Detect implicit write-event system scope with `$context->hasState(Context::SYSTEM_SCOPE_DAL_WRITE_EVENT)` (as the media visibility subscriber does) to distinguish it from explicit system scope.
- Need a real user permission decision in a listener: inspect the context source or call `$context->isAllowed('<privilege>')` (returns the `AdminApiSource` decision, `true` for other sources).
- No entity allowlist: the rule applies to all entities, including extension and custom entities.

Events that stay in the original caller scope: `EntityWriteEvent`, `EntityDeleteEvent`, `PreWriteValidationEvent`, `PostWriteValidationEvent`, `WriteCommandExceptionEvent`, `BeforeVersionMergeEvent`, DAL read/search/load/aggregation events, and business/checkout/Flow events. API ACL validation stays attached to the write commands before persistence.

## Essential identifiers

- `Context::SYSTEM_SCOPE` (`'system'`), `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` (`'system-scope-dal-write-event'`)
- `EntityWrittenContainerEvent`, `EntityWrittenEvent`, `EntityDeletedEvent`
- `Context::isAllowed()`, `Context::getScope()`

## Gotchas

- Listeners that branch on `Context::getScope()` may see `system` instead of `crud` during DAL write events.
- Listener writes using the event context bypass DAL write ACL; nested writes triggered by listeners inherit system scope while dispatch runs.
- Private media visibility is not widened: restrictions still apply under the marker. To read private media deliberately, wrap that read in `$context->scope(Context::SYSTEM_SCOPE, ...)` without the state — re-entering a scope hides parent temporary states for that callback.
- Conceptual dispatch shape (the `$states` third argument is read via `func_get_args()` in 6.7):

```php
$context->scope(
    Context::SYSTEM_SCOPE,
    fn () => $eventDispatcher->dispatch($event),
    [Context::SYSTEM_SCOPE_DAL_WRITE_EVENT],
);
```

## Version notes

- `Context::scope()` carries a `@deprecated tag:v6.8.0` note: the `$states` parameter becomes part of the signature in 6.8; nested scopes do not inherit states unless passed again.

## Code check (6.7.13.0)
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — constant value system-scope-dal-write-event — vendor/shopware/core/Framework/Context.php:28
- confirmed `Context::SYSTEM_SCOPE` — constant value system — vendor/shopware/core/Framework/Context.php:21
- deprecated `Context::scope()` — docblock deprecated tag:v6.8.0, new optional $states parameter — vendor/shopware/core/Framework/Context.php:203
- confirmed `EntityWrittenContainerEvent` — dispatched in system scope with marker by EntityRepository::update() — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:104
- confirmed `EntityWrittenEvent` — nested event class — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityWrittenEvent.php:18
- confirmed `EntityDeletedEvent` — extends EntityWrittenEvent — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityDeletedEvent.php:15
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — Sync API dispatch site uses the marker — vendor/shopware/core/Framework/Api/Sync/SyncService.php:69
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — version merge dispatch site uses the marker — vendor/shopware/core/Framework/DataAbstractionLayer/VersionManager.php:219
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — media visibility restriction checks hasState on the marker — vendor/shopware/core/Content/Media/Subscriber/MediaVisibilityRestrictionSubscriber.php:154
- confirmed `Context::isAllowed()` — delegates to AdminApiSource, true otherwise — vendor/shopware/core/Framework/Context.php:263
