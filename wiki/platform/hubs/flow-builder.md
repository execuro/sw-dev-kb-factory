---
id: platform/hubs/flow-builder.md
title: "Flow Builder"
summary: "Flow Builder concepts, plugin/app extension points, ADRs, references, and merchant-facing settings/recipes across 6.6 and 6.7."
keywords: ["flow builder", "flow", "trigger", "condition", "action", "flowdispatcher", "flowexecutor", "storableflow", "flowstorer", "flow action", "flow event", "aware interface", "app system", "rule builder", "business events"]
members: ["platform/dev/6.6/concepts/framework/flow-concept.md", "platform/dev/6.6/guides/plugins/apps/flow-builder/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/_index.md", "platform/dev/6.6/guides/plugins/plugins/framework/flow/_index.md", "platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md", "platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md", "platform/dev/6.6/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md", "platform/dev/6.6/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md", "platform/dev/6.6/resources/references/adr/2023-07-13-flow-builder-preview.md", "platform/dev/6.6/resources/references/app-reference/flow-action-reference.md", "platform/dev/6.6/resources/references/core-reference/_index.md", "platform/dev/6.6/resources/references/core-reference/flow-reference.md", "platform/dev/6.7/concepts/framework/flow-concept.md", "platform/dev/6.7/concepts/framework/rule-system/_index.md", "platform/dev/6.7/guides/development/troubleshooting/flow-reference.md", "platform/dev/6.7/guides/plugins/apps/flow-builder/_index.md", "platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md", "platform/dev/6.7/guides/plugins/plugins/framework/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md", "platform/dev/6.7/guides/plugins/plugins/framework/flow/action-transactions.md", "platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md", "platform/dev/6.7/resources/references/adr/2022-03-25-prevent-mail-updates.md", "platform/dev/6.7/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md", "platform/dev/6.7/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md", "platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md", "platform/dev/6.7/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md", "platform/dev/6.7/resources/references/adr/2023-07-13-flow-builder-preview.md", "platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md", "platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md", "platform/dev/6.7/resources/references/app-reference/flow-action-reference.md", "platform/dev/6.7/resources/references/core-reference/_index.md", "platform/func/extensions/shopware-commercial.md", "platform/func/features/delayed-flow-actions.md", "platform/func/features/share-flows.md", "platform/func/features/webhook-actions-in-flow-builder.md", "platform/func/settings/Business-Events.md", "platform/func/settings/Flow-Builder.md", "platform/func/settings/email-templates.md", "platform/func/settings/shop/subscriptions.md", "platform/func/settings/tags.md", "platform/func/shopware-6-de/after-order-payment-process.md", "platform/func/tutorials-and-faq/flow-builder-example-flows.md", "platform/func/tutorials-and-faq/tags-examples.md"]
lastBuilt: "2026-09-15"
---

Flow Builder is Shopware's event-driven automation system: a business event triggers a
flow, conditions (usually via the Rule Builder) gate it, and actions run — sending mail,
tagging, calling a webhook, delaying, stopping the flow, and more. This hub gathers the
concept docs, the plugin/app extension points for adding custom triggers and actions, the
ADRs that explain *why* the current `StorableFlow`/`FlowStorer` design replaced the older
`FlowEvent`, the reference tables of events/actions, and the merchant-facing settings and
worked recipes. Come here instead of grepping when the question spans "how does a flow run"
and "how do I extend it" and "what does the merchant see".

## Developer — concepts

- [Flow](platform/dev/6.6/concepts/framework/flow-concept.md) — Flow, trigger, condition, action, template concepts and how `FlowDispatcher`/`FlowExecutor` evaluate a flow (6.6).
- [Flow](platform/dev/6.7/concepts/framework/flow-concept.md) — same concept doc updated for 6.7, including `FlowFactory`/`StorableFlow` data storage; near-duplicate of the 6.6 page with 6.7-specific class detail.
- [Rule system](platform/dev/6.7/concepts/framework/rule-system/_index.md) — the cross-domain rule system (conditions evaluated against cart/order/customer) and the Admin Rule Builder that Flow Builder conditions rely on.

## Developer — plugin/app extension guides

- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) / [Framework](platform/dev/6.7/guides/plugins/plugins/framework/_index.md) — plugin-framework landing pages (DAL, custom fields, events, rules, message queue, flow builder, rate limiter); near-duplicate across versions, 6.7 adds system-check/caching entries.
- [Flow](platform/dev/6.6/guides/plugins/plugins/framework/flow/_index.md) / [Flow](platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md) — landing pages for custom flow actions/triggers as plugin extensions; near-duplicate across versions.
- [Add Flow Builder Action](platform/dev/6.7/guides/plugins/plugins/framework/flow/add-flow-builder-action.md) — create a custom `FlowAction` tagged `flow.action`, implement an `Aware` interface, register a custom trigger event, and override the admin UI (6.7 only).
- [Running Actions Inside Transactions](platform/dev/6.7/guides/plugins/plugins/framework/flow/action-transactions.md) — implement `TransactionalAction` on a `FlowAction` so `handleFlow` runs in a DB transaction; throw `TransactionFailedException` to roll back (6.7 only).
- [Flow Builder](platform/dev/6.6/guides/plugins/apps/flow-builder/_index.md) / [Flow Builder](platform/dev/6.7/guides/plugins/apps/flow-builder/_index.md) — overview of extending Flow Builder from an *app* (not a plugin) via `Resources/flow.xml`; near-duplicate across versions.
- [Add Custom Flow Action from App System](platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md) — `flow.xml` meta/headers/parameters/config fields for an app flow action, and the webhook POST Shopware sends to the app's `url` (6.7 only).

