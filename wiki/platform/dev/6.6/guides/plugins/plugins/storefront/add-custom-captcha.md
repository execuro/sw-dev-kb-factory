---
id: platform/dev/6.6/guides/plugins/plugins/storefront/add-custom-captcha.md
title: Add custom captcha
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/storefront/add-custom-captcha.html
sourceHash: 96041d99234ff781d8e0a47f367ba3379ccad727
keywords: ["custom captcha", "AbstractCaptcha", "isValid", "getName", "supports", "shouldBreak", "getData", "getViolations", "YourCaptcha", "GoogleReCaptchaV3", "Shopware\\Storefront\\Framework\\Captcha", "captcha type"]
summary: How to add a custom captcha type to Shopware 6 by extending AbstractCaptcha and implementing isValid and getName.
lastBuilt: 2026-09-15
---
## What it is

This guide shows how to add a custom captcha implementation to the Shopware 6 core by extending the `AbstractCaptcha` base class.

## When to use

Use this when the built-in captcha types are not sufficient and a plugin needs to integrate a third-party or custom captcha verification service.

## Key steps / config

1. Optionally organize plugin files by creating a `Captcha` folder inside `src/Framework`.
2. `AbstractCaptcha` is the base class for all captcha types and declares these methods:

- `supports(string $type): bool` — checks if the captcha type is supported
- `isValid(string $code): bool` — checks if the captcha code is valid
- `getName(): string` — returns the name of the captcha type
- `shouldBreak(): bool` — checks if the captcha should break validation
- `getData(): array` — returns the data of the captcha type
- `getViolations(): ConstraintViolationListInterface` — returns validation violations

3. Extend `AbstractCaptcha` and implement `isValid` and `getName`, e.g.:

```php
namespace Shopware\Storefront\Framework\Captcha;

#[Package('storefront')]
class YourCaptcha extends AbstractCaptcha
{
    final public const CAPTCHA_NAME = 'yourCaptchaName';
    final public const CAPTCHA_REQUEST_PARAMETER = '_your_captcha_name';

    public function isValid(Request $request, array $captchaConfig): bool
    {
        // validate $request->get(self::CAPTCHA_REQUEST_PARAMETER)
    }

    public function getName(): string
    {
        return self::CAPTCHA_NAME;
    }
}
```

The example implementation injects a Guzzle `ClientInterface`, reads the captcha response from the request via a constant request parameter, and posts it to a verification endpoint, returning `true` only if the service reports success.

For a full reference implementation, the guide points to the `GoogleReCaptchaV3` class shipped in the Shopware 6 core.

## Essential identifiers

- `AbstractCaptcha` — base class for captcha types, in `Shopware\Storefront\Framework\Captcha`
- methods `isValid()`, `getName()`, `supports()`, `shouldBreak()`, `getData()`, `getViolations()`
- example class `YourCaptcha` extending `AbstractCaptcha`
- reference implementation `GoogleReCaptchaV3`

## Gotchas

`isValid` must return `false` (not throw) when the request lacks the expected captcha parameter or when the verification call fails — the example catches `ClientExceptionInterface` and returns `false` in that case.
