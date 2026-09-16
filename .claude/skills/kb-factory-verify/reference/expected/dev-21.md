# `dev-21` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-21` · `dev` · `Events` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** My plugin dispatches its own domain event — how do I make it show up as a trigger in the Flow Builder?

**Expected answer — every fact an answer must contain:**

1. The event class must implement `Shopware\Core\Framework\Event\FlowEventAware`, which mandates `public static function getAvailableData(): EventDataCollection` and `public function getName(): string` and extends `ShopwareEvent` (so `getContext()` too); data-carrying `Aware` interfaces such as `OrderAware` are additionally implemented and are recognised because they carry the `#[IsFlowEventAware]` attribute. `FlowEventAware` is also the runtime gate — `FlowDispatcher` returns early for any event that is not `FlowEventAware`, so a plain Symfony event never reaches flow execution. `getAvailableData()` is still required and still consumed by the collector in 6.7. `[code: Framework/Event/FlowEventAware.php:9-14]` `[code: Content/Flow/Dispatching/FlowDispatcher.php:41-69]`
2. Implementing the interfaces is not enough — the class must also be registered for the trigger list, by either of two routes: override the protected `Bundle::getActionEventClasses()` in the plugin bootstrap (core turns it into `BusinessEventRegisterCompilerPass`, which calls `BusinessEventRegistry::addClasses()`; no `services.xml` wiring at all), or subscribe to `BusinessEventCollectorEvent::NAME` with a plain `kernel.event_subscriber` tag at the default priority and call `$collection->set($definition->getName(), $definition)`. `add()` must not be used: it appends under a numeric key, so the by-name lookups (`BusinessEventCollector::fetchAppEvents()`, `MailDataSimulator::getTemplateData()`) miss and the trigger exposes no variables. No elevated priority is needed, and there is no service tag that registers a flow trigger. `[code: Framework/Bundle.php:121-129,197-206]` `[code: Framework/Event/BusinessEventCollector.php:27-49]` `[code: Framework/Struct/Collection.php:34-53]`
3. What fires the flow is the runtime `$event->getName()`: `FlowFactory::create()` builds the `StorableFlow` from it and `FlowDispatcher::callFlowExecutor()` matches it against the `flow` table's `event_name`, so `BusinessEventCollector::define($class, $customName)` only renames the definition shown to the admin — a custom name the event's own `getName()` does not return yields a trigger that is selectable and never fires. For the trigger's data to reach actions and mail templates the event must be picked up by a storer tagged `flow.storer` (every storer runs and guards with an `instanceof` on its aware interface); implementing `ScalarValuesAware` routes scalars through core's `ScalarValuesStorer`, otherwise the `StorableFlow` stays empty. No administration-side registration is required — the trigger picker is fed from `GET /api/_info/events.json`, and a missing snippet only degrades the label to the humanised raw name segments. `[code: Content/Flow/Dispatching/FlowDispatcher.php:127-178]` `[code: Content/Flow/Dispatching/FlowFactory.php:19-34]` `[code: Content/DependencyInjection/flow.xml:286-310]`

