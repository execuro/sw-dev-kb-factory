# `dev-60` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-60` · `dev` · `Hosting & ops` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** Which transports do my Shopware message queue workers have to consume in production, and how do I turn off the admin worker?

**Expected answer — every fact an answer must contain:**

1. Production runs one or more supervised CLI workers (`systemd`/`supervisor`, with `--time-limit`/`--memory-limit`) and every transport must be named explicitly on the command line — `bin/console messenger:consume async low_priority`; in 6.7 nothing appends `low_priority` implicitly, and a worker consumes exactly the receivers it is given. `[code: Framework/Resources/config/packages/framework.yaml:57-93]` `[code: Framework/MessageQueue/Middleware/RoutingOverwriteMiddleware.php:25-46]` `[code: Framework/MessageQueue/Api/ConsumeMessagesController.php:52-83]`
2. Disable the admin worker with `shopware.admin_worker.enable_admin_worker: false` in `config/packages/shopware.yaml` (it defaults to `true`); once it is off a separate `bin/console scheduled-task:run` process is mandatory, because `TaskScheduler::queueScheduledTasks()` is reached only from that command or from the `/api/_action/scheduled-task/run` route that only the admin worker JS calls — without it no scheduled task is ever queued, no matter how many transports the workers consume. `[code: Framework/DependencyInjection/Configuration.php:232-256]` `[code: Framework/Resources/config/packages/shopware.yaml:385-392]` `[code: Framework/MessageQueue/Command/ScheduledTaskRunner.php:46-70]` `[code: Framework/MessageQueue/Api/ScheduledTaskController.php:24-30]`
3. `failed` is the registered `framework.messenger.failure_transport`, a dead-letter target drained with `messenger:failed:retry` / `:show` / `:remove` — not a transport a standing worker consumes. A message that exhausts `async`'s `max_retries: 3` is **moved to `failed`, not deleted**; the only discard is a message that fails again while being consumed from `failed` itself. `[code: Framework/Resources/config/packages/framework.yaml:57-82]` `[code: symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:37-74]`

**Note on `webhook` (6.7 only):** 6.7 registers a fourth transport `webhook` (`shopware-webhook://default`, `max_retries: 0`) and routes `WebhookEventMessage` to it unconditionally, but with `WEBHOOKS_REWORK` off (the default) `WebhookTransport::send()` forwards the envelope to `async` and `get()` returns `[]`, so a CLI worker must **not** be given `webhook`. It becomes mandatory only when that flag is switched on. An answer that names `webhook` for a default 6.7 install is wrong. `[code: Framework/Webhook/Transport/WebhookTransport.php:50-63,86-88]` `[code: Framework/Api/Controller/InfoController.php:256-271]`

