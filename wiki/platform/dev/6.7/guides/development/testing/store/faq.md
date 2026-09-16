---
id: platform/dev/6.7/guides/development/testing/store/faq.md
title: FAQ
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/faq.html
sourceHash: ff90cb46cb553caafa742b327f5d6bd8ae90938b
codeCheckedAgainst: "6.7.13.0"
keywords: ["store review faq", "shopware store submission", "extension review", "test environment", "partner account", "technology partner agreement", "third-party api declaration", "review blocking", "extension video", "store preview", "code quality review", "functional testing"]
summary: Shopware Store review FAQ - test environment, pre-submission setup, video, retest limits and 12-week block, third-party API declaration, partner agreement.
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/development/testing/store/content-and-translations.md"]
---
## What it is

Frequently asked questions about submitting an extension (plugin or app) to the Shopware Store review: test environment, what must be prepared, retest limits, declarations and agreements.

## When to use

Before submitting an extension to the Shopware Store, or when a submission has failed review and you need to know the process rules.

## Key steps / config

- **Requirements beyond core:** extensions must meet current development standards, best practices and security requirements even where Shopware does not provide the mechanism or safeguard out of the box.
- **Test environment:** a test environment is provided in your partner account, within the extension, to test all functionality.
- **Before submission:** check that everything works as described in the guidelines, and preconfigure at least one main functionality in the test environment (e.g. if the extension adds product custom fields with input options, set them up and create examples).
- **Video:** you may upload a video of the functionality, in English or German, recorded in the Shopware test environment. It helps review and can be shown in the Store.
- **Code quality:** reviewed after the functional test, against Shopware standards.
- **Retest limits:** at most three functional test rounds and two developer (code) review rounds.
- **Third-party APIs:** extensions that send or receive data to external APIs or services (e.g. PayPal, DHL, your own backend) must declare those integrations.
- **Technology partner agreement:** required before activation if the extension is a software application or interface that causes downstream costs, transaction fees or service charges for the customer. Contact: `alliances@shopware.com`; the information can also be included in the app and provided at final submission.
- **Preview:** must meet all requirements listed in the store description; placeholders (logo, "coming soon") are accepted if no images exist yet. See [Content and translations](platform/dev/6.7/guides/development/testing/store/content-and-translations.md).

## Gotchas

- Repeated failures or unresolved issues can block the extension for up to 12 weeks; during the block it is neither tested nor approved.
- Creating a functional copy of the extension to bypass a suspension is not permitted.

## Code check (6.7.13.0)
- unverified `test environment` — Store review process rule, not represented in installed Shopware code
- unverified `technology partner agreement` — contractual requirement, out of scope of vendor/shopware
- unverified `12 weeks` — review blocking period is a Store policy, not a code constraint