**Trap:** the documented recipe demands a listener priority of `1000` and presents the `BusinessEventCollectorEvent` subscriber as the only route; neither holds. An answer that passes must not require an elevated priority, and must not treat `define($class, $customName)` as a way to register a differently named trigger.

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-trigger.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `FlowEventAware` mandates static `getAvailableData()` and `getName()`, and extends `ShopwareEvent`. | `Framework/Event/FlowEventAware.php:9-14` | `interface FlowEventAware extends ShopwareEvent { public static function getAvailableData(): EventDataCollection; public function getName(): string; }` |
| `FlowDispatcher` is the runtime gate: non-`FlowEventAware` events return early before any flow work. | `Content/Flow/Dispatching/FlowDispatcher.php:41-69` | `if (!$event instanceof FlowEventAware) { return $event; }` |
| `Bundle::getActionEventClasses()` is the supported plugin hook; returns `[]` by default. | `Framework/Bundle.php:121-129` | `protected function getActionEventClasses(): array { return []; }` |
| `Bundle::build()` turns that list into a compiler pass automatically — no `services.xml` entry. | `Framework/Bundle.php:197-206` | `$container->addCompilerPass(new BusinessEventRegisterCompilerPass($classes), PassConfig::TYPE_BEFORE_OPTIMIZATION, 0);` |
| The pass appends via `addClasses()` on the registry definition; the registry merges and dedupes. | `Framework/DependencyInjection/CompilerPass/BusinessEventRegisterCompilerPass.php:20-24`; `Framework/Event/BusinessEventRegistry.php:38-74` | `$definition->addMethodCall('addClasses', [$this->classes]);` |
| The collector reflects each class without a constructor, throws if it is not `FlowEventAware`, skips an empty `getName()`, and derives `aware` from `#[IsFlowEventAware]` interfaces. | `Framework/Event/BusinessEventCollector.php:55-86` | `if (!$instance instanceof FlowEventAware) { FrameworkException::invalidEventData(…); } $name ??= $instance->getName(); if ($name === '') { return null; }` |
| Second route: the collector dispatches `BusinessEventCollectorEvent` explicitly so plugins can mutate the collection; core uses it itself for state-change triggers. | `Framework/Event/BusinessEventCollector.php:41-45`; `Checkout/Order/Listener/OrderStateChangeEventListener.php:48-54,114-116` | `$event = new BusinessEventCollectorEvent($result, $context); … $result = $event->getCollection();` |
| `Collection::add()` appends numerically; only `set($key, …)` keys by name, and core always uses `set($definition->getName(), $definition)`. | `Framework/Struct/Collection.php:34-53`; `Framework/Event/BusinessEventCollector.php:38` | `public function add($element): void { … $this->elements[] = $element; }` ‖ `$result->set($definition->getName(), $definition);` |
| A numerically keyed entry still appears in the API list but breaks the by-name lookups — `fetchAppEvents()` dedupe and `MailDataSimulator::getTemplateData()`, which returns `[]`. | `Framework/Event/BusinessEventCollector.php:104-106`; `Content/MailTemplate/Service/MailDataSimulator.php:136-139` | `$definition = $this->businessEventCollector->collect($context)->get($flowEvent); if ($definition === null) { return []; }` |
| No priority is load-bearing: the collection is filled before dispatch, the sole core listener runs at default priority 0 and never filters, and the final order is a name-based `uasort` after all listeners. | `Framework/Event/BusinessEventCollector.php:27-49`; `Checkout/DependencyInjection/order.xml:154-162` | `$result->sort(static fn (BusinessEventDefinition $a, BusinessEventDefinition $b) => $a->getName() <=> $b->getName());` |
| Flow lookup keys on the runtime `$event->getName()`, matched against the `flow` table's `event_name`; `define()`'s second argument only renames the admin-side definition. | `Content/Flow/Dispatching/FlowDispatcher.php:127-178`; `Content/Flow/Dispatching/FlowFactory.php:29-34`; `Content/Flow/Dispatching/FlowLoader.php:24-30,55` | `$flows = $this->getFlows($event->getName());` ‖ `SELECT \`event_name\`, … FROM \`flow\` WHERE \`active\` = 1 …` |
| Storers are a `tagged_iterator` on `flow.storer` injected into `FlowFactory`; every storer runs and guards with an `instanceof`, so an unmatched event yields an empty `StorableFlow`. `ScalarValuesAware` routes scalars through core's `ScalarValuesStorer`. | `Content/DependencyInjection/flow.xml:286-288,308-310`; `Content/Flow/Dispatching/FlowFactory.php:47-69`; `Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:18-43` | `if (!$event instanceof ScalarValuesAware) { return $stored; } … $stored[ScalarValuesAware::STORE_VALUES] = $event->getValues();` |
| `sequenceRuleMatches()` does not require `OrderAware`: it falls back to the context's rule ids when the flow has neither order nor customer data. | `Content/Flow/Dispatching/FlowExecutor.php:231-267` | `$baseContextEvaluation = \in_array($ruleId, $event->getContext()->getRuleIds(), true); if (!$event->hasData(OrderAware::ORDER) && !$event->hasData(CustomerAware::CUSTOMER)) { return $baseContextEvaluation; }` |
| The admin trigger picker is fed straight from `GET /_info/events.json`; missing snippets fall back to the humanised raw name segments. | `Framework/Api/Controller/InfoController.php:144-150`; `administration/…/sw-flow/component/sw-flow-trigger/index.js:727-757` | `return this.httpClient.get('/_info/events.json', …)` ‖ `return translatedEventName ? this.$t(translatedEventName) : eventName.replace(/_|-/g, ' ');` |
| Verification without the admin UI: `bin/console debug:business-events`. | `Framework/Event/Command/DebugDumpBusinessEventsCommand.php:14-41` | `#[AsCommand(name: 'debug:business-events', …)]` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A service tag (`shopware.business_event` / `shopware.flow.event`) registers a flow trigger. | absent | The registry is populated only by its hardcoded array and `addClasses()` calls from `BusinessEventRegisterCompilerPass`; no `findTaggedServiceIds` in the path, no `tagged_iterator` on the registry definition (`Framework/DependencyInjection/event.xml:9`). |
| Core overrides `getActionEventClasses()` somewhere as a copyable example. | absent | Grep across `vendor/shopware/` returns only the default and its caller in `Framework/Bundle.php:126-129`; core registers its own events through the hardcoded registry array. |
| The `BusinessEventCollectorEvent` listener must declare priority 1000. | absent | No priority is read in the collect path; the sole core listener is a bare `kernel.event_subscriber` at priority 0 and the final order is a name `uasort` (`Framework/Event/BusinessEventCollector.php:27-49`; `Checkout/DependencyInjection/order.xml:154-162`). |
| `flowBuilderService` (or any administration-side registration) is required to expose a plugin trigger. | absent | `FlowBuilderService` has no trigger API; the list comes from `GET /_info/events.json` only, and missing snippets degrade to humanised raw segments (`administration/…/sw-flow/service/flow-builder.service.ts`; `…/sw-flow-trigger/index.js:749-757`). |
| `BusinessEventCollector::define($class, $customName)` registers a custom name the Flow Builder will dispatch on. | absent | The second argument only substitutes the definition name shown to the admin; dispatch-time lookup uses `$event->getName()` exclusively (`Framework/Event/BusinessEventCollector.php:55-67`; `Content/Flow/Dispatching/FlowDispatcher.php:127-178`). |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Core's own use of the `BusinessEventCollectorEvent` route to add triggers at runtime — the pattern a plugin reuses for dynamic names. | `Checkout/Order/Listener/OrderStateChangeEventListener.php:114-120` |
| _Gap:_ no functional/integration test for the plugin-side registration path ships in the trimmed vendor dist tree (no `Content/Flow` or `Framework/Event` tests). Every mechanism above is traced to production source, not to a test. | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Trigger registered under a custom name via `define(EventClass, 'custom.name')` appears in the admin but never fires; reporter traces it to the lookup by `$event->getName()`. | 6.6 | closed | https://github.com/shopware/shopware/issues/10736 |
| Commercial's subscriber uses `$collection->add($definition)`; the by-name `get()` misses, the variables endpoint returns `[]` and the mail action fails with `Variable "subscription" does not exist`. | 6.7.13.1 | closed | https://github.com/shopware/shopware/issues/20064 |
| A first-party extension's custom trigger stopped being selectable after 6.7. | 6.7 | closed | https://github.com/shopware/shopware/issues/13474 |
| `addServiceProviderDecorator('flowBuilderService', …)` dropped by boot order, entry falls back to `unknownLabel` while the backend still returns it. | 6.7.11.1 | closed | https://github.com/shopware/shopware/issues/17720 |
| If-conditions unusable with a custom trigger because `sequenceRuleMatches()` reportedly requires `OrderAware`. | 6.7.0.1 | closed | https://github.com/shopware/shopware/issues/11511 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which interface must the event implement, and does the collector skip others? | `Framework/Event/FlowEventAware.php:9-14`; `Framework/Event/BusinessEventCollector.php:55-86` | `FlowEventAware`; the collector throws for anything else and skips an empty `getName()`. Fact 1. |
| Does the collection key by name on `add()`, or is `set()` mandatory? | `Framework/Struct/Collection.php:34-53`; `Framework/Event/BusinessEventCollector.php:38,104-106` | `add()` keys numerically; `set($definition->getName(), $definition)` is the only correct form. Confirms the mechanism behind #20064 — now fact 2. |
| Does `define()`'s custom name fire the flow? | `Content/Flow/Dispatching/FlowDispatcher.php:127-178`; `Content/Flow/Dispatching/FlowFactory.php:29-34` | It does not; dispatch keys on `$event->getName()`. Confirms the mechanism behind #10736 — now fact 3. |
| Must a plugin ship a `FlowStorer` for its variables? | `Content/DependencyInjection/flow.xml:286-310`; `Content/Flow/Dispatching/Storer/ScalarValuesStorer.php:18-43` | Not strictly: `ScalarValuesAware` reuses core's storer; a custom `flow.storer` is needed for entities. Fact 3. |
| Which tag registers the collector subscriber? | `Checkout/DependencyInjection/order.xml:154-162` | Plain `kernel.event_subscriber`, no dedicated tag, no priority. Fact 2. |
| Does `sequenceRuleMatches()` require `OrderAware`? | `Content/Flow/Dispatching/FlowExecutor.php:231-267` | No — it falls back to the context's rule ids. The community claim in #11511 is not the code's behaviour; conditions evaluate against an often-empty rule-id list rather than being unavailable. Not promoted to a fact. |
| Is administration-side registration required? | `administration/…/sw-flow/store/flow.store.ts:309-318`; `…/sw-flow-trigger/index.js:727-757`; `…/sw-flow-detail/index.js:183-191` | No. `flowBuilderService` covers actions only; `isUnknownTrigger` means the server did not return the event. #17720/#13474 do not bear on trigger registration. Fact 3 (negative half). |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| `FlowEventAware` is the base interface for every trigger, providing `availableData` and `name`. | "This interface is the base for every flow builder trigger." | `add-flow-builder-trigger.md:32` | yes — `Framework/Event/FlowEventAware.php:9-14` |
| Any event implementing one of the Aware interfaces becomes available in the trigger list. | "Any event that implements one of these interfaces will be available in the trigger list…" | `add-flow-builder-trigger.md:30` | no — registration is separate (see divergence) |
| The event must be added via a `BusinessEventCollectorEvent::NAME` subscriber calling `define()` and setting the definition. | "At this step, you need to add your new event to the flow trigger list…" | `add-flow-builder-trigger.md:339` | partly — the route exists, but it is one of two, and `set()` by name is mandatory |
| The subscriber must use a higher priority (1000). | "your subscriber has to have a higher priority point…" | `add-flow-builder-trigger.md:382` | no — disproved |
| The subscriber is registered with `kernel.event_subscriber`. | "->tag('kernel.event_subscriber');" | `add-flow-builder-trigger.md:398-400` | yes — `Checkout/DependencyInjection/order.xml:154-162` |
| From 6.5 `getAvailableData` can no longer be used to get data from the Flow Builder. | "the `getAvailableData` function can no more be used…" | `add-flow-builder-trigger.md:115` | no — still mandatory and still consumed by the collector |
| Each Aware interface has a matching `FlowStorer`; custom data needs a new Aware plus a Storer. | "These Aware are the conditions to restore event data in Flow Builder via `FlowStorer` respective." | `add-flow-builder-trigger.md:117,243` | yes — `Content/DependencyInjection/flow.xml:286-310` |
| Actions read trigger data through `StorableFlow::getStore()` / `::getData()`. | "In Flow Actions, you can get the data easily via `getStore` and `getData`." | `add-flow-builder-trigger.md:321` | yes — `Content/Flow/Dispatching/Action/SendMailAction.php:167,175` |

