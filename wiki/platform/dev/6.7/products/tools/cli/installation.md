---
id: platform/dev/6.7/products/tools/cli/installation.md
title: Other Installation Options
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/installation.html
sourceHash: ea514f540c77895f5ce69fd19a5d47f3df9ed249
codeCheckedAgainst: "6.7.15.1"
keywords: ["shopware-cli", "install shopware cli", "dnf", "aur", "nix", "devenv", "ddev", "ghcr.io/shopware/shopware-cli", "gitlab ci", "codespaces", "SHOPWARE_PACKAGES_TOKEN", "SHOPWARE_PACKAGIST_TOKEN", "SHOPWARE_CLI_TOOLS_DIR", "SHOPWARE_CLI_NO_UPDATE_NOTIFICATION", "build from source"]
summary: Extra Shopware CLI install routes (DNF, AUR, Nix, devenv, release packages, CI images, ddev, Docker, source build) and its environment variables.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md"]
---
## What it is

Additional ways to install Shopware CLI beyond the Homebrew, APT and Docker quick start in the [Shopware CLI overview](platform/dev/6.7/products/tools/cli/_index.md): other package managers, release packages, CI/CD and dev-environment integrations, Docker usage, building from source, plus the environment variables the CLI reads.

## When to use

You are on a distribution without Homebrew/APT, need the CLI inside a CI job, devcontainer, ddev or a Docker image, or want to configure tokens and update notifications.

## Key steps / config

Package managers:

```bash
curl -1sLf 'https://dl.cloudsmith.io/public/friendsofshopware/stable/setup.rpm.sh' | sudo -E bash
sudo dnf install shopware-cli                 # Fedora/CentOS/openSUSE/RHEL
yay -S shopware-cli-bin                       # Arch (AUR)
nix profile install nixpkgs#shopware-cli      # or github:FriendsOfShopware/nur-packages#shopware-cli
```

Devenv: add an input `froshpkgs` with `url: github:FriendsOfShopware/nur-packages` (its `nixpkgs` input `follows: "nixpkgs"`) to `devenv.yaml`, then list `inputs.froshpkgs.packages.${pkgs.system}.shopware-cli` in `packages` of `devenv.nix`.

Release packages from the GitHub releases page: `sudo dpkg -i shopware-cli_<version>_linux_amd64.deb`, `sudo rpm -i shopware-cli_<version>_linux_arm64.rpm`, `sudo apk add shopware-cli-<version>.apk`; or download `https://github.com/shopware/shopware-cli/releases/latest/download/shopware-cli-linux-amd64`, `chmod +x` it and move it into `$PATH` (e.g. `/usr/local/bin/`).

CI and environments:

- GitHub Codespaces devcontainer feature: `"ghcr.io/shyim/devcontainers-features/shopware-cli:latest": {}` under `features`.
- GitLab CI: `image.name: ghcr.io/shopware/shopware-cli:latest` with `entrypoint: [ "/bin/sh", "-c" ]`.
- ddev (`.ddev/web-build/Dockerfile.shopware-cli`) or any Dockerfile:

```Dockerfile
COPY --from=ghcr.io/shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli
```

Running via Docker (registry `ghcr.io/shopware/shopware-cli`):

```bash
docker run --rm -v $(pwd):$(pwd) -w $(pwd) -u $(id -u) ghcr.io/shopware/shopware-cli extension build FroshPlatformAdminer
```

Environment variables:

| Variable | Purpose |
|---|---|
| `SHOPWARE_PACKAGES_TOKEN` | Composer token for `packages.shopware.com` when resolving dependencies (e.g. `project ci`) |
| `SHOPWARE_PACKAGIST_TOKEN` | Token for headless `project autofix composer-plugins` |
| `COMPOSER_AUTH` | Credentials for other private Composer repositories |
| `SHOPWARE_CLI_TOOLS_DIR` | Use a self-provisioned tools directory as-is; skips the CLI's own tool setup |
| `SHOPWARE_CLI_NO_UPDATE_NOTIFICATION` | `true` disables update notifications |

Update hints: the CLI checks for newer releases in the background and prints to stderr; silence once with `shopware-cli --no-update-hint <command>` or set `export SHOPWARE_CLI_NO_UPDATE_NOTIFICATION=true`.

Build from source (Go 1.27.0+ and Git): `git clone https://github.com/shopware/shopware-cli`, then `go mod tidy`, `go build -o shopware-cli .`, `./shopware-cli --version`.

## Essential identifiers

- `shopware-cli`, `shopware-cli-bin`, `ghcr.io/shopware/shopware-cli`, `ghcr.io/shopware/shopware-cli:bin`
- `--no-update-hint`
- `SHOPWARE_PACKAGES_TOKEN`, `SHOPWARE_PACKAGIST_TOKEN`, `COMPOSER_AUTH`, `SHOPWARE_CLI_TOOLS_DIR`, `SHOPWARE_CLI_NO_UPDATE_NOTIFICATION`

## Gotchas

- `SHOPWARE_PACKAGIST_TOKEN` and `SHOPWARE_PACKAGES_TOKEN` are different variables. Both tokens come from the Shopware Account: Shops > Licenses > "..." on any extension > Install via Composer.

## Code check (6.7.15.1)
- unverified `shopware-cli` — standalone Go binary, not part of the Shopware package roots
- unverified `SHOPWARE_PACKAGES_TOKEN` — read by shopware-cli, not by core; out of scope
- unverified `SHOPWARE_PACKAGIST_TOKEN` — read by shopware-cli, out of scope
- unverified `SHOPWARE_CLI_TOOLS_DIR` — shopware-cli env var, out of scope
- unverified `SHOPWARE_CLI_NO_UPDATE_NOTIFICATION` — shopware-cli env var, out of scope
- unverified `--no-update-hint` — shopware-cli global flag, out of scope
- unverified `COMPOSER_AUTH` — Composer env var, outside the Shopware package roots
