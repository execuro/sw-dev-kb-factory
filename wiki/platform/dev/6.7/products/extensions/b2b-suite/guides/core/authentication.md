---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/authentication.md
title: Storefront Authentication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/authentication.html
sourceHash: 5d94da74f80608651897cf0c1dbf233bdd62df0e
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "StoreFrontAuthentication", "AuthenticationService", "Identity", "OwnershipContext", "context_owner_id", "auth_id", "AuthenticationIdentityLoaderInterface", "CredentialsEntity", "b2b_front_auth.authentication_repository", "b2b_store_front_auth", "login provider", "sales representative", "debtor"]
summary: B2B Suite storefront authentication - Identity, OwnershipContext, context_owner_id/auth_id columns and adding a custom login identity provider.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite `StoreFrontAuthentication` component gives a common B2B interface for login, ownership and authentication. It extends Shopware's default authentication and lets several source tables (e.g. contacts and debtors) log in through one UI, exposes a unified `Identity`, and supplies an ownership context. Roles in the component: a **Provider** supplies identities, a **Context** filters data by the identity (debtor/tenant-like filter), an **Owner** stores the identity that owns a record.

## When to use

- Scoping your own B2B tables so data never leaks from one debtor to another.
- Marking records as owned by a specific user.
- Adding a new kind of B2B user that can log in (beside `Contact` and `Debtor`).

## Key steps / config

**Identity as context** - add a `context_owner_id` column referencing `b2b_store_front_auth`:

```sql
CREATE TABLE IF NOT EXISTS `b2b_my` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `context_owner_id` INT(11) NOT NULL,
  INDEX `b2b_my_auth_owner_id_IDX` (`context_owner_id`),
  CONSTRAINT `b2b_my_auth_owner_id_FK` FOREIGN KEY (`context_owner_id`)
    REFERENCES `b2b_store_front_auth` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE
)
```

Read it through `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationService` (service id `b2b_front_auth.authentication_service`): check `isB2b()`, then `getIdentity()->getOwnershipContext()->contextOwnerId`. Load a full identity with `getIdentityByAuthId($contextOwnerId)`.

**Identity as owner** - add a nullable `auth_id` column (FK to `b2b_store_front_auth.id`) and fill it from `getOwnershipContext()->authId`. The context owner is treated as an admin that owns all its users and their data (ACL may override). Typical queries: records where `auth_id = :authId`; records where `auth_id IN (SELECT auth_id FROM b2b_store_front_auth WHERE context_owner_id = :identityContextOwnerId)`. Values come from `->authId->getValue()` / `->contextOwnerId->getValue()`. Run them on an injected `Doctrine\DBAL\Connection`, e.g. `fetchAllAssociative()`.

**Identity as provider** (follow the `Contact`/`Debtor` implementations):

1. Implement the interface `Shopware\B2B\StoreFrontAuthentication\Framework\Identity` (factory for B2B ids/data plus Shopware glue such as customer group id, password hash). Examples: `Shopware\B2B\Debtor\Framework\DebtorIdentity`, `Shopware\B2B\Contact\Framework\ContactIdentity`.
2. A CredentialsBuilder with `createCredentials(array $parameters): AbstractCredentialsEntity` returning a `CredentialsEntity` (`email`, `salesChannelId`, `customerScope` from system config `core.systemWideLoginRegistration.isCustomerBoundToSalesChannel`).
3. Implement `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationIdentityLoaderInterface`: `fetchIdentityByCredentials(CredentialsEntity $credentialsEntity, LoginContextService $contextService, bool $isApi = false): Identity`. Use `LoginContextService::getAuthId(...)` to get/create auth ids; loaders can be chained to create dependent auth ids.
4. Tag the loader service:

```php
$services->set('b2b_my.contact_authentication_identity_loader', Shopware\B2B\My\AuthenticationIdentityLoader::class)
    ->tag('b2b_front_auth.authentication_repository');
```

## Essential identifiers

- `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationService`, `b2b_front_auth.authentication_service`
- `Shopware\B2B\StoreFrontAuthentication\Framework\Identity`, `OwnershipContext` (`contextOwnerId`, `authId`)
- `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationIdentityLoaderInterface`, `LoginContextService`, `CredentialsEntity`
- tag `b2b_front_auth.authentication_repository`; table `b2b_store_front_auth`
- `core.systemWideLoginRegistration.isCustomerBoundToSalesChannel`

## Gotchas

- The source's query example fetches the connection via the service id `dbal_connection` and calls `fetchAll()`; neither exists in Shopware 6.7 core (core injects `Doctrine\DBAL\Connection` and uses `fetchAllAssociative()`).
- Sales representative identities extend the debtor identity; after login the representative gets the sales-representative-debtor identity and acts as the client, while the original identity stays identifiable.

## Code check (6.7.15.1)
- unverified `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationService` — B2B Suite plugin code, not part of the installed core/storefront/administration packages
- unverified `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationIdentityLoaderInterface` — B2B Suite plugin code, out of scope
- unverified `b2b_front_auth.authentication_repository` — B2B Suite service tag, out of scope
- confirmed `core.systemWideLoginRegistration.isCustomerBoundToSalesChannel` — core system config key read via SystemConfigService — vendor/shopware/core/Checkout/Customer/Validation/CustomerEmailUniqueChecker.php:140
- confirmed `isCustomerBoundToSalesChannel` — bool input field in core config — vendor/shopware/core/System/Resources/config/systemWideLoginRegistration.xml:9
- confirmed `SystemConfigService::get()` — signature get(string $key, ?string $salesChannelId = null) — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:60
- absent `dbal_connection` — service id not found anywhere in the installed code (Shopware 5 id)
- confirmed `Doctrine\DBAL\Connection` — injected DBAL connection type used by core services — vendor/shopware/core/Checkout/Customer/Validation/CustomerEmailUniqueChecker.php:6
- confirmed `Connection::fetchAllAssociative()` — fetch method used in core — vendor/shopware/core/Checkout/Customer/Validation/CustomerEmailUniqueChecker.php:194
- unverified `Connection::fetchAll()` — vendor/doctrine, out of scope; no core usage found
