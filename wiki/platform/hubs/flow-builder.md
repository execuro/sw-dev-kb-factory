---
id: platform/hubs/flow-builder.md
title: flow builder
summary: "Flow Builder navigation: concepts, plugin and app extension, ADRs, references and merchant setup for triggers, conditions and actions."
keywords: ["flow builder", "flow", "trigger", "condition", "action", "flow.xml", "StorableFlow", "FlowStorer", "FlowExecutor", "custom flow action", "delayed flow actions", "webhook action", "TransactionalAction"]
members: [platform/dev/6.6/concepts/framework/flow-concept.md, platform/dev/6.6/guides/plugins/apps/flow-builder/_index.md, platform/dev/6.6/guides/plugins/plugins/framework/_index.md, platform/dev/6.6/guides/plugins/plugins/framework/flow/_index.md, platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md, platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md, platform/dev/6.6/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md, platform/dev/6.6/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md, platform/dev/6.6/resources/references/adr/2023-07-13-flow-builder-preview.md, platform/dev/6.6/resources/references/app-reference/flow-action-reference.md, platform/dev/6.6/resources/references/core-reference/_index.md, platform/dev/6.6/resources/references/core-reference/flow-reference.md, platform/dev/6.7/concepts/framework/flow-concept.md, platform/dev/6.7/concepts/framework/rule-system/_index.md, platform/dev/6.7/guides/development/troubleshooting/flow-reference.md, platform/dev/6.7/guides/plugins/apps/flow-builder/_index.md, platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md, platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md, platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md, platform/dev/6.7/guides/plugins/plugins/framework/flow/action-transactions.md, platform/dev/6.7/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md, platform/dev/6.7/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md, platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md, platform/dev/6.7/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md, platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md, platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md, platform/dev/6.7/resources/references/app-reference/flow-action-reference.md, platform/dev/6.7/resources/references/core-reference/_index.md, platform/dev/6.7/resources/references/core-reference/actions-reference.md, platform/func/extensions/shopware-commercial.md, platform/func/features/delayed-flow-actions.md, platform/func/features/share-flows.md, platform/func/features/webhook-actions-in-flow-builder.md, platform/func/settings/Business-Events.md, platform/func/settings/Flow-Builder.md, platform/func/settings/email-templates.md, platform/func/settings/shop/subscriptions.md, platform/func/settings/tags.md, platform/func/shopware-6-de/after-order-payment-process.md, platform/func/shopware-services/shopware-payments.md, platform/func/tutorials-and-faq/documentv2.md, platform/func/tutorials-and-faq/flow-builder-example-flows.md, platform/func/tutorials-and-faq/tags-examples.md]
lastBuilt: 2026-10-21
---

Flow Builder automates business processes: a trigger (event) starts a flow, optional conditions (rules) filter it, and actions run. Come here for the whole topic: the FlowDispatcher/FlowExecutor model, the Aware/Storer (StorableFlow) data mechanism, how plugins and apps add custom actions and triggers, the trigger and action lookup tables, and the merchant-side configuration. Developer pages are split by version; merchant pages under `platform/func` are version-independent.

## Developer: 6.7

Concepts and extension guides:
- [Flow](platform/dev/6.7/concepts/framework/flow-concept.md) — flows, triggers, conditions, actions, templates; FlowDispatcher/FlowExecutor and FlowStorer.
- [Rule system](platform/dev/6.7/concepts/framework/rule-system/_index.md) — the generic rule system used by checkout, promotions and Flow Builder conditions.
- [Flow](platform/dev/6.7/guides/plugins/plugins/framework/flow/_index.md) — plugin overview: custom flow actions and triggers.
- [Running Actions Inside Transactions](platform/dev/6.7/guides/plugins/plugins/framework/flow/action-transactions.md) — implement TransactionalAction; TransactionFailedException::because() rolls back.
- [Flow Builder](platform/dev/6.7/guides/plugins/apps/flow-builder/_index.md) — app section overview.
- [Add Custom Flow Action from App System](platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-actions-from-app-system.md) — flow-action definitions in the app flow.xml.
- [Add custom flow trigger from app system](platform/dev/6.7/guides/plugins/apps/flow-builder/add-custom-flow-triggers-from-app-system.md) — flow-event entries and the trigger-event route.

