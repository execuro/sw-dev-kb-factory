---
id: platform/dev/6.7/products/paas/shopware-paas/rabbitmq.md
title: RabbitMQ
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/rabbitmq.html
sourceHash: 553a6c6689af41504ff8a71693769a5140a0568c
codeCheckedAgainst: "6.7.13.0"
keywords: ["rabbitmq", "message queue", "amqp", "shopware paas", "upsun", ".platform/services.yaml", ".platform.app.yaml", "rabbitmqqueue", "relationships", "MESSENGER_TRANSPORT_DSN", "sql queue", "doctrine transport"]
summary: "Disable default RabbitMQ on Shopware PaaS: comment out rabbitmq:3.8 in services.yaml and the rabbitmqqueue relationship; SQL queue is used instead."
lastBuilt: 2026-09-15
---
## What it is

RabbitMQ is enabled by default in the Shopware PaaS template. The service is optional but recommended, and can be disabled and replaced by an SQL-backed queue. This page lists the steps to disable it.

## When to use

When a Shopware PaaS project should run its message queue on the database instead of a RabbitMQ service.

## Key steps / config

1. Disable the service — comment out the RabbitMQ entry in `.platform/services.yaml`:
   ```yaml
   #rabbitmq:
   #   type: rabbitmq:3.8
   #   disk: 1024
   ```
2. Remove the relationship — comment it out in the app configuration (`.platform.app.yaml`):
   ```yaml
   #relationships:
   #   rabbitmqqueue: "rabbitmq:rabbitmq"
   ```
3. Push the changes to the git repository and wait for the deployment to finish.

The queue transport is selected by `MESSENGER_TRANSPORT_DSN`. When no value is provided for it, the installed core falls back to `doctrine://default?auto_setup=false` — the SQL-backed queue — for the `async` Messenger transport.

## Essential identifiers

- `.platform/services.yaml` — service `rabbitmq`, `type: rabbitmq:3.8`
- `.platform.app.yaml` — relationship `rabbitmqqueue: "rabbitmq:rabbitmq"`
- `MESSENGER_TRANSPORT_DSN` — Messenger `async` transport DSN

## Gotchas

- Disabling requires both edits (service and relationship), followed by a push and a completed deployment.
- Core defines separate DSN variables for the `low_priority` and `failed` transports (`MESSENGER_TRANSPORT_LOW_PRIORITY_DSN`, `MESSENGER_TRANSPORT_FAILURE_DSN`), both defaulting to Doctrine queues.

## Code check (6.7.13.0)
- confirmed `MESSENGER_TRANSPORT_DSN` — default `doctrine://default?auto_setup=false` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `MESSENGER_TRANSPORT_DSN` — DSN of the `async` transport — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:68
- confirmed `MESSENGER_TRANSPORT_LOW_PRIORITY_DSN` — Doctrine default, `low_priority` queue — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:4
- confirmed `MESSENGER_TRANSPORT_FAILURE_DSN` — Doctrine default, `failed` queue — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:5
- unverified `rabbitmq:3.8` — PaaS service type, infrastructure config outside vendor scope
- unverified `rabbitmqqueue` — relationship name from the PaaS recipe, outside vendor scope
