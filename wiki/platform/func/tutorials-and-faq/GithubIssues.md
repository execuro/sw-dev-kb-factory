---
id: platform/func/tutorials-and-faq/GithubIssues.md
title: GithubIssues
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/GithubIssues
sourceHash: 73dbe3941b235e9f8927a343973bd69b5f323c761690ed2d22302cb101b4a6fc
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["GitHub Issues", "bug report", "issue tracker", "feature request", "feedback.shopware.com", "is:issue", "is:open", "security vulnerability report", "Shopware version field", "vote issue"]
summary: "How to search, vote on, and file Shopware bug reports on GitHub Issues, and where to submit feature requests instead."
lastBuilt: "2026-09-15"
---
## What it is

This article explains how to use the Shopware GitHub Issues page to report and track bugs, and clarifies that feature requests go elsewhere.

## When to use

Use this when you want to check if a bug is already known, vote/comment on an existing issue, file a new bug report, or submit a feature idea.

## Key steps / config

- Bug tracker: `github.com/shopware/shopware/issues`.
- Viewing issues requires no account; creating, voting, or commenting requires a free GitHub account.
- Search existing issues keeping `is:issue` and `is:open` in the query, e.g. adding a keyword like `search` to find open issues about search.
- Voting with a thumbs-up on an issue increases its perceived relevance; comments can add missing context.
- To file a new bug report, click **New Issue**, then **Get started** next to "Bug report" (or use the "Report a security vulnerability" section for critical security issues). Required fields: Title (1), Shopware version (2), Affected area / extension (3), Actual behavior (4), Expected behavior (5), How to reproduce (6).
- Feature requests are not accepted via GitHub Issues; submit them at `feedback.shopware.com`.

## Essential identifiers

- Issues repository: `github.com/shopware/shopware/issues`
- Search filters: `is:issue`, `is:open`
- Feedback site: `feedback.shopware.com`

## Gotchas

- GitHub Issues is exclusively for bug reports, not feature requests or suggestions.
- Only "Report a security vulnerability" should be used for critical security issues, not the general bug report flow.