References and ADRs:
- [Flow Reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md) — trigger event names, including state_enter/state_leave and B2B employee events.
- [Flow Action Reference](platform/dev/6.7/resources/references/app-reference/flow-action-reference.md) — app flow actions in Resources/flow.xml and available variables.
- [Core Reference](platform/dev/6.7/resources/references/core-reference/_index.md) — reference index including Flow Builder.
- [Actions Reference](platform/dev/6.7/resources/references/core-reference/actions-reference.md) — B2B flow actions (ChangeEmployeeStatusAction and others).
- [Integrate an app into flow action](platform/dev/6.7/resources/references/adr/2022-04-19-integrate-app-into-flow-action.md) — ADR: apps ship actions as XML-defined webhooks.
- [Integrate an app into the flow event](platform/dev/6.7/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md) — ADR: custom app triggers (near-duplicate of the 6.6 ADR, updated for 6.7).
- [Adding the `StorableFlow` instead of the `FlowEvent` for implementing the flow DelayAction in flow builder](platform/dev/6.7/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md) — ADR: StorableFlow replaces FlowEvent (6.6 copy below).
- [Flow storer with scalar values](platform/dev/6.7/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md) — ADR: ScalarValuesAware/ScalarValuesStorer replace single-purpose pairs.
- [Introduce transactional flow actions](platform/dev/6.7/resources/references/adr/2024-02-11-transactional-flow-actions.md) — ADR behind TransactionalAction.
- [Move flow execution after business process](platform/dev/6.7/resources/references/adr/2025-01-31-move-flow-execution-after-business-process.md) — ADR: buffered flows run after the request, default from 6.8 via FLOW_EXECUTION_AFTER_BUSINESS_PROCESS.

## Developer: 6.6

The 6.6 pages mirror the 6.7 ones where titles match; use them only for 6.6 projects.
- [Flow](platform/dev/6.6/concepts/framework/flow-concept.md) — Flow Builder concepts and evaluation.
- [Flow](platform/dev/6.6/guides/plugins/plugins/framework/flow/_index.md) — plugin landing page for custom actions and triggers.
- [Framework](platform/dev/6.6/guides/plugins/plugins/framework/_index.md) — plugin Framework section landing page (DAL, events, rules, flow builder).
- [Flow Builder](platform/dev/6.6/guides/plugins/apps/flow-builder/_index.md) — apps adding custom flow actions.
- [Flow Reference](platform/dev/6.6/resources/references/core-reference/flow-reference.md) — trigger events and available actions (6.4.6.0+).
- [Flow Action Reference](platform/dev/6.6/resources/references/app-reference/flow-action-reference.md) — flow-action.xml reference (6.7 uses Resources/flow.xml).
- [Core Reference](platform/dev/6.6/resources/references/core-reference/_index.md) — reference index.
- [Integrate an app into the flow event](platform/dev/6.6/resources/references/adr/2022-06-17-integrate-app-into-flow-event.md) — ADR: custom app triggers.
- [Adding the `StorableFlow` instead of the `FlowEvent` for implementing the flow DelayAction in flow builder](platform/dev/6.6/resources/references/adr/2022-07-21-adding-the-storable-flow-to-implement-delay-action-in-flow-builder.md) — ADR: StorableFlow.
- [Flow storer with scalar values](platform/dev/6.6/resources/references/adr/2023-02-02-flow-storer-with-scalar-values.md) — ADR: ScalarValuesAware.
- [Flow Builder Preview](platform/dev/6.6/resources/references/adr/2023-07-13-flow-builder-preview.md) — ADR: optional Previewable interface for action previews in the administration.
- [Differentiator cluster for Shopware plugins or apps](platform/dev/6.6/resources/guidelines/testing/Differentiator-Clusters.md) — Store release criteria that mention Flow Builder.

## Merchant

- [Flow Builder](platform/func/settings/Flow-Builder.md) — triggers, conditions and actions in the administration.
- [Flow Builder Example Flows](platform/func/tutorials-and-faq/flow-builder-example-flows.md) — sample recipes.
- [Delayed Flow Actions](platform/func/features/delayed-flow-actions.md) — release a flow at a later date.
- [Share Flows](platform/func/features/share-flows.md) — import and export flows.
- [Webhook Actions In Flow Builder](platform/func/features/webhook-actions-in-flow-builder.md) — forward flow data to third-party APIs.
- [Business Events](platform/func/settings/Business-Events.md) — older event-to-email mechanism, superseded by Flow Builder.
- [Email Templates](platform/func/settings/email-templates.md) — mail variables per template type.
- [Shopware Commercial](platform/func/extensions/shopware-commercial.md) — plan-gated features including Flow Builder items.
- [Subscriptions](platform/func/settings/shop/subscriptions.md) — Flow/Rule Builder triggers for subscriptions.
- [Tags](platform/func/settings/tags.md) — tag management used in rules and flows.
- [Tags Examples](platform/func/tutorials-and-faq/tags-examples.md) — worked tag examples, including Flow Builder conditions.
- [After Order Payment Process](platform/func/shopware-6-de/after-order-payment-process.md) — order versus payment separation.
- [Shopware Payments](platform/func/shopware-services/shopware-payments.md) — includes Flow Builder actions.
- [Documentv2](platform/func/tutorials-and-faq/documentv2.md) — Document V2 tutorial that touches flows.
