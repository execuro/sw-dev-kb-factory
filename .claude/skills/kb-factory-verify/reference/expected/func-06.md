# `func-06` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `func-06` · `func` · `Merchant` |
| Version | `6.6` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-1011-find-cases-that-are-not` |
| Core version | `6.7.13.0` |

**Query:** Which triggers and actions does the Flow Builder offer, and how do I make it send a mail when an order is placed?

**Expected answer — every fact an answer must contain:**

1. In 6.6 the Flow Builder sits under **Settings > Shop** (the 6.6 `sw-flow` module's `settingsItem.group` is a callback returning `'shop'` unless the `v6.7.0.0` feature flag is active; 6.7 moves it to **Settings > Automation**). A flow is a `flow` entity with a Required `eventName` — the trigger — and its steps are `flow_sequence` rows that are each either an action (`action_name` + `config`) or a Rule-Builder condition (`rule_id`) with a `trueCase` branch. The trigger list is not a closed table: 23 hard-coded event classes in 6.6 (24 while the `v6.7.0.0` flag is off), plus one generated `state_enter.*`/`state_leave.*` trigger per state-machine state and side, plus active apps' `app_flow_event` rows. `[code: 6.6 Administration sw-flow/index.js:179-187 (ref v6.6.10.0); Content/Flow/FlowDefinition.php:225; Content/Flow/Aggregate/FlowSequence/FlowSequenceDefinition.php:64-77; Checkout/Order/Listener/OrderStateChangeEventListener.php:124-150]`
2. Core ships 16 flow actions, the identical set in 6.6.10.0 and 6.7.13.0 (add/remove order and customer tag, change customer group, change customer status, grant download access, generate document, send mail, set order state, three custom-field actions, two affiliate-and-campaign-code actions, stop flow); each declares `requirements()`, so availability depends on the trigger's aware-interfaces. Core ships **no** delay/wait action — only the empty `DelayableAction` marker interface and a `delayable` flag exposed to the administration; time-delayed actions and the Call URL (webhook) action are licence-gated extensions. `[code: Content/DependencyInjection/flow.xml:66-158; Content/Flow/Dispatching/Action/FlowAction.php:9-19; Content/Flow/Dispatching/DelayableAction.php:8]` plus `[docs-only]` for the Beyond/Evolve plan gating.
3. To mail on order placed: trigger `checkout.order.placed` (`CheckoutOrderPlacedEvent`, which implements `MailAware`) plus the action `action.mail.send`, whose config needs a non-empty `recipient` and a `mailTemplateId` — a missing recipient throws `MailEventConfigurationException`, a missing template returns silently. `recipient.type` `'default'` falls back to the event's own `MailRecipientStruct` (the order customer); `'custom'` **replaces** that audience entirely with the configured address map (`getRecipients()` returns only `recipients['data']`, and `MailFactory::create()` calls `Email::to(...)`, a setter). A stock installation already ships an order-confirmation flow for this event, so a merchant's own flow sends an *additional* mail rather than substituting for it. `[code: Content/Flow/Dispatching/Action/SendMailAction.php:104-118,303-325; Content/Mail/Service/MailFactory.php:38; Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27-29; Migration/V6_3/Migration1536233560BasicData.php:2110-2118]`

**Trap:** The corpus still contains the obsolete predecessor page `platform/func/settings/Business-Events.md`, which a `checkout.order.placed` grep also hits; the target page states Flow Builder replaced Business Events as of 6.4.8.0, so an answer grounded in the Business Events page is wrong. A second trap: the merchant page's claim that `checkout.order.payment_method.changed` already sets the **order** status to "Open" is false — that path sets only the order *transaction* (payment) state.

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/settings/Flow-Builder
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| A flow is a `flow` entity with a Required `eventName` (the trigger) plus active/priority; the steps are `flow_sequence` children | `Content/Flow/FlowDefinition.php:225` | `(new StringField('event_name', 'eventName', 255))->addFlags(new Required())` |
| A sequence is either an action (`action_name` + `config`) or a condition (`rule_id`), with `position`/`displayGroup`/`trueCase` and parent/children | `Content/Flow/Aggregate/FlowSequence/FlowSequenceDefinition.php:64-77` | `(new FkField('rule_id', 'ruleId', RuleDefinition::class))` … `new BoolField('true_case', 'trueCase')` |
| Triggers are business events implementing `FlowEventAware`, collected by `BusinessEventCollector::collect()` | `Framework/Event/BusinessEventCollector.php:25-49` | `$events = $this->registry->getClasses();` |
| In 6.6 the hard-coded core trigger list holds 23 event classes (24 with the v6.7.0.0 flag off) | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Event/BusinessEventRegistry.php#L37-L62` | `private array $classes = [ CustomerBeforeLoginEvent::class, … CheckoutOrderPlacedEvent::class, … ];` |
| `state_enter.*` / `state_leave.*` triggers are generated per state-machine state and side | `Checkout/Order/Listener/OrderStateChangeEventListener.php:124-150` | `$name = implode('.', [$side, $machine->getTechnicalName(), $state->getTechnicalName()]);` |
| Apps add triggers through `app_flow_event` | `Framework/Event/BusinessEventCollector.php:86-104` | `SELECT app_flow_event.name, app_flow_event.aware … WHERE app.active = 1` |
| Core ships 16 tagged flow actions, identical in 6.6.10.0 and 6.7.13.0 | `Content/DependencyInjection/flow.xml:66-158` | `<tag name="flow.action" priority="500" key="action.mail.send"/>` … `key="action.stop.flow"` |
| `FlowAction` has three abstract members: `requirements()`, `handleFlow()`, static `getName()` | `Content/Flow/Dispatching/Action/FlowAction.php:9-19` | `abstract public function requirements(): array;` |
| The mail action's key is `action.mail.send` and it requires `MailAware` | `Content/Flow/Dispatching/Action/SendMailAction.php:41-80` | `final public const ACTION_NAME = 'action.mail.send';` … `return [MailAware::class];` |
| The mail action's config needs a non-empty `recipient` and a `mailTemplateId` | `Content/Flow/Dispatching/Action/SendMailAction.php:104-118` | `if (empty($eventConfig['recipient'])) { throw new MailEventConfigurationException(…); } if (!isset($eventConfig['mailTemplateId'])) { return; }` |
| **`recipient.type = 'custom'` replaces the event audience completely** — `getRecipients()` returns only `recipients['data']`, and the single resulting map reaches `Email::to(...)`, a setter, not `addTo()`; the only address core adds is a Bcc from `core.mailerSettings.deliveryAddress` | `Content/Flow/Dispatching/Action/SendMailAction.php:127-135,303-325`; `Content/Mail/Service/MailFactory.php:38`; `Content/Mail/Service/MailService.php:128` | `case self::RECIPIENT_CONFIG_CUSTOM: return $recipients['data'];` … `default: return $mailStructRecipients;` … `->to(...$this->formatMailAddresses($recipients))` |
| Same `'custom'` branch in 6.6.10.0 | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/src/Core/Content/Flow/Dispatching/Action/SendMailAction.php:278-282` | `case self::RECIPIENT_CONFIG_CUSTOM: return $recipients['data'];` |
| Two mails for one event come from **two flows**, not from merging inside one action: `FlowDispatcher::callFlowExecutor()` loads every active flow for the event name, and a fresh install ships a default order-confirmation flow for `CheckoutOrderPlacedEvent` with recipient type `'default'` | `Migration/V6_3/Migration1536233560BasicData.php:2110-2118` | `'event_name' => CheckoutOrderPlacedEvent::EVENT_NAME, 'action_name' => SendMailAction::ACTION_NAME,` |
| A send failure is caught and only logged, so one flow's mail can silently disappear while another's goes out | `Content/Flow/Dispatching/Action/SendMailAction.php:184-200` | `try { $this->emailService->send(…); } catch (\Exception $e) { $this->logger->error("Could not send mail:…")` |
| **`checkout.order.payment_method.changed` sets the order *transaction* state to `open`, not the order state**: `SetPaymentOrderRoute` either reopens the existing transaction or writes a new one with the `order_transaction` machine's initial state, then dispatches the event; the `order` state machine is never transitioned on this path | `Checkout/Order/SalesChannel/SetPaymentOrderRoute.php:103-153,180-220`; `Migration/V6_3/Migration1536233560BasicData.php:1203,1265` | `$initialState = $this->initialStateIdLoader->get(OrderTransactionStates::STATE_MACHINE);` … `'stateId' => $initialState,` |
| Identical in 6.6.10.0 | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/src/Core/Checkout/Order/SalesChannel/SetPaymentOrderRoute.php:91,107,127,160-168` | same `InitialStateIdLoader->get(OrderTransactionStates::STATE_MACHINE)` and dispatch order |
| **`StopFlowAction` halts the entire flow** — every remaining chained action and every remaining root sequence — but not other flows on the same event: it sets the shared `FlowState::$stop`, which `executeAction()` and the `getSequences()` loop both guard on, and `FlowState` is created fresh per flow | `Content/Flow/Dispatching/Action/StopFlowAction.php:28-31`; `Content/Flow/Dispatching/FlowState.php:13`; `Content/Flow/Dispatching/FlowExecutor.php:136-138,168-191` | `public function handleFlow(StorableFlow $flow): void { $flow->stop(); }` … `if ($event->getFlowState()->stop) { return; }` … `if ($state->stop) { return; }` |
| Same guards in 6.6.10.0; the sequence tree is walked depth-first and single-threaded, so there are no truly parallel branches | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/src/Core/Content/Flow/Dispatching/FlowExecutor.php:87-89,140-143` | same two `stop` guards |
| 6.6 admin menu parent: `settingsItem.group` is a callback returning `'shop'` unless `v6.7.0.0` is active; 6.7.13.0 hard-codes `'automation'` | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/src/Administration/Resources/app/administration/src/module/sw-flow/index.js:179-187`; `vendor/shopware/administration/.../module/sw-flow/index.js:177-180` | 6.6 `if (!Feature.isActive('v6.7.0.0')) { return 'shop'; } return 'automation';`; 6.7 `group: 'automation',` |
| Both settings-tab labels exist in the 6.6 snippet file | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/src/Administration/Resources/app/administration/src/module/sw-settings/snippet/en-GB.json:8,15` | `"tabShop": "Shop",` … `"tabAutomation": "Automation",` |
| The admin reads triggers from `GET /api/_info/events.json` and actions from `GET /api/_info/flow-actions.json` | `Framework/Api/Controller/InfoController.php:144-231` | `#[Route(path: '/api/_info/events.json', …)]` |
| Delayability is the marker interface `DelayableAction`, exposed to the admin as `delayable: boolean` | `Content/Flow/Dispatching/DelayableAction.php:8` | `interface DelayableAction { }` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| Core offers a delay / wait action | absent | No delay action class or `action.delay` key exists under `Content/Flow`; only the empty `DelayableAction` marker and the `delayable` flag |
| Some core listener merges the event's `MailRecipientStruct` recipients into a custom-recipient Send mail action | absent | No `MailBeforeValidateEvent` subscriber exists in core or storefront; `$data['recipients']` is read only by `MailService` (`:128` into `MailFactory`, `:239` into `MailSentEvent`); no `addTo`/`addRecipient`/`setRecipients` anywhere in the mail path |
| `checkout.order.payment_method.changed` transitions the **order** state | absent | `SetPaymentOrderRoute`, the sole dispatcher of `OrderPaymentMethodChangedEvent`, references only `OrderTransactionStates::STATE_MACHINE`; grep for the event across core returns the class, the registry constants and a 6.7 mail-template migration, no state subscriber (`Checkout/Order/SalesChannel/SetPaymentOrderRoute.php:148`) |
| `action.app.flow` is a core flow action | absent | The key exists only in the administration constants; app actions come from `app_flow_action` via `FlowActionCollector::fetchAppActions()` |
| Plugin trigger events are auto-discovered | absent | `Bundle::getActionEventClasses()` returns `[]` and `registerEvents()` skips registration when empty (`Framework/Bundle.php:126-206`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Custom recipients replace the event audience — strict equality between the mail-service payload and the configured custom map (6.6) | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/tests/integration/Core/Content/Flow/SendMailActionTest.php:196-212` |
| `StopFlowAction` stops the flow — the executor never calls `handleFlow` on actions sequenced after the stop | `https://raw.githubusercontent.com/shopware/shopware/v6.6.10.0/tests/unit/Core/Content/Flow/Dispatching/FlowExecutorTest.php:61,82-87,170-177` |
| Action keys are asserted by the container wiring itself | `Content/DependencyInjection/flow.xml:160-166` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| A Send mail action with a custom recipient delivered to the customer/employee instead, and two mails went out | 6.7 | closed | https://github.com/shopware/shopware/issues/14364 |
| The 'Enquirer'/'Requester' recipient option resolves to the shop operator, not the form submitter | 6.6 | open | https://github.com/shopware/shopware/issues/7785 |
| No default flow or mail template ships for the 'payment enters status failed' trigger | 6.7 | closed | https://github.com/shopware/shopware/issues/19242 |
| Flows (incl. order placed) not executed when the storefront was entered with a `referralCode` parameter | 6.7 | closed | https://github.com/shopware/shopware/issues/14659 |
| Maintainer issue: the flow pipeline has no end-to-end test coverage for several default `state_enter` payment flows | unclear | open | https://github.com/shopware/shopware/issues/17833 |
| A custom flow action registered the documented way is silently dropped from the action picker | 6.7 | closed | https://github.com/shopware/shopware/issues/17720 |
| The Send mail action offers no CC/BCC configuration | unclear | open | https://github.com/shopware/shopware/issues/17870 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does recipient type `custom` replace or add to the event audience (issue 14364)? | code (deep) | **Replaces**, completely — one recipient map reaches `Email::to()`, a setter. The report's two mails come from two flows firing for the same event (the shipped default order-confirmation flow plus the merchant's own), and a custom recipient can get nothing because `send()` catches and only logs a validation failure. |
| Does `checkout.order.payment_method.changed` set the **order** status to Open? | code (deep) | No — only the order *transaction* (payment) state. A flow action that sets the order state is therefore not redundant, and the merchant page's warning is wrong about the order status. |
| Does `Stop flow` halt the whole flow or only the current branch? | code (deep) | The whole flow it runs in (remaining chained actions and remaining root sequences), but not other flows on the same event. There is no real parallelism — the tree is walked depth-first. |
| Where does the 6.6 administration put the Flow Builder? | code (deep) | **Settings > Shop** by default in 6.6 (`'shop'` unless the `v6.7.0.0` flag is on); **Settings > Automation** in 6.7.13.0. |
| What is the complete 6.6 trigger set, and how is it assembled? | code | 23 hard-coded classes (24 with the flag off) plus generated state triggers plus app events. |
| What is the complete 6.6 core action set? | code | 16 tagged actions, identical in 6.6.10.0 and 6.7.13.0; `action.mail.send` is the Send mail action. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The 6.6 page places the Flow Builder under Settings > Shop | "You can find the Flow Builder under **Settings** > **Shop**." | merchant `settings/Flow-Builder/v1-2-2-1.md:10` | **yes** — the 6.6 `sw-flow` module's group is `'shop'` unless the v6.7.0.0 flag is active |
| Every flow begins with a trigger picked from a fixed list | "Every flow begins with a trigger. This specifies when the flow is executed." | merchant `v1-2-2-1.md:41` | partly — the trigger requirement yes, the fixed list no |
| `checkout.order.placed` is the order-placed trigger | "\| checkout.order.placed \| Triggered when an order is placed \| …" | merchant `v1-2-2-1.md:61` | yes |
| Send mail is configured with a reply-to address, a recipient, a template and optional documents | "In the configuration, first, select a reply-to address ans a recipient. …" | merchant `v1-2-2-1.md:188-189` | partly — `recipient` and `mailTemplateId` are the confirmed required config |
| Available actions are trigger-dependent | "Depending on the trigger, not all actions may be available." | merchant `v1-2-2-1.md:163` | yes — each action declares `requirements()` |
| Conditions reuse Rule Builder rules with True/False branches | "Each condition has two possible outcomes. True or False." | merchant `v1-2-2-1.md:131` | yes — `rule_id` + `true_case` |
| `checkout.order.payment_method.changed` already sets the order status to 'Open', so a flow must not set it again | "The trigger **checkout.order.payment\_method.changed** automatically sets the order status to 'Open' …" | merchant `v1-2-2-1.md:47` | **no** — only the order *transaction* state is set to `open`; the order state is untouched |
| Delayed actions require the Beyond plan; Call URL requires Evolve + Commercial | "The time-delayed actions in the Flow Builder are available to you with the Shopware Beyond plan." | merchant `v1-2-2-1.md:137`, `v1-3-0-1.md:253` | consistent — core ships no delay action; licence gating is `[docs-only]` |
| Example recipe: trigger Checkout/Order/Placed, generate document, send email with recipient 'default' | "To do this, you use the trigger **Checkout / Order / Placed**. …" | merchant `tutorials-and-faq/flow-builder-example-flows/v1-0-0-0.md:36-38` | consistent — `default` falls back to the event's `MailRecipientStruct` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| `checkout.order.payment_method.changed` automatically sets the **order** status to 'Open' | The path sets only the order *transaction* (payment) state to the `order_transaction` machine's initial state `open`; the `order` state machine is never transitioned and no subscriber does so | `Checkout/Order/SalesChannel/SetPaymentOrderRoute.php:103-153`; `Migration/V6_3/Migration1536233560BasicData.php:1203,1265` |
| The 6.6 page gives a closed trigger table | The list is assembled at runtime: 23 hard-coded classes plus one generated trigger per state-machine state and side, plus active apps' `app_flow_event` rows | `Checkout/Order/Listener/OrderStateChangeEventListener.php:124-150`; `Framework/Event/BusinessEventCollector.php:86-104` |
| The docs list "Delayed Actions" among Flow Builder actions (Beyond plan) | Core ships no delay/wait action — only the empty `DelayableAction` marker and a `delayable` flag | `Content/Flow/Dispatching/DelayableAction.php:8` |
| The 6.6 page lists `checkout.customer.changed-payment-method` and `newsletter.update` (deprecated) as triggers | `CustomerChangedPaymentMethodEvent` is registered in 6.6 only while the v6.7.0.0 flag is off and is gone in 6.7.13.0 | `https://github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Framework/Event/BusinessEventRegistry.php#L37-L62` |
| The 6.7 page states Settings > Automation, and the suite's previous fact used that path for a 6.6 case | Version-dependent: `'shop'` in 6.6 by default, `'automation'` in 6.7 (and in 6.6 with the major flag on) | `6.6 sw-flow/index.js:179-187`; `vendor/shopware/administration/.../sw-flow/index.js:177-180` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Flows live under **Settings > Automation > Flow Builder**; the **Flow** tab selects a **Trigger** (e.g. `checkout.order.placed`, `checkout.customer.register`, `state_enter.*`/`state_leave.*`), then **Condition**s using Rule Builder rules with true/false branches and **Action**s added via the plus symbol. | rewritten | The 6.6 admin puts the module under **Settings > Shop**; `'automation'` is the 6.7 group (or 6.6 with the `v6.7.0.0` flag on). The trigger/condition/action structure is retained and now carries its code backing, plus how the trigger list is actually assembled. |
| Available actions include Send mail, Assign status (payment/shipping/order status), Generate a document, Add Tag / Remove Tag, Change custom field content and Stop flow; **Delayed Actions** are Shopware Beyond only and the **Call URL (Webhook)** action requires the Evolve plan with Shopware Commercial. | rewritten | Replaced by the authoritative 16-action tagged set from `flow.xml`, with the absence of any core delay action stated explicitly; the licence gating survives as `[docs-only]`. |
| **Stop flow** halts the entire flow including parallel branches, and the trigger `checkout.order.payment_method.changed` already sets the order status to "Open", so a flow action must not set it to "Open" again. | removed | First half is confirmed but reworded (there are no parallel branches — the tree is walked depth-first — and the stop does not affect other flows on the same event), and it moved into fact 3's neighbourhood. Second half is **disproved**: `SetPaymentOrderRoute` sets only the order *transaction* state, so setting the order state in a flow is not redundant. |
| _(new)_ | added | `recipient.type = 'custom'` **replaces** the event's audience rather than adding to it, and a stock install already runs its own order-confirmation flow for `checkout.order.placed` — the two facts that decide whether a "send a mail on order placed" answer is usable. |
