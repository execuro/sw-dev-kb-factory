---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/installation/system-requirements.md
relatedPages:
  - platform/dev/6.7/guides/installation/_index.md
  - platform/dev/6.7/guides/installation/legacy-setups/_index.md
sourceHash: 1769a247e0545fd58c807bdf6fd0c42ebdba4461
sourceUrl: https://developer.shopware.com/docs/guides/installation/system-requirements.html
title: System Requirements
version: "6.7"
versions:
  - "6.7"
keywords: ["system requirements", "hardware requirements", "ram", "cpu", "disk space", "macos", "linux", "windows wsl 2", "docker desktop", "docker group", "usermod", "workstation setup"]
summary: Workstation requirements for a Docker-based Shopware 6.7 dev setup - CPU, 8-16 GB RAM, ~10 GB disk, macOS 13+/64-bit Linux/WSL 2, docker group.
lastBuilt: 2026-10-21
---
## What it is

The physical machine requirements (hardware, operating system, permissions, networking) for a workstation or server on which the Shopware 6 development environment is set up. It does not cover the application stack (PHP, database, web server versions) — those live in the hosting guide.

## When to use

Before starting the Docker-based installation path in platform/dev/6.7/guides/installation/_index.md, to check whether the machine is suitable. For installing Shopware from scratch without Docker, the software requirements in the hosting guide apply instead.

## Key steps / config

Hardware:

| Component | Requirement |
|---|---|
| CPU | Quad-core or higher recommended |
| Memory (RAM) | 8 GB minimum, 16 GB recommended (especially for Docker) |
| Disk space | About 10 GB free for Shopware and supporting services |
| Internet | Reliable connection for dependency downloads |

Operating system:

| Platform | Requirement |
|---|---|
| macOS | macOS 13 or newer |
| Linux | 64-bit distribution |
| Windows | Windows 10/11 Pro using WSL 2 or Docker Desktop |

Permissions and networking:

- Administrative or root privileges, if your organization requires them.
- Firewall must allow internal communication between containers or local web services.
- On Linux, add your user to the `docker` group:

```bash
sudo usermod -aG docker $USER
```

## Gotchas

- Only Unix-based systems are supported; Windows works only through WSL 2 or Docker Desktop.
- This installation path is Docker-based. Alternative approaches are documented under [legacy setups](platform/dev/6.7/guides/installation/legacy-setups/_index.md) and are no longer recommended for new projects.

## Code check (6.7.15.1)
- unverified `CPU / RAM / disk space` — workstation hardware figures are not expressed in the Shopware code
- unverified `macOS 13 / WSL 2` — operating-system support is a tooling claim, not checked in code
- unverified `usermod -aG docker` — host Docker setup, out of scope of vendor/shopware
- confirmed `php` — the application stack lives in the hosting guide; core requires `~8.2.0 || ~8.3.0 || ~8.4.0 || ~8.5.0` — vendor/shopware/core/composer.json:36
