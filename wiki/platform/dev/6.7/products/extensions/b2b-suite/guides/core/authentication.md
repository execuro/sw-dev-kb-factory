---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/core/authentication.md
title: Storefront Authentication
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/core/authentication.html
sourceHash: 5d94da74f80608651897cf0c1dbf233bdd62df0e
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "storefront authentication", "AuthenticationService", "Identity", "AuthenticationIdentityLoaderInterface", "b2b_front_auth.authentication_repository", "b2b_front_auth.authentication_service", "context_owner_id", "b2b_store_front_auth", "OwnershipContext", "CredentialsEntity", "sales representative", "login provider"]
summary: "B2B Suite storefront auth: Identity/OwnershipContext, context_owner_id and auth_id columns, adding a login provider via a tagged identity loader."
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite `StoreFrontAuthentication` component extends Shopware's default authentication with a common B2B interface for login, ownership and authentication: multiple source tables (e.g. contact and debtor), a unified `Identity` interface, and an ownership context. A **Provider** supplies identities, a **Context** filters data by identity (debtor/tenant-like), an **Owner** stores the identity owning a record.

## When to use

When B2B data must be scoped to the logged-in debtor, records must carry their owning identity, or a new B2B user type must be able to log in.

## Key steps / config

**Identity as context** — add a `context_owner_id` column with a foreign key to `b2b_store_front_auth` (`id`, `ON DELETE CASCADE`), then read it from the identity:

```php
$authenticationService = $this->container->get('b2b_front_auth.authentication_service');
if (!$authenticationService->isB2b()) { /* not logged in */ }
$ownershipContext = $authenticationService->getIdentity()->getOwnershipContext();
$ownershipContext->contextOwnerId;
$ownerIdentity = $authenticationService->getIdentityByAuthId($contextOwnerId);
```

Class: `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationService`.

**Identity as owner** — add a nullable `auth_id` column referencing `b2b_store_front_auth` and fill it from `$ownershipContext->authId`. The context owner owns all its users and their data (ACL may override), so queries filter by `auth_id = :authId` or `auth_id IN (SELECT auth_id FROM b2b_store_front_auth WHERE context_owner_id = :identityContextOwnerId)`, passing `->getValue()` of the ids.

**Identity as provider** (model on `Contact`/`Debtor`):

1. Implement `Shopware\B2B\StoreFrontAuthentication\Framework\Identity` (examples `Shopware\B2B\Debtor\Framework\DebtorIdentity`, `Shopware\B2B\Contact\Framework\ContactIdentity`); it holds B2B ids plus Shopware glue (customer group id, password hash).
2. CredentialsBuilder: `createCredentials(array $parameters): AbstractCredentialsEntity` returns a `CredentialsEntity` with `email`, `salesChannelId`, and `customerScope` from system config `core.systemWideLoginRegistration.isCustomerBoundToSalesChannel`.
3. Implement `Shopware\B2B\StoreFrontAuthentication\Framework\AuthenticationIdentityLoaderInterface::fetchIdentityByCredentials(CredentialsEntity $credentialsEntity, LoginContextService $contextService, bool $isApi = false): Identity`; get auth ids via `$contextService->getAuthId(<RepositoryClass>, $id, $parentAuthId)`. Loaders can be chained.
4. Register it as a tagged service:

```php
$services->set('b2b_my.contact_authentication_identity_loader', Shopware\B2B\My\AuthenticationIdentityLoader::class)
    ->tag('b2b_front_auth.authentication_repository');
```

## Essential identifiers

- `b2b_front_auth.authentication_service`, `getIdentity()`, `getOwnershipContext()`, `contextOwnerId`, `authId`
- `AuthenticationIdentityLoaderInterface`, `LoginContextService`, `CredentialsEntity`
- Tag `b2b_front_auth.authentication_repository`; table `b2b_store_front_auth`

## Gotchas

- Sales representative identities extend the debtor identity: after login they act as the client (debtor) while the original sales representative identity stays identifiable.
- B2B Suite classes, service ids, tag and tables are not in the installed Shopware packages; only the core config key was checked.

## Code check (6.7.13.0)
- confirmed `core.systemWideLoginRegistration.isCustomerBoundToSalesChannel` — core system config key read via SystemConfigService — vendor/shopware/core/Checkout/Customer/SalesChannel/RegisterRoute.php:518
- confirmed `isCustomerBoundToSalesChannel` — bool input field in the systemWideLoginRegistration config — vendor/shopware/core/System/Resources/config/systemWideLoginRegistration.xml:9
- confirmed `SystemConfigService::get()` — signature `get(string $key, ?string $salesChannelId = null)` — vendor/shopware/core/System/SystemConfig/SystemConfigService.php:59
- unverified `AuthenticationService` — B2B Suite class, not in vendor/shopware core/storefront/administration
- unverified `AuthenticationIdentityLoaderInterface` — B2B Suite interface, out of scope of installed packages
- unverified `Identity` — B2B Suite interface, out of scope of installed packages
- unverified `b2b_front_auth.authentication_repository` — B2B Suite service tag, out of scope
- unverified `b2b_store_front_auth` — B2B Suite table, out of scope
