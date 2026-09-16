---
id: platform/func/settings/logging.md
title: Logging
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/logging
sourceHash: c71254e3ce2de6c4a760fa47d0b5e60ff520f6983ef8cac8ff3491ca1b06bf49
revision:
  current: true
  range: "6.4.0.0 - 6.4.20.2"
  swMin: "6.4.0.0"
  swMax: "6.4.20.2"
keywords: ["event log", "logging", "settings system event logs", "log priority", "debug", "info", "error", "critical", "self-hosted logging", "mail log details", "self-hosted store only"]
summary: How the self-hosted event log under Settings > System > Event logs tracks store actions and lets you inspect log entry details by priority.
lastBuilt: 2026-09-15
---
## What it is

The event log lets a self-hosted store transparently track which actions occurred and when — for example an order being placed or an email being sent — so failures such as a cancelled order can be traced by timestamp, priority, and message content. This article applies only to self-hosted stores, not Shopware 6 Cloud/SaaS environments.

## When to use

Use **Settings > System > Event logs** to investigate whether a specific system action (order, email dispatch, etc.) happened and to find the cause of an error.

## Key steps / config

- The overview lists log entries in columns that can be hidden via the **"..."** icon and restored via the 3-dash icon; compact mode can also be toggled here.
- A **central search bar** searches the logs.
- Columns: **Message** (originating area, e.g. checkout or mail), **Priority** (with numeric severity), **Content** (the actual log text; clicking it opens the entry's details).
- Priority levels: Debug (100), Info (200), Error (300, should be checked), Critical (400, should be checked immediately).
- Clicking a log entry, or its **"..."** icon, opens a details modal; mail logs offer multiple views of the mail, while debug entries are shown only in source-code format.

## Essential identifiers

- Admin path: **Settings > System > Event logs**.
- Priority values: `Debug (100)`, `Info (200)`, `Error (300)`, `Critical (400)`.

## Gotchas

From version 6.5 onwards, event log entries were reduced by default to keep the log clearer; the developer documentation covers how to re-enable e-mail logging if needed.
