# `edge-09` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `edge-09` · `edge` · `Trap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** Where do I configure Business Events so that a mail is sent when an order is placed in Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. States that no Business Events configuration screen exists in the 6.6 or 6.7 administration: the admin module directory contains no `sw-event-action` / `sw-business-event` module, and the `event_action`, `event_action_rule` and `event_action_sales_channel` tables are dropped by a V6_5 migration. `[code: Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29]`
2. Points to the Flow Builder as the place to configure the mail — admin module `sw-flow`, reached under Settings in the `automation` settings group (route `sw.flow.index`, privilege `flow.viewer`) — by pairing the trigger `checkout.order.placed` (`CheckoutOrderPlacedEvent`, which implements `MailAware`) with the send-mail action `action.mail.send` (`SendMailAction`, whose `requirements()` is `[MailAware::class]`). `[code: administration Resources/app/administration/src/module/sw-flow/index.js:177-182]` `[code: Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27-29]` `[code: Content/Flow/Dispatching/Action/SendMailAction.php:41,78-81]`
3. Does not present Business Events as a configurable surface: in 6.7 the term survives only as the read-only event catalogue — the constants in `Framework/Event/BusinessEvents.php` (including `CHECKOUT_ORDER_PLACED`), exposed at `GET /api/_info/events.json` and consumed by the administration to populate the Flow Builder trigger picker. There is no write side. `[code: Framework/Event/BusinessEvents.php:31,43]` `[code: Framework/Api/Controller/InfoController.php:144-150]`

**Trap:** The official merchant page "Settings > Business Events" is still published and still describes assigning email templates to events under Settings > Shop; that screen does not exist in 6.6 or 6.7.

