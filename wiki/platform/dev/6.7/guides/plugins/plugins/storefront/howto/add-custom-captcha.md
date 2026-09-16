---
id: platform/dev/6.7/guides/plugins/plugins/storefront/howto/add-custom-captcha.md
title: Add Custom Captcha
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/add-custom-captcha.html
sourceHash: 1b5f6743949c6997bd8fef14510aa5fc8d8e36a1
codeCheckedAgainst: "6.7.13.0"
keywords: ["captcha", "AbstractCaptcha", "isValid", "getName", "supports", "shouldBreak", "getData", "getViolations", "GoogleReCaptchaV3", "shopware.storefront.captcha", "recaptcha", "spam protection", "CAPTCHA_REQUEST_PARAMETER"]
summary: "Add a custom Storefront captcha by extending AbstractCaptcha (implement isValid() and getName()); GoogleReCaptchaV3 is the core reference implementation."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md"]
---
## What it is

How to add a custom captcha type to the Shopware Storefront by extending `Shopware\Storefront\Framework\Captcha\AbstractCaptcha`, the base class of all captcha types. Requires a running plugin ([Plugin base guide](platform/dev/6.7/guides/plugins/plugins/plugin-base-guide.md)).

## When to use

You want a captcha provider other than the built-in ones (honeypot, basic captcha, Google reCAPTCHA v2/v3) to protect Storefront forms.

## Key steps / config

1. Optionally create `src/Framework/Captcha` in your plugin to keep files organized.
2. Extend `AbstractCaptcha`. Its members (as declared in 6.7):
   - `supports(Request $request, array $captchaConfig): bool` — default: true only for POST requests with a non-empty config whose `isActive` is true.
   - `isValid(Request $request, array $captchaConfig): bool` — **abstract**, must implement.
   - `getName(): string` — **abstract**, must implement; unique technical name.
   - `shouldBreak(): bool` — default `true` (throw instead of showing hints on failure).
   - `getData(): ?array` — default `null`; data for rendering the captcha.
   - `getViolations(): ConstraintViolationList`.
3. Skeleton (plugin namespace; import the base class):

```php
use Shopware\Storefront\Framework\Captcha\AbstractCaptcha;

class YourCaptcha extends AbstractCaptcha
{
    final public const CAPTCHA_NAME = 'yourCaptchaName';
    final public const CAPTCHA_REQUEST_PARAMETER = '_your_captcha_name';
    private const YOUR_CAPTCHA_ENDPOINT = 'https://www.yourcaptcha.com/verify';

    public function __construct(private readonly ClientInterface $client) {}

    public function isValid(Request $request, array $captchaConfig): bool { /* POST to YOUR_CAPTCHA_ENDPOINT, return success flag; false on ClientExceptionInterface */ }

    public function getName(): string { return self::CAPTCHA_NAME; }
}
```

4. In `isValid()`, return `false` if the request parameter is missing; otherwise POST `form_params` (`response`, `remoteip`) with the Guzzle `ClientInterface`, decode the JSON body and return its `success` value; catch `Psr\Http\Client\ClientExceptionInterface` and return `false`.
5. Register the class as a service tagged `shopware.storefront.captcha` (core captchas use this tag with a `priority`; the reCAPTCHA ones receive `service('shopware.captcha.client')` as the HTTP client).

## Essential identifiers

- `Shopware\Storefront\Framework\Captcha\AbstractCaptcha`
- `isValid()`, `getName()`, `supports()`, `shouldBreak()`, `getData()`, `getViolations()`
- `Shopware\Storefront\Framework\Captcha\GoogleReCaptchaV3` (reference implementation)
- service tag `shopware.storefront.captcha`, client service `shopware.captcha.client`

## Gotchas

- The source's method list shows `supports(string $type)` and `isValid(string $code)`; the real signatures take `Request $request, array $captchaConfig`, and its own snippet already uses that form.
- The source's snippet uses the core namespace `Shopware\Storefront\Framework\Captcha` and posts to `self::GOOGLE_CAPTCHA_VERIFY_ENDPOINT`, a constant it never defines; use your plugin namespace and your own endpoint constant.
- Core `GoogleReCaptchaV3` also sends `secret` from `$captchaConfig['config']['secretKey']` and checks a score threshold (default 0.5).

## Code check (6.7.13.0)
- confirmed `AbstractCaptcha::isValid()` — abstract, (Request, array) signature — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:37
- confirmed `AbstractCaptcha::getName()` — abstract — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:42
- corrected `AbstractCaptcha::supports()` — docs: supports(string $type) — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:19
- confirmed `AbstractCaptcha::shouldBreak()` — returns true by default — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:48
- corrected `AbstractCaptcha::getData()` — docs: returns array; code returns ?array, default null — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:60
- corrected `AbstractCaptcha::getViolations()` — docs: ConstraintViolationListInterface; code returns ConstraintViolationList — vendor/shopware/storefront/Framework/Captcha/AbstractCaptcha.php:65
- confirmed `GoogleReCaptchaV3` — core implementation extending AbstractCaptcha — vendor/shopware/storefront/Framework/Captcha/GoogleReCaptchaV3.php:11
- confirmed `GoogleReCaptchaV3::GOOGLE_CAPTCHA_VERIFY_ENDPOINT` — private constant of the core class only — vendor/shopware/storefront/Framework/Captcha/GoogleReCaptchaV3.php:15
- confirmed `shopware.storefront.captcha` — service tag collected by CaptchaRouteListener — vendor/shopware/storefront/DependencyInjection/captcha.php:24
- confirmed `shopware.captcha.client` — HTTP client service injected into reCAPTCHA captchas — vendor/shopware/storefront/DependencyInjection/captcha.php:45
