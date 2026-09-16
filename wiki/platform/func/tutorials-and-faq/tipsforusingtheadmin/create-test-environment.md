---
id: platform/func/tutorials-and-faq/tipsforusingtheadmin/create-test-environment.md
title: Create Test Environment
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/tipsforusingtheadmin/create-test-environment"
sourceHash: "88b8da7804301cbf9b58d16c323061cbdd995e6042a1cf881f9025623849913d"
revision:
  current: true
  range: "6.0.0 - 6.6.0.3"
  swMax: "6.6.0.3"
  swMin: "6.0.0"
keywords: ["test environment", "staging mode", "database dump", "mysqldump", "hosts file", "app_url", "database_url", "env.local", "subdomain", "phpmyadmin", "adminer", "mysql cli"]
summary: "Two ways to create a Shopware 6 test environment: mirroring the live shop to a sub-domain, or a local setup via a hosts-file entry, plus Staging Mode."
lastBuilt: "2026-09-15"
---

## What it is

Instructions for building a Shopware 6 test environment, either by mirroring the live
shop into a secondary directory reachable via a sub-domain, or by running a local copy
reachable through the live domain via a hosts-file entry, plus a pointer to Shopware's
built-in Staging Mode (since 6.6.1.0).

## When to use

Before applying updates or risky changes to a live shop, to validate them in an isolated
copy first without affecting the production system.

## Key steps / config

**Mirroring to a secondary directory (recommended over a sub-directory of the main
shop, unlike the old Shopware 5 approach):**
- Create a new folder next to the main store directory (e.g. "testshop") and copy the
  live environment's files into it, including hidden files such as `.env` and
  `.htaccess`.
- Create a sub-domain at the hoster and route it to the new folder; it must differ from
  the main shop domain.
- Create an empty database for the test shop (via phpMyAdmin, Adminer, or the MySQL CLI
  login followed by `CREATE DATABASE IF NOT EXISTS NameOfYourDatabase CHARACTER SET
  utf8mb4 COLLATE utf8mb4_unicode_ci;`), always with a prior backup.
- Update the test environment's env file: from Shopware 6.5 current data lives in
  `.env.local` (the `.env` file itself is used only up to and including 6.4). Adjust the
  `DATABASE_URL` entry so the database name after the final `/` matches the newly
  created test database, and adjust `APP_URL` so it points at the test shop's public
  folder. `COMPOSER_HOME` may also need adjusting if it points inside the Shopware
  directory.
- Copy the live database into the test database via phpMyAdmin export/import, Adminer
  export/import, or CLI: `mysqldump -u Username -p NameOfTheDatabase > Filename.sql` to
  export, then `mysql -u Username -p NameOfTheDatabase < Filename.sql`-style import to
  load it — the CLI route is generally fastest and recommended when export/import
  through the UI hits file-size or timeout limits.
- In the admin, edit the test sales channel's domain URL (e.g. append `/testshop`) to
  match the new folder.

**Local test environment via a hosts-file entry:**
- Add an entry mapping the live shop's domain to the local test environment's IP address
  in the operating system's hosts file — on Windows this file lives under
  `WINDOWS\System32\drivers\etc`; on Ubuntu/Linux and macOS it is under `/etc/hosts`
  (macOS: edit via `sudo nano /etc/hosts`).
- The domain spelling (with or without `www`) must exactly match what is stored in the
  Shopware account, since plugin license checks are tied to that domain.
- The local environment must be able to reach the Shopware server for plan/license
  comparison; if support access is needed, the local system should also be reachable
  over the internet.
- While the hosts entry is active, the live shop cannot be reached from that computer via
  its normal domain.

**Staging Mode**: since Shopware 6.6.1.0, an integrated Staging Mode prepares the shop
for a staging environment so changes can be tested without affecting the live shop; full
activation steps are in Shopware's developer documentation on staging configuration.

## Essential identifiers

- `.env` / `.env.local` (env file location depends on Shopware version)
- `DATABASE_URL`, `APP_URL`, `COMPOSER_HOME` (env vars to adjust)
- `mysqldump` (CLI database export)
- Staging Mode (built-in, since Shopware 6.6.1.0)

## Gotchas

- Copying the test shop into a sub-directory of the live shop (the old Shopware 5
  pattern) is explicitly discouraged in Shopware 6 due to operational problems.
- Forgetting to copy hidden files (`.env`, `.htaccess`) is a common mistake since some
  file managers hide dotfiles by default.
- Plugin license/plan comparisons require the domain configured locally to exactly match
  the domain stored in the Shopware account, including `www` presence/absence.

## Version notes

From Shopware 6.5 onward, environment configuration is read from `.env.local`; `.env`
alone is only used up to and including Shopware 6.4. Staging Mode was introduced in
Shopware 6.6.1.0.
