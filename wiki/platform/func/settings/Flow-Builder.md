---
id: platform/func/settings/Flow-Builder.md
title: Flow Builder
docType: functional
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/Flow-Builder"
sourceHash: 7d82b5c4068e88b2aee70c94153542c3e43c7355fcc9b60a1c32c86627d8ee40
revision:
  current: true
  range: "6.6.2.0 - 6.6.10.6"
  swMin: "6.6.2.0"
  swMax: "6.6.10.6"
keywords: ["flow builder", "trigger", "condition", "action", "checkout.order.placed", "rule builder", "webhook", "delayed action", "custom trigger", "automation", "send mail", "stop flow", "share flows"]
summary: Flow Builder automates business processes with event triggers, rule-based conditions, and actions such as sending mail or calling webhooks.
lastBuilt: 2026-09-15
---
## What it is

Flow Builder, under **Settings > Automation**, lets merchants automate business processes without programming: a **trigger** fires on a Shopware event, optional **conditions** built from the Rule Builder narrow when it applies, and one or more **actions** are then executed.

## When to use

Used to automate tasks like sending emails, changing order status, calling external URLs, or applying tags/custom fields in reaction to store events such as an order being placed or a customer registering.

## Key steps / config

A flow has two tabs when created or edited:
- **General**: Name, Description, Priority (order among flows sharing a trigger), Active toggle.
- **Flow**: select a **trigger**, then use the plus symbol to add **conditions** and **actions**.

Example triggers (technical names): `checkout.order.placed`, `checkout.customer.register`, `checkout.customer.login`, `state_enter.order.state.completed`, `mail.before.send`, `newsletter.register`. The trigger `checkout.order.payment_method.changed` automatically sets order status to "Open" and must not be set to "Open" again via flow.

Actions include: Assign account status, Assign affiliate/campaign code, Assign customer group, Generate a document, Send mail, Assign status (payment/shipping/order), Stop flow, Set download access, Change custom field content, Add Tag/Remove Tag. **Stop flow** halts the whole flow regardless of parallel branches; later conditions/actions after a triggered "Stop flow" are skipped.

**Delayed Actions** (Shopware Beyond plan) let an action fire after a delay set as Hour/Day/Week/Month or a custom value in the format `SS.TT.WW.MM`. Delayed items appear under **Scheduled Actions**.

**Custom Trigger** (since 6.5.3.0) lets apps register their own triggers, and flows can call third-party webhooks or be triggered by third-party events; see the developer guide `add-custom-flow-triggers-from-app-system`.

**Webhook Actions** (Evolve plan, requires the Shopware Commercial extension) add the **Call URL (Webhook)** action, supporting methods GET, POST, PUT, PATCH, DELETE, with configurable URL, parameters, header parameters, body, and Basic Auth.

**Share Flows** (from 6.4.19.0, Rise plan): flows can be downloaded/uploaded under **Settings > Flow Builder** via **Upload Flow**; the downloaded file contains sequences and configuration, but references to categories/products/properties may be dropped and must be reassigned on import.

## Essential identifiers

- `checkout.order.placed`, `checkout.order.payment_method.changed` — trigger event names
- **Settings > Automation > Flow Builder** — menu path
- **Call URL (Webhook)** action
- Delay format `SS.TT.WW.MM`

## Gotchas

If "Administrator" is selected as the mail recipient, all users with the admin flag receive the email, including external users using an admin account for API access. Some order statuses are interdependent — e.g. Refunded/Partially Refunded/Chargeback payment status can only be set if the order previously had Paid or Partially Paid status.

## Version notes

Delayed Actions require the Beyond plan; Webhook Actions require the Evolve plan and the Shopware Commercial extension; Custom Trigger support was added in 6.5.3.0; Share Flows was added in 6.4.19.0 and requires the Rise plan.