## Developer — references

- [Core Reference](platform/dev/6.6/resources/references/core-reference/_index.md) / [Core Reference](platform/dev/6.7/resources/references/core-reference/_index.md) — index of the Core Reference section (DAL, admin panel, flags, filters, Flow Builder, Rules); near-duplicate across versions.
- [Flow Reference](platform/dev/6.6/resources/references/core-reference/flow-reference.md) / [Flow Reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md) — the trigger-event-to-action reference table; same table, moved from `core-reference` in 6.6 to `guides/development/troubleshooting` in 6.7 — treat as the same reference, not two.
- [Flow Action Reference](platform/dev/6.6/resources/references/app-reference/flow-action-reference.md) / [Flow Action Reference](platform/dev/6.7/resources/references/app-reference/flow-action-reference.md) — `flow-action.xml`/`flow.xml` schema reference for app flow actions (meta, config fields, available variables); near-duplicate across versions.
- [Differentiator cluster for Shopware plugins or apps](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) — Store release criteria that mention Flow Builder as one of several differentiator clusters an extension can satisfy.

## Developer — ADRs (design history)

Shared across 6.6 and 6.7 (near-duplicate content, same decision):

- [Integrate an app into the flow event](platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md) ([6.7](platform/dev/6.7/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md)) — apps add custom trigger events via `flow.xml`/`CustomAppEvent` and a trigger-event API, using `FlowStorer` to persist data.
- [Adding the `StorableFlow`...](platform/dev/6.6/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md) ([6.7](platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md)) — `StorableFlow` replaces `FlowEvent` so delayed actions can restore data later.
- [Flow storer with scalar values](platform/dev/6.6/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md) ([6.7](platform/dev/6.7/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md)) — generic `ScalarValuesAware`/`ScalarValuesStorer` replaces many single-purpose `*Aware`/`*Storer` classes.
- [Flow Builder Preview](platform/dev/6.6/resources/references/adr/2023-07-13-flow-builder-preview.md) ([6.7](platform/dev/6.7/resources/references/adr/2023-07-13-flow-builder-preview.md)) — an optional `Previewable` interface lets an action describe what it would do without executing; the 6.7 copy notes the interface is not present in the installed 6.7 code.

6.7-only ADRs:

- [Prevent mail updates](platform/dev/6.7/resources/references/adr/2022-03-25-prevent-mail-updates.md) — `shopware.mail.update_mail_variables_on_send: false` stops `SendMailAction` rewriting mail-template `templateData` on every send.
- [Integrate an app into flow action](platform/dev/6.7/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md) — apps ship flow actions in `flow.xml` (`flow-extensions` > `flow-actions`); `FlowExecutor` calls the app webhook via `app_flow_action_id`.
- [Introduce transactional flow actions](platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md) — actions implementing `TransactionalAction` run in a DB transaction; `TransactionFailedException::because()` forces a rollback with savepoints.
- [Move flow execution after business process](platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md) — flows are buffered in memory and run after the triggering unit of work (kernel/console terminate, worker message handled), behind the `FLOW_EXECUTION_AFTER_BUSINESS_PROCESS` flag.

## Merchant

- [Flow Builder](platform/func/settings/Flow-Builder.md) — the merchant-facing feature: triggers, rule-based conditions, and actions like sending mail or calling webhooks.
- [Business Events](platform/func/settings/Business-Events.md) — the older event→email-template assignment mechanism, explicitly superseded by Flow Builder.
- [Delayed Flow Actions](platform/func/features/delayed-flow-actions.md) — release a flow's actions at a later date (e.g. a review-request email a week after an order).
- [Share Flows](platform/func/features/share-flows.md) — import/export flows to move them between shops or into an app.
- [Webhook Actions In Flow Builder](platform/func/features/webhook-actions-in-flow-builder.md) — forward flow data to a third-party API when a trigger fires.
- [Shopware Commercial](platform/func/extensions/shopware-commercial.md) — the paid plan (Rise/Evolve/Beyond) that gates some Flow Builder capabilities.
- [Email Templates](platform/func/settings/email-templates.md) — editing the mail templates and Twig-style variables that Flow Builder's "send mail" action fills in.
- [Subscriptions](platform/func/settings/shop/subscriptions.md) — recurring-order settings that use Rule/Flow Builder triggers such as `Checkout / Subscription / Placed`.
- [Tags](platform/func/settings/tags.md) — tag management referenced by Flow Builder's "assign tag" action.
- [After Order Payment Process](platform/func/shopware-6-de/after-order-payment-process.md) — how order/payment separation interacts with retrying or changing payment, relevant to flow triggers on order/payment state.
- [Flow Builder Example Flows](platform/func/tutorials-and-faq/flow-builder-example-flows.md) — worked recipes: tagging new customers, limiting item purchase, auto-sending documents, notifying a warehouse, posting to a webhook.
- [Tags Examples](platform/func/tutorials-and-faq/tags-examples.md) — worked tag examples, several of which combine with Flow Builder conditions.
</content>
