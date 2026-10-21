---
id: platform/dev/6.7/resources/references/adr/2026-06-23-dal-write-events-system-scope.md
title: Dispatch DAL Write Events in System Scope
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-06-23-dal-write-events-system-scope.html
sourceHash: 36d60a924fb03dd085945d551bbc4a362668040b
codeCheckedAgainst: "6.7.15.1"
keywords: ["Context::SYSTEM_SCOPE", "Context::SYSTEM_SCOPE_DAL_WRITE_EVENT", "Context::scope", "Context::isAllowed", "Context::getScope", "EntityWrittenContainerEvent", "EntityWrittenEvent", "EntityDeletedEvent", "product.written", "acl", "api permissions", "write listener", "system scope"]
summary: DAL post-write events dispatch in system scope with a write-event marker state, keeping the caller's source so listener writes skip API ACL.
lastBuilt: 2026-10-21
---
## What it is

An ADR (2026-06-23, area: framework) deciding that DAL post-write events are dispatched in `Context::SYSTEM_SCOPE`, on the same `Context` instance and with the original source, and with the temporary state `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` set. Follow-up DAL writes done by listeners from the event context therefore skip DAL write ACL, so an API client writing `product` no longer needs privileges such as `custom_extension_entity:create` just because an extension listens to `product.written`.

## When to use

- Writing a subscriber to `EntityWrittenContainerEvent`, `<entity>.written` or `<entity>.deleted` that writes extension-owned data.
- Debugging why a listener sees scope `system` instead of `crud`.
- Implementing a subsystem that must tell implicit write-event system scope apart from an explicit system-scope opt-in.

## Key steps / config

Dispatch shape used at every affected site:

```php
$context->scope(
    Context::SYSTEM_SCOPE,
    fn () => $eventDispatcher->dispatch($event),
    [Context::SYSTEM_SCOPE_DAL_WRITE_EVENT],
);
```

- Affected dispatch sites: repository write results, Sync API write results, version create/merge write results. Dispatching the container event is the boundary, because nested `EntityWrittenEvent`/`EntityDeletedEvent` are dispatched from it, so subscribers to either see the same scoped context.
- Applies to every DAL entity, including extension and custom entities; there is no entity-name allowlist.
- The source is not replaced with `SystemSource`. Listeners that need a user permission decision check the source or call `Context::isAllowed()` explicitly.
- A subsystem detects the implicit scope with `$context->hasState(Context::SYSTEM_SCOPE_DAL_WRITE_EVENT)`. Private media visibility restrictions use this and still apply during write-event dispatch.
- A listener that deliberately needs private media wraps that read in `$context->scope(Context::SYSTEM_SCOPE, ...)` without the state; re-entering a scope hides the parent's temporary states for that callback.

Events that stay in the caller's scope: `EntityWriteEvent`, `EntityDeleteEvent`, `PreWriteValidationEvent`, `PostWriteValidationEvent`, `WriteCommandExceptionEvent`, `BeforeVersionMergeEvent`, DAL read/search/load/aggregation events, and business, checkout and Flow events. API ACL validation is attached to the write commands before persistence; moving pre-write events to system scope would skip the caller's ACL check.

## Essential identifiers

- `Context::SYSTEM_SCOPE` (`'system'`), `Context::CRUD_API_SCOPE` (`'crud'`)
- `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` (`'system-scope-dal-write-event'`)
- `Context::scope()`, `Context::getScope()`, `Context::isAllowed()`
- `EntityWrittenContainerEvent`, `EntityWrittenEvent`, `EntityDeletedEvent`

## Gotchas

- Listeners branching on `Context::getScope()` may now observe `system` instead of `crud` during DAL write events.
- Writes made by listeners with the event context bypass DAL write ACL, and nested writes they trigger inherit system scope while dispatch runs.
- Private media access is not widened implicitly; an explicit system-scope read is still required.
- Rejected: dispatching with `SystemSource` (loses caller identity), documentation-only fix, plugin-declared listener permissions, expanding roles on plugin install, a separate "skip listener ACL" flag, moving side effects to async jobs.

## Version notes

In 6.7.15.1 the third `$states` argument of `Context::scope()` is not in the PHP signature yet: it is read via `func_get_args()` and marked to become a real optional parameter in v6.8.0. Passing it as the third argument works now.

## Code check (6.7.15.1)
- confirmed `Context::SYSTEM_SCOPE` — value `'system'` — vendor/shopware/core/Framework/Context.php:22
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — value `'system-scope-dal-write-event'` — vendor/shopware/core/Framework/Context.php:29
- confirmed `Context::scope()` — states passed as optional third argument, formal parameter announced for v6.8.0 — vendor/shopware/core/Framework/Context.php:202
- confirmed `Context::getScope()` — returns current scope string — vendor/shopware/core/Framework/Context.php:238
- confirmed `Context::isAllowed()` — delegates to `AdminApiSource`, otherwise true — vendor/shopware/core/Framework/Context.php:263
- confirmed `EntityWrittenContainerEvent` — repository update dispatches it in system scope with the marker — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:117
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — Sync API write dispatch uses the same scoped call — vendor/shopware/core/Framework/Api/Sync/SyncService.php:81
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — version create/merge dispatch uses the same scoped call — vendor/shopware/core/Framework/DataAbstractionLayer/VersionManager.php:160
- confirmed `Context::SYSTEM_SCOPE_DAL_WRITE_EVENT` — media visibility restriction checks `hasState()` for the marker — vendor/shopware/core/Content/Media/Subscriber/MediaVisibilityRestrictionSubscriber.php:154
