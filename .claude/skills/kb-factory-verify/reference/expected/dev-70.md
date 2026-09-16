# `dev-70` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-70` · `dev` · `App system` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** How do I implement a payment method in an app with `pay-url` and `finalize-url`, and what must the app server return in Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. The method is declared as `<payments><payment-method>` in `manifest.xml`, where only `identifier` and `name` are mandatory and `pay-url`, `finalize-url`, `validate-url`, `refund-url`, `recurring-url` are all optional. There is no separate synchronous and asynchronous handler class: every app payment method is served by the one core `AppPaymentHandler`, and a finalize step happens only when the app's pay response carried a `redirectUrl` (`PaymentProcessor` nulls the payment token only for a `RedirectResponse`). Calling finalize when no `finalize-url` is declared throws `AppException::interrupted('Finalize URL not defined')`; with no `pay-url`, `pay()` does nothing and the transaction stays `open`. `[code: Framework/App/Manifest/Schema/manifest-3.0.xsd:520-538, Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:57-60, Framework/App/Payment/Handler/AppPaymentHandler.php:119-157, Checkout/Payment/PaymentProcessor.php:93-111]`
2. Shopware POSTs the JSON `PaymentPayload` (`source`, `orderTransaction`, `order`, `requestData`, `returnUrl`, `validateStruct`, `recurring`) to both URLs, signed with the app secret and with a 20-second timeout; the app's **response** must itself carry a `shopware-app-signature` header — an HMAC-SHA256 of the response body with the app secret — or the request fails verification. The body is decoded into `PaymentResponse`, which recognises exactly three keys: `status`, `redirectUrl` and `message`; a non-empty `message` aborts the payment with `AppException::interrupted`. `[code: Framework/App/Payment/Payload/Struct/PaymentPayload.php:21-37, Framework/App/Payment/Payload/PaymentPayloadService.php:22,44-53, Framework/App/Payload/AppPayloadServiceHelper.php:147-155, Framework/App/Hmac/Guzzle/AuthMiddleware.php:73-82, Framework/App/Payment/Response/PaymentResponse.php:14-34]`
3. `status` is the only thing that moves the transaction (no status, or an empty one, leaves it `open`; neither `redirectUrl` nor a bare HTTP 200 transitions anything) and it is passed verbatim as a **state-machine transition action name**, not a state name. Valid for `order_transaction` in 6.7: `paid`, `paid_partially`, `process`, `process_unconfirmed`, `authorize`, `chargeback`, `refund`, `refund_partially`, `remind`, `reopen`, plus the two special cases `cancel` (throws `PaymentException::customerCanceled`, transaction ends `cancelled`) and `fail` (never reaches the state machine — it is turned into the error message `Payment was reported as failed.` and thrown as `AppException::interrupted`). State names such as `cancelled`, `refunded`, `failed`, `in_progress`, `unconfirmed`, `reminded` are **not** accepted: the string is handed unvalidated to `StateMachineRegistry::transition()`, which throws `IllegalTransitionException` and leaves the transaction `failed`. 6.7's `Migration1742302302RenamePaidTransitionActions` renamed `pay` → `paid`, `pay_partially` → `paid_partially`, `do_pay` → `process`, so the old names must not be used. `[code: Framework/App/Payment/Handler/AppPaymentHandler.php:236-259, System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31, Migration/V6_7/Migration1742302302RenamePaidTransitionActions.php:30-33,80-83]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/apps/checkout/payment.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `<payment-method>` children are an `xs:choice`: `identifier`, `name` mandatory; `description`, `pay-url`, `finalize-url`, `validate-url`, `refund-url`, `recurring-url`, `icon` all `minOccurs="0"` | `Framework/App/Manifest/Schema/manifest-3.0.xsd:520-538` | `<xs:element type="xs:anyURI" name="pay-url" minOccurs="0"/>` |
| Install writes `handlerIdentifier` `app\<AppName>_<identifier>` and `technicalName` `payment_<AppName>_<identifier>`; new methods get `afterOrderEnabled = true` | `Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php:79-108` | `$payload['handlerIdentifier'] = \sprintf('app\\%s_%s', $appName, $paymentMethod->getIdentifier());` |
| Payment methods are persisted only once the app holds an app secret (after registration) | `Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php:63-67` | `if (!$context->hasAppSecret()) { return; }` |
| In dev, installing an app declaring payment methods without an app secret throws `appSecretRequiredForFeatures` | `Framework/App/Lifecycle/AppFeatureValidator.php:26-55` | `$usedFeatures[] = 'Payment Methods';` |
| All app payment methods resolve to the single `AppPaymentHandler`, by `app_payment_method_id`, not by handler string | `Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:57-60` | `if (isset($result['app_payment_method_id'])) { return $this->handlers[AppPaymentHandler::class] ?? null; }` |
| `AppPaymentHandler` extends `AbstractPaymentHandler`, tagged `shopware.payment.method` | `Framework/DependencyInjection/app.php:452-461` | `->tag('shopware.payment.method');` |
| `pay()`: POSTs to `pay-url` when set, applies the status, returns a `RedirectResponse` only when `redirectUrl` came back; otherwise null | `Framework/App/Payment/Handler/AppPaymentHandler.php:119-131` | `if ($response->getRedirectUrl()) { return new RedirectResponse($response->getRedirectUrl()); } return null;` |
| The finalize step exists because `PaymentProcessor` nulls the payment token on a `RedirectResponse` | `Checkout/Payment/PaymentProcessor.php:93-96,109-111` | `// has been nulled, if response is RedirectResponse, therefore we have a finalize step` |
| `finalize()`: forwards the return URL's query params minus `_sw_payment_token`; throws when no `finalize-url` | `Framework/App/Payment/Handler/AppPaymentHandler.php:134-157` | `if ($url === null) { throw AppException::interrupted('Finalize URL not defined'); }` |
| `returnUrl` is part of the pay payload, built by `PaymentProcessor` from the payment token | `Framework/App/Payment/Handler/AppPaymentHandler.php:119`; `Checkout/Payment/PaymentProcessor.php:82` | `$payload = $this->buildPayload($orderTransaction, $order, $request->request->all(), $transaction->getReturnUrl(), …);` |
| Body is the JSON `PaymentPayload`: source, orderTransaction, order, requestData, returnUrl, validateStruct, recurring | `Framework/App/Payment/Payload/Struct/PaymentPayload.php:21-37` | `protected Source $source; protected OrderTransactionEntity $orderTransaction;` |
| POST, JSON, signed with the app secret, 20-second timeout | `Framework/App/Payment/Payload/PaymentPayloadService.php:22,44-53` | `public const PAYMENT_REQUEST_TIMEOUT = 20;` |
| Payment calls set `validated_response = true`, so the app's response must carry a valid `shopware-app-signature` | `Framework/App/Payload/AppPayloadServiceHelper.php:147-155`; `Framework/App/Hmac/Guzzle/AuthMiddleware.php:73-82` | `AuthMiddleware::VALIDATED_RESPONSE => true,` |
| `PaymentResponse` recognises exactly `message`, `status`, `redirectUrl` | `Framework/App/Payment/Response/PaymentResponse.php:14-34` | `protected ?string $status = null; protected ?string $redirectUrl = null;` |
| A non-empty `message` aborts with `AppException::interrupted` | `Framework/App/Payment/Handler/AppPaymentHandler.php:229-231` | `if ($response->getErrorMessage()) { throw AppException::interrupted($response->getErrorMessage()); }` |
| `validate-url` is optional, runs on the cart pre-order; its `preOrderPayment` is handed back to `pay()` | `Framework/App/Payment/Handler/AppPaymentHandler.php:88-106` | `if (!$validateUrl) { return new ArrayStruct(); }` |
| Refund/recurring support is a direct lookup of `refund_url` / `recurring_url`; missing → `paymentTypeUnsupported` | `Framework/App/Payment/Handler/AppPaymentHandler.php:70-86,182-185` | `$requiredUrl = match ($type) { PaymentHandlerType::REFUND => 'refund_url', …};` |
| On uninstall the methods are deactivated, not deleted | `Framework/App/Lifecycle/Handler/PaymentMethodLifecycleHandler.php:120-140` | `'active' => false, 'appPaymentMethod' => ['appId' => null]` |
| **deep** The status is passed verbatim as `state_machine_transition.action_name`; the order_transaction alphabet is paid, paid_partially, pay, pay_partially, do_pay, process, process_unconfirmed, authorize, chargeback, cancel, fail, remind, reopen, refund, refund_partially | `System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31`; `Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:11-22` | `public const ACTION_PAID = 'paid';` … `public const STATE_FAILED = 'failed';` |
| **deep** `StateMachineTransitionActions` is shared across machines: ship/retour/complete are not seeded for order_transaction; the authoritative alphabet is the migration-seeded transition rows | `Migration/V6_3/Migration1580746806AddPaymentStates.php:104-123` | `'action_name' => 'do_pay', 'from_state_id' => $stateOpenId, 'to_state_id' => $stateInProgressId` |
| **deep** `transitionState()` has exactly two guards (empty status, `cancel`) and otherwise passes the raw string to `StateMachineRegistry::transition()` | `Framework/App/Payment/Handler/AppPaymentHandler.php:236-259` | `$this->stateMachineRegistry->transition(new Transition($entityName, $entityId, $response->getStatus(), 'stateId'), $context);` |
| **deep** An unmatched action throws `IllegalTransitionException` (HTTP 400, `SYSTEM__ILLEGAL_STATE_TRANSITION`); the only silent case is a transition to the current state (`UnnecessaryTransitionException`, caught, no-op) | `System/StateMachine/StateMachineRegistry.php:315-322,352-356,161-172` | `throw StateMachineException::illegalStateTransition($fromStateId, $transitionName, $transitionNames);` |
| **deep** The exception propagates into `PaymentProcessor`, which logs it, forces the transaction to `failed` and redirects with `error-code=` | `Checkout/Payment/PaymentProcessor.php:99-106,150-160` | `$this->transactionStateHandler->fail($transaction->getId(), $salesChannelContext->getContext());` |
| **deep** `Migration1742302302RenamePaidTransitionActions` renames `pay`→`paid`, `pay_partially`→`paid_partially`, `do_pay`→`process`; `update()` duplicates, `updateDestructive()` deletes the old rows | `Migration/V6_7/Migration1742302302RenamePaidTransitionActions.php:30-33,48-70,80-83` | `$connection->delete('state_machine_transition', ['action_name' => 'do_pay', …]);` |
| **deep** `status` is the only transition trigger: `pay()`/`finalize()` call `transitionState()` and nothing else touches the state; a bare HTTP 200 moves nothing | `Framework/App/Payment/Handler/AppPaymentHandler.php:108-158` | `$this->transitionState($orderTransaction->getId(), $response, $context);` |
| **deep** `fail` never reaches `transitionState`: `getErrorMessage()` synthesises `Payment was reported as failed.` and `requestAppServer()` throws first | `Framework/App/Payment/Response/PaymentResponse.php:36-47`; `AppPaymentHandler.php:220-234` | `if ($this->status === StateMachineTransitionActions::ACTION_FAIL) { return 'Payment was reported as failed.'; }` |
| **deep** `cancel` bypasses the state machine in the handler but still ends `cancelled` — `PaymentProcessor` catches `PAYMENT_CUSTOMER_CANCELED_EXTERNAL` and calls `cancel()` | `Checkout/Payment/PaymentProcessor.php:150-156` | `if ($e instanceof PaymentException && $e->getErrorCode() === PaymentException::PAYMENT_CUSTOMER_CANCELED_EXTERNAL) { $this->transactionStateHandler->cancel(...); }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `pay-url` is mandatory for an app payment method | absent | `minOccurs="0"` in the XSD, and `pay()` guards with `if ($payUrl)` and returns null (`manifest-3.0.xsd:525`, `AppPaymentHandler.php:120-131`) |
| Shopware distinguishes synchronous and asynchronous app payment handlers | absent | One handler class for all app payment methods; asynchronicity comes from `redirectUrl` in the pay response |
| The app may return arbitrary fields Shopware interprets | absent | `PaymentResponse` declares only `message`, `status`, `redirectUrl` |
| `capture-url` / a capture step exists in 6.7 | absent | The XSD offers only pay/finalize/validate/refund/recurring URLs |
| The app's pay response need not be signed | absent | `validated_response = true` for all payment calls; `AuthMiddleware` verifies `shopware-app-signature` |
| `AppPaymentHandler` validates the returned status against an allow-list | absent | `transitionState()` has only the empty-status and `cancel` guards; no `in_array`/enum/match (`AppPaymentHandler.php:236-259`) |
| Returning a state name (`failed`, `cancelled`, `in_progress`, `unconfirmed`) works | absent | No `state_machine_transition` row is seeded with those action names for `order_transaction.state` (`Migration1536233560BasicData.php:1232-1259`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| A valid action status transitions the transaction (`paid_partially` → `STATE_PARTIALLY_PAID`) | `shopware/shopware@trunk tests/integration/Core/Framework/App/Payment/AppAsyncPaymentHandlerTest.php:30-44` |
| `fail` throws `AppException::interrupted('Payment was reported as failed.')` instead of running the fail transition | `…/AppAsyncPaymentHandlerTest.php:46-61` |
| An empty status leaves the transaction on `open` | `…/AppAsyncPaymentHandlerTest.php:98-111` |
| `authorize` on finalize reaches `STATE_AUTHORIZED`; `cancel` raises `PAYMENT_CUSTOMER_CANCELED_EXTERNAL` and ends `cancelled` | `…/AppAsyncPaymentHandlerTest.php (testPayFinalize, testPayFinalizeCanceledState)` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| 6.7.0.0 release notes list "Payment: payment states" and "Payment: finalize step"; the guide says the app server must respond with a payment state from 6.7.0.0 to change the transaction state | 6.7.0.0 | merged | https://developer.shopware.com/release-notes/6.7/6.7.0.0.html |
| `Migration1742302302RenamePaidTransitionActions` renamed `pay`/`pay_partially`/`do_pay` shop-wide, breaking processes; scoped by merged PR #11238 | 6.7.0.0 | merged | https://github.com/shopware/shopware/issues/11157 |
| A repeat `/payment/finalize-transaction` call produced a token-expired error; PR #13014 flags tokens as used so a second finalize is skipped | 6.4–6.7, changed Nov 2025 | merged | https://github.com/shopware/shopware/issues/12593 |
| Reported hard app-payment timeout turning slow authorisations into failed payments | general | closed by author | https://github.com/shopware/shopware/issues/9165 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| What must the app return from `pay-url`; which JSON keys and which class decodes it | code lane | `PaymentResponse` with exactly `status`, `redirectUrl`, `message` — fact 2 |
| Is a payment state mandatory in 6.7 to change the transaction state? | deep pass | Yes in effect — `status` is the only transition trigger; without it the transaction stays `open` — fact 3 |
| What is POSTed to the two URLs | code lane | `PaymentPayload`: source, orderTransaction, order, requestData, returnUrl, validateStruct, recurring — fact 2 |
| Which manifest element and child URLs exist; does omitting `finalize-url` select the sync flow? | code lane | `<payments><payment-method>`; no `capture-url`; the flow is decided by `redirectUrl` at runtime, not by the declared URL set — fact 1 |
| Which transition action names does 6.7 use after `Migration1742302302`? | deep pass | `pay`→`paid`, `pay_partially`→`paid_partially`, `do_pay`→`process` — fact 3 |
| Is there a configurable timeout for app payment requests? | code lane | `PaymentPayloadService::PAYMENT_REQUEST_TIMEOUT = 20` (a constant, not configuration) — recorded in fact 2 |
| Does a second finalize call after PR #13014 no-op? | not settled by code | Out of scope for this query's facts; the used-token flag was not read. Not part of any fact |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Sync vs async is decided by defining a `finalize-url` or not | "If no `finalize-url` is defined, the internal Shopware payment handler will default to a synchronous payment." | payment.md | no — one handler class; the finalize step follows from `redirectUrl` in the pay response |
| Omitting `pay-url` leaves the payment open at checkout | "then the payment will remain on open on checkout" | payment.md | yes — `AppPaymentHandler.php:120-131` |
| Methods are identified by app name plus per-method identifier | "identified by the name of your app and the identifier you define per payment method" | payment.md | yes — `PaymentMethodLifecycleHandler.php:79-108` |
| From 6.7.0.0 the app server has to respond with a payment state to change the transaction state | "your app-server **has to** respond with a payment state in its response" | payment.md | yes — `status` is the only trigger (`AppPaymentHandler.php:236-259`) |
| The pay request carries `order`, `orderTransaction`, `returnUrl`; finalize carries `orderTransaction` and `requestData` | "The request includes all necessary data such as the `order`, `orderTransaction`, and a `returnUrl`" | payment.md | yes, with a correction — finalize sends the same `PaymentPayload` including `order` (`PaymentPayload.php:21-37`) |
| Requests and responses of all endpoints are signed | "The requests and responses of all of your endpoints will be signed and feature JSON content." | payment.md | yes — `validated_response = true`, `AuthMiddleware.php:73-82` |
| The finalize outcome table: `cancel`, `fail`, `paid`, `authorize` | table quote | payment.md | yes — all four are handled (two as special cases) |
| "All possible payment states": open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback | list quote | payment.md | no — that is the state vocabulary; `status` takes action names |
| `pay-url` responses carry only a `redirectUrl` | `{"redirectUrl": "…"}` | payment-reference.md | yes as valid, but no status means no transition — the transaction stays `open` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| "These two types are differentiated by defining a `finalize-url` or not. If no `finalize-url` is defined, the internal Shopware payment handler will default to a synchronous payment." | There is one handler class, `AppPaymentHandler`, for all app payment methods. Whether a finalize step happens is decided at runtime: `PaymentProcessor` nulls the payment token only when `pay()` returns a `RedirectResponse`, which it does only when the app answered with `redirectUrl`. Finalize without a declared `finalize-url` throws `AppException::interrupted('Finalize URL not defined')`. | `Checkout/Payment/Cart/PaymentHandler/PaymentHandlerRegistry.php:57-60`; `Framework/App/Payment/Handler/AppPaymentHandler.php:119-157`; `Checkout/Payment/PaymentProcessor.php:93-111` |
| payment.md's "All possible payment states" — open, paid, cancelled, refunded, failed, authorize, unconfirmed, in_progress, reminded, chargeback — presented as the values for `status` | `status` is a transition **action** name, not a state name. `cancelled`, `refunded`, `failed`, `unconfirmed`, `in_progress` and `reminded` are `OrderTransactionStates::STATE_*` values and are never seeded as action names — returning one produces `IllegalTransitionException` and the transaction ends `failed`. The valid actions are paid, paid_partially, process, process_unconfirmed, authorize, chargeback, refund, refund_partially, remind, reopen, plus the `cancel` and `fail` special cases. | `System/StateMachine/Aggregation/StateMachineTransition/StateMachineTransitionActions.php:10-31`; `Checkout/Order/Aggregate/OrderTransaction/OrderTransactionStates.php:11-22`; `System/StateMachine/StateMachineRegistry.php:315-322,352-356` |
| payment.md's own two spellings (`cancel`/`fail` in the finalize table vs `cancelled`/`failed` in the state list) are never reconciled | Only the verb forms work, and neither of them runs a plain transition: `fail` is converted to an error message and thrown before the state machine is reached; `cancel` throws `PaymentException::customerCanceled`. | `Framework/App/Payment/Response/PaymentResponse.php:36-47`; `Framework/App/Payment/Handler/AppPaymentHandler.php:229-248` |
| payment-reference.md (banner "only available starting with Shopware 6.4.1.0") shows pay responses with only a `redirectUrl` and never mentions the 6.7 state requirement | Valid, but without a `status` no transition runs at all and the transaction stays `open`. | `Framework/App/Payment/Handler/AppPaymentHandler.php:236-259` |
| payment-reference.md names the request header `shopware-shop-signature` and does not state that the app's **response** must be signed | The response must carry `shopware-app-signature`, an HMAC-SHA256 of the body with the app secret; `AuthMiddleware` rejects it otherwise (401 responses exempt). | `Framework/App/Payload/AppPayloadServiceHelper.php:147-155`; `Framework/App/Hmac/Guzzle/AuthMiddleware.php:73-82` |
| payment.md: finalize "is only provided with the `orderTransaction` … and `requestData`" | Finalize sends the same `PaymentPayload` struct, which always includes `order` and `source`. | `Framework/App/Payment/Handler/AppPaymentHandler.php:134-157`; `Framework/App/Payment/Payload/Struct/PaymentPayload.php:21-37` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| The presence of `finalize-url` in the manifest decides asynchronous vs synchronous; without it Shopware treats the method as synchronous, and without `pay-url` the transaction stays `open`. | first clause removed, second kept in fact 1 | Code disproves the first half: one handler class serves all app payment methods and the finalize step is triggered by a `redirectUrl` in the pay response, not by the declared URL set. The `pay-url` clause is confirmed by `AppPaymentHandler.php:120-131` |
| Since Shopware 6.7.0.0 the app server must respond with a payment `status` if it wants to change the transaction state, e.g. `{"status": "authorize"}`. | kept, folded into facts 2 and 3 with tags | Confirmed: `status` is the only transition trigger and `authorize` is a valid action; added the response keys and the mandatory response signature, which the old set omitted |
| Valid payment states are `open`, `paid`, `cancelled`, `refunded`, `failed`, `authorize`, `unconfirmed`, `in_progress`, `reminded`, `chargeback`. | removed, replaced by the action-name list in fact 3 | Code disproves it: `status` takes transition action names, so `cancelled`, `refunded`, `failed`, `unconfirmed`, `in_progress` and `reminded` fail with `IllegalTransitionException` and `open` is a starting state, not a returnable action. The correct set also includes `paid_partially`, `process`, `process_unconfirmed`, `refund`, `refund_partially`, `remind` and `reopen`, which the old fact omitted |
