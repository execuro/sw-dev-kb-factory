---
id: platform/dev/6.7/resources/references/adr/2026-09-29-authorize-webhooks-against-their-owner.md
title: Authorize webhooks against their owner
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-09-29-authorize-webhooks-against-their-owner.html
sourceHash: c04c937fc65a3aad9cd44ae16383227acd7e0e15
codeCheckedAgainst: "6.7.15.1"
keywords: ["webhook", "Hookable::isAllowed", "app_id", "app-less webhook", "app webhook", "webhook owner", "acl role", "FRAMEWORK__DELETE_RESTRICTED", "POST /api/webhook", "webhook authorization", "integration", "admin api", "adr"]
summary: "ADR: webhooks get an owner user/integration; delivery and writes are authorized against it. 6.7.15.1 still skips ACL for app-less webhooks"
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-09-29) that gives every webhook an owner (a user or an integration) and authorizes both event delivery and webhook writes against that owner's ACL roles. It closes the gap where app-less webhooks created through the Admin API received full payloads without any privilege check.

## When to use

- Creating, updating or deleting webhooks through the Admin API (`POST /api/webhook`) or from plugin/CLI code.
- Investigating why an app-less webhook does or does not receive an event, or why a user/integration cannot be deleted.

## Key steps / config

Two kinds of webhooks:

- **App webhooks** — declared in an app manifest, written by the app lifecycle; `app_id` is set.
- **App-less webhooks** — created via `POST /api/webhook`; `app_id` is `NULL`.

Problems before the decision: only app webhooks were checked against ACL (using the app's role); a caller with only `webhook:create` could receive data it may not read; `webhook:update` could repoint an app webhook's URL (still delivering under the app's role); app-less webhooks of other users could be changed or deleted; any event name was accepted on create, even non-hookable ones.

Decision:

1. **Owner.** An app-less webhook's owner is the user or integration that created it, recorded from the Admin API session on insert into an owner-user or owner-integration column (only one is set; the integration wins when the request carries one). An app webhook's owner is the app's integration, resolved from `app.integration_id` on load. Owner fields are neither writable nor readable through the API.
2. **Orphans.** The loader skips app-less rows without an owner. Deleting a user or integration that still owns app-less webhooks is rejected with `FRAMEWORK__DELETE_RESTRICTED` (HTTP 409); the database columns still cascade for direct deletes.
3. **Migration.** Existing app-less webhooks are assigned to one new admin integration labelled "Legacy webhooks" and keep delivering.
4. **Delivery.** On load, the owner is resolved to an owner type — admin (admin flag, every privilege) or restricted (roles from `acl_user_role`, `integration_role`, plus the app role for app integrations). A webhook only receives events its owner may read; app and app-less webhooks share this path.
5. **Writes.** Admin API updates/deletes of app webhooks are always rejected (also for administrators — the manifest owns them); app-less webhooks may only be changed by their owner or an administrator.
6. **Subscriptions on write.** The event must be hookable, every covering policy must permit the subscriber, and the subscriber must hold the event's required privileges; violations reject the write.
7. **Narrowing.** An app-less webhook may carry an optional list of ACL role ids; an admin owner may list any roles, a restricted owner only roles it holds. Without the list, all owner roles apply.

## Essential identifiers

- `webhook` entity, field `app_id`; `app.integration_id`
- `Hookable::isAllowed()` (`Shopware\Core\Framework\Webhook\Hookable`)
- Tables `acl_user_role`, `integration_role`
- `POST /api/webhook`, privileges `webhook:create`, `webhook:update`
- `FRAMEWORK__DELETE_RESTRICTED`

## Gotchas

- 6.7.15.1 does not implement this ADR: `WebhookManager` returns "allowed" for any webhook whose `appId` is `null`, so app-less webhooks still receive every subscribed event unchecked; only app webhooks are checked via the app's ACL role. `PrivilegePolicy`, `SubscriptionValidator`, `Hookable::NO_APP_ID`, the owner columns `owner_user_id`/`owner_integration_id` and the `aclRoleIds` webhook field are not in the installed code.
- After the change, existing app-less webhooks run with admin privileges (via the "Legacy webhooks" integration) until a merchant recreates them with fewer privileges.
- The Administration has no webhook list; deleting webhooks before deleting their owner needs the Admin API.
- Role-based narrowing is coarse: limiting a webhook to a single privilege needs a role granting exactly that privilege.

## Version notes

New public API introduced by the ADR (all HTTP 400 unless noted):

- Optional `webhook` field `aclRoleIds` (list of ACL role ids).
- `FRAMEWORK__WEBHOOK_OWNER_MISSING` — plugin/CLI inserts an app-less webhook without an owner.
- `FRAMEWORK__APP_WEBHOOK_NOT_MODIFIABLE` — Admin API change/delete of an app webhook.
- `FRAMEWORK__WEBHOOK_NOT_OWNED` — neither owner nor admin changes/deletes an app-less webhook.
- `FRAMEWORK__WEBHOOK_EVENT_NOT_PERMITTED` — event not hookable or refused by a policy.
- `FRAMEWORK__WEBHOOK_EVENT_PRIVILEGES_MISSING` — owner may not receive the event; message names the missing privileges.
- `Hookable::isAllowed()` receives `Hookable::NO_APP_ID` as app id for app-less webhooks.
- Existing `FRAMEWORK__DELETE_RESTRICTED` (HTTP 409) for deleting an owner that still owns webhooks.

## Code check (6.7.15.1)
- absent `NO_APP_ID` — `Hookable` defines no such constant in the installed code
- confirmed `Hookable::isAllowed()` — signature `isAllowed(string $appId, AclPrivilegeCollection $permissions)` — vendor/shopware/core/Framework/Webhook/Hookable.php:70
- corrected `WebhookManager::isEventDispatchingAllowed()` — docs: app-less webhooks authorized against their owner; installed returns true when `appId` is null — vendor/shopware/core/Framework/Webhook/Service/WebhookManager.php:324
- confirmed `appAclRoleId` — app webhooks are checked against the app's ACL role — vendor/shopware/core/Framework/Webhook/Service/WebhookLoader.php:74
- confirmed `app_id` — webhook FK to app, null for app-less webhooks — vendor/shopware/core/Framework/Webhook/WebhookDefinition.php:67
- absent `PrivilegePolicy` — not in the installed code
- absent `SubscriptionValidator` — not in the installed code
- absent `FRAMEWORK__WEBHOOK_NOT_OWNED` — error code not in the installed code
- absent `owner_user_id` — owner column not in the installed code
- confirmed `FRAMEWORK__DELETE_RESTRICTED` — existing restrict-delete error code — vendor/shopware/core/Framework/DataAbstractionLayer/Write/Validation/RestrictDeleteViolationException.php:65