Business context (`[docs-only]`, no code contradiction): the trigger exists so a shop owner can decide what happens when the plugin's event occurs, configured under Settings → Flow Builder; which Aware interface is chosen determines which merchant-visible actions become selectable (`add-flow-builder-trigger.md:16,36`).

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Any event implementing an Aware interface is available in the trigger list. | Implementing the interfaces is necessary but not sufficient; the class must be registered through `Bundle::getActionEventClasses()` or a collector subscriber. The page does not reconcile its own two statements. | `Framework/Event/BusinessEventRegistry.php:38-74`; `Framework/Bundle.php:121-129,197-206` |
| The collector subscriber must run at an elevated priority (1000) or awareness/actions go missing. | No priority is read anywhere in the collect path; the collection is filled before dispatch, the only core listener sits at priority 0, and the result is sorted by name after all listeners run. | `Framework/Event/BusinessEventCollector.php:27-49`; `Checkout/DependencyInjection/order.xml:154-162` |
| The collector subscriber is the only registration route. | `Bundle::getActionEventClasses()` is a first-class hook needing no service wiring; the docs never mention it, and no bundle in `vendor/shopware` overrides it, so there is no in-tree example. | `Framework/Bundle.php:121-129,197-206` |
| From 6.5 `getAvailableData()` can no longer be used. | It is still a mandatory member of `FlowEventAware` in 6.7.13.0 and `BusinessEventCollector::define()` calls it to build the definition the admin consumes. | `Framework/Event/FlowEventAware.php:9-14`; `Framework/Event/BusinessEventCollector.php:55-86` |
| The page's example registers the definition on the collection without stating the keying requirement. | `set($definition->getName(), $definition)` is mandatory; `add()` appends numerically and silently breaks the by-name lookups used for variables and mail preview data. | `Framework/Struct/Collection.php:34-53`; `Content/MailTemplate/Service/MailDataSimulator.php:136-139` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The event class must implement `Shopware\Core\Framework\Event\FlowEventAware` (the base interface for every trigger) plus the Aware interfaces matching the data it carries — `OrderAware` (`orderId`), `CustomerAware` (`customerId`), `MailAware` (`MailRecipientStruct`, `salesChannelId`), `UserAware` (`userId`), `SalesChannelAware` (`salesChannelId`). | rewritten | Kept and confirmed, with the interface's mandatory members and its role as the `FlowDispatcher` runtime gate added; the enumeration of Aware interfaces is replaced by the `#[IsFlowEventAware]` mechanism the collector actually reads. |
| Add it to the trigger list with a subscriber on `BusinessEventCollectorEvent::NAME` registered under the `kernel.event_subscriber` tag, using an elevated priority (e.g. `1000`) so it runs before other subscribers, otherwise awareness/action data can be missing. | rewritten | The priority clause is removed — code shows no priority is read in the collect path. The `Bundle::getActionEventClasses()` route and the mandatory `set()`-by-name keying are added. |
| From Shopware 6.5.0.0 the event object itself is deprecated inside Flow Builder in favour of `Shopware\Core\Content\Flow\Dispatching\StorableFlow`; data is restored by `FlowStorer` classes paired with the Aware interface (e.g. `CustomerAware` → `Shopware\Core\Content\Flow\Dispatching\Storer\CustomerStorer`), and custom data needs a new Aware interface plus a `FlowStorer` implementing `store()` and `restore()`. | rewritten | The storer half is confirmed and kept; the "event object deprecated / `getAvailableData` unusable" framing is dropped because `getAvailableData()` is still mandatory and still consumed. The name-keying mechanism that decides whether a registered trigger ever fires is added in its place. |
