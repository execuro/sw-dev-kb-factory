---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/javascript/_index.md
title: Official JavaScript SDK
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/javascript/
sourceHash: a135f8feb790583946f0ac5058e6242ab4b4f1a2
keywords: ["App SDK", "JavaScript SDK", "Node", "Deno", "Bun", "Cloudflare Workers", "Request/Response", "HTTP client", "signing", "context object"]
summary: "The JavaScript App SDK simplifies building Shopware apps with standard Request/Response objects, a context object, signing, and an HTTP client."
lastBuilt: "2026-09-15"
---
## What it is

The App SDK for JavaScript abstracts and simplifies creating Shopware apps. It uses standardized JavaScript Request/Response objects, so it runs on Node, Deno, Bun, and Cloudflare Workers.

## When to use

Use this SDK when building the backend for a Shopware app in JavaScript or TypeScript on any of those runtimes.

## Key steps / config

The SDK provides a context object that grants access to relevant information and services within the Shopware environment — used for interacting with Shopware's APIs, accessing database entities, and executing various operations. It supports signing mechanisms so requests and responses can be validated for authenticity and integrity between the app and Shopware. It also includes an HTTP client that simplifies making API requests to Shopware endpoints, handling authentication, executing HTTP requests, and processing responses.

## Essential identifiers

- App SDK for JavaScript
- context object
- Request/Response
- Node, Deno, Bun, Cloudflare Workers
