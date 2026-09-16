---
id: platform/dev/6.7/products/tools/cli/_index.md
title: Shopware CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/
sourceHash: 22e9c97c54d0c03c24b84f0e24fe3e145f2aedfe
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli", "shopware cli", "extension validate", "project validate", "extension fix", "project fix", "shopware/shopware-cli-action", "DO_NOT_TRACK", "telemetry", "memory_limit", "deployment helper", "ci/cd", "command line"]
summary: "Shopware CLI: standalone tool for projects, Docker dev env, extension build/validate/package, Store upload, CI/CD; install via brew, apt, action, Docker."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/installation.md", "platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/guides/development/dev-environment.md", "platform/dev/6.7/resources/references/telemetry.md"]
---
## What it is

Shopware CLI (`github.com/shopware/shopware-cli`) is the open-source command-line interface for Shopware 6, installed and configured separately from the Shopware instance. It covers managing and configuring projects, running an integrated Docker-based development environment, building/validating/packaging extensions, uploading and maintaining extensions in the Shopware Store, and running CI/CD pipelines.

## When to use

- Automating project and extension tasks locally or in CI.
- Building the deployment artifact in a CI/CD workflow; the [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) then handles the deploy phase (installing Shopware, managing extensions, running migrations).

## Key steps / config

Install options:

- macOS / Linux (Homebrew): `brew install --cask shopware/tap/shopware-cli`
- GitHub Actions:
  ```yaml
  - name: Install shopware-cli
    uses: shopware/shopware-cli-action@v3
  ```
- Debian / Ubuntu (APT): run the friendsofshopware Cloudsmith `setup.deb.sh` script, then `sudo apt install shopware-cli`.
- Dockerfile: `COPY --from=ghcr.io/shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli`
- Prebuilt binaries: the Releases page of `shopware/shopware-cli` on GitHub.

Verifier tooling requirements when running on the host (`extension validate --full`, `project validate`, `extension fix`, `project fix`, format commands):

- PHP 8.2.0 or newer, Node.js 20.0.0 or newer
- Composer (PHP verifier dependencies, project/extension dependency resolution)
- npm (JavaScript verifier dependencies)

Basic `extension validate` uses the built-in `sw-cli` checks and needs no local PHP or Node.js. The Docker images include the verifier runtime dependencies.

Platform: macOS, Linux, Docker; Windows users use WSL 2 or Docker (see [installation](platform/dev/6.7/products/tools/cli/installation.md)). PHP stack requirements include `memory_limit` of at least `512M` ([system requirements](platform/dev/6.7/guides/installation/system-requirements.md), [hosting](platform/dev/6.7/guides/hosting/_index.md)).

Telemetry: limited usage telemetry, no personal data, credentials or file contents; opt out with the `DO_NOT_TRACK` environment variable ([telemetry](platform/dev/6.7/resources/references/telemetry.md)).

## Essential identifiers

- Binary: `shopware-cli`
- Commands: `extension validate`, `extension validate --full`, `project validate`, `extension fix`, `project fix`
- GitHub Action: `shopware/shopware-cli-action@v3`
- Docker image: `ghcr.io/shopware/shopware-cli:bin`
- Env var: `DO_NOT_TRACK`

## Gotchas

- The CLI binary itself does not need PHP/Node.js for every command, but full validation, fix and format commands do when run on the host.
- With the Docker-based development environment, run Composer and PHP tools inside the web container, not on the host ([dev environment](platform/dev/6.7/guides/development/dev-environment.md)).

## Code check (6.7.13.0)
- confirmed `memory_limit` — installer requires at least 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:48
- confirmed `php` — shopware/core 6.7 requires PHP ~8.2.0 or newer minor lines, matching the 8.2.0 minimum — vendor/shopware/core/composer.json:51
- unverified `shopware-cli` — standalone Go binary, not part of vendor/shopware
- unverified `DO_NOT_TRACK` — read by the CLI, not by the installed Shopware code
- unverified `shopware/shopware-cli-action@v3` — GitHub Action, out of scope
