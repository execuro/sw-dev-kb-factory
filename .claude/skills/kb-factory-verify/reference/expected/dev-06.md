# `dev-06` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-06` · `dev` · `Events` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` (6.6 checked against branch `6.6.x`) |

**Query:** How do I add a custom Flow Builder action?

**Expected answer — every fact an answer must contain:**

1. A plugin action extends the abstract class `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction` and implements its three abstract members: `requirements(): array` (the `*Aware` interface class names the action needs, e.g. `OrderAware::class`, which is what constrains it to compatible triggers), `handleFlow(StorableFlow $flow): void`, and the **static** `getName(): string`. It is not an event subscriber — there is no `getSubscribedEvents()` and no `handle(FlowEvent)`; `FlowExecutor` calls `handleFlow()` directly. The class is identical in 6.6 and 6.7.  `[code: Content/Flow/Dispatching/Action/FlowAction.php:9-19]` `[code: Content/Flow/Api/FlowActionCollector.php:73-90]`
2. The service must be tagged `flow.action` **with a `key` attribute** — `FlowExecutor` receives the actions as a `tagged_iterator … index-by="key"` and looks the handler up by the action name stored on the flow sequence, so the key must equal `getName()` (core does exactly this, e.g. `key="action.add.order.tag"`). There is no autoconfiguration for `FlowAction`, and a missing or mismatched key is a **silent no-op**: `FlowExecutor` returns without error or log when the lookup misses. `priority` is an additional attribute core sets on its own tags.  `[code: Content/DependencyInjection/flow.xml:61,64-67]` `[code: Content/Flow/Dispatching/FlowExecutor.php:210-214]` `[code: Content/Flow/Dispatching/Action/AddOrderTagAction.php:28-31]`
3. Inside `handleFlow()` the action reads its sequence configuration with `$flow->getConfig()` and event data with `$flow->getData(<Aware constant>)` after guarding with `$flow->hasData(...)`; there is no typed config object. The action only appears in the Administration once the `flowBuilderService` singleton has been given its label, icon, name mapping and group via `addActionNames()`, `addLabels()`, `addIcons()`, `addGroups()`, `addActionGroupMapping()` (the PHP tag alone only publishes it through `GET /api/_info/flow-actions.json`). Optional empty marker interfaces change execution: `DelayableAction` allows use in delayed flows, `TransactionalAction` makes `FlowExecutor` run the handler in a retryable transaction.  `[code: Content/Flow/Dispatching/Action/AddOrderTagAction.php:40-56]` `[code: vendor/shopware/administration/…/module/sw-flow/service/flow-builder.service.ts:165-206]` `[code: Content/Flow/Dispatching/FlowExecutor.php:216-229]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/flow/add-flow-builder-action.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `FlowAction` declares exactly three abstract members, `getName()` being static | `Content/Flow/Dispatching/Action/FlowAction.php:9-19` | `abstract public function requirements(): array; abstract public function handleFlow(StorableFlow $flow): void; abstract public static function getName(): string;` |
| The identical abstract class exists on 6.6.x — contract unchanged between 6.6 and 6.7 | `github.com/shopware/shopware@6.6.x src/Core/Content/Flow/Dispatching/Action/FlowAction.php` | same three abstract methods |
| Registration is the `flow.action` tag and the tag must carry `key` — the iterator is `index-by="key"` | `Content/DependencyInjection/flow.xml:61,64-67` | `<argument type="tagged_iterator" tag="flow.action" index-by="key" />` … `<tag name="flow.action" priority="1000" key="action.add.order.tag" />` |
| Lookup is by the stored sequence action name; a miss returns silently | `Content/Flow/Dispatching/FlowExecutor.php:210-214` | `$action = $this->actions[$sequence->action] ?? null; if (!$action instanceof FlowAction) { return; }` |
| Core keeps tag key and `getName()` identical | `Content/Flow/Dispatching/Action/AddOrderTagAction.php:28-31` | `public static function getName(): string { return 'action.add.order.tag'; }` |
| `requirements()` returns `*Aware` class names; the collector lcfirst's their short names into the published requirements that constrain triggers | `Content/Flow/Dispatching/Action/AddOrderTagAction.php:36-38`; `Content/Flow/Api/FlowActionCollector.php:73-90` | `return [OrderAware::class];` / `$requirementsName[] = lcfirst(array_last($className));` |
| `handleFlow()` reads data via `hasData()`/`getData()` keyed by Aware constants and config via `getConfig()` | `Content/Flow/Dispatching/Action/AddOrderTagAction.php:40-56` | `if (!$flow->hasData(OrderAware::ORDER_ID)) { return; } $this->update($flow->getContext(), $flow->getConfig(), $flow->getData(OrderAware::ORDER_ID));` |
| `DelayableAction` and `TransactionalAction` are empty markers; the latter makes `FlowExecutor` wrap the handler in a retryable transaction | `Content/Flow/Dispatching/DelayableAction.php:8-10`; `Content/Flow/Dispatching/TransactionalAction.php:7-13`; `Content/Flow/Dispatching/FlowExecutor.php:216-229` | `if (!$action instanceof TransactionalAction) { $action->handleFlow($event); return; } … RetryableTransaction::transactional(...)` |
| The same tag (without `index-by`) feeds `FlowActionCollector`, which backs `GET /api/_info/flow-actions.json` | `Content/DependencyInjection/flow.xml:161-165`; `Framework/Api/Controller/InfoController.php:231-234`; `Content/Flow/Api/FlowActionCollector.php:37-50` | `<argument type="tagged_iterator" tag="flow.action" />` / `#[Route(path: '/api/_info/flow-actions.json' …)]` |
| The admin side is the `flowBuilderService` singleton with additive registration methods | `vendor/shopware/administration/…/src/module/sw-flow/service/index.ts:16-18`; `…/service/flow-builder.service.ts:165-206` | `Application.addServiceProvider('flowBuilderService', …)` / `addActionNames`, `addLabels`, `addIcons`, `addGroups`, `addActionGroupMapping`, `addDescriptionCallbacks` |
| Apps take a different route entirely: `Resources/flow.xml` → `app_flow_action` with a `url`, executed as `AppFlowActionEvent` via the webhook manager | `Framework/App/Lifecycle/Handler/FlowActionLifecycleHandler.php:83-87`; `Framework/App/Flow/Action/Action.php:13,23-31`; `Content/Flow/Dispatching/FlowExecutor.php:196-207` | `if ($sequence->appFlowActionId) { … $this->dispatcher->dispatch($globalEvent, $sequence->action); return; }` |
| Static analysis binds the tag to the base class | `DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:74` | `'flow.action' => FlowAction::class,` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `FlowAction` subclasses are autoconfigured, so the tag can be omitted | absent | `AutoconfigureCompilerPass` has no entry for `FlowAction` (only `FlowStorer`); every core action is tagged explicitly, and the tag needs a `key` autoconfiguration could not supply — same in 6.6.x (`AutoconfigureCompilerPass.php:156-158`, `flow.xml:64-158`) |
| A flow action subscribes to events / implements `EventSubscriberInterface` or `handle(FlowEvent)` | absent | the abstract class declares only the three members; `FlowExecutor` calls `handleFlow()` directly (`FlowAction.php:9-19`, `FlowExecutor.php:210-217`) |
| An unmatched action name produces a surfaced exception | absent | `FlowExecutor::callHandle` returns silently on a lookup miss, with no log (`FlowExecutor.php:210-214`) |
| Apps can ship a PHP flow action handler | absent | app actions live in `app_flow_action` with a required `url` and run as webhooks (`AppFlowActionDefinition.php:72`, `FlowExecutor.php:196-207`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Minimal custom `FlowAction` as upstream unit tests build it, incl. the `TransactionalAction` marker | `github.com/shopware/shopware@6.7.13.x tests/unit/Core/Content/Flow/Dispatching/FlowExecutorTest.php#L979` |
| Tag→contract mapping asserted by static analysis | `DevOps/StaticAnalyze/PHPStan/tagged-service-contracts.php:74` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `addServiceProviderDecorator('flowBuilderService', …)` silently defeated when Commercial instantiates the service eagerly: action has no group, is dropped by `sw-grouped-single-select`, never appears in the picker | 6.7.11.1 + Commercial | closed | https://github.com/shopware/shopware/issues/17720 |
| Core "Change custom field content" action shown as "Unknown action" while still executing | 6.6.10.2 | closed | https://github.com/shopware/shopware/issues/7825 |
| Official guide's `CreateTagAction.php` example uses an uninitialised `$baseEvent`; action lands in the wrong group and shows as "Unknown action" | 6.5.0.0+ | closed | https://github.com/shopware/docs/issues/1216 |
| Earlier report that the guide's administration section is deprecated/incorrect | 6.4 | closed | https://github.com/shopware/docs/issues/948 |
| `FlowExecutor::sequenceRuleMatches` requires an `OrderAware` event, so conditions are not evaluated for custom non-order triggers | 6.7.0.1 | closed | https://github.com/shopware/shopware/issues/11511 |
| A trigger offers only three actions — action availability is filtered per trigger by the aware interfaces | 6.7.10.2 + Commercial | closed | https://github.com/shopware/shopware/issues/17193 |
| UPGRADE-6.7.md lists no structural change to custom flow actions between 6.6 and 6.7 | 6.7 | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Is the PHP contract still `FlowAction` with `getName()`/`requirements()`/`handleFlow()`, and is it still an event subscriber? | code | Contract unchanged and identical in 6.6/6.7; never an event subscriber — `getName()` is static (`FlowAction.php:9-19`) |
| Which DI tag, and is autoconfiguration enough? | code | `flow.action`, explicitly, and it must carry `key`; no autoconfiguration exists (`flow.xml:61,64-67`; `AutoconfigureCompilerPass.php:156-158`) |
| How is event data reached in a 6.7 action? | code | `$flow->hasData()/getData()` keyed by Aware constants, `$flow->getConfig()` for the sequence config (`AddOrderTagAction.php:40-56`) |
| Do `addIcons`/`addLabels`/`addActionNames`/`addActionGroupMapping` still exist on `flowBuilderService` in 6.7? | code | Yes, all of them, plus `addGroups()` and `addDescriptionCallbacks()` (`flow-builder.service.ts:165-206`) |
| Is the app route still `Resources/flow.xml`? | code | Yes — parsed by `Framework/App/Flow/Action/Action` against `flow-1.0.xsd`, stored as `app_flow_action`, executed as a webhook |
| Is `addServiceProviderDecorator` still safe given the eager-instantiation defect (#17720)? | not settled | The registration methods are confirmed to exist; *how* a plugin reaches the singleton was not examined. No fact depends on the decorator form. |
| Is an action with no group mapping dropped by the action picker? | not settled | Not examined; no fact asserts that a group mapping is optional |
| Does `sequenceRuleMatches` still require `OrderAware` (#11511)? | not settled | Out of scope of this query — it concerns rule evaluation for custom triggers, not adding an action |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| A custom action extends `FlowAction` implementing `getName()`, `requirements()`, `handleFlow(StorableFlow $flow)` | `getName: Returns a unique technical name for your action.` | `…/flow/add-flow-builder-action.md` | yes, with a correction — `getName()` is `static` (`FlowAction.php:9-19`) |
| Register with tag `flow.action` and `priority: 600`; the tag puts it in `/api/_info/flow-actions.json`, priority orders the response | `Make sure to define a tag flow.action with priority: 600…` | same | tag and API endpoint yes (`flow.xml:161-165`, `InfoController.php:231-234`); the prose omits the mandatory `key`, and no consumer of `priority` was traced |
| `$flow->getStore($key)` for aware-interface data, `$flow->getData($key)` for event data, `$flow->getConfig()` for the sequence config | `Use $flow->getStore($key) if you want to get the data from aware interfaces.` | same | `getData()`/`getConfig()` yes (`AddOrderTagAction.php:40-56`); `getStore()` was not examined by the code lane |
| A custom aware interface extends `FlowEventAware` and carries `#[IsFlowEventAware]` | `#[IsFlowEventAware] interface TagAware extends FlowEventAware` | same | not checked |
| An empty `requirements()` makes the action available for all triggers | `all triggers in the flow builder can define the action CreateTagAction` | same | consistent with `FlowActionCollector::define()` publishing an empty requirements list (`FlowActionCollector.php:73-90`), but the admin-side filtering was not traced |
| A new trigger is surfaced by subscribing to `BusinessEventCollectorEvent::NAME` | `$definition = $this->businessEventCollector->define(BasicExampleEvent::class);` | same | not checked (concerns triggers, not actions) |
| The Administration side requires overriding `sw-flow-sequence-action` for title, description and modal name | `we also need to override the sw-flow-sequence-action component in the core` | same | no — code shows the registration surface is the `flowBuilderService` singleton (`flow-builder.service.ts:165-206`) |
| The action group defaults to "General" when not defined | `It will default on the General group if it is not defined.` | same | not checked |
| `TransactionalAction` is an empty marker; the dispatcher wraps the action in a transaction and logs an error on exception | `It does not have any methods to implement.` | `…/flow/action-transactions.md` | marker and transaction yes; on failure `FlowExecutor` throws `FlowException::transactionFailed()` (`FlowExecutor.php:216-229`) |
| App flow actions are declared in `flow.xml`, available from 6.4.10.0 | `Custom flow actions in Shopware Apps are available starting with Shopware 6.4.10.0` | `…/apps/flow-builder/add-custom-flow-actions-from-app-system.md` | the `flow.xml` route yes (`FlowActionLifecycleHandler.php:83-87`); the version floor not checked |

Intent/business context code cannot express:

- Flow Builder is positioned as no-code automation for merchants; a custom action extends that catalogue with a business task.
- App actions are framed as configurable webhook actions for third-party integration, as opposed to in-process plugin actions.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The prose describes the tag as `flow.action` with `priority`, and never explains the `key` attribute it silently includes in the code sample | `key` is mandatory: the executor's iterator is `index-by="key"` and lookup is by the sequence's action name, so a wrong or missing key makes the action a silent no-op | `Content/DependencyInjection/flow.xml:61`; `Content/Flow/Dispatching/FlowExecutor.php:210-214` |
| `getName()` is presented as an ordinary method | it is declared `abstract public static function getName(): string` | `Content/Flow/Dispatching/Action/FlowAction.php:9-19` |
| The Administration is extended by overriding the `sw-flow-sequence-action` component | the registration surface is the `flowBuilderService` singleton's additive methods (`addActionNames`, `addLabels`, `addIcons`, `addGroups`, `addActionGroupMapping`) | `vendor/shopware/administration/…/module/sw-flow/service/flow-builder.service.ts:165-206` |
| On a transactional action's failure "an error is logged" | `FlowExecutor` wraps the throwable and throws `FlowException::transactionFailed($e)` | `Content/Flow/Dispatching/FlowExecutor.php:216-229` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Extend `Shopware\Core\Content\Flow\Dispatching\Action\FlowAction`; implement `getName()`, `requirements()` (aware interfaces such as `OrderAware`) and `handleFlow(StorableFlow $flow)`. | rewritten | correct but incomplete: code shows `getName()` is **static** and that the class is not an event subscriber (`FlowAction.php:9-19`, `FlowExecutor.php:210-217`) |
| Tag the service with `flow.action` (optionally with `priority`). | rewritten | code shows the `key` attribute is mandatory — the iterator is `index-by="key"` and a mismatch is a silent no-op — while `priority` is the genuinely optional part (`flow.xml:61,64-67`, `FlowExecutor.php:210-214`) |
| Check `$flow->hasData()` before reading order/customer data; register the action in the `sw-flow` Administration module. (An answer that additionally mentions the app-system counterpart in `Resources/flow.xml` is not penalised.) | rewritten | the `hasData()` guard and admin registration are confirmed and made specific (`flowBuilderService` methods); the tolerance clause is removed — the app route is a different mechanism (webhook, no PHP handler), not a bonus mention |
