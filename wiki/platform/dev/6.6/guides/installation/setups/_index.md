---
id: platform/dev/6.6/guides/installation/setups/_index.md
title: Setups
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/installation/setups/
sourceHash: 09db14d488807ad8a46835e89c2beed66c55389d
keywords: ["setups", "Docker setup", "Symfony CLI", "Devenv", "Dockware", "DDEV", "development setup", "production setup", "managed hosting", "container-based hosting", "Kubernetes", "Deployer"]
summary: Index page comparing local development setups (Docker, Symfony CLI, Devenv, Dockware, DDEV) and production hosting options.
lastBuilt: "2026-09-15"
---
## What it is

This is the index page for the "Setups" section, listing the available ways to run Shopware 6 both for development and in production.

## When to use

Use this page when deciding which local development environment or production hosting approach to use for a Shopware 6 project, before setting up the underlying database and webserver described on the "Requirements" page.

## Key steps / config

Before choosing a setup, the requirements section explains how to install and configure the necessary services (database, webserver) on a Unix-like system (Linux, macOS, WSL). Technically there is no real difference between a development and a production setup — they only differ in performance and security optimizations.

Development setups listed:
- Docker — a beginner-friendly Docker Compose setup for Shopware 6, suitable for local development.
- Symfony CLI — the default way to run Symfony applications, also suitable for Shopware.
- Devenv — a setup managing all necessary services via a description file in the source code, working on Linux, WSL, and macOS.
- Dockware — a managed Docker setup for Shopware 6 maintained by the agency dasistweb (community-maintained, not by Shopware).
- DDEV — Docker-based PHP development environments, generic enough for any PHP project (community-maintained, not by Shopware).

Production setup options:
- Managed hosting — many hosting providers, especially Shopware-certified ones, offer a fully pre-configured hosting environment; you upload the Shopware project template to the server and run the installation commands. The Deployer tool can automate this deployment process.
- Container-based hosting — a dedicated Docker guide covers setting up a production-ready Docker environment; for Kubernetes, there is a Shopware Kubernetes Operator (`github.com/shopware/shopware-operator`).

## Essential identifiers

- Docker / Docker Compose setup
- Symfony CLI
- Devenv
- Dockware, DDEV (community setups)
- Deployer (deployment automation tool)
- `github.com/shopware/shopware-operator` (Kubernetes Operator)

## Gotchas

Dockware and DDEV are maintained by the community, not directly by Shopware; issues with them should be reported in their respective repositories rather than to Shopware.
