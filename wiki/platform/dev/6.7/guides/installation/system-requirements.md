---
id: platform/dev/6.7/guides/installation/system-requirements.md
title: System Requirements
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/installation/system-requirements.html
sourceHash: 1769a247e0545fd58c807bdf6fd0c42ebdba4461
codeCheckedAgainst: "6.7.13.0"
keywords: ["system requirements", "hardware requirements", "ram", "cpu", "disk space", "operating system", "macos", "linux", "windows wsl 2", "docker desktop", "docker group", "usermod", "workstation"]
summary: Workstation requirements for a Docker-based Shopware 6.7 dev setup - quad-core CPU, 8-16 GB RAM, ~10 GB disk, macOS 13+/64-bit Linux/Windows via WSL 2.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/installation/_index.md", "platform/dev/6.7/guides/installation/legacy-setups/_index.md"]
---
## What it is

Physical machine requirements (hardware, OS, permissions, networking) for a workstation or server running the Docker-based Shopware 6 development environment. The application stack and supported software versions are covered by the hosting guide, not this page.

## When to use

Before starting the Docker-based [installation](platform/dev/6.7/guides/installation/_index.md), to check that the machine is suitable.

## Key steps / config

Hardware:

| Component | Requirement |
|---|---|
| CPU | quad-core or higher recommended |
| RAM | 8 GB minimum, 16 GB recommended (especially for Docker) |
| Disk | about 10 GB free for Shopware and supporting services |
| Internet | reliable connection for dependency downloads |

Operating system:

| Platform | Requirement |
|---|---|
| macOS | macOS 13 or newer |
| Linux | 64-bit distribution |
| Windows | Windows 10/11 Pro using WSL 2 or Docker Desktop |

Permissions and networking:

- Administrative or root privileges, if required within the organization.
- Firewall must allow internal communication between containers or local web services.
- Docker on Linux: add your user to the docker group:

```bash
sudo usermod -aG docker $USER
```

## Gotchas

- Only Unix-based systems are supported; Windows works only through WSL 2 or Docker Desktop.
- Installing Shopware from scratch (without Docker) follows the software requirements in the hosting guide instead. Alternative approaches are documented under [legacy setups](platform/dev/6.7/guides/installation/legacy-setups/_index.md) and are no longer recommended for new projects.

## Code check (6.7.13.0)
- unverified `CPU` — hardware recommendation, not expressed in vendor/shopware code
- unverified `RAM` — 8 GB / 16 GB workstation memory, not expressed in vendor/shopware code
- unverified `macOS 13` — OS requirement, not expressed in vendor/shopware code
- unverified `usermod -aG docker` — host OS command, out of scope
