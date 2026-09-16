---
id: platform/dev/6.6/products/cli/installation.md
title: Installation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/cli/installation.html
sourceHash: 440f16c0cc1c177288c82409c9db0f6fbedc3427
keywords: ["shopware-cli", "installation", "homebrew", "apt", "dnf", "aur", "nix", "devenv", "GitHub Codespaces", "GitHub Action", "Gitlab CI", "ddev", "Docker image", "compile from source"]
summary: "How to install shopware-cli: pre-compiled binary via package managers, Docker, CI integrations, manual binary, or compiling from source."
lastBuilt: "2026-09-15"
---
## What it is

This page lists the ways to install Shopware CLI (`shopware-cli`): pre-compiled binaries via package managers, Docker, manual binary download, or compiling from source.

## Key steps / config

Package managers:

```bash
brew install shopware/tap/shopware-cli
```

```bash
curl -1sLf 'https://dl.cloudsmith.io/public/friendsofshopware/stable/setup.deb.sh' | sudo -E bash
sudo apt install shopware-cli
```

```bash
curl -1sLf 'https://dl.cloudsmith.io/public/friendsofshopware/stable/setup.rpm.sh' | sudo -E bash
sudo dnf install shopware-cli
```

```bash
yay -S shopware-cli-bin
```

Nix:

```shell
nix profile install nixpkgs#shopware-cli
nix profile install github:FriendsOfShopware/nur-packages#shopware-cli
```

Devenv adds `froshpkgs` as an input in `devenv.yaml` pointing at `github:FriendsOfShopware/nur-packages`, then references `inputs.froshpkgs.packages.${pkgs.system}.shopware-cli` in `devenv.nix`.

GitHub Codespaces uses the feature `ghcr.io/shyim/devcontainers-features/shopware-cli:latest`. GitHub Actions can use `shopware/shopware-cli-action@v1`. GitLab CI can use the `shopware/shopware-cli:latest` image. ddev adds `.ddev/web-build/Dockerfile.shopware-cli` with `COPY --from=shopware/shopware-cli:bin /shopware-cli /usr/local/bin/shopware-cli`; the same line can be added to any Docker image.

Running via Docker directly, e.g. to build extension assets:

```bash
docker run --rm -v $(pwd):$(pwd) -w $(pwd) -u $(id -u) shopware/shopware-cli extension build FroshPlatformAdminer
```

Compiling from source:

```bash
git clone https://github.com/shopware/shopware-cli
cd shopware-cli
go mod tidy
go build -o shopware-cli .
./shopware-cli --version
```

## Essential identifiers

- `shopware-cli`
- `shopware/shopware-cli` (Docker image)
- `shopware/shopware-cli-action@v1`
- `ghcr.io/shyim/devcontainers-features/shopware-cli:latest`
