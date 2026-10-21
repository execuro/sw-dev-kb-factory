---
id: platform/dev/6.7/guides/hosting/configurations/shopware/html-sanitizer.md
title: HTML sanitizer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/html-sanitizer.html
sourceHash: 6baa3b641a33b82a2c97267c0b8e333d6ebf9e34
codeCheckedAgainst: "6.7.15.1"
keywords: ["html sanitizer", "shopware.html_sanitizer", "html_sanitizer", "custom_tags", "z-shopware.yaml", "htmlpurifier", "allowed tags", "whitelist", "img tag", "text editor", "xss", "HtmlSanitizer"]
summary: Configure shopware.html_sanitizer in z-shopware.yaml - whitelist tags/attributes per set and field, add custom_tags (6.7.10.0+), or disable it.
lastBuilt: 2026-10-21
---
## What it is

The HTML sanitizer (`Shopware\Core\Framework\Util\HtmlSanitizer`, built on HTML Purifier) strips potentially unsafe or malicious HTML from text-editor content and normalises styles and attributes. In the Administration, a notice tells the user when input was sanitized. Configuration lives under `shopware.html_sanitizer`. Intended for self-hosted shops; not available for cloud stores.

## When to use

When the editor removes tags or attributes you need (e.g. a custom element), when you need to register custom tags, or when you must disable sanitizing.

## Key steps / config

1. Create `config/packages/z-shopware.yaml` (it does not exist by default; the source suggests copying `shopware.yaml` in the same directory).
2. Inside the `shopware:` section add `html_sanitizer:` with the sets/fields to whitelist. Shape per the installed config tree:

```yaml
shopware:
    html_sanitizer:
        enabled: true
        sets:
            - name: basic
              tags: ["img"]
              attributes: ["src", "alt", "style"]
              custom_tags:
                  - tag: your-custom-element
                    type: ...
                    contents: Flow   # default
                    attr_collections: []
                    attributes: []
        fields:
            - name: product_translation.description
              sets: ["basic", "media", "HTML5"]
```

3. Disable entirely (security risk) with `shopware.html_sanitizer.enabled: false`.
4. Custom tags (since 6.7.10.0): add entries to a set's `custom_tags`; the tag (e.g. `your-custom-element`) then survives sanitizing. Options follow HTML Purifier's "Add an element" customisation (library end-user docs).

Built-in sets: `HTML5`, `basic`, `media`, `script`, `tidy`, `bootstrap`, `snippet`. Default field mapping: `product_translation.description` → `basic`, `media`, `HTML5`; `product_translation.descriptionTeaser` → none; `app_cms_block.template` → `basic`, `media`, `tidy`, `HTML5`; `snippet.value` → `basic`, `media`, `bootstrap`, `snippet`, `HTML5`. Fields without a mapping use `basic`.

## Essential identifiers

- `shopware.html_sanitizer` (`enabled`, `cache_dir`, `cache_enabled`, `sets`, `fields`)
- set keys: `name`, `tags`, `attributes`, `custom_attributes`, `custom_tags`, `options`
- `custom_tags` keys: `tag`, `type`, `contents`, `attr_collections`, `attributes`
- `config/packages/z-shopware.yaml`
- `Shopware\Core\Framework\Util\HtmlSanitizer`

## Gotchas

- The source uses `<img>` (with `src`, `alt`, `style`) as the example of a tag stripped by default. In 6.7.15.1 the default `basic` set already allows `img` plus `src`, `alt` and `style`; whitelisting is needed for other tags/attributes.
- With `enabled: false`, unsafe or malicious HTML can be inserted.

## Version notes

- `custom_tags` is available since Shopware 6.7.10.0.

## Code check (6.7.15.1)
- confirmed `html_sanitizer` — config node under `shopware` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1035
- confirmed `html_sanitizer.enabled` — boolean, default true — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1040
- confirmed `custom_tags` — per-set list of `tag`/`type`/`contents`/`attr_collections`/`attributes` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1058
- confirmed `contents` — defaults to `Flow` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1065
- confirmed `fields` — field-to-sets mapping — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1115
- corrected `img` — docs: `<img>` removed by default; `basic` set already allows `img`, `src`, `alt`, `style` — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:504
- confirmed `product_translation.description` — default sets basic, media, HTML5 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:539
- confirmed `HtmlSanitizer::sanitize()` — returns input unchanged when disabled — vendor/shopware/core/Framework/Util/HtmlSanitizer.php:53
- confirmed `basic` — fallback set for unmapped fields — vendor/shopware/core/Framework/Util/HtmlSanitizer.php:128
- unverified `z-shopware.yaml` — project-level file name, not part of the installed code
