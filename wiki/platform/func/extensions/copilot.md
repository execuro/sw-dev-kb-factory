---
id: platform/func/extensions/copilot.md
title: Copilot
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/copilot
sourceHash: 431d739ca77d40b60b2a8baaf443b97bb9e5feeca61eafcfa61633016844a1cd
revision:
  current: true
  range: "6.7.8.0"
  swMax: null
  swMin: null
keywords: ["Copilot", "SwagCopilot", "Data Insights", "Agentic", "chat history", "skills", "Copilot credits", "custom role", "Shopware Intelligence+", "MCP", "@ mention", "Manage extensions", "AI assistant", "Users & permissions"]
summary: "Administration Copilot AI assistant: chat, role and skill settings, Data Insights, @ entity mentions, agentic draft approval, activity history and FAQ."
lastBuilt: 2026-10-20
---
## What it is

Copilot is a chat-based AI assistant in the Shopware Administration. It answers questions about Shopware features and setup, queries shop data (Data Insights) and, in Agentic mode, performs admin tasks after approval.

## When to use

When configuring who may use Copilot and what it may access, using data questions about orders, customers or performance, or letting Copilot prepare changes such as discount campaigns, flows or bulk product updates.

## Key steps / config

- **Open**: the three-stars button on the right of the dashboard; pick a suggested question or type one. Chat history (clock icon) is user-specific; delete all or single chats via context menus. A new chat can start while another runs; a status circle shows progress.
- **Settings** (gear icon): General tab, enable **Use custom roles for Copilot** and select a role. Permissions (view, edit, create, delete) come from **Users & permissions**. The Skills tab toggles features and shows remaining free monthly Copilot credits; an Upgrade button appears for skills needing Intelligence+.
- **Data Insights**: ask data questions (turnover, newsletter registrations, bestsellers) and get text, table or graph output, CSV export and a full-screen sidebar. Copilot does not process PII. A global switch in the Copilot context menu disables Data Insights if large shops slow down.
- **Mention entities** with `@`: Categories, Customers, Landing pages, Products; for example `How many @PRODUCT are left in my inventory?`. Requires Data Insights active and Shopware 6.7.3.0 or higher.
- **Agentic**: Copilot drafts a change, shows old and new values and the affected data, and applies it only after **Approve** (Reject is possible). The activity history lists requests per date with read counts and whether changes were made, with search and time filter. Compatible plugins and apps can expose features to Copilot via MCP; the provider sets this up.
- **Access**: initially administrators only. For others, Settings > System > Users & permissions > Roles, activate **Manage extensions** under Additional permissions so that Apps > SwagCopilot becomes visible.

## Gotchas

- Free requests per month are limited; beyond that an active Shopware Intelligence+ subscription is needed.
- Agentic features depend on Data Insights; if it is disabled they are unavailable. Executed actions cannot be reverted; Copilot acts within the assigned role.
- Do not enter sensitive data; answers can be inaccurate.
- Queries go to an external AI provider (currently based in Europe) that has no shop access and does not train on the data; Shopware collects requests to improve the product.

## Version notes

Entity mentions need 6.7.3.0 or higher. The page revision range is 6.7.8.0.
