---
id: platform/dev/6.7/guides/plugins/plugins/storefront/javascript/plugin-reference.md
title: Storefront Plugins and Helper Reference
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/javascript/plugin-reference.html
sourceHash: 60d79aa050e0e5666146c9f4867e02b4f3ac002d
codeCheckedAgainst: "6.7.13.0"
keywords: ["storefront javascript plugins list", "js helpers", "CookiePermissionPlugin", "AddToCartPlugin", "OffCanvasCartPlugin", "ListingPlugin", "FilterBasePlugin", "BaseSliderPlugin", "SpeculationRulesPlugin", "CookieStorageHelper", "DomAccess", "NativeEventEmitter", "ViewportDetection", "PluginManager.register", "plugin registration name"]
summary: Reference of core Storefront JavaScript plugin classes and helpers (cart, listing, forms, wishlist, cookies, sliders; DomAccess, CookieStorageHelper, etc.).
lastBuilt: 2026-09-15
---
## What it is

A catalogue of the JavaScript plugins and helper classes shipped with the Shopware Storefront that plugins can use, extend or override. Plugin classes live under `src/plugin/`, helpers under `src/helper/` of the Storefront JS sources (installed at `vendor/shopware/storefront/Resources/app/storefront/src`).

## When to use

You are looking for an existing Storefront JS plugin to extend, override or subscribe to, or a helper to reuse. The class name (listed here) is what you import/extend; the name passed to `PluginManager.register()` in the core `main.js` (often without the `Plugin` suffix) is what `override()`, `getPlugin()` and `getPluginInstanceFromElement()` expect.

## Key steps / config

Plugins by area (class name, core registration name in parentheses where useful):

- **Header / navigation**: `SearchWidgetPlugin` (`SearchWidget`), `CartWidgetPlugin` (`CartWidget`), `WishlistWidgetPlugin`, `AccountGuestAbortButtonPlugin` (fires `guest-logout` after a guest logout), `OffCanvasAccountMenu` (`AccountMenu`), `OffcanvasMenuPlugin` (`OffCanvasMenu`), `ScrollUpPlugin`, `SetBrowserClassPlugin` (device classes such as `is-ipad` on the body), `SpeculationRulesPlugin` (enabled in `Admin > Settings > System > Storefront`).
- **Cart / product detail**: `AddToCartPlugin` (`AddToCart`), `OffCanvasCartPlugin` (`OffCanvasCart`), `BuyBoxPlugin`, `VariantSwitchPlugin`, `QuantitySelectorPlugin`, `MagnifierPlugin`, `ZoomModalPlugin`, `ImageZoomPlugin`, `CrossSellingPlugin`, `RatingSystemPlugin`, `OffCanvasTabs`.
- **Listing**: `ListingPlugin` (`Listing`; filters, sorting, pagination), `FilterBasePlugin` (base for filters), `OffCanvasFilter`.
- **Sliders / media**: `BaseSliderPlugin` (tiny-slider), `CmsGdprVideoElement` (consent overlay before external CMS video).
- **Forms**: `FormValidation`, `FormAjaxSubmitPlugin`, `FormAutoSubmitPlugin`, `FormAddHistoryPlugin`, `FormCmsHandler` (registered on `.cms-element-form form`), `FormFieldTogglePlugin`, `FormPreserverPlugin`, `FormSubmitLoaderPlugin`, `CountryStateSelectPlugin`, `DatePickerPlugin`, `DateFormat`, `ClearInputPlugin`, `RemoteClickPlugin`.
- **Captcha**: `BasicCaptchaPlugin`, `GoogleReCaptchaBasePlugin` (base for v2/v3).
- **Cookies**: `CookiePermissionPlugin` (`CookiePermission`, banner), `CookieConfiguration` (settings OffCanvas).
- **Wishlist**: `AddToWishlistPlugin`, `BaseWishlistStoragePlugin` (base for guest local and logged-in persisted storage), `GuestWishlistPagePlugin` (`/wishlist` for guests).
- **Modals / analytics**: `AjaxModalPlugin` (`AjaxModal`, trigger needs `data-url`), `GoogleAnalyticsPlugin` (only when Analytics is active).

Helpers: `ArrowNavigationHelper`, `CookieStorageHelper`, `DateFormatHelper` (`Intl.DateTimeFormat`), `Debouncer` (wraps `setTimeout`), `DeviceDetection`, `DomAccess`, `ElementReplaceHelper`, `FeatureSingleton` (feature flag checks), `Iterator`, `MemoryStorage` (fallback storage), `NativeEventEmitter` (not meant to be extended), `StorageSingleton` (local/session/cookie storage wrapper), `StringHelper`, `ViewportDetection` (active Bootstrap viewport, e.g. `LG`).

## Essential identifiers

- `src/plugin/<area>/<name>.plugin.js` (plugin classes), `src/helper/**/*.helper.js` (helpers)
- `PluginManager.register('<Name>', ..., '<selector>')` in `main.js` — registration name and selector
- `CookiePermissionPlugin`, `AddToCartPlugin`, `OffCanvasCartPlugin`, `ListingPlugin`, `FilterBasePlugin`, `BaseSliderPlugin`, `SpeculationRulesPlugin`
- `CookieStorageHelper`, `DomAccess`, `NativeEventEmitter`, `ViewportDetection`, `FeatureSingleton`, `StorageSingleton`

## Gotchas

- Some classes in the docs table are not in the installed 6.7 code: `AddressEditorPlugin`, `CollapseCheckoutConfirmMethodsPlugin`, `FormScrollToInvalidFieldPlugin`, `FlyoutMenuPlugin`, plus the removed `EllipsisPlugin` and `FadingPlugin`. Do not extend or override them.
- `FeatureSingleton` and `StorageSingleton` are not default exports: `feature.helper.js` default-exports `Feature`, `storage.helper.js` default-exports a storage instance.
- The installed code has plugins the table omits, e.g. `AlertAriaPlugin`, `NavbarPlugin`, `GallerySliderPlugin`, `ProductSliderPlugin`, `AddressManagerPlugin`.
- Cookie, wishlist and Google Analytics plugins are only registered when the `window` flags `useDefaultCookieConsent`, `wishlistEnabled`, `gtagActive` are set.

## Version notes

- `EllipsisPlugin` and `FadingPlugin` were deprecated and removed in v6.6.0.

## Code check (6.7.13.0)
- absent `AddressEditorPlugin` — not found anywhere in the installed code
- absent `CollapseCheckoutConfirmMethodsPlugin` — not found anywhere in the installed code
- absent `FormScrollToInvalidFieldPlugin` — not found anywhere in the installed code
- absent `FlyoutMenuPlugin` — not found anywhere in the installed code
- absent `EllipsisPlugin` — removed in v6.6.0, not in the installed code
- absent `FadingPlugin` — removed in v6.6.0, not in the installed code
- confirmed `CookiePermissionPlugin` — class in src/plugin/cookie — vendor/shopware/storefront/Resources/app/storefront/src/plugin/cookie/cookie-permission.plugin.js:10
- confirmed `SpeculationRulesPlugin` — registered synchronously as SpeculationRules — vendor/shopware/storefront/Resources/app/storefront/src/main.js:83
- confirmed `CookieStorageHelper` — default export of cookie-storage.helper.js — vendor/shopware/storefront/Resources/app/storefront/src/helper/storage/cookie-storage.helper.js:4
- confirmed `FeatureSingleton` — internal class; file default-exports Feature — vendor/shopware/storefront/Resources/app/storefront/src/helper/feature.helper.js:4
