# `dev-54` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-54` · `dev` · `Storefront` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0922-52-61` |
| Core version | `6.7.13.0` |

**Query:** How do I register a plugin cookie in the storefront cookie consent manager in Shopware 6.7?

**Expected answer — every fact an answer must contain:**

1. Register an invokable listener service tagged `kernel.event_listener` for `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent` — a **core** (not storefront) event, dispatched by `Shopware\Core\Content\Cookie\Service\CookieProvider::getCookieGroups()`; it exposes a mutable public `$cookieGroupCollection` plus the `Request` and the `SalesChannelContext`, so registration can be made sales-channel dependent. There is no cookie-specific service tag. `[code: Content/Cookie/Service/CookieProvider.php:51-72]` `[code: Content/Cookie/Event/CookieGroupCollectEvent.php:15-22]`
2. In `__invoke(CookieGroupCollectEvent $event): void`, fetch a group from the collection — keyed by technical name, e.g. `$event->cookieGroupCollection->get(CookieProvider::SNIPPET_NAME_COOKIE_GROUP_COMFORT_FEATURES)` — make sure it has a `CookieEntryCollection` and add a `new CookieEntry('my-cookie')` configured through the public properties `name` (snippet key), `value` and `expiration`. A `CookieGroup` is either a cookie itself (`setCookie()`) or a container of entries (`setEntries()`), never both — mixing them throws `CookieException::notAllowedPropertyAssignment` — and a group that ends up with neither is silently dropped from the output. `[code: Content/Cookie/Struct/CookieEntry.php:14-27]` `[code: Content/Cookie/Struct/CookieGroup.php:53-70]`
3. The older storefront route — implementing/decorating `Shopware\Storefront\Framework\Cookie\CookieProviderInterface` — is deprecated since 6.7.3.0 and removed in 6.8.0: it still works in 6.7 but emits a service and a runtime deprecation, and it is not additive — while a legacy provider is registered and the `v6.8.0.0` flag is off, core converts that legacy array *instead of* building its own default groups. `[code: shopware/storefront Framework/Cookie/CookieProvider.php:86-95]` `[code: shopware/storefront DependencyInjection/services.php:725-727]` `[code: Content/Cookie/Service/CookieProvider.php:55-65]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The 6.7 consent list is built by the core `CookieProvider`, which dispatches `CookieGroupCollectEvent` as the extension point | `Content/Cookie/Service/CookieProvider.php:51-72` | `$this->eventDispatcher->dispatch(new CookieGroupCollectEvent($cookieGroups, $request, $salesChannelContext));` |
| The event carries a mutable collection plus Request and SalesChannelContext | `Content/Cookie/Event/CookieGroupCollectEvent.php:15-22` | `public CookieGroupCollection $cookieGroupCollection, public readonly Request $request, protected readonly SalesChannelContext $salesChannelContext,` |
| Cookies are `CookieEntry` structs with public `cookie`, `value`, `expiration`, `name`, `description`, `hidden`; the group collection is keyed by technical name | `Content/Cookie/Struct/CookieEntry.php:14-27`, `Content/Cookie/Struct/CookieGroupCollection.php:14-26` | `parent::set($element->getTechnicalName(), $element);` |
| A group is a cookie **or** a container, never both | `Content/Cookie/Struct/CookieGroup.php:53-70` | `throw CookieException::notAllowedPropertyAssignment('cookie', 'entries');` |
| Groups without entries and without an own cookie are removed before rendering | `Content/Cookie/Service/CookieProvider.php` (`removeCookieGroupsWithoutCookies`) | `// Cookie groups without cookie entries should not be shown to the user` |
| The four group snippet constants | `Content/Cookie/Service/CookieProvider.php:28-32` | `SNIPPET_NAME_COOKIE_GROUP_REQUIRED = 'cookie.groupRequired';` … |
| Legacy `CookieProviderInterface::getCookieGroups()` triggers a deprecation, removal 6.8.0 | `shopware/storefront Framework/Cookie/CookieProvider.php:86-95` | `Feature::triggerDeprecationOrThrow('v6.8.0.0', …)` |
| The legacy service is DI-deprecated as of 6.7.3.0 | `shopware/storefront DependencyInjection/services.php:725-727` | `->deprecate('shopware/storefront', '6.7.3.0', …)` |
| Legacy and new path are mutually exclusive branches | `Content/Cookie/Service/CookieProvider.php:55-65` | `if ($this->legacyCookieProvider && !Feature::isActive('v6.8.0.0')) { $this->convertLegacyCookies(…) } else {` |
| Core's own listeners use a plain `kernel.event_listener` tag | `Checkout/DependencyInjection/customer.xml:393-396` | `<tag name="kernel.event_listener"/>` |
| Reference implementation, conditional on sales-channel config | `Checkout/Customer/Cookie/WishlistCookieCollectListener.php:25-49` | `$entryWishlist = new CookieEntry('wishlist-enabled'); … $entries->add($entryWishlist);` |
| Names/descriptions are translated after the event, so listeners pass snippet keys | `Content/Cookie/Service/CookieProvider.php:67-70` | `$this->translateCookieGroupsAndTheirEntries($cookieGroup);` |
| The store-api route computes a configuration hash and writes it into the `cookie-config-hash` entry; it is experimental | `Content/Cookie/SalesChannel/CookieRoute.php:21-47` | `@experimental stableVersion:v6.8.0 feature:COOKIE_GROUPS_STORE_API` … `path: '/store-api/cookie-groups'` |
| JS side reacts through the `CookieConfiguration_Update` emitter event | `shopware/storefront Resources/app/storefront/src/plugin/cookie/cookie-configuration.plugin.js:45,542-550` | `document.$emitter.publish(COOKIE_CONFIGURATION_UPDATE, updatedCookies);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A dedicated service tag such as `shopware.cookie.provider` | absent | `grep -rn "shopware.cookie"` over core and storefront returns nothing; the legacy mechanism is service *decoration* of `CookieProviderInterface` |
| An app-script hook `CookieGroupCollectHook` in 6.7.13.0 | absent | `Content/Cookie/` has no `Hook` directory; the hook exists only on upstream trunk |
| The storefront still owns the cookie registry in 6.7 | absent | the storefront class is only an optional legacy argument to the core service (`Content/DependencyInjection/cookie.xml:9-15`) |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| Adding a group/entry from a listener, incl. snippet translation | `shopware/shopware @ trunk tests/unit/Core/Content/Cookie/Service/CookieProviderTest.php` — `testNewCookieAddedViaEvent` |
| Legacy provider still converted while `v6.8.0.0` is off | same file — `testLegacyCookieConverting` (`#[DisabledFeatures(['v6.8.0.0'])]`) |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Old decorator recipe is outdated for 6.7; event replaces it | 6.7 | open | developer.shopware.com add-cookie-to-manager |
| Cookie group assembly moved from Storefront controller to a core `CookieRoute` | 6.7 | merged | shopware/shopware#10354 |
| `Request` added to the event, backported to 6.7.3.x | 6.7 | merged | shopware/shopware#12627 (#12643) |
| Plugins can register conditionally since 6.7.3.0 | 6.7 | closed | shopware/shopware#18739 |
| Filtering a cookie by active payment method is the plugin's job, not core's | 6.6 \| 6.7 | closed | shopware/shopware#4375 |
| Further app-side mechanisms (manifest `<active-payment-method>`, collect hook) | 6.7 | closed | shopware/shopware#19384 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `CookieProviderInterface` still exist and is it deprecated? | code | exists, deprecated 6.7.3.0, removal 6.8.0, runtime deprecation on call |
| FQCN of the collect event and its dispatcher | code | `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent`, dispatched by the core `CookieProvider` |
| Typed objects or nested arrays? | code | typed `CookieGroup`/`CookieEntry` structs; the array form exists only through `convertLegacyCookies()` |
| Is there an app-script cookie hook in this version? | code | no — absent in 6.7.13.0 |
| Does core filter cookies by active payment method? | code | no such filtering; `WishlistCookieCollectListener` shows the listener doing it itself |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Listen to `CookieGroupCollectEvent` and add cookies to the collection | "Adding custom cookies requires you to listen to the `CookieGroupCollectEvent`…" | add-cookie-to-manager.md | yes |
| Tagged `kernel.event_listener` with the core FQCN | "->tag('kernel.event_listener', ['event' => 'Shopware\\Core\\Content\\Cookie\\Event\\CookieGroupCollectEvent']);" | add-cookie-to-manager.md | yes |
| Since 6.7.3.0 structured objects replace arrays | "Since Shopware 6.7.3.0, cookies use structured objects (`CookieEntry` and `CookieGroup`)…" | add-cookie-to-manager.md | yes (DI deprecation names 6.7.3.0) |
| Group fetched by `CookieProvider::SNIPPET_NAME_*`, entries may be null | "$comfortFeaturesCookieGroup = $event->cookieGroupCollection->get(…)" | add-cookie-to-manager.md | yes |
| `CookieEntry` built from the cookie key, configured via `name`/`value`/`expiration` | "$cookieEntry = new CookieEntry('my-cookie-key');" | add-cookie-to-manager.md | yes |
| `CookieProviderInterface` deprecated but working for BC | "This interface is now deprecated and should be replaced…" | add-cookie-to-manager.md | yes |
| Groups must not carry `cookie`, `value`, `expiration`, `isRequired` | "Cookie groups should not have the `cookie`, `value`, `expiration`, or `isRequired` parameters." | add-cookie-to-manager.md | partly — code enforces cookie-vs-entries exclusivity; no `isRequired` property was shown |
| Store API endpoint `GET /store-api/cookie/groups` since 6.7.3.0 | "The Store API endpoint for cookie groups is available starting with Shopware 6.7.3.0." | cookie-consent-management.md | no — the route path in code is `/store-api/cookie-groups` and is `@experimental` |
| Hash stored in a `cookie-config-hash` browser cookie keyed by language id | "…stored in the browser's `cookie-config-hash` cookie as an object where the language ID is the key…" | add-cookie-to-manager.md | partly — code shows the hash written into a `cookie-config-hash` entry; the per-language object shape was not checked |
| `cookie-group-collect` app hook, introduced 6.7.14.0 | "The `cookie-group-collect` hook was introduced in Shopware 6.7.14.0." | cookies-with-apps.md | no — absent in 6.7.13.0, consistent with a later introduction |

