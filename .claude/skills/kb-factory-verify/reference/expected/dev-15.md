# `dev-15` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-15` · `dev` · `Events` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** How do I work out which event Shopware actually dispatches for a given action, for example after a product is loaded or a page is rendered?

**Expected answer — every fact an answer must contain:**

1. DAL entity events are name-strings derived mechanically, not literals in a dispatch call: `EntityLoadedEvent` sets its own name to `<entityName>.loaded`, `EntityRepository::read()` dispatches a nested `EntityLoadedContainerEvent` with no name, and `NestedEventDispatcher` — which decorates `event_dispatcher` globally — unwraps it and re-dispatches each nested event under its `getName()`. So `product.loaded` fires on every repository read even though grepping the source for the string `'product.loaded'` finds no dispatch site. `[code: Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31; Framework/Event/NestedEventDispatcher.php:19-31; Framework/DataAbstractionLayer/EntityRepository.php:218-223]`
2. "After a page is rendered" has no post-render event: `StorefrontRenderEvent` is dispatched by `StorefrontController::renderStorefront()` *before* the Twig call, so it is a before-render hook whose listeners mutate the template parameters. The storefront's own `StorefrontRouteEventSubscriber` re-dispatches it as `{route}.render` (and `{scope}.scope.render`); core's `RouteEventSubscriber` produces only `{route}.request`, `{route}.controller` and `{route}.response`, and `{route}.encode` comes from `StoreApiResponseListener` for store-api routes only. Page *loading* is covered separately by the class-based `<X>PageLoadedEvent` each page loader dispatches at the end of `load()`. `[code: vendor/shopware/storefront/Controller/StorefrontController.php:77-89; vendor/shopware/storefront/Framework/Routing/StorefrontRouteEventSubscriber.php:24-36; Framework/Routing/RouteEventSubscriber.php:40,52,64]`
3. The workable discovery methods in 6.7 are the per-domain `*Events.php` constant classes plus grepping the dispatching class for `->dispatch(`. The documented `@Event` search term is dead — the string does not occur anywhere under `vendor/shopware`. `bin/console debug:event-dispatcher` enumerates `array_keys($dispatcher->getListeners())`, i.e. only events that already have a registered listener, so it answers "who listens", not "what is dispatched", and never surfaces the dynamically named route events. Only business/flow events have a real registry (`debug:business-events`). `[code: Content/Product/ProductEvents.php:14-17; vendor/symfony/framework-bundle/Command/EventDispatcherDebugCommand.php:151-153; Framework/Event/Command/DebugDumpBusinessEventsCommand.php:14-43]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/event/finding-events.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `EntityLoadedEvent` names itself `<entityName>.loaded` | `Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:31` | `$this->name = $this->definition->getEntityName() . '.loaded';` |
| `EntityRepository::read()` dispatches the loaded event nameless | `Framework/DataAbstractionLayer/EntityRepository.php:218-223` | `$event = $this->eventFactory->create($entities->getElements(), $context);` / `$this->eventDispatcher->dispatch($event);` |
| `NestedEventDispatcher` unwraps nested events and dispatches each under its `getName()` | `Framework/Event/NestedEventDispatcher.php:19-31` | `if ($event instanceof NestedEvent && $events = $event->getEvents()) { foreach ($events as $nested) { $name = null; if ($nested instanceof GenericEvent) { $name = $nested->getName(); } $this->dispatch($nested, $name); } }` |
| The unwrapping is global — the dispatcher decorates `event_dispatcher` | `Framework/DependencyInjection/event.xml:13` | `<service id="Shopware\Core\Framework\Event\NestedEventDispatcher" decorates="event_dispatcher">` |
| `.request` / `.response` / `.controller` come from core's `RouteEventSubscriber`, plus a parallel `{scope}.scope.{suffix}` per route scope | `Framework/Routing/RouteEventSubscriber.php:40,52,64` | `$this->dispatcher->dispatch($event, $request->attributes->get('_route') . '.request');` … `. '.response'` … `. '.controller'` |
| `.render` is produced by the storefront subscriber in 6.7, at priority -10 on `StorefrontRenderEvent` | `vendor/shopware/storefront/Framework/Routing/StorefrontRouteEventSubscriber.php:24,32,36` | `StorefrontRenderEvent::class => ['render', -10],` / `$this->dispatcher->dispatch($event, $request->attributes->get('_route') . '.render');` |
| `.encode` is store-api only, from `StoreApiResponseListener::dispatch()` on `kernel.response` priority 10000 | `System/SalesChannel/Api/StoreApiResponseListener.php:87-88` | `$name = $request->attributes->get('_route') . '.encode';` / `$this->dispatcher->dispatch($event, $name);` |
| `StorefrontRenderEvent` is dispatched before the Twig render, and its parameters are what gets rendered | `vendor/shopware/storefront/Controller/StorefrontController.php:77-79,89` | `$event = new StorefrontRenderEvent($view, $parameters, $request, $salesChannelContext);` / `$this->container->get('event_dispatcher')->dispatch($event);` … `fn () => $this->render($view, $event->getParameters(), new Response())` |
| Three core listeners consume `StorefrontRenderEvent` in 6.7, proving it is live | `vendor/shopware/storefront/DependencyInjection/system.php:18` | `->tag('kernel.event_listener', ['event' => StorefrontRenderEvent::class, 'method' => 'loadAnalytics', 'priority' => 2000]);` |
| Storefront page events are class-based, dispatched at the end of each loader's `load()` | `vendor/shopware/storefront/Page/Navigation/NavigationPageLoader.php:76-78` | `$this->eventDispatcher->dispatch(new NavigationPageLoadedEvent($page, $context, $request));` |
| `*Events.php` constant classes carry no annotations, only `#[Package]` and consts | `Content/Product/ProductEvents.php:14-17` | `#[Package('inventory')]` / `class ProductEvents` / `final public const PRODUCT_LISTING_CRITERIA = ProductListingCriteriaEvent::class;` |
| `debug:event-dispatcher` lists only events that have a registered listener | `vendor/symfony/framework-bundle/Command/EventDispatcherDebugCommand.php:91,97,151-153` | `$allEvents = array_keys($dispatcher->getListeners());` / `'The event "%s" does not have any registered listeners.'` |
| Business/flow events do have a real registry and command | `Framework/Event/Command/DebugDumpBusinessEventsCommand.php:14-43` | `#[AsCommand(name: 'debug:business-events', description: 'Dumps all business events')]` / `$result = $this->collector->collect(Context::createCLIContext());` |
| `.search.result.loaded` style constants fire only when that exact definition's repository is used directly | `Framework/DataAbstractionLayer/EntityRepository.php:283-284,297-298,311-312` | `$event = new EntitySearchResultLoadedEvent($this->definition, $result);` / `$this->eventDispatcher->dispatch($event, $event->getName());` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `.render` is dispatched by `Shopware\Core\Framework\Routing\RouteEventSubscriber` in 6.7 | absent | 6.7's `RouteEventSubscriber` has no `render()` method and no `StorefrontRenderEvent` import; `getSubscribedEvents()` returns only REQUEST/CONTROLLER/RESPONSE. The method lived under that class only up to 6.6. `Framework/Routing/RouteEventSubscriber.php:27-33` |
| The `@Event` annotation marks event classes in the 6.7 source | absent | `grep -rn "@Event" vendor/shopware` returns 0 matches across core, storefront, administration and elasticsearch. |
| An event fired *after* the storefront HTML is produced | absent | `StorefrontRenderEvent` is dispatched before `$this->render()`; no post-render event exists in `renderStorefront()`. The only post-response hooks are `{route}.response` and, for store-api, `{route}.encode`. `vendor/shopware/storefront/Controller/StorefrontController.php:77-89` |
| A single generated catalogue of every dispatched event | partially absent | Only business/flow events are collected (`BusinessEventCollector` / `BusinessEventRegistry`); DAL and storefront page events have no catalogue. `Framework/Event/` |
| `{route}.encode` / `{route}.controller` were introduced in 6.6.11.0 | absent as stated | Both are missing in v6.6.0.0 and already present in v6.6.10.0, so the 6.6.11.0 pin is wrong; the exact introducing patch was not bisected. Irrelevant to a 6.7-pinned case, where all five suffixes exist. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Route-suffixed events asserted by name, including the scope variants and `.controller` | `github shopware/shopware refs/heads/trunk tests/unit/Core/Framework/Routing/RouteEventSubscriberTest.php` |
| Core registration of the subscriber that produces the suffixes — active, not opt-in | `Framework/DependencyInjection/services.xml:235-238` |
| Storefront registration of the `.render` producer | `vendor/shopware/storefront/DependencyInjection/services.php:299-303` |
| A real shipped listener on `StorefrontRenderEvent` | `vendor/shopware/storefront/Test/Controller/AuthTestSubscriber.php:25,36` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `ProductEvents::PRODUCT_PRICE_LOADED_EVENT` reported declared but never dispatched — `*Events` constants presented as unreliable | 6.6 | closed | https://github.com/shopware/shopware/issues/4524 |
| `SalesChannelAnalyticsLoader` listener on `StorefrontRenderEvent` never ran because the bundle did not load the XML defining it — "the event is dispatched" and "my listener runs" are separate questions | 6.7.4.0 | closed | https://github.com/shopware/shopware/issues/13387 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Are `*Events` constants dead, i.e. unsafe as a discovery method? | code (deep) | Refuted for `.loaded`: the event *is* dispatched, nameless, via `EntityLoadedContainerEvent` unwrapped by `NestedEventDispatcher`; grep finding no dispatch site is a search artefact of the nested design. The real caveat is narrower — `.search.result.loaded` style constants fire only when that definition's own repository is called. |
| Is `<entity_name>.loaded` still how DAL events are named, and where is the name built? | code (deep) | Confirmed at `EntityLoadedEvent.php:31`. |
| Does 6.7 still dispatch `StorefrontRenderEvent`, and from where? | code (deep) | Yes — `StorefrontController::renderStorefront()`, before the Twig call. Three core listeners consume it. |
| Does `debug:event-dispatcher` list DAL and business events? | code (deep) | No — it enumerates registered listeners only; it cannot enumerate dispatched events. |
| Which class dispatches business events into the collector? | code (round 1) | Business events are collected by `BusinessEventCollector` and exposed via `debug:business-events`; that is the only real event registry in the codebase. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| DAL events follow `entity_name.event` | "You can use them by following this pattern: `entity_name.event`." | `docs/.../framework/event/finding-events.md:20-22` | yes — `EntityLoadedEvent.php:31` |
| Event constant classes are found by searching for `@Event` | "Finding those \"event classes\" can be done by searching for the term `@Event` in your project." | `docs/.../finding-events.md:30` | **no** — 0 occurrences under `vendor/shopware` |
| Search terms `extends NestedEvent` / `extends Event` / `implements ShopwareEvent` / `->dispatch` | "…`->dispatch`: Here you will find all the occurrences where the events are actually being fired." | `docs/.../finding-events.md:110-113` | partly — `->dispatch(` grep confirmed useful for class-based page events; for DAL `.loaded` names it yields nothing |
| Storefront page load dispatches a page-loaded event | "Usually when a Storefront page is loaded, a respective \"page is being loaded\" event is also fired." | `docs/.../finding-events.md:158` | yes — `NavigationPageLoader.php:76-78` |
| Five route-suffixed events, `{route}.render` thrown before Twig rendering | "\| `{route}.render` \| Storefront \| `Shopware\Storefront\Event\StorefrontRenderEvent` \| Thrown before twig rendering in the storefront. \|" | `docs/.../finding-events.md:207` | yes for the five suffixes and the "before Twig" timing; the producing class for `.render` is the storefront subscriber, not core's |
| `{route}.encode` / `{route}.controller` only since 6.6.11.0 | "**Note:** This was only introduced in 6.6.11.0" | `docs/.../finding-events.md:208-209` | **no** — already present in v6.6.10.0 |
| Symfony profiler's Events tab lists all events fired in the request | "Use the profiler to easily find all fired events in the current request." | `docs/.../finding-events.md:252` | not examined — not admitted to the facts |
| Business events found via `implements BusinessEventInterface` / `MailActionInterface` | "Those business events can be found by either searching for the term…" | `docs/.../finding-events.md:244` | not examined; the code-backed route is `debug:business-events` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Event classes are located by searching for `@Event` | The string does not exist anywhere under `vendor/shopware`; `ProductEvents.php` carries only `#[Package]` and const declarations. The workable convention is the `*Events.php` filename plus the `Shopware\…\Event(s)` namespaces. | `Content/Product/ProductEvents.php:14-17`; `grep -rn "@Event" vendor/shopware` → 0 |
| `{route}.render` is dispatched by `Shopware\Core\Framework\Routing\RouteEventSubscriber` | In 6.7 that method moved to `Shopware\Storefront\Framework\Routing\StorefrontRouteEventSubscriber`; core's subscriber handles only REQUEST/CONTROLLER/RESPONSE. | `Framework/Routing/RouteEventSubscriber.php:27-33`; `vendor/shopware/storefront/Framework/Routing/StorefrontRouteEventSubscriber.php:24-36` |
| `{route}.encode` and `{route}.controller` were introduced in 6.6.11.0 | Absent in v6.6.0.0, already present in v6.6.10.0 — the pin is wrong. The exact 6.6.x patch was not bisected; at 6.7 all five suffixes exist unconditionally. | `github shopware/shopware v6.6.0.0` and `v6.6.10.0` `RouteEventSubscriber.php`, `StoreApiResponseListener.php` |
| The docs page omits it entirely | Every route-suffixed dispatch also emits a parallel `{scope}.scope.{suffix}` event per route scope. | `Framework/Routing/RouteEventSubscriber.php:40,52,64` |
| The page's search-location advice points at `platform/src` and the archived `shopwareArchive/development` template; all source links are pinned to tag v6.4.0.0 | Not applicable to a 6.7 install; the code lanes worked from `vendor/shopware/core` and `vendor/shopware/storefront`. | docs lane contradiction note |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| DAL events are named `entity_name.event` (e.g. `product.written`, `custom_entity.deleted`); some entities expose constants through an event class such as `ProductEvents`, locatable by searching for `@Event`. | rewritten | The naming rule is confirmed, but the `@Event` search term is disproven (0 occurrences in `vendor/shopware`), and the fact omitted the load-bearing mechanic: the name is built by `EntityLoadedEvent` and dispatched via `NestedEventDispatcher`, which is why grep finds no dispatch site. |
| Route events are the Symfony route name plus a suffix: `{route}.request`, `{route}.response`, `{route}.render` (Storefront), `{route}.encode` (Store-API) and `{route}.controller`, the last two only since 6.6.11.0. | rewritten | All five suffixes are confirmed at 6.7, but they come from three different classes; the 6.6.11.0 pin is wrong and carries no weight in a 6.7-pinned case; and the fact never answered the query's "page is rendered" half. |
| Other events are found by searching the core source: `->dispatch` / `extends NestedEvent` / `implements ShopwareEvent` for general PHP events, `PageLoadedEvent` for page events, `CriteriaEvent` for criteria events, `implements BusinessEventInterface` or `MailActionInterface` for business events, `$emitter.publish` for Storefront JS and `$emit` for Administration; the Symfony profiler's Events tab lists everything fired in a request. | rewritten | Reduced to the discovery methods the code settles: `*Events.php` plus `->dispatch(` grep work, `@Event` does not, `debug:event-dispatcher` answers "who listens" not "what is dispatched", and only business events have a registry. The JS/Administration and profiler halves are outside what the code lane examined and were not admitted. |
