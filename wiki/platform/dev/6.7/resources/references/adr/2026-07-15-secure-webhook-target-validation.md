---
id: platform/dev/6.7/resources/references/adr/2026-07-15-secure-webhook-target-validation.md
title: Secure webhook target validation
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2026-07-15-secure-webhook-target-validation.html
sourceHash: 8c4ebf18dcda6a0f91de37ec9a1b9b3950bb03dc
codeCheckedAgainst: "6.7.15.1"
keywords: ["webhook", "ssrf", "server-side request forgery", "WebhookClient", "shopware.webhook.guzzle", "WebhookTargetValidator", "AppSystemHttpMiddleware", "CURLOPT_RESOLVE", "allow_redirects", "shopware.app_system.allow_unencrypted_traffic", "shopware.app_system.allowed_private_ip_addresses", "redirect validation", "dns rebinding"]
summary: "ADR: webhook URLs are validated at DAL write and before every delivery hop (HTTPS-only, no private IPs, DNS pinning via CURLOPT_RESOLVE)."
lastBuilt: 2026-10-21
---
## What it is

An architecture decision record (2026-07-15) hardening webhook delivery against server-side request forgery (SSRF). Webhook responses (status and content) are persisted in `webhook_event_log`, so a webhook pointing at an internal URL would turn the webhook worker into an SSRF read primitive. The decision: validate every outbound destination — the configured URL and every redirect target — before the HTTP request is sent.

## When to use

- Configuring webhooks or app backends that live on HTTP, on direct IP addresses, or in a private network.
- Debugging webhook deliveries that fail with "App system request target is not allowed" or a DAL write error on `webhook.url`.
- Understanding why redirects from HTTPS to HTTP or to private hosts are blocked.

## Key steps / config

Validation model (as implemented in 6.7.15.1):

1. **Write time** — `WebhookUrlWriteValidator` subscribes to `PreWriteValidationEvent` and rejects inserts/updates of `webhook.url` that `WebhookTargetValidator::validate()` refuses ("The webhook URL is not allowed by the configured webhook network policy."). This is operator feedback, not the security boundary.
2. **Delivery time (mandatory)** — the `shopware.webhook.guzzle` client (used by `WebhookClient`) has `AppSystemHttpMiddleware` (service `shopware.webhook.guzzle.security_middleware`, webhook mode) inserted in the handler stack after Guzzle's `allow_redirects` middleware, so the initial request and every redirected request are validated before sending. Old rows and changed DNS records are thereby re-checked.
3. Per request the middleware: requires `https` (or `http` only if unencrypted traffic is allowed); rejects IP-literal hosts not in the allow-list; resolves the host via the shared `TrustedUrlResolver` (same helper as media upload-by-URL) and rejects non-public results; forbids proxies and cURL overrides of target, redirect-following, IP resolution and headers; then pins the validated IP with `CURLOPT_RESOLVE`.
4. `WebhookClient` delivers with `allow_redirects` set to `['max' => 5, 'strict' => true]` — a bounded redirect limit with strict RFC redirects.

Operator config in `shopware.yaml` (defaults shown):

```yaml
shopware:
    app_system:
        enable_url_validation: true
        allow_unencrypted_traffic: false
        allowed_private_ip_addresses: []
```

Resolve pin shape set on each request:

```php
$curlOptions[\CURLOPT_RESOLVE] = [\sprintf('%s:%d:%s', $target->host, $port, $ip)];
```

## Essential identifiers

- `Shopware\Core\Framework\Webhook\Service\WebhookClient`
- `shopware.webhook.guzzle`, `shopware.webhook.guzzle.security_middleware`, `shopware.webhook.trusted_url_resolver`
- `Shopware\Core\Framework\App\Http\AppSystemHttpMiddleware`
- `Shopware\Core\Framework\Webhook\Validation\WebhookTargetValidator`, `WebhookUrlWriteValidator`
- `shopware.app_system.enable_url_validation`, `shopware.app_system.allow_unencrypted_traffic`, `shopware.app_system.allowed_private_ip_addresses`
- `CURLOPT_RESOLVE`, `webhook_event_log`

## Gotchas

- The ADR text says webhook delivery sets `allow_redirects` to `false` and follows redirects in an explicit loop; the installed code instead keeps Guzzle redirects enabled (`max` 5, `strict`) and validates each hop via middleware placed after the redirect middleware.
- Guzzle's `track_redirects` history is not a security control — the redirected request is already sent when the history is available.
- Existing webhooks using HTTP, direct IP targets, or HTTPS-to-HTTP redirects need explicit operator configuration; public-to-private redirects need the private IP allow-list.
- DNS can still change between validation and connection when cURL resolve pinning is unavailable for the active handler; pinning one IP can reduce CDN/load-balancer flexibility per attempt.
- Media upload-by-URL uses a different transport and is not hardened by this webhook-specific change.
- The `dev` and `test` environment `shopware.yaml` files ship `enable_url_validation: false`, which disables the checks there.
- Invalid destinations stay inside the existing webhook failure handling path.

## Code check (6.7.15.1)
- confirmed `shopware.webhook.guzzle` — Guzzle client with security middleware after `allow_redirects` — vendor/shopware/core/Framework/DependencyInjection/webhook.php:75
- confirmed `WebhookClient` — delivers webhook requests via the injected Guzzle client — vendor/shopware/core/Framework/Webhook/Service/WebhookClient.php:20
- corrected `allow_redirects` — docs: set to `false` with an explicit redirect loop; code sets `['max' => 5, 'strict' => true]` — vendor/shopware/core/Framework/Webhook/Service/WebhookClient.php:110
- confirmed `AppSystemHttpMiddleware` — validates scheme, IP literal, DNS and pins IP per request — vendor/shopware/core/Framework/App/Http/AppSystemHttpMiddleware.php:16
- confirmed `CURLOPT_RESOLVE` — pin `host:port:ip` of the validated target — vendor/shopware/core/Framework/App/Http/AppSystemHttpMiddleware.php:69
- confirmed `WebhookTargetValidator::validate()` — scheme, host, IP-literal and DNS checks — vendor/shopware/core/Framework/Webhook/Validation/WebhookTargetValidator.php:38
- confirmed `WebhookUrlWriteValidator` — DAL write-time check of `webhook.url` — vendor/shopware/core/Framework/Webhook/Validation/WebhookUrlWriteValidator.php:19
- confirmed `allow_unencrypted_traffic` — defaults to false — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1750
- confirmed `allowed_private_ip_addresses` — defaults to empty list — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:747
- confirmed `enable_url_validation` — defaults to true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1749