Intent/business context the code cannot express: the consent manager exists for GDPR compliance and the docs place legal responsibility on the shop owner; the configuration hash exists to re-prompt users whenever cookie handling changes; registering a cookie only makes it appear in the manager — acting on consent needs separate JavaScript.

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| Store API path `/store-api/cookie/groups` | the route is `/store-api/cookie-groups`, name `store-api.cookie.groups`, marked `@experimental stableVersion:v6.8.0 feature:COOKIE_GROUPS_STORE_API` | `Content/Cookie/SalesChannel/CookieRoute.php:21-47` |
| Groups must not carry an `isRequired` parameter | no `isRequired` property exists on `CookieGroup`; what the code enforces is that a group has either `cookie` or `entries` | `Content/Cookie/Struct/CookieGroup.php:53-70` |
| An app script hook `cookie-group-collect` participates in cookie collection | no `Hook` directory under `Content/Cookie` in 6.7.13.0; docs themselves date it to 6.7.14.0 | `Content/Cookie/` |
| The legacy `CookieProviderInterface` "still works for backward compatibility" (read as additive) | it is not additive: while a legacy provider is registered and `v6.8.0.0` is off, core skips its own default groups and converts the legacy array instead | `Content/Cookie/Service/CookieProvider.php:55-65` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Register a listener in `services.php` tagged `kernel.event_listener` for the event `Shopware\Core\Content\Cookie\Event\CookieGroupCollectEvent` and implement `__invoke(CookieGroupCollectEvent $event): void`. | rewritten | kept and confirmed; extended with the dispatcher, the event's payload (Request + SalesChannelContext) and the absence of a cookie-specific tag |
| Inside the listener, take a group from `$event->cookieGroupCollection` (e.g. `CookieProvider::SNIPPET_NAME_COOKIE_GROUP_COMFORT_FEATURES`), get/create its `CookieEntryCollection` and add a `CookieEntry` with `name`, `value` and `expiration`; groups themselves must not carry `cookie`, `value`, `expiration` or `isRequired`. | rewritten | confirmed up to the group clause; `isRequired` does not exist on `CookieGroup`, so the enforced rule (cookie XOR entries, `CookieException::notAllowedPropertyAssignment`) replaces it, plus the silent drop of empty groups |
| Since 6.7.3.0 structured `CookieEntry`/`CookieGroup` objects replace the array format and `CookieProviderInterface` is deprecated (still working for BC); the cookie config hash is stored per language in the browser cookie `cookie-config-hash` and exposed via `/store-api/cookie/groups`. | rewritten | deprecation since 6.7.3.0 / removal 6.8.0 confirmed, but the store-api path is wrong (`/store-api/cookie-groups`, experimental) and the per-language hash shape is unverified, so both were dropped from the fact; the load-bearing point code adds is that the legacy path is not additive |
