---
id: platform/dev/6.7/guides/development/testing/store/faq.md
title: FAQ
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/store/faq.html
sourceHash: ff90cb46cb553caafa742b327f5d6bd8ae90938b
codeCheckedAgainst: "6.7.15.1"
keywords: ["store review faq", "extension submission", "test environment", "functional testing", "code review", "blocking period", "third-party api", "technology partner agreement", "preview", "demo video", "store approval"]
summary: Shopware Store review FAQ - test environment, pre-submission setup, review attempts and 12-week block, API declarations, partner agreement, previews
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/development/testing/store/content-and-translations.md"]
---
## What it is

Frequently asked questions about the Shopware Store review process for extensions: test environment, what to prepare, how often an extension is tested, and declaration duties.

## When to use

When planning a Store submission or after a failed review, to know the process rules and limits.

## Key steps / config

- **Standards beyond Shopware**: extensions must meet current development standards, best practices and security requirements even where Shopware does not provide the mechanism out of the box.
- **Test environment**: a test environment is provided in your partner account within the extension, for testing all functionality.
- **Before submission**: check everything works as described in the guidelines, and preconfigure at least one main functionality (e.g. set up product custom fields with examples in the test environment).
- **Video**: you may upload a demo video, in English or German, recorded in the test environment; it can also be used in-store.
- **Code quality**: reviewed by Shopware developers after the functional test, against Shopware standards.
- **Repeated failures**: at most three functional tests and two developer reviews. Repeated or unresolved errors may block the extension for up to **12 weeks**, with no testing or approval meanwhile. Creating a functional copy to bypass the block is not permitted.
- **Third-party APIs**: extensions that send/receive data via external APIs or services (e.g. PayPal, DHL, own backend) must declare those integrations.
- **Technology partner agreement**: required before activation if the extension causes downstream costs, transaction fees or service charges for the customer; the information can also be provided in the app at final submission.
- **Preview**: must meet all store description requirements; placeholders such as a logo or "coming soon" are allowed if no images exist yet. See [Content and Translations](platform/dev/6.7/guides/development/testing/store/content-and-translations.md).

## Code check (6.7.15.1)
- unverified `technology partner agreement` — Store/account process rule, no counterpart in the installed code
- unverified `12 weeks` — review blocking period is a Store policy, not code
