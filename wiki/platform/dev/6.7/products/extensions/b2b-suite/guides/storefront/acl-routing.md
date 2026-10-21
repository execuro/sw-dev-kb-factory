---
id: platform/dev/6.7/products/extensions/b2b-suite/guides/storefront/acl-routing.md
title: ACL and Routing
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/products/extensions/b2b-suite/guides/storefront/acl-routing.html
sourceHash: fc118303901fd121118b5813522c0c10688b17ec
codeCheckedAgainst: "6.7.15.1"
keywords: ["b2b suite", "acl routing", "AclRoutingUpdateService", "RoutingIndexer", "b2b_acl", "NOT_MAPPED", "_acl_", "privilege", "resource", "is--b2b-acl-forbidden", "access control", "permissions", "block controller actions"]
summary: B2B Suite ACL routing - map controller actions to resource/privilege (AclRoutingUpdateService, RoutingIndexer), hide links via b2b_acl.
lastBuilt: 2026-10-21
---
## What it is

The B2B Suite ACL Routing component blocks controller actions for B2B users. It extends the B2B ACL component by mapping an `action` in a given `controller` to a `resource` (= entity type) and a `privilege` (= class of actions). The two core actions are `index` and `detail`.

## When to use

When adding B2B Suite storefront controllers whose actions must be protected by B2B ACL rights, when generating the mapping for new controllers, or when hiding inaccessible actions in templates.

## Key steps / config

1. **Define the mapping array** (resource → controller → action => privilege):

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

2. **Sync it to the database during installation** — all routes that need access rights must be stored in the database:

```php
Shopware\B2B\AclRoute\Framework\AclRoutingUpdateService::create()
    ->addConfig($myAclConfig);
```

3. **Provide translation snippets**: snippet names are created from resource and privilege names, prefixed with `_acl_` — resource `contingentgroup` needs `_acl_contingentgroup`.

4. **Optional – generate the mapping automatically** with the `RoutingIndexer` (expects the format created by the IndexerService; usable in deployment or test workflows):

```php
$indexer = new Shopware\B2B\AclRoute\Framework\RoutingIndexer();
$indexer->generate(\Shopware_Controllers_Frontend_B2bContact::class, __DIR__ . '/my-acl-config.php');
```

Generated entries use `'NOT_MAPPED'` for unknown resources/privileges; replace each with the correct name.

5. **Extend templates** to hide inaccessible actions:

```twig
<a href="{{ url("frontend.b2b." ~ page.route ~ ".assign") }}" class="{{ b2b_acl('b2broleaddress', 'assign') }}">
```

This renders `is--b2b-acl is--b2b-acl-controller-b2broleaddress is--b2b-acl-action-assign` plus `is--b2b-acl-allowed` or `is--b2b-acl-forbidden`. Default behaviour hides forbidden elements with `display: none`; on a `form` tag it removes the submit button and disables all form items; on a row of the b2b default grid it mutes the applied ajax panel action.

**Default privileges**

| Privilege | Meaning |
|---|---|
| `list` | Entity listing (indexActions, gridActions) |
| `detail` | Read-only inspection: disabled forms, assignment lists |
| `create` | Creating new entities |
| `delete` | Removing entities |
| `update` | Changing existing entities |
| `assign` | Changing the entity's assignment |
| `free` | No restrictions |

**Assignment rules**: assignment controllers belong to the resource on the right side of the assignment (`B2BContactRole` → `role`); assignment listings use `detail` (`B2BContactRole:indexAction`); actions writing the assignment use `assign` (`B2BContactRole:assignAction`).

## Essential identifiers

- `Shopware\B2B\AclRoute\Framework\AclRoutingUpdateService` (`::create()`, `->addConfig()`)
- `Shopware\B2B\AclRoute\Framework\RoutingIndexer` (`->generate()`)
- Twig function `b2b_acl(resource, privilege)`
- `NOT_MAPPED`, snippet prefix `_acl_`
- CSS classes `is--b2b-acl`, `is--b2b-acl-allowed`, `is--b2b-acl-forbidden`

## Gotchas

- The ACL is enforced at PHP level — routes without access are blocked regardless; the template extension only improves UX.
- Any `NOT_MAPPED` entry in generated config marks a new action that still needs a privilege.
- None of these classes, routes or Twig functions exist in the installed platform packages; they ship with the B2B Suite plugin.

## Code check (6.7.15.1)
- unverified `Shopware\B2B\AclRoute\Framework\AclRoutingUpdateService` — B2B Suite plugin class, not part of the installed platform packages
- unverified `Shopware\B2B\AclRoute\Framework\RoutingIndexer` — B2B Suite plugin class, outside the platform packages
- unverified `b2b_acl` — Twig function registered by the B2B Suite, not by shopware/storefront
- unverified `frontend.b2b` — B2B Suite route prefix, no such routes in the platform packages
- confirmed `SwagB2bPlatform` — the B2B Suite is referenced only as an external plugin name in core — vendor/shopware/core/System/Resources/translation.yaml:9
