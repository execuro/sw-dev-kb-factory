---
id: platform/dev/6.7/products/nexus/_index.md
title: Nexus
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/nexus/
sourceHash: 4bcc3152eeae2cf30a47667dff6455a5568ad04e
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware nexus", "nexus", "early access", "workflow automation", "event-driven integration", "low-code", "visual workflow builder", "business central", "items", "customers", "salesOrders", "erp integration", "managed cloud service"]
summary: "Shopware Nexus (Early Access): managed cloud low-code platform for event-driven workflows and ERP integration; features, limits, roadmap."
lastBuilt: 2026-09-15
---
## What it is

Shopware Nexus is a managed cloud platform for event-driven automation and integration. Merchants build workflows visually (low-code) that connect Shopware with ERPs, CRMs and other business systems. It is in **Early Access**: functions are limited and behaviour and scope may change. Feedback channel: the [Nexus club](https://hub.shopware.com/clubs/nexus).

## When to use

When evaluating automation of repetitive tasks triggered by Shopware events, bidirectional data sync with external systems (e.g. Microsoft Dynamics Business Central), or no-code conditional logic and data transformation — without writing a plugin.

## Key steps / config

Capabilities available in Early Access:

- Visual Workflow Builder (drag-and-drop)
- Shopware Event Triggers (react to entity events) and Schedule Triggers (cron-based)
- Business Central Integration: CRUD for 3 entities `items`, `customers`, `salesOrders`
- Shopware API Actions (call any endpoint in your store) and API requests (any external endpoint)
- Slack Notifications, S3 Storage
- Conditional Logic (if/else and switch), Data Transformation (map and filter), Expression Placeholders (insert event data into templates), Delay Node
- Execution Monitoring (runs and metrics, per-node timeline and payloads)
- Workflow Versioning (published version history with compare and restore)
- User Management & Roles: Admin, Builder, Viewer per company

## Essential identifiers

- Business Central entities `items`, `customers`, `salesOrders`
- Roles Admin, Builder, Viewer

## Gotchas

- Not available during Early Access: SLA guarantees, 24/7 support, multi-region deployment (EU only), workflow marketplace.
- Managed cloud service only; on-premise and self-hosted deployment are not being considered.

## Version notes

- Planned for GA: AI-Assisted Authoring, Advanced Analytics, Per-Tenant Quotas (usage and billing).
- Planned post-GA: additional ERP connectors (SAP, Oracle, etc.), Custom Node Development.

## Code check (6.7.13.0)
- unverified `salesOrders` — Nexus is an external managed cloud service; no implementation in vendor/shopware core, storefront or administration src
- unverified `Visual Workflow Builder` — SaaS feature, out of scope of the installed Shopware code
