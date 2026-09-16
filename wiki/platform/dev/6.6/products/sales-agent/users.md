---
id: platform/dev/6.6/products/sales-agent/users.md
title: User creation
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/sales-agent/users.html
sourceHash: fbd61f5b5820c331d7c4905c2ec312669423c391
keywords: ["Sales Agent users", "/api/user", "/api/entity-restriction", "x-api-key", "API_AUTH_SECRET_KEY", "user restriction", "criteria object", "search criteria", "entity restriction"]
summary: Create Sales Agent users and restrict them to specific customers via the /api/user and /api/entity-restriction endpoints.
lastBuilt: "2026-09-15"
---
## What it is

Describes how to create a Sales Agent user and restrict a user to viewing only specific customers via the API.

## Key steps / config

Create a user with a `POST` request to `/api/user`, authenticated with the `x-api-key` header (set via `API_AUTH_SECRET_KEY`):

```json
{
  "name": "<name>",
  "email": "<email>",
  "id": "<id>",
  "password": "<password>"
}
```

Restrict a user to specific customers with a `POST` request to `/api/entity-restriction`:

```json
{
  "entity": "customer",
  "email": "<user_email>",
  "criteria": {
    "filter": []
  }
}
```

The `criteria` object supports the same fields as the Shopware API's search criteria.

## Essential identifiers

- `/api/user`
- `/api/entity-restriction`
- `x-api-key`
- `API_AUTH_SECRET_KEY`