**Official reference URL:** https://docs.shopware.com/en/shopware-6-en/settings/Business-Events
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The automation module that configures event-triggered actions is `sw-flow`, title snippet `sw-flow.general.mainMenuItemGeneral` | `administration .../src/module/sw-flow/index.js:68-71` | `Module.register('sw-flow', { type: 'core', name: 'flow', title: 'sw-flow.general.mainMenuItemGeneral',` |
| That snippet resolves to "Flow Builder" | `administration .../src/module/sw-flow/snippet/en.json:8` | `"mainMenuItemGeneral": "Flow Builder",` |
| Reached under Settings, group `automation`, route `sw.flow.index`, privilege `flow.viewer` | `administration .../src/module/sw-flow/index.js:177-182` | `settingsItem: { group: 'automation', to: 'sw.flow.index', icon: 'regular-flow', privilege: 'flow.viewer', },` |
| Flow routes carry `parentPath: 'sw.settings.index'` — a settings child, not a top-level module | `administration .../src/module/sw-flow/index.js:80-92` | `meta: { parentPath: 'sw.settings.index', privilege: 'flow.viewer', },` |
| Sending a mail is the flow action `action.mail.send` | `Content/Flow/Dispatching/Action/SendMailAction.php:39-41,70-72` | `final public const ACTION_NAME = 'action.mail.send';` |
| `SendMailAction` is offered only for events implementing `MailAware` | `Content/Flow/Dispatching/Action/SendMailAction.php:78-81` | `public function requirements(): array { return [MailAware::class]; }` |
| The order-placed trigger is `checkout.order.placed`; the event implements `MailAware` | `Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27-29` | `class CheckoutOrderPlacedEvent extends Event implements SalesChannelAware, …, MailAware, …` |
| "Business event" survives as the event catalogue only | `Framework/Event/BusinessEvents.php:31,43` | `public const CHECKOUT_ORDER_PLACED = CheckoutOrderPlacedEvent::EVENT_NAME;` |
| The catalogue is read-only over the Admin API | `Framework/Api/Controller/InfoController.php:144-150` | `#[Route(path: '/api/_info/events.json', name: 'api.info.business-events', methods: ['GET'])]` |
| The administration consumes it to fill the trigger picker | `administration .../src/core/service/api/business-events.api.service.js:22-27` | `return this.httpClient.get('/_info/events.json', {` |
| Mail templates are edited in `sw-mail-template`; the flow modal only selects or creates one | `administration .../src/module/sw-flow/index.js:35-39` | `Shopware.Component.register('sw-flow-mail-send-modal', …)` |
| 6.6 is identical: the module list on tag v6.6.10.0 contains `sw-flow` and no business-event module | `github.com/shopware/shopware/tree/v6.6.10.0/…/src/module` | `… "sw-flow", "sw-import-export", … (no sw-event-action, no sw-business-event)` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A "Business Events" configuration screen exists in the 6.7 administration | absent | The 72-entry module directory contains `sw-flow`, `sw-mail-template` and the `sw-settings-*` modules but no `sw-event-action` / `sw-settings-event-action` / `sw-business-event`; `grep -rn "sw-event-action"` over `vendor/shopware/administration` returns no match |
| The `event_action` storage that backed the old screen still exists | absent | `Migration1670854818RemoveEventActionTable` (V6_5) drops `event_action`, `event_action_rule`, `event_action_sales_channel` in `updateDestructive()`; no `EventActionDefinition` remains (`Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29`) |
| Business events are configured somewhere independently of the Flow Builder | absent | The only business-event surface is the read-only collector plus `GET /api/_info/events.json`; the writable entity is `flow` (`Framework/Event/BusinessEventCollector.php:13-25`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The dispatcher turning a dispatched business event into flow execution | `Content/Flow/Dispatching/FlowDispatcher.php:26` |
| The executor resolving flow sequences to `FlowAction` services such as `SendMailAction` | `Content/Flow/Dispatching/FlowExecutor.php:40` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| The merchant "Settings > Business Events" page is still published, warning only that business events "will be replaced by the Flow Builder in the major release 6.4.8.0" | doc cut-off 6.4.8.0; live as of 2026-09 | open | https://docs.shopware.com/en/shopware-6-en/settings/Business-Events |
| Flow Builder merchant page notes the B2B Suite kept using business events, so the term survives in a narrower context | 6.4.8+ / unclear for 6.7 | open | https://docs.shopware.com/en/shopware-6-en/settings/Flow-Builder |
| Forum: after activating the Flow Builder, customer mails stopped; a poster's workaround was to "activate Business-Events additionally" | 6.4.6.0 reported; relevance to 6.6/6.7 unverified | open | https://forum.shopware.com/t/flow-builder-emailversand-funktioniert-nicht-mehr/91350 |
| shopware/docs issue: the 6.4 Flow Builder developer guide was wrong about the administration part of a custom flow action | 6.4 | closed | https://github.com/shopware/docs/issues/948 |

Note: the community lane hit the GitHub issue-search rate limit and dropped two searches, so shopware/shopware issue coverage is thinner than its web coverage. No absence of a community signal was treated as evidence here.

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does any business-event admin surface still exist in 6.7 (`event_action` entity, `sw-event-action` module)? | code | No. Module absent; tables dropped by the V6_5 migration |
| Is `checkout.order.placed` still the order-placed trigger in 6.7? | code | Yes — `CheckoutOrderPlacedEvent::EVENT_NAME`, implements `MailAware`/`FlowEventAware` |
| Is the Flow Builder still under Settings > Automation, so "Settings > Business Events" names a non-existent screen? | code | Yes — settings group `automation`, route `sw.flow.index` |
| Does anything still register handlers under the "business event" name? | code (core + administration) | Only the read-only catalogue: `BusinessEvents` constants, `BusinessEventCollector`, `GET /api/_info/events.json`, `business-events.api.service.js` |
| Where are shipped default flows defined, and is order-confirmation mail a default flow or merchant-created? | not examined | Not settled; out of scope for the query, which asks where to configure, not what ships |
| Can the order-confirmation mail be produced by anything other than a flow in 6.7? | not examined | Not settled; the facts above assert only that the Flow Builder is where it is configured |
| Does the B2B bundle still use business events? | not examined by code (bundle is not in `vendor/shopware/core`) | Unconfirmed docs claim; deliberately excluded from the facts |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Business Events are configured under Settings > Shop and assigned to email templates | "In the **Business Events** section under **Settings > Shop**, you have the option of assigning certain Shopware events … to corresponding email templates." | `merchant/…/settings/Business-Events/v1-0-0.md:13` | **no** — no such module in 6.6/6.7 |
| Business Events were replaced by the Flow Builder in 6.4.8.0 and continue to be used for the B2B-Suite | "Business events will be replaced by the Flow Builder in the major release 6.4.8.0. Business events will continue to be used for the B2B-Suite." | `merchant/…/settings/Business-Events/v1-0-0.md:10` | partly — code confirms the screen is gone but not the 6.4.8.0 release nor the B2B-Suite claim |
| Selecting "Order placed" selects the technical event `checkout.order.placed` | "you can select the event **Order placed**. Hereby you automatically select the technical event **checkout.order.placed**." | `merchant/…/settings/Business-Events/v1-0-0.md:45` | yes for the event name (`CheckoutOrderPlacedEvent.php:29`); no for the screen |
| The Flow Builder is under Settings > Automation and automates email sending | "You can find the **Flow Builder** under **Settings > Automation**." | `merchant/…/settings/Flow-Builder/v1-3-0-1.md:9` | yes — settings group `automation`, route `sw.flow.index` |
| `checkout.order.placed` is a selectable Flow Builder trigger | "\| checkout.order.placed \| Triggers when an order is placed \|" | `merchant/…/settings/Flow-Builder/v1-3-0-1.md:62` | yes |
| The Send mail action takes reply-to, recipient, template and optional documents | "With this action, you can have emails sent automatically. …" | `merchant/…/settings/Flow-Builder/v1-3-0-1.md:204` | partly — `SendMailAction` and its `MailAware` requirement confirmed; field-level config not read |
| The flow builder, not business events, defines which emails are sent | "You can define which emails are sent in which situations in the flow builder." | `merchant/…/settings/email-templates/v1-5-0-0.md:12` | yes |
| The B2B suite still uses business events (on a 6.7 page) | "Please note that the B2B suite still uses the business events." | `merchant/…/settings/email-templates/v1-5-0-0.md:14` | **not checked** — B2B bundle outside `vendor/shopware/core`; excluded from the facts |
| Developer docs still instruct grepping for `implements BusinessEventInterface` / `MailActionInterface` | "Those business events can be found by either searching for the term `implements BusinessEventInterface` or `implements MailActionInterface`." | `developer/…/event/finding-events.md:244-245` | **no** — 6.7 gates the send-mail action on `MailAware`, not `MailActionInterface` |
| `BusinessEventInterface` is a current event interface | "`BusinessEventInterface`: This interface extends from `ShopwareEvent` …" | `developer/…/event/add-custom-event.md:31` | **no** — the docs repo's own patch file states it was to be removed in v6.5 |
| Double-Opt-In newsletter registration is edited via business events | "The double opt-in function … can now be editing with business events." | `merchant/…/Newsletter-configuration/v1-3-0.md:27` | **no** — no business-event screen |
| Events are linked to rules and templates under Settings > Business events | "… in the administration under **Settings > Business events**." | `merchant/…/after-order-payment-process/v1-0-0-0.md:18` | **no** |

Documentation context code cannot express (recorded, not admitted as facts): Flow Builder is positioned as merchant automation without programming knowledge; time-delayed actions require the Shopware Beyond plan, the Flow Builder extension the Evolve plan, flow sharing 6.4.19.0 + Rise; selecting "Administrator" as recipient mails every user carrying the admin flag, including external API users.

## Doc/code divergence

What the documentation asserts and what the code shows. A recorded finding, not a defect report —
this skill does not fix the docs or the wiki.

| docs claim | code shows | citation |
| --- | --- | --- |
| A Business Events section exists under Settings > Shop where events are assigned to email templates | No such admin module in 6.6 or 6.7; the backing `event_action*` tables are dropped by a V6_5 migration | `Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29` |
| Business Events are replaced "in the major release 6.4.8.0" | Code dates the storage removal to a V6_5 migration; it does not confirm 6.4.8.0 as the replacement release | `Migration/V6_5/Migration1670854818RemoveEventActionTable.php:24-29` |
| The B2B suite still uses business events (stated on a productVersionFrom 6.7.0.0 page) | Not examined — the B2B bundle is not part of `vendor/shopware/core`; in core the only business-event surface is read-only | `Framework/Event/BusinessEventCollector.php:13-25` |
| Business events are found by grepping `implements BusinessEventInterface` / `MailActionInterface` | The 6.7 send-mail action is gated on `MailAware`; `CheckoutOrderPlacedEvent` implements `MailAware` and `FlowEventAware` | `Content/Flow/Dispatching/Action/SendMailAction.php:78-81`, `Checkout/Cart/Event/CheckoutOrderPlacedEvent.php:27` |
| Double-Opt-In and after-order-payment configuration live under Settings > Business events | Those are flow triggers; the only writable surface is the `flow` entity in `sw-flow` | `administration .../src/module/sw-flow/index.js:80-92` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that Business Events were replaced by Flow Builder starting with 6.4.8.0 and remain relevant only for the B2B Suite. | replaced | Code does not confirm either half: the storage removal is a V6_5 migration, not 6.4.8.0, and the B2B-Suite claim is a docs-only assertion about a bundle outside `vendor/shopware/core`. Replaced with the code-backed statement that no Business Events screen exists in 6.6 or 6.7 |
| Points to Flow Builder (Settings > Automation > Flow Builder, as the linked page states) as the place to send a mail on order placed. | rewritten | Kept and strengthened: the "as the linked page states" hedge is replaced by the code anchors — module `sw-flow`, settings group `automation`, route `sw.flow.index`, privilege `flow.viewer`, action `action.mail.send` gated on `MailAware` |
| Names the technical event `checkout.order.placed` and does not present the Business Events form as the current way. | rewritten | Event name confirmed by code and folded into fact 2; the negative half is sharpened into fact 3, which states what "business event" actually denotes in 6.7 — the read-only catalogue behind `GET /api/_info/events.json` |
