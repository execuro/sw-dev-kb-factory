---
id: platform/dev/6.6/products/extensions/b2b-suite/guides/core/authentication.md
title: Storefront Authentication
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/products/extensions/b2b-suite/guides/core/authentication.html"
sourceHash: "c82803a9bc0591564f3edd81190f29853b9cc2f7"
keywords: ["Storefront Authentication", "AuthenticationService", "Identity", "OwnershipContext", "contextOwnerId", "authId", "AuthenticationIdentityLoaderInterface", "CredentialsBuilder", "CredentialsEntity", "b2b_front_auth.authentication_service", "sales representative", "b2b suite"]
summary: "The Storefront Authentication component provides a unified Identity/OwnershipContext for login, ownership, and multi-source B2B auth."
lastBuilt: "2026-09-15"
---
## What it is

Describes the Storefront Authentication component, a common B2B interface for login, ownership, and authentication that extends Shopware's default authentication. It lets multiple source tables authenticate through one unified `Identity` interface, and provides a context for record ownership. Example plugins ("B2bAuth.zip" for adding a provider, "B2bLogin.zip" for exchanging the login value) are referenced by the docs.

## When to use

Use when a plugin needs to add a new type of B2B user/login source, when a table's rows must be scoped to a debtor/tenant, or when records must be flagged as owned by a specific identity.

## Key steps / config

- Retrieve the current identity via `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationService`, e.g. through `$this->container->get('b2b_front_auth.authentication_service')`.
- To scope data by the logged-in user's tenant, add a `context_owner_id` column referencing `b2b_store_front_auth(id)`, then read it via `$authenticationService->getIdentity()->getOwnershipContext()->contextOwnerId`.
- To flag records as owned by a specific identity, add an `auth_id` column referencing `b2b_store_front_auth(id)`, then read it via `getOwnershipContext()->authId`.
- To add a new identity provider (following `Contact`/`Debtor`):
  1. Implement `Shopware\B2B\StoreFrontAuthentication\Framework\Identity` (a factory-like interface every custom identity must implement; examples: `DebtorIdentity`, `ContactIdentity`).
  2. Implement a `CredentialsBuilder::createCredentials(array $parameters): AbstractCredentialsEntity` that builds a `CredentialsEntity`.
  3. Implement `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationIdentityLoaderInterface::fetchIdentityByCredentials(CredentialsEntity $credentialsEntity, LoginContextService $contextService, bool $isApi = false): Identity`.
  4. Register the loader as a tagged service:

```xml
<service id="b2b_my.contact_authentication_identity_loader" class="Shopware\B2B\My\AuthenticationIdentityLoader">
    <tag name="b2b_front_auth.authentication_repository" />
</service>
```

## Essential identifiers

- `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationService`
- `Shopware\B2B\StoreFrontAuthentication\Framework\Identity`
- `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationIdentityLoaderInterface`
- `b2b_front_auth.authentication_service` (service id)
- `b2b_front_auth.authentication_repository` (tag name)
- `OwnershipContext::$contextOwnerId` / `OwnershipContext::$authId`
- `AuthenticationService::isB2b()` / `getIdentity()` / `getIdentityByAuthId()`

## Gotchas

A sales representative identity extends the debtor identity: after logging in, a sales representative assumes the debtor's identity in order to act as that client, while the original sales representative identity can still be identified when logged in as the client.
