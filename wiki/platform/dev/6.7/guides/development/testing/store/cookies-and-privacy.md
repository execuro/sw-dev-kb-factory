---
id: platform/dev/6.7/guides/development/testing/store/cookies-and-privacy.md
title: Cookies and privacy
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/cookies-and-privacy.html
sourceHash: ae491c9538cfc46e83562d15b7d77465f3f42648
codeCheckedAgainst: "6.7.15.1"
keywords: ["cookie consent manager", "cookie categories", "technically required", "marketing", "comfort features", "cookie.groupRequired", "cookie.groupMarketing", "cookie.groupComfortFeatures", "dsgvo", "gdpr", "subprocessor", "store review"]
summary: Store review cookie rules - register cookies in the Cookie Consent Manager, unchecked by default, one of three categories; DSGVO subprocessor declaration
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md"]
---
## What it is

Shopware Store review requirements for how an extension registers cookies and declares personal-data processing.

## When to use

When an extension sets cookies from the store URL or processes personal data of merchants or end customers, and you prepare it for Store submission.

## Key steps / config

- Register every cookie in the [Cookie Consent Manager](platform/dev/6.7/guides/plugins/plugins/storefront/advanced/add-cookie-to-manager.md).
- Cookies must be optional; classify one as technically required only if it truly is.
- All cookies appear **unchecked** by default in the Storefront cookie configuration, unless law and product behavior explicitly require otherwise.
- Assign each cookie to exactly one category:
  - **Technically required** (`cookie.groupRequired`) — strictly necessary for the shop to function.
  - **Marketing** (`cookie.groupMarketing`) — analytics or data collection.
  - **Comfort features** (`cookie.groupComfortFeatures`) — everything else needed for a specific feature.
- Example: a pop-up reminder cookie is not technically required; use Comfort features or tie it to the session cookie.

Privacy (Art. 28 DSGVO): enter the data processor under **Subprocessor** and further processors under **Further subprocessors** in the Shopware Account; mention external services that receive personal data in the description.

## Essential identifiers

- `cookie.groupRequired`, `cookie.groupMarketing`, `cookie.groupComfortFeatures` (core cookie group snippet names)

## Gotchas

- Core also defines a fourth group, `cookie.groupStatistical` (used e.g. for Google Analytics), while the review guideline lists only three categories — the guideline puts analytics under Marketing.

## Code check (6.7.15.1)
- confirmed `cookie.groupRequired` — technically-required group snippet — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:30
- confirmed `cookie.groupComfortFeatures` — comfort features group snippet — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:32
- confirmed `cookie.groupMarketing` — marketing group snippet — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:33
- corrected `cookie.groupStatistical` — docs: only three categories exist; core also has a statistical group — vendor/shopware/core/Content/Cookie/Service/CookieProvider.php:31
