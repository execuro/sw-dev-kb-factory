---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md
title: Storefront Plugins and Helper Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/plugin-reference.html
sourceHash: 60d79aa050e0e5666146c9f4867e02b4f3ac002d
codeCheckedAgainst: "6.7.15.1"
keywords: ["storefront javascript plugins", "js helpers", "CookiePermissionPlugin", "AddToCartPlugin", "ListingPlugin", "FilterBasePlugin", "OffCanvasCartPlugin", "DomAccess", "NativeEventEmitter", "ViewportDetection", "StorageSingleton", "FeatureSingleton", "plugin list", "extendable plugins"]
summary: Reference list of core Storefront JS plugins and helper classes available to extend or reuse in Shopware 6.7, with what each one does.
lastBuilt: 2026-10-21
---
## What it is

A catalogue of the JavaScript plugins and helpers shipped with the Shopware Storefront that plugin developers can reuse or extend (override). Each entry is a class name plus a one-line purpose.

## When to use

When looking for an existing Storefront JS plugin to override or subscribe to, or a helper to import instead of writing your own DOM, storage, viewport or date utilities.

## Essential identifiers

Plugins — cart, checkout, product:
- `AddToCartPlugin` — submits the add-to-cart form and opens the OffCanvas cart
- `OffCanvasCartPlugin` — cart in an OffCanvas; `CartWidgetPlugin` — header cart total
- `BuyBoxPlugin` — refreshes buy box after variant switch; `VariantSwitchPlugin` — submits variant form
- `QuantitySelectorPlugin` — +/- quantity buttons
- `CrossSellingPlugin` — re-initialises sliders in cross-selling tabs
- `ZoomModalPlugin`, `ImageZoomPlugin`, `MagnifierPlugin` — product image zoom/gallery
- `RatingSystemPlugin` — review star selection (1–5)

Plugins — wishlist, account:
- `AddToWishlistPlugin`, `WishlistWidgetPlugin`, `BaseWishlistStoragePlugin`, `GuestWishlistPagePlugin` (`/wishlist` for guests)
- `AccountGuestAbortButtonPlugin` — fires `guest-logout` after guest logout
- `OffCanvasAccountMenu` — account menu in OffCanvas on mobile

Plugins — listing, navigation, layout:
- `ListingPlugin` — filters, sorting, pagination requests; `FilterBasePlugin` — base for listing filters
- `OffCanvasFilter`, `OffCanvasTabs`, `OffcanvasMenuPlugin` — mobile OffCanvas variants
- `CollapseFooterColumnsPlugin`, `ScrollUpPlugin`, `SetBrowserClassPlugin` (adds e.g. `is-ipad` to `<body>`)
- `SearchWidgetPlugin` — search suggestions dropdown
- `BaseSliderPlugin` — slider base using tiny-slider
- `AjaxModalPlugin` — Bootstrap modal loading content from a `data-url` attribute
- `SpeculationRulesPlugin` — speculation rules, enabled under `Admin > Settings > System > Storefront`

Plugins — forms, consent, misc:
- `FormAjaxSubmitPlugin`, `FormAutoSubmitPlugin`, `FormAddHistoryPlugin`, `FormCmsHandler`, `FormFieldTogglePlugin`, `FormPreserverPlugin`, `FormSubmitLoaderPlugin`, `FormValidation`
- `CountryStateSelectPlugin`, `DatePickerPlugin`, `DateFormat`, `ClearInputPlugin`, `RemoteClickPlugin`
- `BasicCaptchaPlugin`, `GoogleReCaptchaBasePlugin` (base for v2/v3)
- `CookiePermissionPlugin` (cookie banner), `CookieConfiguration` (cookie OffCanvas), `CmsGdprVideoElement` (consent overlay for external CMS video)
- `GoogleAnalyticsPlugin` — `gtag` events when Analytics is active in the sales channel

Helpers:
- `DomAccess`, `ElementReplaceHelper`, `Iterator`, `StringHelper`, `Debouncer` (wraps `setTimeout`)
- `ArrowNavigationHelper` (used by `SearchWidgetPlugin`), `DeviceDetection`, `ViewportDetection` (Bootstrap viewport, e.g. `LG`/`XL`)
- `CookieStorageHelper`, `StorageSingleton` (local/session/cookie storage), `MemoryStorage` (fallback)
- `DateFormatHelper` (wraps `Intl.DateTimeFormat`), `FeatureSingleton` (feature-flag checks)
- `NativeEventEmitter` — DOM-element based emitter, not meant to be extended

## Gotchas

- Several names in the upstream table do not exist in the 6.7.15.1 Storefront code: `AddressEditorPlugin`, `CollapseCheckoutConfirmMethodsPlugin`, `FlyoutMenuPlugin`, `FormScrollToInvalidFieldPlugin`. Do not try to override or import them. The installed code instead ships e.g. `AddressManagerPlugin` (registered as `AddressManager`) and `NavbarPlugin` (registered as `Navbar`).
- `FeatureSingleton` and `StorageSingleton` are internal classes; the helper files export a frozen instance (`StorageInstance`) and, for features, the default class `Feature`.
- `FormValidation` is the class name of both a helper (`helper/form-validation.helper.js`) and a plugin (`plugin/forms/form-validation.plugin.js`).

## Version notes

- `EllipsisPlugin` and `FadingPlugin` were deprecated and removed in v6.6.0 and are not present in 6.7.

## Code check (6.7.15.1)
- absent `AddressEditorPlugin` — listed in docs, no such class in the installed code
- absent `CollapseCheckoutConfirmMethodsPlugin` — listed in docs, no such class in the installed code
- absent `FlyoutMenuPlugin` — listed in docs, no such class in the installed code
- absent `FormScrollToInvalidFieldPlugin` — listed in docs, no such class in the installed code
- absent `EllipsisPlugin` — removed in v6.6.0
- absent `FadingPlugin` — removed in v6.6.0
- confirmed `CookiePermissionPlugin` — cookie banner plugin class — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:10
- confirmed `SpeculationRulesPlugin` — speculation rules plugin class — vendor/shopware/storefront/Resources/app/storefront/src/plugin/speculation-rules/speculation-rules.plugin.js:9
- confirmed `StorageSingleton` — wraps local/session storage — vendor/shopware/storefront/Resources/app/storefront/src/helper/storage/storage.helper.js:7
- confirmed `FeatureSingleton` — feature-flag helper class — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:4