**Official reference URL:** https://developer.shopware.com/docs/guides/hosting/infrastructure/message-queue.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| 6.7 ships four transports: `failed`, `async` (`max_retries: 3`), `low_priority`, `webhook` (`shopware-webhook://default`, `max_retries: 0`) | `Framework/Resources/config/packages/framework.yaml:65-86` | `webhook:\n    dsn: 'shopware-webhook://default'\n    retry_strategy:\n        max_retries: 0` |
| Routing: `AsyncMessageInterface` → `async`, `LowPriorityMessageInterface` → `low_priority`, `WebhookEventMessage` → `webhook` (no flag guard) | `Framework/Resources/config/packages/framework.yaml:83-96` | `routing:\n    'Shopware\Core\Framework\Webhook\Message\WebhookEventMessage': webhook` |
| Flag OFF the `webhook` transport is a pass-through: `send()` forwards to the async transport, `get()` returns `[]`; `WEBHOOKS_REWORK` defaults to false | `Framework/Webhook/Transport/WebhookTransport.php:50-63,86-88`; `Framework/Resources/config/packages/feature.yaml:104-108` | `if (!$this->outboxOwnsLifecycle()) {\n    return $this->asyncTransport->send($envelope);\n}` · `return Feature::isActive('WEBHOOKS_REWORK');` |
| Core itself strips `webhook` from the admin-worker transport list while the flag is inactive | `Framework/Api/Controller/InfoController.php:256-271` | `return array_values(array_filter($transports, static fn (string $transport): bool => $transport !== 'webhook'));` |
| `failed` is the global failure transport; the terminal failure re-sends the envelope to the `failed` sender with `SentToFailureTransportStamp` | `Framework/Resources/config/packages/framework.yaml:57-58`; `symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:62-73` | `failure_transport: failed` · `$failureSender->send($envelope);` |
| Only a failure raised while consuming `failed` itself is dropped (listener early-return) | `symfony/messenger EventListener/SendFailedMessageToFailureTransportListener.php:56-58` | `if (($this->failureTransportsByName[$event->getReceiverName()] ?? null) === $event->getReceiverName()) { return; }` |
| `messenger:failed:retry/show/remove` are wired to `failed` because `failure_transport` is set | `symfony/framework-bundle DependencyInjection/FrameworkExtension.php:2698-2706` | `->replaceArgument(0, $config['failure_transport']);` |
| Shipped admin-worker default: worker on, `transports: ["webhook", "async", "low_priority"]`, `poll_interval: 20`; `enable_admin_worker` defaults to `true` in the config tree | `Framework/Resources/config/packages/shopware.yaml:385-392`; `Framework/DependencyInjection/Configuration.php:232-256` | `->booleanNode('enable_admin_worker')->defaultValue(true)` |
| `queueScheduledTasks()` has exactly two callers: the `scheduled-task:run` command and the API route driven only by the admin worker JS | `Framework/MessageQueue/Command/ScheduledTaskRunner.php:46-70`; `Framework/MessageQueue/Api/ScheduledTaskController.php:24-30`; `administration .../app/init-post/worker.init.ts:59-61` | `while (!$this->shouldStop) { $this->scheduler->queueScheduledTasks();` · `if (context.config.adminWorker?.enableAdminWorker && !enabled) {` |
| A worker consumes exactly the receivers named: `RoutingOverwriteMiddleware` is send-side only; `ConsumeMessagesController` takes one receiver per call; the admin JS iterates the configured list verbatim | `Framework/MessageQueue/Middleware/RoutingOverwriteMiddleware.php:25-46`; `Framework/MessageQueue/Api/ConsumeMessagesController.php:52-83`; `administration .../core/worker/admin-worker.js:77-79` | `$worker = new Worker([$this->defaultTransportName => $receiver], …);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A production worker must also be set up for the `failed` transport | absent | `failed` is in no shipped transport list; grepping `vendor/shopware` (core, storefront, administration, deployment-helper) for `messenger:consume` and `messenger:failed` returns zero hits. Intended drain is `messenger:failed:*`. `Framework/Resources/config/packages/shopware.yaml:392`; `symfony/framework-bundle .../FrameworkExtension.php:2698-2706` |
| Something implicitly adds `low_priority` to a worker's consumed transports | absent | Outside YAML, `low_priority` occurs once in `vendor/shopware` — an OpenAPI schema example at `Framework/Api/ApiDefinition/Generator/Schema/AdminApi/paths/config.json:31`. No compiler pass, command or middleware touches a worker's receiver list. |
| A message that exhausts `max_retries` on `async` is deleted | absent | No delete path. `SendFailedMessageForRetryListener` only logs on terminal failure; `SendFailedMessageToFailureTransportListener:37-74` then sends the envelope to the `failed` sender. |
| Disabling the admin worker still leaves an in-process mechanism queueing scheduled tasks | absent | `TaskScheduler::queueScheduledTasks()` has only two callers (`ScheduledTaskRunner.php:49,69`; `ScheduledTaskController.php:27`). No kernel subscriber, no request listener. |
| Core prescribes or ships a production worker command line | absent | No `messenger:consume` anywhere in `vendor/shopware/core` or `vendor/shopware/deployment-helper/src`; `UpgradeManager.php:87` runs only `scheduled-task:register`. |
| `shopware.admin_worker.enable_admin_worker` defaults to false in 6.7 | absent | Both the config tree and the shipped `shopware.yaml` set it to `true`. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Flag OFF: the webhook transport persists the outbox row and forwards to `async` — the async worker does the delivery | `shopware/shopware@trunk (ee66a4c) tests/unit/Core/Framework/Webhook/Transport/WebhookTransportTest.php:26-49` |
| Flag ON: `send()` does not forward to async and `get()` delegates to `MySQLWebhookReceiver` — the `webhook` transport is then the only drain | `shopware/shopware@trunk tests/unit/Core/Framework/Webhook/Transport/WebhookTransportTest.php:51-66,78-104` |
| End-to-end: flag OFF requires a worker pass on `async`; same dispatch contract under both flag states | `shopware/shopware@trunk tests/integration/Core/Framework/Webhook/WebhookDispatchEndToEndTest.php` |
| Admin-worker-enabled dispatch delivers inline and enqueues nothing | `shopware/shopware@trunk tests/integration/.../WebhookDispatchEndToEndTest.php (testSyncPathDeliversWithinDispatch…)` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Changelog: up to 6.6 `low_priority` was added to workers automatically; from 6.7 it must be named explicitly | 6.5.7.0 changelog, change lands in 6.7 | merged | https://github.com/pickware/shopware-platform/blob/master/changelog/release-6-5-7-0/2023-10-23-add-new-async-low-priority-queue.md |
| Practitioner blog: "the CLI worker has to be set up for the failed queue as well" | 6.7 | open | https://www.xictron.com/en/blog/shopware-message-queue-workers-production/ |
| Hosting KBs: `enable_admin_worker: false`, after which scheduled tasks also need a CLI runner | 6.6 / 6.7 | open | https://knowledge.maxcluster.de/en/disable-admin-worker-in-shopware-6 |
| SAVEPOINT errors when indexing messages run in parallel with other transports | 6.6/6.7 era | open | https://github.com/shopware/shopware/issues/14569 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does any 6.7 path implicitly append `low_priority`? | deep code pass Q5 | No. Must be named explicitly — fact 1. |
| Which transports are registered in 6.7? | code lane | Four: `failed`, `async`, `low_priority`, `webhook`. |
| Which node disables the admin worker, and its defaults? | code lane | `shopware.admin_worker.enable_admin_worker`, default `true`; `poll_interval: 20`; shipped transports `["webhook","async","low_priority"]`. |
| With the admin worker off, does anything still queue scheduled tasks? | deep code pass Q6 | No — `scheduled-task:run` is mandatory (fact 2). |
| Is `failed` consumable / included in the worker list? | deep code pass Q4 | Mechanically consumable but a discard path; in no shipped list; drained with `messenger:failed:*` (fact 3). |
| Must a worker consume `webhook` in a default 6.7 install? | deep code pass Q1/Q2 | No while `WEBHOOKS_REWORK` is off; mandatory when on. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| CLI worker is the production method; `async` and `low_priority` are the transports | `bin/console messenger:consume async low_priority` | `guides/hosting/infrastructure/message-queue.md` | yes (transport/routing config; core prescribes no command line itself) |
| A worker must also be set up for the failed queue | "Make sure to set up the CLI worker also for the failed queue. Otherwise, failed messages will not be processed." | `guides/hosting/infrastructure/message-queue.md` | **no — disproved** |
| Admin worker is turned off in `shopware.yaml` | "you should turn off the admin worker in the Shopware configuration file" | `guides/hosting/infrastructure/message-queue.md` | yes |
| Each configured transport must be listed under `shopware.admin_worker.transports` | "you have to specify each transport that was previously configured" | `guides/hosting/infrastructure/message-queue.md` | yes |
| Admin-worker example lists exactly two transports | `transports: ["async", "low_priority"]` | `guides/hosting/infrastructure/message-queue.md` | partly — shipped default is three (`webhook` first), stripped again unless the flag is on |
| Three messenger DSN env vars out of the box | `MESSENGER_TRANSPORT_DSN`, `…_LOW_PRIORITY_DSN`, `…_FAILURE_DSN` | `guides/hosting/infrastructure/message-queue.md` | yes, but `webhook` is a fourth transport with no env var |
| Retried 3 times, then deleted | "The messages are retried automatically 3 times. If the message fails again, it will be deleted." | `guides/hosting/infrastructure/message-queue.md` | **no — retained on `failed`** |
| `AsyncMessageInterface` routes to `async` | — | `guides/hosting/infrastructure/message-queue.md` | yes |
| `scheduler_shopware` transport may be consumed for scheduled tasks | `bin/console messenger:consume scheduler_shopware` | `guides/hosting/infrastructure/scheduled-task.md` | no — `ScheduleProvider` is `@experimental stableVersion:v6.8.0`, in no shipped list |
| Non-scheduler alternative is a separate `scheduled-task:run` process | "you must set up a background worker … and run the command `bin/console scheduled-task:run`" | `guides/hosting/infrastructure/scheduled-task.md` | yes |
| With `WEBHOOKS_REWORK` on, operators must add `webhook` to the consume command; flag defaults off and forwards to `async` | "Flag-off forwards to `async` … flag-on consumes from the outbox." | `resources/references/adr/2026-04-14-webhook-outbox-transport.md` | yes |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| "Make sure to set up the CLI worker also for the failed queue. Otherwise, failed messages will not be processed." | `failed` is the registered failure transport and appears in no shipped worker list; nothing in `vendor/shopware` invokes `messenger:consume` or `messenger:failed:*`. Symfony wires `messenger:failed:retry/show/remove` to it. A standing `messenger:consume failed` worker is a discard path — a second failure there drops the message. | `Framework/Resources/config/packages/shopware.yaml:392`; `symfony/framework-bundle .../FrameworkExtension.php:2698-2706`; `symfony/messenger .../SendFailedMessageToFailureTransportListener.php:56-58` |
| "The messages are retried automatically 3 times. If the message fails again, it will be deleted." | The envelope is re-sent to the `failed` transport (`SentToFailureTransportStamp` + `DelayStamp(0)` + `RedeliveryStamp(0)`); the retry listener only logs. Deletion happens only for a message failing while consumed from `failed` itself. | `symfony/messenger .../SendFailedMessageToFailureTransportListener.php:37-74`; `.../SendFailedMessageForRetryListener.php:60-83` |
| Admin-worker example: `transports: ["async", "low_priority"]` | Shipped default is `["webhook", "async", "low_priority"]` with `webhook` first so inline admin-worker retries drain; `InfoController` filters `webhook` out unless `WEBHOOKS_REWORK` is active. | `Framework/Resources/config/packages/shopware.yaml:385-392`; `Framework/Api/Controller/InfoController.php:256-271` |
| Only three transports / three DSN env vars exist | Four transports are registered; `webhook` uses the in-house DSN `shopware-webhook://default` with `max_retries: 0` and has no env var. | `Framework/Resources/config/packages/framework.yaml:65-86` |
| Docs prescribe the production worker command line | Core prescribes none — no `messenger:consume` anywhere in `vendor/shopware`; the transport set is derivable only from the transport/routing config. | `vendor/shopware/core`, `vendor/shopware/deployment-helper/src` (grep, 0 hits) |
| `scheduler_shopware` can be consumed to run scheduled tasks | `ScheduleProvider` is registered but marked `@experimental stableVersion:v6.8.0 feature:SYMFONY_SCHEDULER` and is in no shipped transport list — not the supported 6.7 answer. | `Framework/MessageQueue/ScheduledTask/SymfonyBridge/ScheduleProvider.php:16-19` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Production runs one or more CLI workers supervised by `systemd` or `supervisor`, consuming both transports: `bin/console messenger:consume async low_priority`, with `--time-limit` and `--memory-limit` (e.g. `--time-limit=60 --memory-limit=128M`). | kept, tightened | Code confirms the transports, and adds the load-bearing point the old text left implicit: in 6.7 nothing appends `low_priority` implicitly and a worker consumes exactly the named receivers. |
| Once CLI workers exist, disable the admin worker in `config/packages/shopware.yaml` with `shopware.admin_worker.enable_admin_worker: false`; the admin worker is not recommended for production because of CPU load and PHP-FPM interference. | kept, extended | Setting confirmed (default `true`). Added the mandatory second process: with the admin worker off, `scheduled-task:run` is the only remaining caller of `queueScheduledTasks()`. |
| A worker must also be set up for the failed transport (`MESSENGER_TRANSPORT_FAILURE_DSN`) or failed messages are never processed; failed messages retry 3 times and are then deleted. The default Doctrine transport stores messages in the database and is not recommended for production. | replaced | Both assertions are disproved. `failed` is in no shipped transport list and is drained with `messenger:failed:*`; a standing worker on it is a discard path. An exhausted message is moved to `failed`, not deleted. |
