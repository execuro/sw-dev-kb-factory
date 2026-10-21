---
id: platform/dev/6.7/guides/development/troubleshooting/_index.md
title: Troubleshooting
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/troubleshooting/
sourceHash: d171ada4aac674a914010d95ec37d67c26400ae1
codeCheckedAgainst: "6.7.15.1"
keywords: ["troubleshooting", "debugging", "xdebug", "XDEBUG_MODE", "XDEBUG_CONFIG", "PHP_PROFILER", "compose.override.yaml", "host.docker.internal", "blackfire", "tideways", "pcov", "docker compose ps", "file permissions"]
summary: "Troubleshooting hub: DAL/rules/flow references, host DB access, Xdebug/profilers via compose.override.yaml, Linux UID 1000."
lastBuilt: 2026-10-21
relatedPages:
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md
  - platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md
  - platform/dev/6.7/guides/development/troubleshooting/rules-reference.md
  - platform/dev/6.7/guides/development/troubleshooting/flow-reference.md
---
## What it is

Hub page for troubleshooting resources (DAL, rules and flow references) plus local debugging setup for the Docker-based Shopware environment: database access from the host, Xdebug and other PHP profilers, and Linux file-permission caveats.

## When to use

When you need a reference for DAL fields/filters, rule classes or flow events, or when you want to attach a debugger/profiler or connect a database client to a local Docker setup.

## Key steps / config

References:

- [DAL Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/_index.md) — fields, flags, filters, aggregations; [Fields Reference](platform/dev/6.7/guides/development/troubleshooting/dal-reference/fields-reference/_index.md) — field types, flags, enum fields.
- [Rules Reference](platform/dev/6.7/guides/development/troubleshooting/rules-reference.md) — rule classes.
- [Flow Reference](platform/dev/6.7/guides/development/troubleshooting/flow-reference.md) — flow events.

Database from the host (Adminer, local MySQL client): host `127.0.0.1` or `localhost`, port = the exposed database port shown by `docker compose ps`.

Enable Xdebug in the web container — create `compose.override.yaml` in the project root:

```yaml
services:
    web:
        environment:
            XDEBUG_MODE: debug
            XDEBUG_CONFIG: client_host=host.docker.internal
            PHP_PROFILER: xdebug
```

Apply with `docker compose up -d`, then attach the IDE (PHPStorm, VS Code) to the default Xdebug port `9003`.

On Linux, also map the host gateway:

```yaml
services:
    web:
        extra_hosts:
            - "host.docker.internal:host-gateway"
```

Other profilers: Blackfire, Tideways, PCOV. Blackfire and Tideways need an extra container, e.g. `PHP_PROFILER=blackfire` on `web` plus a `blackfire` service using image `blackfire/blackfire:2` with `BLACKFIRE_SERVER_ID` and `BLACKFIRE_SERVER_TOKEN`.

## Essential identifiers

- `compose.override.yaml`, `docker compose ps`, `docker compose up -d`
- `XDEBUG_MODE`, `XDEBUG_CONFIG`, `PHP_PROFILER`
- `host.docker.internal:host-gateway`
- `BLACKFIRE_SERVER_ID`, `BLACKFIRE_SERVER_TOKEN`

## Gotchas

- The default setup ships without debugging/profiling tools; they are enabled only through Docker overrides.
- On Linux hosts your user ID must be 1000 (check with `id -u`); other IDs cause permission errors when running `make up` or writing project files.
- Without the `extra_hosts` mapping, Xdebug on Linux cannot reach `host.docker.internal`.

## Code check (6.7.15.1)
- unverified `XDEBUG_MODE` — Docker image environment, not part of the Shopware code roots
- unverified `PHP_PROFILER` — read by the Docker image, outside the code roots
- unverified `compose.override.yaml` — project-level Docker Compose file, out of scope
- unverified `host.docker.internal:host-gateway` — Docker Compose setting, out of scope
- unverified `9003` — Xdebug default port, defined by Xdebug, not Shopware
