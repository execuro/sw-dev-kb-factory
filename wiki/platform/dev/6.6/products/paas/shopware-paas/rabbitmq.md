---
id: platform/dev/6.6/products/paas/shopware-paas/rabbitmq.md
title: RabbitMQ
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/paas/shopware-paas/rabbitmq.html"
sourceHash: "553a6c6689af41504ff8a71693769a5140a0568c"
keywords: ["rabbitmq", "message queue", "shopware paas", ".platform/services.yaml", ".platform.app.yaml", "sql-backed queue", "relationships", "queue backend", "disable service"]
summary: RabbitMQ ships enabled by default on Shopware PaaS and can be disabled in favor of an SQL-backed queue.
lastBuilt: "2026-09-15"
---
## What it is

This page explains that RabbitMQ is enabled by default as an optional queue service in the Shopware PaaS template, and how to disable it in favor of an SQL-backed queue.

## When to use

Use this when you want to remove the RabbitMQ service from a Shopware PaaS deployment and rely on an SQL-backed queue instead.

## Key steps / config

1. Disable the service by commenting out the RabbitMQ block in `.platform/services.yaml`:

```yaml
// .platform/services.yaml
#rabbitmq:
#   type: rabbitmq:3.8
#   disk: 1024
```

2. Remove the relationship by commenting out the entry in `.platform.app.yaml`:

```yaml
// .platform.app.yaml
#relationships:
#   rabbitmqqueue: "rabbitmq:rabbitmq"
```

3. Push the changes to the git repository and wait for the deployment to finish.

## Essential identifiers

- `.platform/services.yaml`
- `.platform.app.yaml`
- `rabbitmq:3.8`
- `rabbitmqqueue`
