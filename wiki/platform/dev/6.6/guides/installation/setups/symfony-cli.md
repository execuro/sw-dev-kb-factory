---
id: platform/dev/6.6/guides/installation/setups/symfony-cli.md
title: Symfony CLI
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/installation/setups/symfony-cli.html
sourceHash: 5aba474f77bf638a5ebb5465058af6716d41fbe4
keywords: ["symfony cli", "symfony server:start", "symfony console", "system:install", "basic-setup", ".env.local", ".php-version", "database url", "default admin credentials"]
summary: "Using Symfony CLI to create, install, and serve a Shopware 6.6 project locally without Docker for the app itself."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.6/guides/installation/requirements.md
---

## What it is

Describes running Shopware locally with the Symfony CLI, a lightweight alternative to
Docker for the application server (though it can still run the database in a container).

## When to use

For a local setup where PHP/Composer/Node are installed directly on the host and MySQL is
either installed locally or run via Symfony CLI's Docker integration.

## Key steps / config

- Create a project: `composer create-project shopware/production <project-name>` (or pin
  a version, e.g. `shopware/production:6.6.10.0`). Symfony Flex prompts whether to run the
  database in a container.
- Without Docker: set the DB connection in `.env.local`:
  ```dotenv
  DATABASE_URL=mysql://username:password@localhost:3306/dbname
  ```
- With Docker: `docker compose up -d` to start; `docker compose down` to stop (add `-v` to
  also remove data).
- Install: prefix commands with `symfony`, e.g.
  `symfony console system:install --basic-setup` (`--basic-setup` creates an admin user
  and default sales channel for `APP_URL`; add `--create-database` if the DB doesn't exist
  yet).
- Default admin credentials: username `admin`, password `shopware` — change them after
  install.
- Serve: `symfony server:start` (add `-d` to background it); stop with
  `symfony server:stop`.
- Change PHP version per project via a `.php-version` file (e.g. content `8.3`); verify
  with `symfony php -v`.
- Change PHP config per project via a `php.ini` file (e.g. `memory_limit = 512M`); verify
  with `symfony php -i`.

## Essential identifiers

- `symfony console system:install --basic-setup`, `symfony server:start`,
  `symfony server:stop`, `symfony php -v`, `symfony php -i`
- `.env.local`, `.php-version`, `php.ini`

## Gotchas

- Always prefix commands with `symfony` — otherwise the wrong PHP version or the Docker
  MySQL database may be used instead of the intended one.
