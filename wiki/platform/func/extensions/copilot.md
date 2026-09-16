---
id: platform/func/extensions/copilot.md
title: Copilot
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/copilot
sourceHash: 8b7735c637ee8cdf4f5e0fb14abfb9dcf97f6df310b7b71e95e7071fe4dd636c
revision:
  current: true
  range: "6.7.8.0"
  swMax: null
  swMin: null
keywords: ["Copilot", "Copilot Agentic", "Data Insights", "Copilot credits", "@PRODUCT", "entity mention", "SwagCopilot", "custom role", "Users & permissions", "Shopware Intelligence+"]
summary: "Chat-based admin AI assistant: Data Insights Q&A, entity mentions, custom Copilot roles, and Copilot Agentic draft-and-approve task execution."
lastBuilt: "2026-09-15"
---

## What it is

Copilot is a chat-based AI assistant in the Shopware Administration that answers configuration/feature questions, answers data-related questions via Data Insights, and — in Copilot Agentic — drafts changes for admin approval before executing them.

## When to use

When an admin wants quick answers about store configuration or features, data-driven insights (turnover, newsletter signups, bestsellers), or wants Copilot to perform bulk/recurring admin tasks after reviewing a draft.

## Key steps / config

- Open Copilot via the **three stars** button on the admin dashboard; pick a suggested question or type into the text field; view **Chat history** via the clock/circular-arrow icon; start a **New chat** to run parallel conversations.
- **Copilot settings** (gear icon): **General** tab — enable "Use custom roles for Copilot" and assign a role (managed under Settings > System > Users & permissions) to restrict which admin areas Copilot may view/edit/create/delete.
- **Skills** tab: enable/disable individual Copilot features and see remaining free monthly Copilot credits; an Upgrade prompt appears for skills requiring a Shopware Intelligence+ subscription.
- **Data Insights**: ask data questions about customers/orders/performance; output as text, table, or graph; supports CSV export and a full-screen sidebar view. Does not process PII — e.g. cannot answer address requests.
- Mention entities in prompts with `@` (Categories, Customers, Landing pages, Products), e.g. `How many @PRODUCT are left in my inventory?`; requires Data Insights active and Shopware 6.7.3.0 or higher.
- **Copilot Agentic** (beta): performs tasks such as creating discount campaigns, setting up flows, or bulk product updates. Presents a draft with an affected-data preview; changes only apply after clicking **Approve** (or are discarded on **Reject**). **Activity history** lists past requests with the read/write operations performed, filterable by search and time.
- Access: only administrators have initial access; additional users are enabled via Settings > System > Users & permissions > Roles, with the "Manage extensions" additional permission required to reveal Apps > SwagCopilot.

## Essential identifiers

Copilot, Copilot Agentic, Data Insights, `@PRODUCT` (entity mention), SwagCopilot, Manage extensions permission

## Gotchas

- Copilot Agentic requires Data Insights enabled; disabling Data Insights disables the agentic functions too.
- Executed Agentic actions cannot be reverted.
- Copilot does not have direct shop access and does not use entered data to train the AI model.
- Do not enter sensitive data (names, bank details) into Copilot prompts.
- Disable Data Insights via the global switch in the Copilot context menu if data-intensive skills slow the admin area on very large shops.

## Version notes

Entity mentions (`@`) require Shopware 6.7.3.0 or higher. Both Data Insights beyond the free monthly quota and Copilot Agentic require an active Shopware Intelligence+ subscription.
