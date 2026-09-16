---
id: platform/dev/6.6/resources/references/storefront-reference/plugin-reference.md
sourceHash: 224681ef5386c96c381467955f48fe16521f04dc
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/storefront-reference/plugin-reference.html
title: Storefront plugins
version: "6.6"
versions: ["6.6"]
docType: developer
keywords: ["storefront plugins", "JavaScript plugins", "AddToCartPlugin", "ListingPlugin", "OffCanvasCartPlugin", "FilterBasePlugin", "CookiePermissionPlugin", "SearchWidgetPlugin", "ZoomModalPlugin", "storefront helpers", "DomAccess", "FeatureSingleton", "StorageSingleton", "deprecated plugin"]
summary: "Full list of built-in storefront JavaScript plugins and helper classes, what each does, and which are deprecated/removed in 6.6.0."
lastBuilt: 2026-09-15
---
## What it is

A reference listing every built-in storefront JavaScript plugin and helper class that ships with Shopware 6, with a description of what each one does. Split into two tables: Plugins and Helpers.

## When to use

Consult this page when extending or overriding storefront JavaScript behaviour, to find the existing plugin/helper that already implements a given interaction (cart, wishlist, filters, OffCanvas, forms, sliders, etc.) instead of duplicating it.

## Key steps / config

Selected plugins by area:
- Cart/wishlist: `AddToCartPlugin`, `CartWidgetPlugin`, `OffCanvasCartPlugin`, `AddToWishlistPlugin`, `BaseWishlistStoragePlugin`, `GuestWishlistPagePlugin`, `WishlistWidgetPlugin`
- Listing/filters: `ListingPlugin`, `FilterBasePlugin` (extended by other filters, communicates with `ListingPlugin`), `OffCanvasFilter`
- Forms: `FormAjaxSubmitPlugin`, `FormAutoSubmitPlugin`, `FormValidation`, `FormFieldTogglePlugin`, `FormPreserverPlugin`, `FormScrollToInvalidFieldPlugin`, `FormSubmitLoaderPlugin`, `FormCmsHandler`, `FormAddHistoryPlugin`
- Account/navigation: `AccountGuestAbortButtonPlugin`, `AddressEditorPlugin`, `OffCanvasAccountMenu`, `FlyoutMenuPlugin`, `OffcanvasMenuPlugin`, `OffCanvasTabs`
- Media/product detail: `BuyBoxPlugin`, `VariantSwitchPlugin`, `MagnifierPlugin`, `ImageZoomPlugin` (works with `ZoomModalPlugin`), `CrossSellingPlugin`, `RatingSystemPlugin`
- Cookies/consent: `CookieConfiguration`, `CookiePermissionPlugin`, `CmsGdprVideoElement`
- Misc: `BaseSliderPlugin` (uses the "tiny-slider" framework), `CountryStateSelectPlugin`, `SearchWidgetPlugin`, `DateFormat`, `DatePickerPlugin`, `ClearInputPlugin`, `ScrollUpPlugin`, `SetBrowserClassPlugin`, `SpeculationRulesPlugin` (activated via Admin > Settings > System > Storefront), `RemoteClickPlugin`, `QuantitySelectorPlugin`, `GoogleAnalyticsPlugin`, `GoogleReCaptchaBasePlugin`, `BasicCaptchaPlugin`, `AjaxModalPlugin`

Deprecated and removed in v6.6.0: `EllipsisPlugin`, `FadingPlugin`.

## Essential identifiers

Helpers: `ArrowNavigationHelper` (used by `SearchWidgetPlugin`), `CookieStorageHelper`, `DateFormatHelper` (wraps `Intl.DateTimeFormat`), `Debouncer` (wraps `setTimeout`), `DeviceDetection`, `DomAccess`, `ElementReplaceHelper`, `FeatureSingleton`, `Iterator`, `MemoryStorage`, `NativeEventEmitter` (not meant to be extended), `StorageSingleton`, `StringHelper`, `ViewportDetection`.

## Gotchas

`EllipsisPlugin` and `FadingPlugin` are deprecated and removed in v6.6.0 — do not build on them. `NativeEventEmitter` is documented as not meant to be extended.

## Version notes

`EllipsisPlugin` and `FadingPlugin` were removed in v6.6.0.
