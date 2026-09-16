---
id: platform/dev/6.7/guides/hosting/configurations/shopware/html-sanitizer.md
title: HTML sanitizer
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/configurations/shopware/html-sanitizer.html
sourceHash: ad69dc6a903e431e8fde6940cf179b9aa76f5a90
codeCheckedAgainst: "6.7.13.0"
keywords: ["html sanitizer", "html_sanitizer", "custom_tags", "z-shopware.yaml", "shopware.yaml", "HtmlSanitizer", "htmlpurifier", "text editor", "allowed tags whitelist", "img tag", "xss", "custom elements"]
summary: "Configure shopware.html_sanitizer (self-hosted): allow tags/attributes per set, register custom_tags (6.7.10.0+), or disable sanitizing in z-shopware.yaml."
lastBuilt: 2026-09-15
---
## What it is

The HTML sanitizer removes potentially unsafe HTML (tags, attributes, styles) from rich-text input such as the admin text editor; when input is stripped, the editor shows a notice. It is backed by HTMLPurifier (`Shopware\Core\Framework\Util\HtmlSanitizer`). Only configurable on self-hosted shops, not cloud.

## When to use

- A tag or attribute you need (e.g. `<img>` with `src`, `alt`, `style`) is stripped from text editor content.
- You add JavaScript-created tags or custom components that must survive sanitizing.
- You want to disable sanitizing entirely (security risk).

## Key steps / config

1. Create `config/packages/z-shopware.yaml` (does not exist by default; the docs suggest copying `shopware.yaml` in the same directory).
2. Under the `shopware:` root add an `html_sanitizer:` key. Its structure as defined by core:

```yaml
shopware:
  html_sanitizer:
    enabled: true            # false disables sanitizing
    cache_enabled: true
    sets:
      - name: basic
        tags: [...]
        attributes: [...]
        custom_attributes:
          - { tags: [...], attributes: [...] }
        custom_tags:         # 6.7.10.0+
          - { tag: your-custom-element, type: ..., contents: Flow, attr_collections: [], attributes: [] }
        options:
          - { key: Attr.EnableID, value: true }
    fields:
      - name: product_translation.description
        sets: ["basic", "media", "HTML5"]
```

3. To allow a tag: add it (and its attributes) to a set's `tags`/`attributes`, and make sure the field uses that set via `fields`.
4. To disable: set `shopware.html_sanitizer.enabled: false`.
5. Custom tags: each `custom_tags` entry is passed to HTMLPurifier `addElement(tag, type, contents, attr_collections, attributes)`; `contents` defaults to `Flow`. See the HTMLPurifier end-user customization docs ("Add an element") for valid values.

## Essential identifiers

- `shopware.html_sanitizer`, `enabled`, `sets`, `fields`, `custom_tags`, `custom_attributes`, `options`
- `config/packages/z-shopware.yaml`
- `Shopware\Core\Framework\Util\HtmlSanitizer`
- Built-in sets: `basic`, `media`, `HTML5`, `script`, `tidy`, `bootstrap`, `snippet`

## Gotchas

- Disabling the sanitizer allows unsafe or malicious HTML to be stored.
- `custom_tags` lives inside a set entry, not directly under `html_sanitizer`; the tag is only allowed on fields whose `sets` include that set.
- A field without a `fields` entry falls back to the `basic` set.
- The docs' `<img>` example predates current defaults: in 6.7.13.0 the shipped `basic` and `media` sets already allow `img` with `src`/`alt`; `style` is in `basic` attributes too.

## Version notes

- `custom_tags` is available since Shopware 6.7.10.0.

## Code check (6.7.13.0)
- confirmed `html_sanitizer.enabled` — shipped default true — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:458
- confirmed `custom_tags` — array node under each set — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1022
- confirmed `contents` — custom tag contents default `Flow` — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1030
- confirmed `custom_attributes` — per-set tags/attributes pairs — vendor/shopware/core/Framework/DependencyInjection/Configuration.php:1047
- confirmed `HtmlSanitizer::sanitize()` — returns text unchanged when disabled — vendor/shopware/core/Framework/Util/HtmlSanitizer.php:53
- confirmed `HtmlSanitizer::$fieldSets` — field without mapping uses set `basic` — vendor/shopware/core/Framework/Util/HtmlSanitizer.php:128
- confirmed `addElement` — custom tags registered via HTMLPurifier definition — vendor/shopware/core/Framework/Util/HtmlSanitizer.php:184
- corrected `img` — docs: removed by default; shipped `basic` set allows img with src/alt — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:466
- confirmed `product_translation.description` — default field mapping to basic/media/HTML5 — vendor/shopware/core/Framework/Resources/config/packages/shopware.yaml:501
- unverified `z-shopware.yaml` — project config file name, not part of vendor code
