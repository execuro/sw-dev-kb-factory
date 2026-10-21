---
id: platform/dev/6.7/products/paas/shopware-paas/rabbitmq.md
title: RabbitMQ
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/paas/shopware-paas/rabbitmq.html
sourceHash: 553a6c6689af41504ff8a71693769a5140a0568c
codeCheckedAgainst: "6.7.15.1"
keywords: ["rabbitmq", "rabbitmq:3.8", "rabbitmqqueue", ".platform/services.yaml", ".platform.app.yaml", "relationships", "MESSENGER_TRANSPORT_DSN", "message queue", "amqp", "sql queue", "doctrine transport", "shopware paas", "disable service"]
summary: Disabling the default RabbitMQ service on Shopware PaaS by commenting out services.yaml and the rabbitmqqueue relationship; falls back to an SQL queue.
lastBuilt: 2026-10-21
---
## What it is

The Shopware PaaS template enables a RabbitMQ service by default. It is optional but recommended. You can disable it and replace it with an SQL-backed queue.

## When to use

When a PaaS project should run without RabbitMQ and use the database as its message queue instead.

## Key steps / config

1. Disable the service: comment out the RabbitMQ service in `.platform/services.yaml`.

   ```yaml
   #rabbitmq:
   #   type: rabbitmq:3.8
   #   disk: 1024
   ```

2. Remove the relationship: comment out the RabbitMQ relationship in the app configuration (`.platform.app.yaml`).

   ```yaml
   #relationships:
   #   rabbitmqqueue: "rabbitmq:rabbitmq"
   ```

3. Push the changes to your git repository and wait for the deployment to finish.

On the Shopware side, the `async` Messenger transport reads `MESSENGER_TRANSPORT_DSN`. When nothing sets that variable, core falls back to `doctrine://default?auto_setup=false`, which is the SQL-backed queue.

## Essential identifiers

- `.platform/services.yaml` (service `rabbitmq`, `type: rabbitmq:3.8`)
- `.platform.app.yaml` (relationship `rabbitmqqueue: "rabbitmq:rabbitmq"`)
- `MESSENGER_TRANSPORT_DSN`

## Code check (6.7.15.1)
- confirmed `MESSENGER_TRANSPORT_DSN` — default `doctrine://default?auto_setup=false` (SQL queue) when unset — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:3
- confirmed `framework.messenger.transports.async.dsn` — async transport DSN is `%env(MESSENGER_TRANSPORT_DSN)%` — vendor/shopware/core/Framework/Resources/config/packages/framework.yaml:70
- unverified `rabbitmqqueue` — PaaS relationship name, defined in the PaaS template, not in core
- unverified `rabbitmq:3.8` — PaaS service type, infrastructure config outside the core packages
