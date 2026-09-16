---
id: "platform/func/first-steps/first-run-wizard.md"
title: "First Run Wizard"
docType: "functional"
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/first-steps/first-run-wizard"
sourceHash: "eb4abf85cc3f169d79d5bd564aa3b20f0c1c7d77c09e53b0a9967a5081120c8e"
revision:
  current: true
  range: "6.4.5.0 - 6.7.2.2"
  swMax: "6.7.2.2"
  swMin: "6.4.5.0"
keywords: ["first run wizard", "initial setup", "demo data", "default sales channel", "product visibility", "mailer configuration", "PayPal configuration", "migration assistant", "Shopware account", "domain verification", "Shopware Store", "community edition"]
summary: "First Run Wizard guides initial shop setup: demo data, default sales channel, mailer/PayPal config, extensions, and account link."
lastBuilt: "2026-09-15"
---
## What it is
The First Run Wizard launches automatically the first time the installer logs you into the admin interface after a successful installation, and guides you through setting up your shop step by step. It can also be reopened later.

## When to use
Use it during initial setup, or reopen it any time via **Settings > System > First Run Wizard** to review or change the initial settings.

## Key steps / config
1. Data import — optionally add demo data (products, categories, manufacturers) via **Next**; demo data is for testing only, not production. Click **Skip** to decline. A migration wizard is also available.
2. Default values — set the default sales channels linked to new products, and default product visibility: Visible (default), Hide in listings, or Hide in listings and search.
3. Mailer configuration — configure mail sending/receiving, or defer with **Set later**.
4. PayPal configuration — enter PayPal API access data and optionally set PayPal as the default payment method for all existing sales channels.
5. Extensions — browse and install plugins by region and category (e.g. the Migration Assistant, found under Tools).
6. Your Shopware account — link or create a Shopware account, verify a domain, and link that domain to the shop; keep the domain-verification file until this step completes.
7. Shopware Store — optionally connect the shop directly to the Shopware Store to access extensions and services.

## Essential identifiers
- `Settings > System > First Run Wizard`
- Migration Assistant

## Gotchas
Domains created via the First Run Wizard are stored as a Community Edition in the Shopware account.

## Version notes
Applies to the range 6.4.5.0 - 6.7.2.2.
