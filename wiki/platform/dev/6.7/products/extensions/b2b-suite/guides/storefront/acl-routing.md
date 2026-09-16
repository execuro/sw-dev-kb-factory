---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/acl-routing.md
title: ACL and Routing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/acl-routing.html
sourceHash: fc118303901fd121118b5813522c0c10688b17ec
codeCheckedAgainst: "6.7.13.0"
keywords: ["b2b suite", "acl routing", "AclRoutingUpdateService", "RoutingIndexer", "b2b_acl", "NOT_MAPPED", "_acl_", "privilege", "resource", "is--b2b-acl-allowed", "is--b2b-acl-forbidden", "controller access"]
summary: B2B Suite ACL routing - map controller actions to resource/privilege via AclRoutingUpdateService, RoutingIndexer generation, b2b_acl Twig CSS classes.
lastBuilt: 2026-09-15
---
## What it is

The B2B Suite ACL Routing component blocks storefront controller actions for B2B users. It builds on the ACL component and maps each `action` of a `controller` to a `resource` (entity type) and a `privilege` (class of actions).

## When to use

When adding B2B storefront controllers whose actions must be restricted by B2B user permissions, and when hiding inaccessible actions in templates.

## Key steps / config

1. Describe routes as resource => controller => action => privilege:
```php
$myAclConfig = [
    'contingentgroup' => [            // resource name
        'B2bContingentGroup' => [     // controller name
            'index' => 'list',        // action name => privilege name
            'detail' => 'detail',
        ],
    ],
];
```
2. Sync it to the database during installation:
```php
Shopware\B2B\AclRoute\Framework\AclRoutingUpdateService::create()
    ->addConfig($myAclConfig);
```
3. Add translation snippets: names are the resource/privilege name prefixed with `_acl_` (resource `contingentgroup` needs `_acl_contingentgroup`).
4. Optionally autogenerate the config (deployment/testing workflow):
```php
$indexer = new Shopware\B2B\AclRoute\Framework\RoutingIndexer();
$indexer->generate(\Shopware_Controllers_Frontend_B2bContact::class, __DIR__ . '/my-acl-config.php');
```
   Any resource or privilege written as `NOT_MAPPED` is a new action; replace it with the correct name.
5. In templates, add the ACL classes to actions:
```twig
<a href="{{ url("frontend.b2b." ~ page.route ~ ".assign") }}" class="{{ b2b_acl('b2broleaddress', 'assign') }}">
```
   Output classes: `is--b2b-acl is--b2b-acl-controller-b2broleaddress is--b2b-acl-action-assign` plus `is--b2b-acl-allowed` or `is--b2b-acl-forbidden`.

Default privileges: `list` (listings, index/grid actions), `detail` (read-only inspection, assignment lists), `create`, `delete`, `update`, `assign` (changing assignments), `free` (no restrictions).

Assignment rules:
- Assignment controllers belong to the resource on the right side (the `B2BContactRole` controller is part of `role`).
- Assignment listings use `detail` (`B2BContactRole:indexAction`).
- Actions writing the assignment use `assign` (`B2BContactRole:assignAction`).

## Essential identifiers

- `Shopware\B2B\AclRoute\Framework\AclRoutingUpdateService` (`create()`, `addConfig()`)
- `Shopware\B2B\AclRoute\Framework\RoutingIndexer` (`generate()`)
- `b2b_acl` Twig function
- `NOT_MAPPED`, `_acl_` snippet prefix
- Privileges `list`, `detail`, `create`, `delete`, `update`, `assign`, `free`

## Gotchas

- Enforcement is at PHP level: inaccessible routes are blocked regardless of templates; the template classes are only for UX.
- Denied elements are hidden with `display: none` by default; on a `form` tag the submit button is removed and all fields disabled; on a table row in the B2B default grid the ajax panel action is muted.
- `RoutingIndexer` expects the format produced by the IndexerService.

## Code check (6.7.13.0)
- unverified `Shopware\B2B\AclRoute\Framework\AclRoutingUpdateService` — B2B Suite plugin class, plugin not in vendor/shopware
- unverified `Shopware\B2B\AclRoute\Framework\RoutingIndexer` — B2B Suite plugin class, out of scope
- unverified `b2b_acl` — B2B Suite Twig function, out of scope
- unverified `NOT_MAPPED` — B2B Suite generator placeholder, out of scope
- unverified `is--b2b-acl-forbidden` — B2B Suite storefront CSS class, out of scope
- confirmed `SwagB2bPlatform` — B2B Suite plugin name, referenced in core only in the translation plugin list — vendor/shopware/core/System/Resources/translation.yaml:6
