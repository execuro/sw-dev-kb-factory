---
id: platform/dev/6.7/products/tools/cli/installation.md
title: Other Installation Options
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/tools/cli/installation.html
sourceHash: "ea514f540c77895f5ce69fd19a5d47f3df9ed249"
codeCheckedAgainst: "6.7.13.0"
keywords: ["shopware-cli", "install shopware-cli", "dnf", "aur", "nix", "devenv", "ddev", "gitlab ci", "ghcr.io/shopware/shopware-cli", "--no-update-hint", "SHOPWARE_CLI_NO_UPDATE_NOTIFICATION", "SHOPWARE_PACKAGES_TOKEN", "SHOPWARE_PACKAGIST_TOKEN", "SHOPWARE_CLI_TOOLS_DIR", "build from source"]
summary: "Shopware CLI install options beyond Homebrew/APT: DNF, AUR, Nix, devenv, release binaries, CI images, ddev, Docker, env vars and building from source."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/products/tools/cli/_index.md"]
---
## What it is

Additional installation methods for Shopware CLI beyond the Homebrew/APT/Docker quick start on the [Shopware CLI overview](platform/dev/6.7/products/tools/cli/_index.md): other package managers, manual release installs, CI/CD and dev environments, Docker usage, update notifications, environment variables, and building from source.

## When to use

When installing `shopware-cli` on Fedora/RHEL, Arch, Nix/devenv, Alpine, inside CI (GitLab, Codespaces), ddev or a custom Docker image, or when configuring its tokens and tool directory.

## Key steps / config

Package managers:

```bash
curl -1sLf 'https://dl.cloudsmith.io/public/friendsofshopware/stable/setup.rpm.sh' | sudo -E bash
sudo dnf install shopware-cli          # Fedora/CentOS/openSUSE/RHEL
yay -S shopware-cli-bin                # Arch (AUR)
nix profile install nixpkgs#shopware-cli
nix profile install github:FriendsOfShopware/nur-packages#shopware-cli
```

Devenv: add input `froshpkgs` (`url: github:FriendsOfShopware/nur-packages`, `inputs.nixpkgs.follows: "nixpkgs"`) to `devenv.yaml`, then in `devenv.nix` add `inputs.froshpkgs.packages.${pkgs.system}.shopware-cli` to `packages`.

Manual release install: `sudo dpkg -i shopware-cli_<version>_linux_amd64.deb`, `sudo rpm -i shopware-cli_<version>_linux_arm64.rpm`, `sudo apk add shopware-cli-<version>.apk`, or download `https://github.com/shopware/shopware-cli/releases/latest/download/shopware-cli-linux-amd64`, `chmod +x`, move to `/usr/local/bin/`.

CI / dev environments:
- GitHub Codespaces devcontainer feature: `"ghcr.io/shyim/devcontainers-features/shopware-cli:latest": {}` under `features`.
- GitLab CI: `image.name: ghcr.io/shopware/shopware-cli:latest` with `entrypoint: [ "/bin/sh", "-c" ]`.
- ddev (`.ddev/web-build/Dockerfile.shopware-cli`) or any Dockerfile:

```Dockerfile
COPY --from=ghcr.io/shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli
```

Run via Docker (registry `ghcr.io/shopware/shopware-cli`):

```bash
docker run --rm -v $(pwd):$(pwd) -w $(pwd) -u $(id -u) ghcr.io/shopware/shopware-cli extension build FroshPlatformAdminer
```

Update notifications: pass `shopware-cli --no-update-hint <command>` or `export SHOPWARE_CLI_NO_UPDATE_NOTIFICATION=true`.

Environment variables:

| Variable | Purpose |
|---|---|
| `SHOPWARE_PACKAGES_TOKEN` | Composer token for packages.shopware.com (e.g. `project ci`) |
| `SHOPWARE_PACKAGIST_TOKEN` | Token for headless `project autofix composer-plugins` |
| `COMPOSER_AUTH` | Credentials for other private Composer repos |
| `SHOPWARE_CLI_TOOLS_DIR` | Self-provisioned tools dir; CLI skips its own tool setup |
| `SHOPWARE_CLI_NO_UPDATE_NOTIFICATION` | `true` disables update notifications |

Build from source (Go 1.27.0+ and Git): `git clone https://github.com/shopware/shopware-cli`, `go mod tidy`, `go build -o shopware-cli .`, `./shopware-cli --version`.

## Essential identifiers

- `shopware-cli`, `shopware-cli-bin`, `ghcr.io/shopware/shopware-cli`, `ghcr.io/shopware/shopware-cli:bin`
- `--no-update-hint`, `SHOPWARE_CLI_NO_UPDATE_NOTIFICATION`
- `SHOPWARE_PACKAGES_TOKEN`, `SHOPWARE_PACKAGIST_TOKEN`, `COMPOSER_AUTH`, `SHOPWARE_CLI_TOOLS_DIR`

## Gotchas

- `SHOPWARE_PACKAGIST_TOKEN` and `SHOPWARE_PACKAGES_TOKEN` are different variables. Both tokens come from Shopware Account: Shops > Licenses > "..." on any extension > Install via Composer.
- The update check runs in the background and prints to stderr.

## Code check (6.7.13.0)
- unverified `shopware-cli` — standalone Go binary, not part of vendor/shopware
- unverified `SHOPWARE_PACKAGES_TOKEN` — read by shopware-cli, not referenced in vendor/shopware/core
- unverified `SHOPWARE_PACKAGIST_TOKEN` — read by shopware-cli, out of scope
- unverified `COMPOSER_AUTH` — Composer env var, out of scope
- unverified `SHOPWARE_CLI_TOOLS_DIR` — shopware-cli env var, out of scope
- unverified `SHOPWARE_CLI_NO_UPDATE_NOTIFICATION` — shopware-cli env var, out of scope
- unverified `--no-update-hint` — shopware-cli global flag, out of scope
