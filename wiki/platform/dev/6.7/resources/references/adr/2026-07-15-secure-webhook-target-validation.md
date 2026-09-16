---
id: platform/dev/6.7/resources/references/adr/2026-07-15-secure-webhook-target-validation.md
title: Secure webhook target validation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-15-secure-webhook-target-validation.html
sourceHash: 8c4ebf18dcda6a0f91de37ec9a1b9b3950bb03dc
codeCheckedAgainst: "6.7.13.0"
keywords: ["webhook", "ssrf", "shopware.webhook.guzzle", "WebhookClient", "webhook_event_log", "webhook.url", "allow_redirects", "CURLOPT_RESOLVE", "shopware.yaml", "redirect validation", "dns rebinding", "https only", "adr"]
summary: "ADR: validate webhook URLs and every redirect hop against SSRF (HTTPS-only, public IPs, DNS pinning); installed 6.7.13.0 WebhookClient does not yet do this."
lastBuilt: 2026-09-15
---
## What it is

An architecture decision record (ADR, 2026-07-15) that hardens webhook delivery against server-side request forgery: every outbound destination, including redirect targets, is validated before the request is sent. Delivery results (status and response body) are stored in `webhook_event_log`, which makes an unvalidated target a read primitive. Installed core 6.7.13.0 does not contain this validation yet.

## When to use

When configuring webhook targets, assessing SSRF exposure of the webhook worker, or planning for HTTP, IP-literal or internal webhook endpoints that the ADR disables by default.

## Key steps / config

Installed 6.7.13.0 behaviour:

1. `webhook.url` is a required `StringField` (max 500) without target validation.
2. Delivery uses `Shopware\Core\Framework\Webhook\Service\WebhookClient` (`@internal`) with the `shopware.webhook.guzzle` client (`timeout` 20, `connect_timeout` 10, `shopware.app_system.guzzle.middleware` in the handler stack). No redirect option is set, so Guzzle's default redirect following applies.
3. `WebhookClient::send()` / `sendBatch()` pass request options straight to Guzzle; a `TransferException` becomes a failed `WebhookResult`.

ADR validation model (target design):

- Validate `webhook.url` on DAL write (operator feedback) and again at delivery time (the actual security boundary; covers old rows and DNS changes).
- HTTPS-only by default; HTTP and a private IP allow-list only via explicit `shopware.yaml` config (exact names left to the implementation).
- Require a valid URL with a host; reject IP-literal hosts unless allow-listed.
- Resolve A and AAAA records; every address must be public (no private, loopback, link-local, reserved, metadata) unless allow-listed.
- Share one IP validation helper with media upload-by-URL.
- Follow redirects in an explicit bounded loop, validating each hop with the same scheme policy and preserving the request method.

## Essential identifiers

- `shopware.webhook.guzzle`
- `Shopware\Core\Framework\Webhook\Service\WebhookClient`
- `webhook.url`, `webhook_event_log`, `shopware.yaml`

## Gotchas

- The ADR sets Guzzle `allow_redirects` to `false` and, when the handler supports cURL, pins each validated host and port with a resolve option; neither exists in 6.7.13.0:
  ```php
  'curl' => [
      CURLOPT_RESOLVE => [sprintf('%s:%d:%s', $host, $port, $validatedPublicIp)],
  ]
  ```
  TLS peer and host verification must stay enabled.
- Guzzle `track_redirects` is diagnostics only; the redirected request is already sent.
- After the change, webhooks using HTTP, IP targets, reserved development hostnames, or redirects to HTTP or private hosts need explicit operator configuration.
- Explicit redirects avoid Guzzle's `POST` to `GET` rewrite on `301`/`302`/`303`.
- Without cURL pinning DNS can still change between validation and connection. Media upload-by-URL is not hardened by this change.

## Code check (6.7.13.0)
- confirmed `shopware.webhook.guzzle` — Guzzle client with timeout 20 / connect_timeout 10, no redirect option — vendor/shopware/core/Framework/DependencyInjection/webhook.php:69
- confirmed `WebhookClient` — internal delivery client — vendor/shopware/core/Framework/Webhook/Service/WebhookClient.php:17
- corrected `WebhookClient::send()` — docs: validates target before sending; code sends request options unchanged — vendor/shopware/core/Framework/Webhook/Service/WebhookClient.php:29
- corrected `webhook.url` — docs: validated on DAL write; plain required StringField(500) — vendor/shopware/core/Framework/Webhook/WebhookDefinition.php:60
- confirmed `webhook_event_log` — event log entity — vendor/shopware/core/Framework/Webhook/EventLog/WebhookEventLogDefinition.php:34
- absent `allow_redirects` — not set anywhere in installed Shopware code
- absent `CURLOPT_RESOLVE` — no resolve pinning in installed Shopware code
