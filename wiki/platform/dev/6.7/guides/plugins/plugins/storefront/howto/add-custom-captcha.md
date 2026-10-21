---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-captcha.md
title: Add Custom Captcha
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-custom-captcha.html
sourceHash: 1b5f6743949c6997bd8fef14510aa5fc8d8e36a1
codeCheckedAgainst: "6.7.15.1"
keywords: ["AbstractCaptcha", "Shopware\\Storefront\\Framework\\Captcha\\AbstractCaptcha", "getName", "validate", "supports", "shouldBreak", "getData", "GoogleReCaptchaV3", "shopware.storefront.captcha", "CAPTCHA_NAME", "captcha", "custom captcha", "bot protection"]
summary: Custom Storefront captcha - extend AbstractCaptcha, implement getName() and validate(), tag the service shopware.storefront.captcha
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to add a custom captcha type to Shopware 6 from a plugin by extending `Shopware\Storefront\Framework\Captcha\AbstractCaptcha`, the base class of all captcha types (core examples: `HoneypotCaptcha`, `BasicCaptcha`, `GoogleReCaptchaV2`, `GoogleReCaptchaV3`).

## When to use

You need a captcha provider other than the built-in ones to protect Storefront form submissions. A running plugin is required ([plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## Key steps / config

1. Optionally create `src/Framework/Captcha/` in the plugin to keep the files organized.
2. Extend `AbstractCaptcha`. Its members in 6.7.15.1:
   - `supports(Request $request, array $captchaConfig): bool` — default: true only for POST requests with a non-empty config whose `isActive` is truthy.
   - `validate(Request $request, array $captchaConfig): ConstraintViolationList` — empty list means valid; override this to verify the code.
   - `getName(): string` — **abstract**, must be implemented; unique technical name.
   - `shouldBreak(): bool` — default `true` (throw on failure instead of showing a message); `GoogleReCaptchaV3` returns `false` to show a violation.
   - `getData(): ?array` — default `null`; data the template needs to render the captcha.

```php
class YourCaptcha extends AbstractCaptcha
{
    final public const CAPTCHA_NAME = 'yourCaptchaName';
    final public const CAPTCHA_REQUEST_PARAMETER = '_your_captcha_name';

    public function __construct(private readonly ClientInterface $client) {}

    public function validate(Request $request, array $captchaConfig): ConstraintViolationList
    { /* read CAPTCHA_REQUEST_PARAMETER, verify via $this->client, return violations or empty list */ }

    public function getName(): string { return self::CAPTCHA_NAME; }
}
```

3. Register the service with the `shopware.storefront.captcha` tag (core captchas use `['priority' => 100..400]`); the core injects `service('shopware.captcha.client')` (a Guzzle `Client`) into the reCAPTCHA classes. The tagged iterator is consumed by `CaptchaRouteListener`.
4. Use `GoogleReCaptchaV3` as the reference implementation (`CAPTCHA_NAME = 'googleReCaptchaV3'`, `CAPTCHA_REQUEST_PARAMETER = '_grecaptcha_v3'`).

## Essential identifiers

- `Shopware\Storefront\Framework\Captcha\AbstractCaptcha`
- `AbstractCaptcha::getName()` (abstract), `validate()`, `supports()`, `shouldBreak()`, `getData()`
- service tag `shopware.storefront.captcha`, `shopware.captcha.client`
- `Shopware\Storefront\Framework\Captcha\GoogleReCaptchaV3`

## Gotchas

- The docs tell you to implement `isValid()` and list `getViolations()`; both are `@deprecated tag:v6.8.0` in 6.7.15.1 — implement `validate()` instead.
- Docs signatures are outdated: `supports(string $type)`, `isValid(string $code)`, `getData(): array`, `getViolations(): ConstraintViolationListInterface` do not match the installed class.
- The docs example uses the core namespace `Shopware\Storefront\Framework\Captcha` and posts to an undefined `self::GOOGLE_CAPTCHA_VERIFY_ENDPOINT` while declaring `YOUR_CAPTCHA_ENDPOINT`; use your own namespace and constant.
- The docs never show service registration; without the `shopware.storefront.captcha` tag the captcha is not picked up.

## Version notes

- 6.8.0 removes `AbstractCaptcha::isValid()` and `getViolations()`; `validate()` is the replacement.

## Code check (6.7.15.1)
- confirmed `AbstractCaptcha::getName()` — abstract, must be implemented — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:73
- corrected `AbstractCaptcha::supports()` — docs: `supports(string $type)`; installed takes `Request $request, array $captchaConfig` — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:21
- confirmed `AbstractCaptcha::validate()` — returns `ConstraintViolationList`, replaces isValid — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:39
- deprecated `AbstractCaptcha::isValid()` — tag:v6.8.0, implement validate() instead — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:61
- deprecated `AbstractCaptcha::getViolations()` — tag:v6.8.0, use validate() — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:99
- corrected `AbstractCaptcha::getData()` — docs: returns `array`; installed returns `?array`, default null — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:91
- confirmed `AbstractCaptcha::shouldBreak()` — default true — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:79
- confirmed `shopware.storefront.captcha` — tagged iterator passed to CaptchaRouteListener — vendor/shopware/storefront/DependencyInjection/captcha.php:24
- confirmed `GoogleReCaptchaV3::CAPTCHA_NAME` — value `googleReCaptchaV3` — vendor/shopware/storefront/Framework/Captcha/GoogleReCaptchaV3.php:15
- confirmed `GoogleReCaptchaV3::validate()` — reference implementation — vendor/shopware/storefront/Framework/Captcha/GoogleReCaptchaV3.php:27
