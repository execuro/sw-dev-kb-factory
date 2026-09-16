---
id: platform/dev/6.6/guides/plugins/apps/app-sdks/php/_index.md
title: Official PHP SDK
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/apps/app-sdks/php/
sourceHash: 572311563a25954fe40b4a59eaf80319fbef8cc4
keywords: ["App SDK", "PHP SDK", "lifecycle management", "context object", "signing", "HTTP client", "event handling", "installation", "activation", "deactivation", "uninstallation"]
summary: "Overview of the PHP App SDK: installation, lifecycle management, context handling, signing, an HTTP client, and event handling for Shopware apps."
lastBuilt: "2026-09-15"
---
## What it is

The App SDK in PHP is a software development kit provided by Shopware for creating custom applications and plugins. It offers a straightforward installation process and lifecycle-management features to handle activation, deactivation, and uninstallation of an app.

## When to use

Use the PHP App SDK when building an app backend in PHP that needs to communicate with Shopware — handling registration, context resolution, request/response signing, outbound HTTP calls, or reacting to Shopware lifecycle events.

## Key steps / config

The SDK provides:

- A context object granting access to relevant Shopware information and services, used for interacting with Shopware's APIs, accessing database entities, and executing operations.
- Signing mechanisms so requests and responses can be validated for authenticity and integrity between the app and Shopware.
- An HTTP client that simplifies calling Shopware API endpoints — handling authentication, executing HTTP requests, and processing responses.
- Event handling, so an app can subscribe to and react to specific events triggered within the Shopware system, enabling customization and extension of Shopware's functionality via custom logic when specific events occur.

Together, installation, lifecycle management, context handling, signing, an HTTP client, and event handling form the foundation for developing custom PHP-based apps and plugins for Shopware.

## Essential identifiers

- App SDK (PHP)
- context object
- HTTP client
- lifecycle management (activation, deactivation, uninstallation)
