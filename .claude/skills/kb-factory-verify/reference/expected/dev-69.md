# `dev-69` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-69` · `dev` · `App system` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** How does an app subscribe to an event like `product.written`, what does Shopware POST to the webhook URL, and how do I verify the request is genuine?

**Expected answer — every fact an answer must contain:**

1. The subscription is declared in the manifest as `<webhooks><webhook name="…" url="…" event="product.written"/></webhooks>` (`name`, `url` and `event` are required, `name` unique, `onlyLiveVersion` optional); the app must additionally hold the `product:read` privilege, otherwise the webhook is silently skipped — no message, no log, no delivery.  `[code: Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:42-45]`
2. The POST body is JSON with `data` (`payload` array plus `event`), `source` (at least `url`, `eventId`, `shopId`, `appVersion`) and a top-level `timestamp`; each payload entry carries only `entity`, `operation`, `primaryKey` and `updatedFields` (field names, not values) — no entity data is transmitted, so the app must fetch it over the Admin API.  `[code: Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:50-72]`
3. Authenticity is verified with the `shopware-shop-signature` header: `hash_hmac('sha256', <raw request body>, <the secret the app returned at registration, stored as the app secret>)`. Only the body is signed — not the URL, not a header. Since 6.7.13.0 the secret is resolved at delivery time, so a rotation does not invalidate queued webhooks.  `[code: Framework/App/Hmac/RequestSigner.php:17-32]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/webhook.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `<webhook>` has required name/url/event and optional onlyLiveVersion, no children | `Framework/App/Manifest/Schema/manifest-3.0.xsd:266-271` | `<xs:attribute type="xs:string" name="name" use="required"/> … <xs:attribute type="xs:boolean" name="onlyLiveVersion" default="false"/>` |
| Webhook names are unique per manifest | `Framework/App/Manifest/Schema/manifest-3.0.xsd:80-89` | `<xs:unique name="uniqueWebhookName">` |
| The dispatcher hands hookable events to the WebhookManager after normal dispatch | `Framework/Webhook/WebhookDispatcher.php:26-37` | `if (!HookableEventFactory::isHookable($event)) { return $event; } $this->webhookManager->dispatch($event);` |
| `product.written` is synthesised from the DAL write container per hookable entity | `Framework/Webhook/Hookable/HookableEventFactory.php:64-87` | `$writtenEvent = $event->getEventByEntityName($entity); … $mergedWrittenEvent = $this->writeResultMerger->mergeWriteResults($writtenEvent, $translationEvent);` |
| Only definitions tagged `shopware.entity.hookable` can be subscribed to | `Framework/Webhook/Hookable/HookableEventCollector.php:87-115` | `Dynamically discovers all hookable entities by checking for services tagged with 'shopware.entity.hookable'.` |
| ProductDefinition carries that tag | `Content/DependencyInjection/product.xml:16-19` | `<tag name="shopware.entity.hookable"/>` |
| Each hookable entity yields `<entity>.written` and `<entity>.deleted`, both requiring `<entity>:read` | `Framework/Webhook/Hookable/HookableEventCollector.php:74-82` | `$entityWrittenEventNames[$entity . '.written'] = $privileges;` |
| Missing read permission skips the webhook | `Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:42-45` | `return $permissions->isAllowed($this->event->getEntityName(), AclRoleDefinition::PRIVILEGE_READ);` |
| Body shape: data{payload,event} + source | `Framework/Webhook/Service/WebhookManager.php:279-310` | `$source = ['url' => $this->shopUrl, 'eventId' => Uuid::randomHex()]; … return ['data' => $data, 'source' => $source];` |
| The app Source struct adds shopId, appVersion, optional inAppPurchases | `Framework/App/Payload/Source.php:20-26` | `protected string $url, protected string $shopId, protected string $appVersion, protected ?string $inAppPurchases = null,` |
| Payload entries are entity/operation/primaryKey (+updatedFields, +versionId) | `Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:50-72` | `$result = ['entity' => …, 'operation' => …, 'primaryKey' => …]; … $result['updatedFields'] = array_keys($writeResult->getPayload());` |
| `timestamp` is added at the top level just before encoding | `Framework/App/Payload/AppPayloadServiceHelper.php:70-74` | `$payload['timestamp'] = $timestamp;` |
| POST with Content-Type json, sw-version, and the language headers when known | `Framework/App/Payload/AppPayloadServiceHelper.php:76-94` | `'Content-Type' => 'application/json', 'sw-version' => $shopwareVersion,` |
| The signature is HMAC-SHA256 over the raw body, POST only | `Framework/App/Hmac/RequestSigner.php:17-32` | `return $request->withAddedHeader(self::SHOPWARE_SHOP_SIGNATURE, $this->signPayload($body, $secret));` |
| No secret means no signature header at all | `Framework/App/Payload/AppPayloadServiceHelper.php:101-103` | `if ($secret !== null) { $options[AuthMiddleware::APP_REQUEST_TYPE] = [AuthMiddleware::APP_SECRET => $secret]; }` |
| The secret is re-resolved at delivery time | `Framework/Webhook/Service/WebhookSigningSecretResolver.php:29-40` | `return $this->currentSecret($appId) ?? $this->deletedAppSecret($message->getAppName()) ?? $message->getSecret();` |
| Delivery is async via the message bus unless the admin worker is on or the event is an app lifecycle event | `Framework/Webhook/Service/WebhookManager.php:111-137` | `if ($this->isAdminWorkerEnabled \|\| $event instanceof AppDeletedEvent …` |
| A deactivated app receives only app lifecycle hooks | `Framework/Webhook/Service/WebhookManager.php:326-334` | `// Only app lifecycle hooks can be received if app is deactivated` |
| `onlyLiveVersion="true"` filters payload entries to the live version | `Framework/Webhook/Service/WebhookManager.php:316-324` | `return isset($writeResult['versionId']) && $writeResult['versionId'] === Defaults::LIVE_VERSION;` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The webhook body contains the written entity's data | absent | Only entity, operation, primaryKey, updatedFields (names) and versionId are emitted — `HookableEntityWrittenEvent.php:50-72` |
| The signature covers the URL, a timestamp header or a canonical string | absent | `RequestSigner::signRequest` hashes the body alone; the timestamp is inside that body — `RequestSigner.php:23-31` |
| Shopware verifies the app's HTTP response to a webhook | absent | `validated_response` is not set for webhook calls, only `app_secret` — `AppPayloadServiceHelper.php:101-103`; `Hmac/Guzzle/AuthMiddleware.php:67-71` |
| Any entity can be subscribed to via `<entity>.written` | absent | Only definitions tagged `shopware.entity.hookable` produce hookable events — `HookableEventFactory.php:67`; `HookableEventCollector.php:92-115` |
| A missing permission produces an error the app can see | absent | `createWebhookMessage` returns null; the webhook is skipped with no message, log or delivery record — `WebhookManager.php:239-241` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — functional tests are stripped from the dist package._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `onlyLiveVersion="true"` on a non-versioned event stopped all deliveries; the issue body carries a real delivered payload matching data/source/timestamp | reported 6.6.9.0, fixed for 6.7.0.0 | closed | https://github.com/shopware/shopware/issues/7858 |
| 6.7.13.0 resolves the HMAC signing secret at delivery time instead of at queue time, so deliveries spanning a secret rotation are no longer signed with a stale secret | 6.7.13.0 | merged | https://developer.shopware.com/release-notes/6.7/6.7.13.0.html |
| Epic "Webhooks Dispatching Rework": webhooks share the `async` queue, ordering not guaranteed, retry ladder 1s/2s/4s, dead after 10 errors; rework behind flag `WEBHOOKS_REWORK`, default off | 6.7 trunk | open | https://github.com/shopware/shopware/issues/16555 |
| Spurious `shopware.updated` deliveries / errors on order state change with registered webhooks | 6.6/6.7 | open | https://github.com/shopware/shopware/issues/11340 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Exact JSON body and `source` sub-keys | code | data{payload,event} + source{url,eventId,shopId,appVersion,[inAppPurchases]} + timestamp — `WebhookManager.php:279-310`, `Source.php:20-26`. Fact 2. |
| Which header carries the signature, and over what | code | `shopware-shop-signature`, HMAC-SHA256 of the raw body — `RequestSigner.php:17-32`. Fact 3. |
| Does the dispatcher resolve the secret at delivery time (the 6.7.13.0 fix)? | code | Yes — `WebhookSigningSecretResolver.php:29-40`. Folded into fact 3. |
| Does `product.written` need an allow-list? | code | Yes, effectively: only `shopware.entity.hookable`-tagged definitions produce the event, and ProductDefinition carries the tag — `HookableEventCollector.php:87-115`, `product.xml:16-19`. Fact 1. |
| Is `WEBHOOKS_REWORK` on by default in 6.7.13.0? | unsettled | Both dispatch paths ship; the flag is read at runtime. It adds `X-Shopware-*` headers and `source.sequence` but changes none of the three facts, which state the body's required keys, not an exhaustive set. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Webhooks are declared as `<webhook name url event>` in the manifest | `<webhook name="product-changed" url="…" event="product.written"/>` | `snippets/config/app/webhooks.xml` | yes — `manifest-3.0.xsd:266-271` |
| Webhook names must be unique | "keep in mind that the name needs to be unique" | `resources/references/app-reference/manifest-reference.md` | yes — `manifest-3.0.xsd:80-89` |
| The body has top-level `data`, `source` and `timestamp` | example payload | `guides/plugins/apps/lifecycle/webhook.md` | yes — `WebhookManager.php:279-310`, `AppPayloadServiceHelper.php:70-74` |
| `entity.written` payloads carry only the id, so the app must fetch data via the API | "the entity in the payload is characterized by its id, stored under `primaryKey`" | same | yes — `HookableEntityWrittenEvent.php:50-72` |
| Authenticity is verified via `shopware-shop-signature`, a SHA256 HMAC of the request body | "Every request should have a SHA256 HMAC of the request body that is signed with the secret your app assigned the shop during the registration" | same | yes — `RequestSigner.php:17-32` |
| Apps need read permissions for the entities in subscribed webhooks | "your app needs read permissions for the entities contained in the subscribed webhooks" | `guides/plugins/apps/lifecycle/app-registration-setup.md` | yes — `HookableEntityWrittenEvent.php:42-45` |
| `timestamp` can be used to reject replayed requests | "If the timestamp is too old, your app should reject the request." | `webhook.md` | yes as a description of app-side behaviour — Shopware only emits the value |
| `onlyLiveVersion` is only checked for `HookableEntityWrittenEvent` | "For other events, the option is ignored." | same | yes — `WebhookManager.php:316-324` |
| `product.written` requires `product:read` | events reference table | `resources/references/app-reference/webhook-events-reference.md` | yes — `HookableEventCollector.php:74-82` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `app-signature-verification.md` says outgoing requests are signed "with your app secret", `webhook.md` says with the per-shop `shop-secret` | One value: the secret the app returned at registration is stored as the app secret and signs the webhook body | `Framework/App/Hmac/RequestSigner.php:17-32`; `Framework/Webhook/Service/WebhookSigningSecretResolver.php:29-40` |
| `webhook-events-reference.md` documents the `product.written` payload as `{entity, operation, primaryKey, payload}` | The emitted key is `updatedFields` (a list of field names), never `payload` inside an entry | `Framework/Webhook/Hookable/HookableEntityWrittenEvent.php:50-72` |
| The docs describe webhook events generally, implying any entity event can be subscribed to | Only entities whose definition carries the `shopware.entity.hookable` tag produce an event at all; a webhook on an untagged entity never fires | `Framework/Webhook/Hookable/HookableEventCollector.php:87-115` |
| The docs do not state what happens when the permission is missing | The webhook is silently skipped — no message, no log, no delivery record | `Framework/Webhook/Service/WebhookManager.php:239-241` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Webhooks are declared in the manifest as `<webhooks><webhook name="..." url="..." event="product.written"/></webhooks>`. | rewritten | Confirmed by the XSD, but incomplete: the code shows the `<entity>:read` privilege is load-bearing — without it the webhook is silently skipped, which decides whether an answer is usable. |
| The payload has the three top-level properties `data`, `source` and `timestamp`, and for `entity.written` events `payload` carries only `primaryKey`, so the app must fetch the entity from the API itself. | rewritten | Confirmed and made precise: entries carry `entity`, `operation`, `primaryKey` and `updatedFields` (names only), and `source` carries url, eventId, shopId and appVersion. |
| Authenticity is verified with the `shopware-shop-signature` header, a SHA256 HMAC of the request body signed with the app secret. | rewritten | Confirmed; clarified that the signing key is the secret the app returned at registration (stored as the app secret), that only the body is covered, and that 6.7.13.0 resolves it at delivery time. |
