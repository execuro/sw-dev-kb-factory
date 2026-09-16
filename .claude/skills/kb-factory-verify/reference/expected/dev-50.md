# `dev-50` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-50` · `dev` · `Core breaking changes` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0921-42-51` |
| Core version | `6.7.13.0` |

**Query:** My `ScheduledTaskHandler` stopped running after the upgrade — how must a scheduled task and its handler be declared in Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. The task class extends `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTask` and implements its two **static** abstract methods `getTaskName(): string` and `getDefaultInterval(): int` (seconds); the base constructor is `final` and empty, so a task class can take no constructor arguments.  `[code: Framework/MessageQueue/ScheduledTask/ScheduledTask.php:36-42, :18-25]`
2. The handler extends `Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler`, carries the class-level attribute `#[AsMessageHandler(handles: ExampleTask::class)]` and implements `run(): void`, which takes no arguments. There is no `getHandledMessages()`; `TaskRunner` resolves the handler solely by reading the `handles` value off `#[AsMessageHandler]`, and silently skips a handler that lacks the attribute — the task then never runs.  `[code: Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:54; Checkout/Cart/Cleanup/CleanupCartTaskHandler.php:16-18; Framework/MessageQueue/ScheduledTask/Scheduler/TaskRunner.php:54-77]`
3. Both services carry a tag: the task `shopware.scheduled.task` (also added automatically by autoconfiguration to any class extending `ScheduledTask`), the handler `messenger.message_handler`, with `scheduled_task.repository` and `logger` as its first two constructor arguments. In 6.7 the handler tag is load-bearing beyond messenger: `ScheduledTaskExecutorCompilerPass` scans services with that tag whose class subclasses `ScheduledTaskHandler` and injects the `ScheduledTaskExecutor` via `setScheduledTaskExecutor()`; without it `__invoke()` falls back to the deprecated inline path and, once the `v6.8.0.0` flag is active, throws `MessageQueueException::scheduledTaskExecutorNotSet`.  `[code: Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29-38; Framework/DependencyInjection/scheduled-task.xml:27-32; Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:26-30, :32-43]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Task base class forces two static methods | `Framework/MessageQueue/ScheduledTask/ScheduledTask.php:36-42` | `abstract public static function getTaskName(): string;` … `abstract public static function getDefaultInterval(): int;` |
| Task constructor is final and empty | `Framework/MessageQueue/ScheduledTask/ScheduledTask.php:18-25` | `final public function __construct()` |
| Task is an async message | `Framework/MessageQueue/ScheduledTask/ScheduledTask.php:10`; `Framework/Resources/config/packages/framework.yaml:94` | `implements ScheduledTaskMessageInterface, AsyncMessageInterface` |
| `shopware.scheduled.task` feeds `TaskRegistry` | `Framework/DependencyInjection/scheduled-task.xml:27-32` | `<argument type="tagged_iterator" tag="shopware.scheduled.task" />` |
| That tag is autoconfigured for `ScheduledTask` subclasses | `Framework/DependencyInjection/CompilerPass/AutoconfigureCompilerPass.php:88-90` | `->registerForAutoconfiguration(ScheduledTask::class)->addTag('shopware.scheduled.task');` |
| Handler constructor and abstract `run()` | `Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:26-30,54` | `protected EntityRepository $scheduledTaskRepository, protected readonly LoggerInterface $exceptionLogger` … `abstract public function run(): void;` |
| Core handler shape | `Checkout/Cart/Cleanup/CleanupCartTaskHandler.php:16-18,32-35` | `#[AsMessageHandler(handles: CleanupCartTask::class)]` |
| Both tags side by side in a core service file | `Checkout/DependencyInjection/cart.xml:34-44` | task `<tag name="shopware.scheduled.task"/>`; handler `<tag name="messenger.message_handler"/>` with `scheduled_task.repository` and `logger` |
| 6.7 executor injection keys off the handler tag | `Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29-38` | `findTaggedServiceIds('messenger.message_handler')` … `is_subclass_of($class, ScheduledTaskHandler::class)` … `addMethodCall('setScheduledTaskExecutor', [$executor])` |
| Missing executor → deprecated fallback, throws under the 6.8 flag | `Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:32-43` | `if (Feature::isActive('v6.8.0.0')) { throw MessageQueueException::scheduledTaskExecutorNotSet(static::class); }` |
| The deprecation names the required registration | `Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:158-168`; `Framework/MessageQueue/MessageQueueException.php:139` | `Register the handler as a "messenger.message_handler" service so the "%s" can inject the executor.` |
| Handler resolution is by `#[AsMessageHandler]` `handles:` | `Framework/MessageQueue/ScheduledTask/Scheduler/TaskRunner.php:54-77` | `$asMessage = $reflection->getAttributes(AsMessageHandler::class); if ($asMessage === []) { continue; }` |
| Task rows are deleted when the class is no longer tagged | `Framework/MessageQueue/ScheduledTask/Registry/TaskRegistry.php:129-163` | `if ($this->taskClassStillAvailable($registeredTask)) { continue; } $deletionPayload[] = …` |
| Tagged service not extending `ScheduledTask` throws | `Framework/MessageQueue/ScheduledTask/Registry/TaskRegistry.php:108-110` | `throw MessageQueueException::missingExtends($task::class);` |
| Dynamic scheduling replaces `rescheduleTask()` | `Framework/MessageQueue/ScheduledTask/ScheduledTaskExecutor.php:93-98` | `if ($handler instanceof DynamicallyScheduledTaskHandler) { … $handler->getNextExecutionTime($task, $taskEntity) …` |
| `markTaskRunning()`, `markTaskFailed()`, `rescheduleTask()` deprecated for 6.8 | `Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:78-114` | `@deprecated tag:v6.8.0 - will be removed, the task state transitions are handled by the {@see ScheduledTaskExecutor}` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `public static function getHandledMessages(): iterable` on a handler | absent | no such method anywhere under `vendor/shopware/`; only `CountHandledMessagesListener::getHandledMessages(): int`, an unrelated counter (`Framework/MessageQueue/Subscriber/CountHandledMessagesListener.php:30`) |
| `ScheduledTaskHandler` is autoconfigured to `messenger.message_handler` by Shopware | absent | `AutoconfigureCompilerPass.php:88-90` registers autoconfiguration for the task only; core handlers all carry the explicit tag |
| `run()` receives the task as an argument | absent | signature is `run(): void`; the task instance reaches only `__invoke()`/the executor (`ScheduledTaskHandler.php:54`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The executor is injected only into `messenger.message_handler` services subclassing `ScheduledTaskHandler` | `tests/unit/Core/Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPassTest.php` @ v6.7.13.0 (`testInjectsExecutorIntoScheduledTaskHandlers`) |
| Other handlers are left untouched by the pass | same file (`testIgnoresHandlersThatAreNotScheduledTaskHandlers`) |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| 6.7.13.0 release notes: orchestration moved from `__invoke()` into `ScheduledTaskExecutor`, injected via a new compiler pass into handlers tagged `messenger.message_handler` | 6.7 | merged | https://developer.shopware.com/release-notes/6.7/6.7.13.0.html |
| UPGRADE-6.6 records the removal of `getHandledMessages()` in favour of `#[AsMessageHandler]` | 6.6 | merged | https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.6.md |
| Forum: `run()` never fired because the `AsMessageHandler` `use` import was missing, so the attribute did nothing despite the tag | 6.6 | closed | https://forum.shopware.com/t/6-6-4-scheduled-task-run-method-will-nicht-ausfuehren/104588 |
| Forum: task not executing; replies point at the two required tags | unclear | open | https://forum.shopware.com/t/problem-with-scheduled-task-in-my-plugin/87934 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `getHandledMessages()` still exist in 6.7? | code lane | No — absent from the whole vendor tree |
| Exact required subclass signature and constructor arguments | code lane | `run(): void`; `(EntityRepository $scheduledTaskRepository, LoggerInterface $exceptionLogger)` |
| Is `#[AsMessageHandler]` required, or is the tag alone enough? | code lane | Both are needed: `TaskRunner.php:54-77` skips handlers without the attribute, `ScheduledTaskExecutorCompilerPass.php:29-38` keys off the tag |
| Does `ScheduledTaskExecutorCompilerPass` exist and what does it require? | code lane | Yes — the `messenger.message_handler` tag plus a `ScheduledTaskHandler` subclass; injects via `setScheduledTaskExecutor()` |
| Does `__invoke()` deprecate the no-executor path, and for which version? | code lane | Yes — deprecated inline path, throws once `v6.8.0.0` is active |
| Does `DynamicallyScheduledTaskHandler::getNextExecutionTime()` exist? | code lane | Yes — `ScheduledTaskExecutor.php:93-98`, replacing `rescheduleTask()` |
| Is `shopware.scheduled.task` still the registration tag, and are the task methods still static? | code lane | Yes to both |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Both tags required: `shopware.scheduled.task` and `messenger.message_handler` | "Note the tags required for both the task and its respective handler" | add-scheduled-task.md:55 | yes — `scheduled-task.xml:27-32`, `cart.xml:34-44` |
| Handler tagged in `services.php` with `scheduled_task.repository` and `logger` args | see quote | add-scheduled-task.md:46-51 | yes — `ScheduledTaskHandler.php:26-30`, `cart.xml:34-44` |
| Handler carries `#[AsMessageHandler(handles: ExampleTask::class)]` and extends `ScheduledTaskHandler` | see quote | add-scheduled-task.md:113 | yes — `CleanupCartTaskHandler.php:16-18`, `TaskRunner.php:54-77` |
| Task extends `ScheduledTask`, forced to implement two methods | see quote | add-scheduled-task.md:87 | yes — `ScheduledTask.php:36-42` (the page does not say they are `static`) |
| Handler implements `run()` | "This method is executed when the scheduled task runs." | add-scheduled-task.md:115 | yes — `ScheduledTaskHandler.php:54` |
| Tasks registered on install/update, or via `bin/console scheduled-task:register` | see quote | add-scheduled-task.md:162-163 | not examined by the code lane |
| Default reschedule is `nextExecutionTime + runInterval`, capped to now | see quote | add-scheduled-task.md:125 | not examined by the code lane |
| Since 6.7.13.0, `DynamicallyScheduledTaskHandler::getNextExecutionTime()` runs after `run()`, `null` falls back to the interval | see quote | add-scheduled-task.md:158 | partly — the interface and its call site are confirmed (`ScheduledTaskExecutor.php:93-98`); the null/past-time semantics were not examined |
| Handlers are classes with `#[AsMessageHandler]` and an `__invoke()` typed on the message | see quote | messaging.md:24 | contradicted for scheduled tasks — the subclass implements `run(): void`; `__invoke(ScheduledTask $task)` is the base class's |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The docs never mention that `getHandledMessages()` was removed, so a reader upgrading a 6.4/6.5 handler gets no cause for the failure the query describes | The method does not exist anywhere in the tree; `TaskRunner` resolves handlers only through `#[AsMessageHandler]`'s `handles` | `Framework/MessageQueue/ScheduledTask/Scheduler/TaskRunner.php:54-77` |
| The docs treat `messenger.message_handler` purely as messenger registration | In 6.7 the tag is also what `ScheduledTaskExecutorCompilerPass` scans to inject the executor; missing it degrades to a deprecated path that throws from 6.8 | `Framework/DependencyInjection/CompilerPass/ScheduledTaskExecutorCompilerPass.php:29-38`; `ScheduledTaskHandler.php:32-43` |
| The concept page presents `__invoke()` typed on the message as the recommended handler shape | A scheduled-task handler must implement `run(): void`; `__invoke(ScheduledTask $task)` is `final`-path base-class logic it must not replace | `Framework/MessageQueue/ScheduledTask/ScheduledTaskHandler.php:32-43,54` |
| The docs say the task class is "forced to implement two methods" without stating they are static | Both are `abstract public static` | `Framework/MessageQueue/ScheduledTask/ScheduledTask.php:36-42` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `The handler extends \`Shopware\Core\Framework\MessageQueue\ScheduledTask\ScheduledTaskHandler\`, carries \`#[AsMessageHandler(handles: ExampleTask::class)]\` and implements \`run(): void\`.` | rewritten | kept and confirmed; extended with the absence of `getHandledMessages()` and with `TaskRunner`'s silent skip, which is the actual cause of "stopped running" |
| `Task and handler need two different DI tags — the task \`shopware.scheduled.task\`, the handler \`messenger.message_handler\` — and the handler is constructed with \`service('scheduled_task.repository')\` and \`service('logger')\`.` | rewritten | confirmed, plus the 6.7-specific reason the handler tag is mandatory (`ScheduledTaskExecutorCompilerPass`) and the autoconfiguration of the task tag |
| `The task class implements \`getTaskName(): string\` (vendor-prefixed, e.g. \`swag.example_task\`) and \`getDefaultInterval(): int\` in seconds; re-register without reinstalling via \`bin/console scheduled-task:register\`.` | rewritten | the methods are confirmed but are `static`, which the old fact omitted; "vendor-prefixed, e.g. `swag.example_task`" is a naming convention no lane evidenced, and the `scheduled-task:register` command was verified by no lane — both removed rather than carried unbacked. Replaced by the `final` empty constructor, which the code shows is load-bearing (a task cannot take constructor arguments) |
