# `dev-19` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-19` · `dev` · `Events` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-11` · run `cases-review-2026-09-11-2118-12-21` |
| Core version | `6.7.13.0` |

**Query:** I need to move long-running work in my plugin out of the request into the message queue — what does the handler class look like and how is it registered?

**Expected answer — every fact an answer must contain:**

1. The handler is a plain `final` class carrying `#[AsMessageHandler]` with a single `__invoke(<Message> $message): void`; there is no Shopware base class or interface, and finality is enforced by a PHPStan architecture rule. `[code: Framework/App/MessageHandler/RotateAppSecretHandler.php:9-29; DevOps/StaticAnalyze/PHPStan/Rules/MessageHandlerFinalRule.php:18-26]`
2. The attribute alone is not enough to register a plugin handler: Symfony applies the `AsMessageHandler` autoconfigurator only to definitions whose `isAutoconfigured()` is true, and Shopware never sets that — `Bundle::registerContainerFile()` loads the plugin's `Resources/config/services.*` with no `<defaults>`, and `grep setAutoconfigured|->autoconfigure(` over core returns 0 hits. So the service must be tagged `messenger.message_handler` unless the plugin's own services file declares `autoconfigure="true"`; core hedges by shipping both (attribute plus explicit tag). If neither path registers it, the failure is at runtime, not compile time: `HandleMessageMiddleware` throws `NoHandlerForMessageException` because `allow_no_handlers` defaults to false. Doing both is safe — `MessageHandlerCompilerPass` collapses the tag list to one merged tag (hand-written tag values winning), and any survivor is de-duplicated by the hashed handler-descriptor id plus the `HandledStamp` check. `[code: Framework/Bundle.php:212-224; Framework/MessageQueue/MessageHandlerCompilerPass.php:18-41; Framework/DependencyInjection/webhook.php:230; vendor/symfony/messenger/Middleware/HandleMessageMiddleware.php:112-115]`
3. What moves the work out of the request is the **message** class, not the handler: `framework.yaml` routes `AsyncMessageInterface` to the `async` transport and `LowPriorityMessageInterface` to `low_priority`, both empty marker interfaces. A message implementing neither matches no routing rule, has no sender, and is handled synchronously inside the dispatching request. Dispatch goes through the plain `Symfony\Component\Messenger\MessageBusInterface`, which is aliased to the single configured bus `messenger.bus.default` — there is no Shopware-specific bus — and the middleware that invokes the handler is `handle_message` (singular). `[code: Framework/Resources/config/packages/framework.yaml:87-95; Framework/MessageQueue/AsyncMessageInterface.php:8; vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:2479-2509,2531-2536]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/framework/message-queue/add-message-handler.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Handler shape: final class, attribute, `__invoke` | `Framework/App/MessageHandler/RotateAppSecretHandler.php:9-29` | `#[AsMessageHandler]` / `final class RotateAppSecretHandler` / `public function __invoke(RotateAppSecretMessage $message): void` |
| Finality enforced as an architecture rule | `DevOps/StaticAnalyze/PHPStan/Rules/MessageHandlerFinalRule.php:18-26` | `->classes(Selector::appliesAttribute(AsMessageHandler::class))->should()->beFinal()->because('MessageHandlers must be final…')` |
| Symfony registers the attribute autoconfigurator, but it applies only to autoconfigured definitions | `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:804-815`; `vendor/symfony/dependency-injection/Compiler/AttributeAutoconfigurationPass.php:76-79` | `$container->registerAttributeForAutoconfiguration(AsMessageHandler::class, … $definition->addTag('messenger.message_handler', $tagAttributes); });` / `if (!$value instanceof Definition \|\| !$value->isAutoconfigured() … ) { return parent::processValue($value, $isRoot); }` |
| Shopware loads plugin service files with no defaults and never marks anything autoconfigured | `Framework/Bundle.php:212-224`; `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:49-56` | `foreach ($this->getServicesFilePathArray($this->getPath() . '/Resources/config/services.*') as $path) { $delegatingLoader->load($path); }` — `AutoconfigureCompilerPass` only registers autoconfiguration *rules* for `shopware.*` tags; `grep setAutoconfigured\|->autoconfigure(` over core → 0 hits |
| Core ships attribute **and** explicit tag | `Framework/Webhook/Handler/WebhookEventMessageHandler.php:25`; `Framework/DependencyInjection/webhook.php:230` | `#[AsMessageHandler] … final readonly class WebhookEventMessageHandler` / `->tag('messenger.message_handler');` |
| Unregistered handler fails at runtime | `vendor/symfony/messenger/Middleware/HandleMessageMiddleware.php:112-115`; `vendor/symfony/framework-bundle/DependencyInjection/Configuration.php:1853` | `if (null === $handler && !$alreadyHandled) { if (!$this->allowNoHandlers) { throw new NoHandlerForMessageException(…); } }` / `->booleanNode('allow_no_handlers')->defaultFalse()` |
| Shopware's pass merges the attribute args under the hand-written tag and collapses to one tag | `Framework/MessageQueue/MessageHandlerCompilerPass.php:18-41`; registered at `Framework/Framework.php:143` | `$tagAttributes = array_merge($attribute->getArguments(), $tagAttributes); … $tags['messenger.message_handler'] = [$tagAttributes];` / `addCompilerPass(new MessageHandlerCompilerPass(), PassConfig::TYPE_BEFORE_OPTIMIZATION, 1000)` |
| Even a double-tagged handler is not handled twice | `vendor/symfony/messenger/DependencyInjection/MessengerPass.php:164-167`; `HandleMessageMiddleware.php:56-58,127-134` | `$definitions[$definitionId = '.messenger.handler_descriptor.'.ContainerBuilder::hash($bus.':'.$message.':'.$handler[0])] = …` / `foreach ($envelope->all(HandledStamp::class) as $stamp) { if ($stamp->getHandlerName() === $handlerDescriptor->getName()) { return true; } }` |
| Transport routing is keyed on the message class | `Framework/Resources/config/packages/framework.yaml:92-95` | `'Shopware\Core\Framework\MessageQueue\AsyncMessageInterface': async` / `'Shopware\Core\Framework\MessageQueue\LowPriorityMessageInterface': low_priority` |
| The markers are empty interfaces | `Framework/MessageQueue/AsyncMessageInterface.php:8`; `Framework/MessageQueue/LowPriorityMessageInterface.php:8` | `interface AsyncMessageInterface { }` |
| One bus; `MessageBusInterface` is aliased to it | `Framework/Resources/config/packages/framework.yaml:87-90`; `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:2475-2476,2531-2536` | `buses: messenger.bus.default: middleware: - …QueuedTimeMiddleware` / `if ($busId === $config['default_bus']) { $container->setAlias('messenger.default_bus', $busId)…; $container->setAlias(MessageBusInterface::class, $busId); }` |
| The invoking middleware is `handle_message`, appended by Symfony's default stack | `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:2479-2509`; `vendor/symfony/framework-bundle/Resources/config/messenger.php:104` | `'after' => [['id' => 'send_message'], ['id' => 'handle_message']]` / `->set('messenger.middleware.handle_message', HandleMessageMiddleware::class)` |
| Dispatch through the injected bus | `Framework/App/Lifecycle/AppSecretRotationService.php:40,60` | `private readonly MessageBusInterface $messageBus,` / `$this->messageBus->dispatch($message);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A middleware named `handle_messages` | absent | No such id in Symfony's default stack or in Shopware config; the id is `handle_message`. `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:2488` |
| Shopware marks plugin definitions autoconfigured so the attribute always works | absent | `grep -rn 'setAutoconfigured\|->autoconfigure('` over `vendor/shopware/core` → 0 hits; `Bundle::registerContainerFile` adds no defaults. `Framework/Bundle.php:212-224` |
| A Shopware-specific bus (`messenger.bus.shopware` / `Adapter\Messenger\MessageBus`) | absent | `Framework/Adapter/Messenger/` holds only `Middleware/` and `Stamp/`; grep finds neither name. Only `messenger.bus.default` is configured. |
| An abstract `AbstractMessageHandler` base class with `getHandledMessages()` | absent | grep over `vendor/shopware/` → 0 hits; the attribute + `__invoke` shape replaced it. |
| A Shopware-specific tag such as `shopware.message_handler` | absent | grep over `vendor/shopware/` → 0 hits; the tag is Symfony's `messenger.message_handler`. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Attribute + explicit tag is the tested path; asserts exactly one merged tag, hand-written values overriding attribute values | `github shopware/shopware refs/heads/trunk tests/unit/Core/Framework/MessageQueue/MessageHandlerCompilerPassTest.php` |
| A shipped core handler in the recommended shape, plus its tag in the DI file | `Framework/Webhook/Handler/WebhookEventMessageHandler.php:25-27`; `Framework/DependencyInjection/webhook.php:230` |
| Core's scheduled-task wiring depends on the tag, not the attribute | `Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29` |
| Minimal handler + async message fixtures | `Framework/Test/MessageQueue/fixtures/TestMessageHandler.php:5-16`; `fixtures/FooMessage.php:5-10` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| 6.6 upgrade guide: `getHandledMessages()` removed in favour of `#[AsMessageHandler]`; extension authors told to make sure handlers are tagged `messenger.message_handler` in services.xml | 6.6 | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.6.md |
| 6.7.13.0 release notes: `ScheduledTaskHandler::__invoke()` orchestration moved into `ScheduledTaskExecutor`, injected via a compiler pass keyed on the `messenger.message_handler` tag | 6.7.13.0 | merged | https://developer.shopware.com/release-notes/6.7/6.7.13.0.html |
| Plugin test bootstrap failed on a message-handler service class missing from the dist package | 6.6.0-rc2 | closed | https://github.com/shopware/shopware/issues/3557 |
| `framework.messenger.routing` duplicated messages into both `async` and `low_priority` | 6.6.10.1 | closed | https://github.com/shopware/shopware/issues/7169 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Attribute, tag, or both — and is autoconfiguration on for plugin services? | code (deep) | Both in practice. Autoconfiguration is **off** unless the plugin's own services file enables it, so the tag is required by default. Now fact 2. |
| Does `AsyncMessageInterface` still exist and is it what routes to async? | code (deep + round 1) | Yes, and routing is keyed on the message class. Now fact 3. |
| Does tagging a handler that also carries the attribute double-register or double-handle it? | code (deep) | No — Shopware's pass collapses to one tag; any survivor is de-duplicated by the hashed descriptor id and the `HandledStamp` check. |
| Which bus does a plugin inject? | code (deep) | The plain `MessageBusInterface`, aliased to the single bus `messenger.bus.default`; no Shopware bus exists. |
| `ScheduledTaskHandler` deprecations / `DynamicallyScheduledTaskHandler` | not examined | Outside this query (plugin handler shape and registration); not admitted to the facts. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Handler marked `#[AsMessageHandler]` with `__invoke`; to register it, tag it `messenger.message_handler` | "To mark the class as message handler, we use the php attribute `#[AsMessageHandler]` and implement the method `__invoke`. … To register a handler, we have to tag it with the `messenger.message_handler` tag." | `docs/.../message-queue/add-message-handler.md:26` | yes — this sentence is the code-accurate one |
| The page's only example shows the attribute and no service definition | "`#[AsMessageHandler]` class SmsHandler { public function __invoke(SmsNotification $message) …" | `docs/.../add-message-handler.md:37-44` | **no** — without a tag or `autoconfigure="true"` the handler is never registered and dispatch throws `NoHandlerForMessageException` |
| Recommended shape is a class with the attribute and a type-hinted `__invoke()` | "the recommended way … a class that has the `AsMessageHandler` attribute and has an `__invoke()` method that's type-hinted with the message class" | `docs/.../concepts/framework/messaging.md:24` | yes — `RotateAppSecretHandler.php:9-29` |
| Messages are synchronous by default; `AsyncMessageInterface` moves handling out of the request | "By default, all messages are handled synchronously. To change the behavior to asynchronously, we have to implement the `AsyncMessageInterface` interface." | `docs/.../add-message-to-queue.md:30` | yes — `framework.yaml:92-95` |
| Dispatch through `MessageBusInterface` on the bus `messenger.default_bus` | "we need to inject the `Symfony\Component\Messenger\MessageBusInterface` … which is called `messenger.default_bus`" | `docs/.../add-message-to-queue.md:60` | yes — the interface is aliased to the single configured bus |
| The handler is called by the `handle_messages` middleware | "A handler gets called once the message is dispatched by the `handle_messages` middleware." | `docs/.../add-message-handler.md:18` | **no** — the id is `handle_message` (singular) |
| `low_priority` only exists from 6.5.7.0 | "Parts of this guide refer to the `low_priority` queue, which is only available in version 6.5.7.0 and above." | `docs/.../add-message-handler.md:13` | not contradicted, but irrelevant at 6.7, where the transport, its env default and the routing line all exist |
| Routing can be overridden per message via `shopware.messenger.routing_overwrite` | "routing_overwrite: 'Your\Custom\Message': low_priority" | `docs/.../add-message-to-queue.md:107-110` | not examined — not admitted to the facts |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The handler example needs no service definition — the attribute suffices | The autoconfigurator runs only on definitions with `isAutoconfigured() === true`; Shopware sets that nowhere and loads plugin service files with no `<defaults>`. A plugin following the example verbatim ships a handler that is never registered, and the message fails at dispatch with `NoHandlerForMessageException`. | `vendor/symfony/dependency-injection/Compiler/AttributeAutoconfigurationPass.php:76-79`; `Framework/Bundle.php:212-224`; `vendor/symfony/messenger/Middleware/HandleMessageMiddleware.php:112-115` |
| The same page says both "mark it with the attribute" and "to register it we have to tag it", without saying whether the tag is an alternative, an addition or a leftover | Both mechanisms are live and additive; core ships both on its own handlers, and `MessageHandlerCompilerPass` exists precisely to merge attribute arguments into a hand-written tag. | `Framework/MessageQueue/MessageHandlerCompilerPass.php:18-41`; `Framework/DependencyInjection/webhook.php:230` |
| The `handle_messages` middleware invokes the handler | No such id exists; it is `handle_message` (service `messenger.middleware.handle_message`), part of Symfony's default `after` stack rather than anything Shopware configures. Shopware's `framework.yaml` contributes only `QueuedTimeMiddleware`. | `vendor/symfony/framework-bundle/DependencyInjection/FrameworkExtension.php:2479-2509`; `Framework/Resources/config/packages/framework.yaml:87-90` |
| The `low_priority` queue's 6.5.7.0 floor is a headline caveat | An operational note for old installs that the code cannot express; at 6.7.13.0 the transport and routing line are present, and what actually decides sync vs async is the marker interface on the message. | `Framework/Resources/config/packages/framework.yaml:4,75,92-95` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The handler is a plain class marked with the PHP attribute `#[AsMessageHandler]` that implements `__invoke(SmsNotification $message)`; no manual service definition is needed. | rewritten | "No manual service definition is needed" is wrong: the attribute is honoured only on autoconfigured definitions, and Shopware marks none. The fact as written teaches a handler that silently never runs. Shape (final class, attribute, `__invoke`) retained and the finality rule added. |
| Classes registered that way are automatically tagged `messenger.message_handler`, and the `handle_messages` middleware is what dispatches a message to its handler(s); several handlers may exist for the same message. | removed | Both halves fail: nothing tags plugin services automatically, and no middleware named `handle_messages` exists (it is `handle_message`). Replaced by the registration requirement in fact 2 and the correct middleware id in fact 3. |
| The handler class lives under the plugin, e.g. `<plugin root>/src/MessageQueue/Handler/SmsHandler.php`; the `low_priority` queue this guide references only exists from Shopware 6.5.7.0, and configuring the messenger to consume it fails on older versions. | removed | The file location is convention the code does not constrain, and the 6.5.7.0 floor carries no weight in a 6.7-pinned case. Replaced by the load-bearing fact the old set missed: the message-side `AsyncMessageInterface` marker is what moves the work out of the request. |
