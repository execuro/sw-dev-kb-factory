---
id: platform/dev/6.7/products/nexus/workflow.md
title: Nexus
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/workflow.html
sourceHash: 0452e44b1e21f880a3a8eb6e02052bd2ae3be36e
codeCheckedAgainst: "6.7.15.1"
keywords: ["nexus", "workflow builder", "workflow states", "node types", "Shopware Event Trigger", "Schedule Trigger", "Shopware API Call", "Business Central", "expression syntax", "If", "Switch", "versioning", "integration automation"]
summary: Shopware Nexus workflow builder - node types (triggers, actions, transforms, conditions, outputs), workflow states, versioning and {{ }} expression syntax.
lastBuilt: 2026-10-21
---
## What it is

The fundamentals of building workflows in Shopware Nexus: workflow structure and states, the available node types, and the expression syntax used for mappings and templates. A workflow is a set of nodes connected on a visual canvas.

## When to use

When you build or debug a Nexus automation, e.g. reacting to a Shopware entity event, writing to Business Central, sending a Slack message or calling an HTTP API, and need to know which node to use, what state a workflow is in, or how to reference payload data.

## Key steps / config

Typical workflow structure, in order: **Trigger** (starts the workflow) → **Actions** (API calls, ERP writes, notifications) → **Transforms** (shape/filter data) → **Conditions** (branching) → **Outputs** (store results).

Builder interface: Canvas, Node Palette, Node Configuration (Params, Credentials, Notes, Debug), Config Templates (reuse node configurations across workflows), Toolbar (Save, Publish, Run, Undeploy, Import/Export), Execution Tab (run history and metrics). A workflow can be run manually with an optional input payload, and exported/imported as JSON.

Workflow states:

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

- Trigger: `Shopware Event Trigger` (react to entity events; config: shop, event), `Schedule Trigger` (cron, timezone)
- Action: `Business Central` (CRUD on BC entities; entity, operation), `Shopware API Call` (method, endpoint), `Send Slack Message` (channel, template), `API Request` (generic HTTP; URL, headers), `Send Shopware Email` (recipient, content)
- Transform: `Filter` (filter array items)
- Condition: `If` (true/false branch), `Switch` (complex branching)
- Control: `Delay`
- Output: `S3 Storage` (store payload)

Expressions use double-curly syntax in templates and mappings:

```text
{{payload.order.orderNumber}}
{{bc_customers_response.value[0].id}}
{{customer.firstName}} {{customer.lastName}}
```

Used for Slack message templates, mapping trigger payload values into action parameters, and driving `If` conditions.

Versioning: every publish stores an immutable version. The **Versions** panel lists versions with author and publish time, compares two versions (node, connector and setting changes), and restores an earlier version into the current draft (published versions stay untouched).

## Essential identifiers

- Node names: `Shopware Event Trigger`, `Schedule Trigger`, `Shopware API Call`, `Send Shopware Email`, `Business Central`, `API Request`, `Send Slack Message`, `Filter`, `If`, `Switch`, `Delay`, `S3 Storage`
- States: `Draft`, `Published`, `Deploying`, `Active`, `Inactive`, `Undeploying`, `Failed`
- Expression form: `{{payload.<path>}}`, `{{<node>_response.<path>}}`

## Gotchas

- A workflow must be deactivated before you can restore a version.
- Execution monitoring requires a manual refresh.
- Execution metrics cover status (Success / Failed / Running), duration, messages processed per node, error counts and latency, a per-node timeline, and per-node payload inspection as formatted JSON.

## Code check (6.7.15.1)
- unverified `Shopware Event Trigger` — Nexus node of the hosted Nexus service, not implemented in the installed Shopware packages
- unverified `Shopware API Call` — Nexus node, hosted-service behaviour outside the installed code
- unverified `Send Shopware Email` — Nexus node, hosted-service behaviour outside the installed code
- unverified `{{payload.order.orderNumber}}` — Nexus expression syntax, evaluated by the Nexus service, not by Shopware core
