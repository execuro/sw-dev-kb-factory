---
codeCheckedAgainst: "6.7.13.0"
docType: developer
id: platform/dev/6.7/guides/development/troubleshooting/_index.md
sourceHash: d171ada4aac674a914010d95ec37d67c26400ae1
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/
title: Troubleshooting
version: "6.7"
versions:
  - "6.7"
keywords: ["troubleshooting", "debugging", "xdebug", "XDEBUG_MODE", "XDEBUG_CONFIG", "PHP_PROFILER", "compose.override.yaml", "host.docker.internal", "docker compose ps", "blackfire", "tideways", "pcov", "file permissions"]
summary: "Troubleshooting hub for local Docker setups: DB access port, enabling Xdebug/Blackfire/Tideways via compose.override.yaml, Linux UID 1000 permissions."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md
  - platform/dev/6.7/guides/development/troubleshooting/rules-reference.md
  - platform/dev/6.7/guides/development/troubleshooting/flow-reference.md
---
## What it is

Entry page for troubleshooting resources (runtime, data, integration issues) plus practical debugging setup for Shopware's Docker-based local environment: database access from the host, PHP debugger/profiler enablement, and Linux-specific caveats.

## When to use

- You need a DAL, rule or flow reference: [DAL Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md) (fields, flags, filters, aggregations), [Fields Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md), [Rules Reference](platform/dev/6.7/guides/development/troubleshooting/rules-reference.md) (rule classes), [Flow Reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md) (flow events).
- You want to connect a DB client, set breakpoints with Xdebug, or profile PHP in the Docker setup.

## Key steps / config

Database from the host (Adminer, local MySQL client): host `127.0.0.1` or `localhost`; port = the exposed database port shown by `docker compose ps`.

Enable Xdebug in the `web` container via `compose.override.yaml` in the project root:

```yaml
services:
    web:
        environment:
            XDEBUG_MODE: debug
            XDEBUG_CONFIG: client_host=host.docker.internal
            PHP_PROFILER: xdebug
```

Apply with `docker compose up -d`, then attach the IDE (PHPStorm, VS Code) to the default Xdebug port `9003`.

On Linux, also map the hostname to the Docker host gateway:

```yaml
services:
    web:
        extra_hosts:
            - "host.docker.internal:host-gateway"
```

Other profilers: Blackfire, Tideways, PCOV (`PHP_PROFILER=blackfire` etc.). Tideways and Blackfire need an extra container, e.g.:

```yaml
services:
    web:
        environment:
            - PHP_PROFILER=blackfire
    blackfire:
        image: blackfire/blackfire:2
        environment:
            BLACKFIRE_SERVER_ID: ...
            BLACKFIRE_SERVER_TOKEN: ...
```

## Essential identifiers

- `compose.override.yaml`, `docker compose ps`, `docker compose up -d`
- `XDEBUG_MODE`, `XDEBUG_CONFIG`, `PHP_PROFILER`
- `host.docker.internal:host-gateway`, port `9003`
- `BLACKFIRE_SERVER_ID`, `BLACKFIRE_SERVER_TOKEN`, image `blackfire/blackfire:2`

## Gotchas

- The default Docker setup ships without debugger/profiler; they must be enabled via overrides.
- Linux: `host.docker.internal` is not resolvable unless mapped with `extra_hosts`.
- Linux hosts: your user ID (`id -u`) must be 1000; other IDs may cause permission errors when running `make up` or writing project files.

## Code check (6.7.13.0)
- unverified `XDEBUG_MODE` — Docker image environment, outside vendor/shopware
- unverified `PHP_PROFILER` — Docker image environment, outside vendor/shopware
- unverified `compose.override.yaml` — project Docker Compose setup, outside vendor/shopware
- unverified `host.docker.internal:host-gateway` — Docker Compose feature, out of scope
- unverified `BLACKFIRE_SERVER_ID` — Blackfire container configuration, out of scope
