---
id: platform/dev/6.7/products/nexus/workflow.md
title: Nexus
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/workflow.html
sourceHash: 0452e44b1e21f880a3a8eb6e02052bd2ae3be36e
codeCheckedAgainst: "6.7.13.0"
keywords: ["nexus", "workflow builder", "workflow states", "node types", "trigger node", "Shopware Event Trigger", "Schedule Trigger", "Business Central", "expression syntax", "{{payload.order.orderNumber}}", "versioning", "integration automation"]
summary: Shopware Nexus workflow builder with node types (triggers, actions, transforms, conditions, outputs), workflow states, versioning and {{ }} expressions.
lastBuilt: 2026-09-15
---
## What it is

Reference for building workflows in Shopware Nexus: workflow structure, builder UI, lifecycle states, execution metrics, versioning, available node types, and the `{{ }}` expression syntax used in templates and mappings.

## When to use

- Designing a Nexus workflow that reacts to Shopware events or a schedule and calls Shopware, Business Central, Slack, HTTP APIs or S3.
- Interpreting a workflow's state or which toolbar actions are available.
- Writing mapping/template expressions against the trigger payload.

## Key steps / config

Structure: nodes connected on a canvas, typically **Trigger → Actions → Transforms → Conditions → Outputs**.

Builder elements: Canvas, Node Palette, Node Configuration (Params, Credentials, Notes, Debug), Config Templates (reuse node configs across workflows), Toolbar (Save, Publish, Run, Undeploy, Import/Export), Execution Tab (run history, metrics). Workflows can be run manually with an optional input payload and exported/imported as JSON.

States:

| State | Meaning | Actions |
|---|---|---|
| Draft | Editing | Save, Publish |
| Published | Built and ready | Execute |
| Deploying | Creating deployment | - |
| Active | Running | Undeploy |
| Inactive | Deployed but stopped | Execute, Delete |
| Undeploying | Removing deployment | - |
| Failed | Deployment or execution failed | Retry, Delete |

Node types:

- Trigger: Shopware Event Trigger (shop, event), Schedule Trigger (cron, timezone)
- Action: Business Central (entity, operation), Shopware API Call (method, endpoint), Send Slack Message (channel, template), API Request (URL, headers), Send Shopware Email (recipient, content)
- Transform: Filter (array items)
- Condition: If (true/false), Switch (complex branching)
- Control: Delay
- Output: S3 Storage

Expressions:

```text
{{payload.order.orderNumber}}
{{bc_customers_response.value[0].id}}
{{customer.firstName}} {{customer.lastName}}
```

Used for Slack templates, mapping trigger payload values into action parameters, and driving `If` conditions.

Execution metrics: status (Success/Failed/Running), duration, messages per node, error counts and latency, a node timeline (step, label, status, runtime), and per-node payload as formatted JSON.

## Essential identifiers

- Nodes: `Shopware Event Trigger`, `Schedule Trigger`, `Business Central`, `Shopware API Call`, `Send Slack Message`, `API Request`, `Send Shopware Email`, `Filter`, `If`, `Switch`, `Delay`, `S3 Storage`
- Expression syntax: `{{ }}`

## Gotchas

- Monitoring requires manual refresh.
- A workflow must be deactivated before restoring a version.
- Restoring a version replaces the current draft; existing published versions stay untouched.

## Version notes

Each publish stores an immutable version (author, publish time) in the **Versions** panel, which supports comparing two versions (node, connector, setting changes) and restoring an earlier one.

## Code check (6.7.13.0)
- confirmed `OrderEntity::$orderNumber` — order field behind `payload.order.orderNumber` — vendor/shopware/core/Checkout/Order/OrderEntity.php:34
- confirmed `CustomerEntity::$firstName` — customer field used in the name expression — vendor/shopware/core/Checkout/Customer/CustomerEntity.php:49
- confirmed `CustomerEntity::$lastName` — customer field used in the name expression — vendor/shopware/core/Checkout/Customer/CustomerEntity.php:51
- unverified `Shopware Event Trigger` — Nexus SaaS node, not in installed code
- unverified `bc_customers_response` — Business Central response variable, external service
