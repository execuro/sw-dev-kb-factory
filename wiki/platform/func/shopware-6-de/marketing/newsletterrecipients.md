---
id: platform/func/shopware-6-de/marketing/newsletterrecipients.md
title: Newsletterrecipients
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-de/marketing/newsletterrecipients
sourceHash: bb4b97770a0a3ae92fed4206533b03dad5a77b9f349e98f31f53f3e23335c16d
revision:
  current: true
  range: "6.0.0 - 6.6.10.20"
  swMax: "6.6.10.20"
  swMin: "6.0.0"
keywords: ["newsletter recipients", "Newsletter Recipients", "marketing", "double opt-in", "opt-in status", "awaiting activation", "immediately active", "awaiting deletion", "subscriber list", "filter", "tags", "admin", "sales channel"]
summary: "Admin overview of newsletter recipients under Marketing, covering status meanings, filtering, and editing a recipient's details and tags."
lastBuilt: "2026-09-15"
---
## What it is

The Newsletter Recipients screen, found in the admin under **Marketing > Newsletter Recipients**, lists all customers who have registered for the newsletter in their accounts.

## When to use

Use this page to review who has subscribed to the newsletter, check their confirmation status, and edit or tag individual recipients.

## Key steps / config

- Overview list (1): shows all registered newsletter recipients.
- Context menu (2) per entry: remove or edit the recipient.
- List settings (3): choose which columns/information are displayed.
- Filter (4): narrow the list by **status**, **language** or **sales channel**.
- Edit recipient (via context menu): change address, language, e-mail address, and **Tags** (custom keywords for later search).
- Related configuration is described in the "Newsletter" docs article.

## Essential identifiers

- Admin path: `Marketing > Newsletter Recipients`
- Filter fields: status, language, sales channel
- Edit fields: address, language, e-mail address, Tags

## Gotchas

- Status meanings:
  - Awaiting activation: double opt-in is enabled and the customer still needs to confirm registration.
  - Immediately Active: double opt-in is disabled and the customer has signed up.
  - Active: the customer has confirmed registration.
  - Awaiting deletion: the customer unsubscribed and deletion from the newsletter recipient list is required.
