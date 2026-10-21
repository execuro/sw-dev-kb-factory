---
id: platform/dev/6.7/products/nexus/_index.md
title: Nexus
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/
sourceHash: 4bcc3152eeae2cf30a47667dff6455a5568ad04e
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware nexus", "nexus", "workflow automation", "event-driven integration", "visual workflow builder", "business central", "items", "customers", "salesOrders", "schedule triggers", "early access", "low-code", "erp integration"]
summary: Overview of Shopware Nexus (Early Access) - a managed cloud workflow service. Lists triggers, nodes, Business Central CRUD, limits and planned features.
lastBuilt: 2026-10-21
---
## What it is

Shopware Nexus is a managed cloud platform for event-driven automation and integration. Merchants build workflows in a visual, low-code builder. The workflows connect Shopware with ERPs, CRMs and other business systems. Nexus is in **Early Access**: its feature set is limited, and its behaviour and scope may change. Questions and feedback go to the Nexus club on the Shopware hub.

## When to use

Use it when you want to automate repetitive tasks triggered by Shopware events. It also fits when you need to sync data both ways between Shopware and an external system such as Microsoft Dynamics Business Central, without writing code. Other uses are conditional logic, data transformation, monitoring of execution in real time, and role-based team access.

## Key steps / config

Available in Early Access:

| Feature | What it does |
|---|---|
| Visual Workflow Builder | Drag-and-drop interface |
| Shopware Event Triggers | React to entity events |
| Schedule Triggers | Cron-based execution |
| Business Central Integration | CRUD for 3 entities: `items`, `customers`, `salesOrders` |
| Shopware API Actions / API requests | Call any endpoint in your store / any external endpoint |
| Slack Notifications, S3 Storage | Send Slack messages; store data on S3 |
| Conditional Logic | If/else and switch branching |
| Data Transformation, Expression Placeholders | Map/filter data; insert event data into templates |
| Execution Monitoring | Runs and metrics, with a per-node timeline and payloads |
| Delay Node | Timed delays between steps |
| Workflow Versioning | Published version history with compare and restore |
| User Management & Roles | Admin, Builder and Viewer roles per company |

Planned for GA: AI-assisted authoring, advanced analytics, per-tenant quotas (usage and billing). Planned post-GA: more ERP connectors (SAP, Oracle, etc.) and custom node development.

## Essential identifiers

- Business Central entities: `items`, `customers`, `salesOrders`
- Roles: Admin, Builder, Viewer

## Gotchas

- Early Access does not include SLA guarantees, 24/7 support, multi-region deployment (EU only) or a workflow marketplace.
- Nexus runs only as a managed cloud service. On-premise and self-hosted deployment are not planned.

## Code check (6.7.15.1)
- unverified `Shopware Nexus` — external managed cloud service, not part of the core/storefront/administration code
- unverified `salesOrders` — Business Central entity name handled by Nexus, not in Shopware code
- confirmed `services:install` — the core installs Shopware services (the delivery channel for Nexus components) via this command — vendor/shopware/core/Service/Command/Install.php:16
