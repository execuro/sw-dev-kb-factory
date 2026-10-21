---
id: platform/dev/6.7/products/tools/cli/_index.md
title: Shopware CLI
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/
sourceHash: b6d56ca263b7687843ae2d87f7078bc64971e865
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli", "Shopware CLI", "command line", "extension validate", "project validate", "shopware/shopware-cli-action", "ghcr.io/shopware/shopware-cli", "DO_NOT_TRACK", "telemetry", "homebrew", "ci/cd", "sw-cli", "memory_limit"]
summary: "Shopware CLI: standalone tool for projects, extensions, Store and CI/CD; install via Homebrew, APT, GitHub Action or Docker; verifier needs PHP 8.2+"
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md", "platform/dev/6.7/products/tools/cli/installation.md", "platform/dev/6.7/guides/installation/system-requirements.md", "platform/dev/6.7/resources/references/telemetry.md"]
---
## What it is

Shopware CLI (source at https://github.com/shopware/shopware-cli) is an open-source command-line interface for Shopware 6. You install and configure it separately from your Shopware instance. It handles these tasks:

- managing and configuring projects
- running an integrated Docker-based development environment
- building, validating, and packaging extensions
- uploading and maintaining extensions in the Shopware Store
- running CI/CD pipelines

## When to use

Use it to automate project and extension work, to validate or package an extension for the Store, or to build a deployment artifact in CI. In a CI/CD workflow, Shopware CLI builds the artifact. The [Deployment Helper](platform/dev/6.7/guides/hosting/installation-updates/deployments/deployment-helper/_index.md) then handles the deploy phase: installing Shopware, managing extensions, and running migrations. GitHub Actions, GitLab CI, and Docker examples are on the [installation page](platform/dev/6.7/products/tools/cli/installation.md).

## Key steps / config

Install it in one of these ways:

```bash
# macOS / Linux (Homebrew)
brew install --cask shopware/tap/shopware-cli
# Debian / Ubuntu (APT)
curl -1sLf 'https://dl.cloudsmith.io/public/friendsofshopware/stable/setup.deb.sh' | sudo -E bash
sudo apt install shopware-cli
# Dockerfile
COPY --from=ghcr.io/shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli
```

GitHub Actions step:

```yaml
- name: Install shopware-cli
  uses: shopware/shopware-cli-action@v3
```

Prebuilt packages are published at https://github.com/shopware/shopware-cli/releases. The tool runs on macOS, Linux, and Docker. On Windows, use WSL 2 or Docker.

The CLI binary itself does not need PHP or Node.js for every command. When you run external verifier tooling on the host, you need:

- PHP 8.2.0 or newer
- Node.js 20.0.0 or newer
- Composer, when the CLI prepares PHP verifier dependencies or resolves dependencies
- npm, when it prepares JavaScript verifier dependencies

The commands that use external verifier tooling are `extension validate`, `extension validate --only phpstan`, `project validate`, the fix commands, and the format commands.

`extension validate --only builtin` uses only the built-in checks and needs no local PHP or Node.js. Selecting only a native Twig checker also skips external tool setup. The Docker images include the verifier runtime dependencies and are recommended for consistent results.

## Essential identifiers

- `shopware-cli` (the legacy alias `sw-cli` still works)
- `extension validate`, `extension validate --only builtin`, `project validate`
- `ghcr.io/shopware/shopware-cli`, `shopware/shopware-cli-action@v3`
- `DO_NOT_TRACK`: set this env var to opt out of telemetry

## Gotchas

- The PHP stack requires `memory_limit ≥ 512M`. See the [System Requirements](platform/dev/6.7/guides/installation/system-requirements.md) for hardware requirements.
- With the Docker dev environment, run Composer and PHP tools inside the web container, not on the host. See the [dev environment guide](platform/dev/6.7/guides/development/dev-environment.md).
- Telemetry is collected by default. It includes no personal data, credentials, or file contents. Opt out with `DO_NOT_TRACK`. Details are in the [telemetry reference](platform/dev/6.7/resources/references/telemetry.md).

## Code check (6.7.15.1)
- confirmed `MEMORY_LIMIT_REQUIREMENT` — the installer requirement check uses 512M — vendor/shopware/core/Installer/Requirements/ConfigurationRequirementsValidator.php:18
- confirmed `php` — the core composer constraint starts at PHP 8.2, matching the verifier's PHP 8.2.0 minimum — vendor/shopware/core/composer.json:36
- unverified `shopware-cli` — standalone Go binary, not in the checked package roots
- unverified `DO_NOT_TRACK` — read by Shopware CLI, not found in the checked package roots
- unverified `sw-cli` — CLI alias, outside the checked package roots
