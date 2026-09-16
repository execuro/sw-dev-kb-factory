# `dev-10` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-10` · `dev` · `DAL` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-2-11` |
| Core version | `6.7.13.0` |

**Query:** How do I write an indexer that precomputes derived data for my custom entity on write, and how do I trigger a full reindex?

**Expected answer — every fact an answer must contain:**

1. Extend `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer` and implement all **six** abstract members — `getName(): string`, `iterate(?array $offset): ?EntityIndexingMessage`, `update(EntityWrittenContainerEvent $event): ?EntityIndexingMessage`, `handle(EntityIndexingMessage $message): void`, `getTotal(): int` and `getDecorated(): EntityIndexer` (core throws `DecorationPatternException` here); only `getOptions()` is optional. The service tag is `shopware.entity_indexer`, applied automatically by autoconfiguration to anything extending `EntityIndexer`, and `EntityIndexerRegistry` is the single `messenger.message_handler` for indexing messages — the plugin registers no handler of its own. `[code: Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-49]` `[code: Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:116-118]` `[code: Framework/DependencyInjection/data-abstraction-layer.php:893-900]`
2. On write, `EntityIndexingSubscriber` listens to `EntityWrittenContainerEvent` at priority 1000 and calls `EntityIndexerRegistry::refresh()`, which calls `update()` on every indexer; narrow the write with `$event->getPrimaryKeys(<entity name>)` and return `null` when nothing is affected. A returned `EntityIndexingMessage` is handled **synchronously in-process** unless its 4th constructor argument `$forceQueue` is `true` or the Context carries `EntityIndexerRegistry::USE_INDEXING_QUEUE`; no plugin messenger routing is needed, since `EntityIndexingMessage` implements `AsyncMessageInterface`, which core routes to the `async` transport. `[code: Framework/DataAbstractionLayer/Indexing/Subscriber/EntityIndexingSubscriber.php:20-28]` `[code: Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:120-157,264-272]` `[code: Framework/Resources/config/packages/framework.yaml:92-96]`
3. A full reindex is `bin/console dal:refresh:index`, which loops `iterate($offset)` per indexer until it returns `null` (page ids with `IteratorFactory::createIterator()`); the command takes **no positional entity argument** — only `--use-queue`, `--no-progress`, `--skip=` and `--only=`, matched against `getName()` (convention `<entity>.indexer`). Programmatically it is `EntityIndexerRegistry::sendFullIndexingMessage()`. DAL writes inside `handle()` are guarded against re-entry only on the synchronous write path (`$working` is set solely inside `refresh()`); on the queued path and on both `dal:refresh:index` paths there is no guard and the indexer can loop, so write via `Connection` directly or wrap the write in `$context->state(fn () => …, EntityIndexerRegistry::DISABLE_INDEXING)`. `[code: Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:43-59]` `[code: Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistry.php:50-66,81-118,127-158]` `[code: Checkout/Payment/DataAbstractionLayer/PaymentMethodIndexer.php:79-86]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/data-handling/add-data-indexer.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `EntityIndexer` declares six abstract members: getName, iterate, update, handle, getTotal, getDecorated. | `Framework/DataAbstractionLayer/Indexing/EntityIndexer.php:9-39` | `abstract public function iterate(?array $offset): ?EntityIndexingMessage;` |
| `getOptions(): array` is the only non-abstract member; it lists sub-updater names callers may skip. | `Indexing/EntityIndexer.php:41-49` ; `Content/Product/DataAbstractionLayer/ProductIndexer.php:257-265` | `public function getOptions(): array { return []; }` |
| The `shopware.entity_indexer` tag is applied by autoconfiguration to any service extending EntityIndexer. | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:116-118` | `->registerForAutoconfiguration(EntityIndexer::class)->addTag('shopware.entity_indexer');` |
| The tag is consumed once, as a `tagged_iterator` into `EntityIndexerRegistry`, itself a `messenger.message_handler`. | `Framework/DependencyInjection/data-abstraction-layer.php:893-900` | `tagged_iterator('shopware.entity_indexer'), … ->tag('messenger.message_handler');` |
| The write hook is a subscriber: `EntityIndexingSubscriber` on `EntityWrittenContainerEvent` at priority 1000 calls `refresh()`. | `Indexing/Subscriber/EntityIndexingSubscriber.php:20-28` | `return [EntityWrittenContainerEvent::class => [['refreshIndex', 1000]]];` |
| `refresh()` calls `update()` on every indexer; `null` means nothing to do; otherwise the registry stamps the indexer name, sets isFullIndexing=false, applies only/skip and calls sendOrHandle. | `Indexing/EntityIndexerRegistry.php:120-157` | `$message->setIndexer($indexer->getName()); $message->isFullIndexing = false;` |
| Queue vs inline: `sendOrHandle()` dispatches to the bus only on USE_INDEXING_QUEUE or `forceQueue`, else calls `__invoke()` in-process. | `Indexing/EntityIndexerRegistry.php:264-272` ; `:256` | `if ($useQueue \|\| $message->forceQueue()) { $this->messageBus->dispatch($message); return; } $this->__invoke($message);` |
| Four context constants govern indexing: EXTENSION_INDEXER_SKIP, EXTENSION_INDEXER_ONLY, USE_INDEXING_QUEUE, DISABLE_INDEXING. | `Indexing/EntityIndexerRegistry.php:26-31` | `final public const DISABLE_INDEXING = 'disable-indexing';` |
| `EntityIndexingMessage(array\|string $data, ?array $offset = null, ?Context $context = null, bool $forceQueue = false, bool $isFullIndexing = false)` implements AsyncMessageInterface. | `Indexing/EntityIndexingMessage.php:12,27-35` | `class EntityIndexingMessage implements AsyncMessageInterface, DeduplicatableMessageInterface` |
| `EntityIndexingMessage::allow(string $name)` is how handle() honours the skip list. | `Indexing/EntityIndexingMessage.php:100-103` ; `Content/Rule/DataAbstractionLayer/RuleIndexer.php:84-90` | `if ($message->allow(self::PAYLOAD_UPDATER)) { … }` |
| `iterate()` is the full-reindex producer, paged with `IteratorFactory::createIterator($definition, $lastId, $limit = 50)`, returning null when exhausted. | `Content/Rule/DataAbstractionLayer/RuleIndexer.php:46-57` ; `Dbal/Common/IteratorFactory.php:31` | `if ($ids === []) { return null; }` |
| The full-index loop lives in `index(bool $useQueue, array $skip, array $only, bool $postUpdate)`; it stamps isFullIndexing=true and dispatches Progress events. | `Indexing/EntityIndexerRegistry.php:81-118` | `while ($message = $indexer->iterate($offset)) { … $message->isFullIndexing = true;` |
| `dal:refresh:index` has options --use-queue, --no-progress, --skip, --only and delegates to `index()`. | `Framework/DataAbstractionLayer/Command/RefreshIndexCommand.php:21-24,43-59` | `$this->registry->index($input->getOption('use-queue'), $skip, $only);` |
| --skip/--only match `getName()`; the command strips the `.indexer` suffix for RefreshIndexEvent. | `Command/RefreshIndexCommand.php:61-66` ; `RuleIndexer.php:41-44` | `str_replace('.indexer', '', $indexer)` |
| Programmatic full reindex: `sendFullIndexingMessage()` (FullEntityIndexerMessage) and `sendIndexingMessage()` (IterateEntityIndexerMessage); `__invoke` handles all three message types. | `Indexing/EntityIndexerRegistry.php:50-75,201-236` | `$this->messageBus->dispatch(new FullEntityIndexerMessage($skip, $only));` |
| `IterateEntityIndexerMessage` is self-chaining — handling one re-dispatches the next offset. | `Indexing/EntityIndexerRegistry.php:68-75` | `$this->messageBus->dispatch(new IterateEntityIndexerMessage($message->getIndexer(), $next->getOffset(), $message->getSkip()));` |
| `PostUpdateIndexer` implementations are skipped by refresh() and by index() unless `$postUpdate` is true. | `Indexing/EntityIndexerRegistry.php:83-86,127-129` | `if (!$postUpdate && $indexer instanceof PostUpdateIndexer) { continue; }` |
| `update()` may do the work inline and return null (RuleIndexer calls handle() itself). | `Content/Rule/DataAbstractionLayer/RuleIndexer.php:59-70` | `$this->handle(new RuleIndexingMessage(array_values($updates), null, $event->getContext())); return null;` |
| `getDecorated()` conventionally throws `DecorationPatternException`. | `RuleIndexer.php:100-103` | `throw new DecorationPatternException(static::class);` |
| A dedicated (possibly empty) message subclass is the core convention. | `Content/Rule/DataAbstractionLayer/RuleIndexingMessage.php` | `class RuleIndexingMessage extends EntityIndexingMessage {}` |
| **Deep:** `$working` is written only at `:127` and `:158`, both inside `refresh()`. It is true while handle() runs **only** on the synchronous write path; on the queued write path, both `dal:refresh:index` paths and the iterate path handle() runs with `$working === false`, so a DAL write inside handle() re-enters refresh() unguarded. | `Indexing/EntityIndexerRegistry.php:33,50-66,81-118,120-160,264-272,278-298` | `if ($this->working) { return; } $this->working = true;` |
| **Deep:** any DAL write dispatches `EntityWrittenContainerEvent` carrying the write's Context; `EntityIndexingSubscriber` is the only caller of `refresh()` in core. | `EntityRepository.php:100-104` ; `Event/EntityWrittenContainerEvent.php:24-34` ; `Subscriber/EntityIndexingSubscriber.php:27` | `$event = EntityWrittenContainerEvent::createWithWrittenEvents($affected, $context, []);` |
| **Deep:** `disabled($context)` is `return $context->hasState(self::DISABLE_INDEXING);`, checked before `$useQueue` and before the indexer loop, so no update() runs at all; the state must be on the Context handed to the write. `$context->state($closure, …)` adds and restores it. | `Indexing/EntityIndexerRegistry.php:29-31,132-138,254-262` ; `Framework/Struct/StateAwareTrait.php:15-57` | `if ($this->disabled($context)) { return; }` |
| **Deep:** core uses this escape hatch itself in `PaymentMethodIndexer::handle()`. | `Checkout/Payment/DataAbstractionLayer/PaymentMethodIndexer.php:79-86` | `// Use 'disabled-indexing' state, because DAL is used in the NameGenerator to upsert payment methods` |
| **Deep:** `USE_INDEXING_QUEUE` only defers work to the bus; it suppresses no indexer and sets no guard on the consumer side. | `Indexing/EntityIndexerRegistry.php:254-257,264-272` | `private function useQueue(Context $context): bool { return $context->hasState(self::USE_INDEXING_QUEUE); }` |
| **Deep:** core routes `AsyncMessageInterface` to the `async` transport (DSN `%env(MESSENGER_TRANSPORT_DSN)%`, default `doctrine://default?auto_setup=false`), so a plugin's message subclass is queued with no plugin-side routing. | `Framework/Resources/config/packages/framework.yaml:3,65-69,92-96` | `'Shopware\Core\Framework\MessageQueue\AsyncMessageInterface': async` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| An indexer needs its own message handler / `#[AsMessageHandler]`. | absent | `EntityIndexerRegistry` is the single handler for all three message types and resolves the indexer by name. `data-abstraction-layer.php:900` ; `EntityIndexerRegistry.php:50-66` |
| `dal:refresh:index` takes a positional entity/indexer argument. | absent | `configure()` adds only the four options, no `InputArgument`. `Command/RefreshIndexCommand.php:43-50` |
| An unknown `--only` name or a message for a removed indexer raises an error. | absent | `getIndexer()` returns null and `__invoke` silently does nothing; `index()` skips unlisted names. `EntityIndexerRegistry.php:58-64,243-253` |
| The re-entrancy guard protects `handle()` on the message-queue path. | absent | `__invoke()` calls `$indexer->handle()` with no reference to `$working`. `EntityIndexerRegistry.php:50-66` |
| `index()` (`dal:refresh:index`) sets the re-entrancy guard. | absent | Lines 81-118 contain no `$working` assignment. `EntityIndexerRegistry.php:81-118` |
| `USE_INDEXING_QUEUE` suppresses or dampens re-indexing loops. | absent | It only chooses dispatch vs inline `__invoke()`. `EntityIndexerRegistry.php:254-257,264-272` |
| A plugin must add messenger routing for its own `EntityIndexingMessage` subclass. | absent | Routing is declared against `AsyncMessageInterface`, which the base class implements. `framework.yaml:92-95` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Complete compact reference implementation of all six members. | `Content/Rule/DataAbstractionLayer/RuleIndexer.php:41-103` |
| `getTotal()` built off the same IteratorFactory that drives `iterate()`. | `Content/Rule/DataAbstractionLayer/RuleIndexer.php:95-98` |
| `$working` is per-refresh() and reset in the finally, so a throwing indexer does not disable indexing for the process. | shopware/shopware trunk, `tests/unit/Core/Framework/DataAbstractionLayer/Indexing/EntityIndexerRegistryTest.php::testRefreshResetsWorkingStateWhenIndexerThrows` |
| `__invoke(EntityIndexingMessage)` reaches `handle()` with no `refresh()` on the stack — the unguarded queue entry point. | same file, `::testHandleIsRoutedThroughTheMetricsInstrumentor` |
| Core's own in-production use of the DISABLE_INDEXING escape hatch around a DAL write inside handle(). | `Checkout/Payment/DataAbstractionLayer/PaymentMethodIndexer.php:81-84` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Administration's Caches & indexes selector is a hard-coded JS list, so extension indexers are invisible; `debug:container --tag=shopware.entity_indexer` shows what is really registered. | 6.7.12.2 | closed | https://github.com/shopware/shopware/issues/18673 |
| A core indexer re-queued itself forever: `dal:refresh:index --only=payment_method.indexer` plus `messenger:consume` produced an infinite indexing loop. | 6.5.6.1 | closed | https://github.com/shopware/shopware/issues/3430 |
| `dal:refresh:index` exhausts PHP memory on large data sets and indexes some records twice. | 6.4.17 era | closed | https://github.com/shopware/shopware/issues/2795 |
| A custom offset object in an indexing message could not be deserialized off the queue. | 6.5.3.3 | closed | https://github.com/shopware/shopware/issues/3245 |
| Indexing message dispatch failed with `Serialization of 'Closure' is not allowed` from a non-serializable value on the Context. | 6.4.17.2 | closed | https://github.com/shopware/shopware/issues/6158 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which DI tag registers a custom indexer, and does the registry collect by it alone? | code lane | `shopware.entity_indexer`, autoconfigured, consumed once as a tagged_iterator. `AutoconfigureCompilerPass.php:116-118` ; `data-abstraction-layer.php:893-900` |
| Which members are abstract on `EntityIndexer`? | code lane | Six, including `getTotal()` and `getDecorated()`; `getOptions()` is not abstract. `Indexing/EntityIndexer.php:9-49` |
| Is `$forceQueue` the 4th ctor argument and is sync the default? | code lane | Yes — `sendOrHandle()` queues only on `forceQueue` or USE_INDEXING_QUEUE. `EntityIndexerRegistry.php:264-272` |
| What does `dal:refresh:index` call, and what does `--only` match? | code lane | `index()` loops `iterate()`; `--only`/`--skip` match `getName()`; no positional argument. `Command/RefreshIndexCommand.php:43-66` |
| Does 6.7 guard against an indexer's own DAL writes re-triggering it (issue #3430)? | deep pass | Only on the synchronous write path; `$working` is set solely inside `refresh()`, so the queue and `dal:refresh:index` paths are unguarded. The escape hatch is `EntityIndexerRegistry::DISABLE_INDEXING` on the write's Context. `EntityIndexerRegistry.php:120-160` |
| Is a plugin's message routed asynchronously out of the box? | deep pass | Yes — `AsyncMessageInterface` is routed to `async` in core's framework.yaml. `framework.yaml:92-96` |
| Is the offset required to be plain serializable data (issues #3245, #6158)? | not settled | Not read by either code pass; not load-bearing for the facts. |
| How does an indexer appear in the Administration's Caches & indexes screen? | not settled | Administration JS not read; outside the query's scope. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| An indexer extends `EntityIndexer` and must be tagged `shopware.entity_indexer`. | "The indexer service has to be tagged as `shopware.entity_indexer` in order to work." | `developer/guides/plugins/plugins/framework/data-handling/add-data-indexer.md` | partly — the tag is right, but autoconfiguration applies it |
| `getName()` must be unique and routes messages in the registry. | "It is used in the `EntityIndexerRegistry` to identify which messages should be handled by which indexer." | same page | yes — `EntityIndexerRegistry.php:243-253` |
| `iterate($offset)` runs on a full reindex, via CLI or the Administration. | "This is for example the case if the console command `bin/console dal:refresh:index` is used" | same page | yes for CLI — `EntityIndexerRegistry.php:81-118` ; admin path not read |
| `iterate()` should page ids with `IteratorFactory` and return null when exhausted. | "the `…Dbal\Common\IteratorFactory` is used to fetch customer ids" | same page | yes — `RuleIndexer.php:46-57` |
| `update(EntityWrittenContainerEvent)` runs on DAL writes and extracts primary keys. | "This function is called when entities are updated over the DAL." | same page | yes — `EntityIndexingSubscriber.php:20-28` ; `RuleIndexer.php:61` |
| `handle()` processes messages from `iterate()` or `update()`. | "The `handle()` method handles the messages which were generated in the `self::iterate` or `self::update` function." | same page | yes — `EntityIndexerRegistry.php:50-66` |
| Messages from `update()` are synchronous by default; `$forceQueue` (4th ctor param) makes them async. | "it has a fourth parameter named `$forceQueue` which is `false` by default" | same page | yes — `EntityIndexingMessage.php:27-35` ; `EntityIndexerRegistry.php:264-272` |
| DAL writes inside an indexer re-trigger indexing and can loop, so use `Connection` directly. | "This can lead to an infinite loop. Therefore, the connection should be used directly" | same page | partly — true on the queued and `dal:refresh:index` paths, false on the synchronous write path, which `$working` guards |
| DAL writes are possible if `EntityIndexerRegistry::DISABLE_INDEXING` is added to the context state. | "$context->addState(EntityIndexerRegistry::DISABLE_INDEXING);" | same page | yes — `EntityIndexerRegistry.php:132-138,254-262` ; core uses `$context->state(...)` |
| For existing core entities, subscribing to indexer events is preferred over a new indexer. | "if you want to react on changes of existing entities the preferred way should be subscribing to the events" | same page | not checked — intent guidance |
| The core indexer list includes a `BreadcrumpIndexer`. | "* `BreadcrumpIndexer`" | same page | no — name not verified against any class; a docs misspelling |
| `dal:refresh:index` "refreshes the index for a given entity". | "\| `dal:refresh:index` \| Refreshes the index for a given entity \|" | `resources/references/core-reference/commands-reference.md` | no — the command takes no entity argument |
| `dal:refresh:index media.indexer` is a valid invocation. | "Running `bin/console dal:refresh:index media.indexer` is a no-op." | `guides/plugins/plugins/content/media/remote-thumbnail-generation.md` | no — no positional argument exists |
| `--use-queue` performs a complete reindex and should always be used. | "**ALWAYS** \"`--use-queue`\" since big request can outperform the server!" | `guides/hosting/infrastructure/elasticsearch/elasticsearch-debugging.md` | partly — the option exists and queues every message; the "always" is advice |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| An indexer must implement `getName()`, `iterate()`, `update()` and `handle()` — no other mandatory member is named. | Six abstract members; a class implementing only the documented four does not instantiate (`getTotal()` and `getDecorated()` are missing). | `Indexing/EntityIndexer.php:9-39` |
| `dal:refresh:index` takes an entity/indexer name as an argument (`dal:refresh:index media.indexer`). | `configure()` adds no `InputArgument`; targeting one indexer is `--only=<indexer name>`. | `Command/RefreshIndexCommand.php:43-50` |
| The service "has to be tagged as `shopware.entity_indexer` in order to work". | The tag is correct but autoconfiguration adds it to anything extending `EntityIndexer`; an explicit tag is not required. | `AutoconfigureCompilerPass.php:116-118` |
| Writing through the DAL inside an indexer "can lead to an infinite loop" — stated unconditionally. | `$working` is set only inside `refresh()`, so the synchronous write path IS guarded; the loop is real on the queued write path, on both `dal:refresh:index` paths and on the iterate path. | `EntityIndexerRegistry.php:50-66,81-118,120-160` |
| The core indexer list names a `BreadcrumpIndexer`. | Not examined by either code pass; the spelling is a docs error and no matching class was verified. | n/a — not examined |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Extend `Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexer` and implement `getName()`, `iterate($offset)`, `update(EntityWrittenContainerEvent $event)` and `handle(EntityIndexingMessage $message)`. | rewritten | Incomplete: `EntityIndexer` has six abstract members. An answer listing only these four produces a class that cannot be instantiated, so `getTotal()` and `getDecorated()` are load-bearing and were added, together with the autoconfigured tag and the fact that the registry is the only message handler. |
| Register it with the service tag `shopware.entity_indexer` (underscore, not a dot); a full index is triggered by `bin/console dal:refresh:index`, and messages from `update()` run synchronously unless `$forceQueue = true` is passed as the 4th constructor argument of `EntityIndexingMessage`. | rewritten | All three halves confirmed and tagged; split across facts 1-3 and extended with the autoconfiguration of the tag, the `USE_INDEXING_QUEUE` context state as the second way to queue, the out-of-the-box `AsyncMessageInterface` routing, and the command's real option set (no positional argument, `--only`/`--skip` matched against `getName()`). |
| Writing through the DAL inside `handle()` re-triggers `EntityWrittenContainerEvent` and loops — write via `Connection` directly or add `EntityIndexerRegistry::DISABLE_INDEXING` to the context state. | rewritten | The unconditional "loops" is wrong: the deep pass proved `$working` (set only in `refresh()`) guards the synchronous write path, while the queued write path, both `dal:refresh:index` paths and the iterate path run `handle()` with `$working === false`. The remedy half is confirmed (`disabled()` returns before any `update()`; core uses `$context->state(..., DISABLE_INDEXING)` in `PaymentMethodIndexer`). |
