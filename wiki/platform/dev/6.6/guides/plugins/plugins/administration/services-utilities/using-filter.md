---
id: platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/using-filter.md
title: Using filter
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/administration/services-utilities/using-filter.html
sourceHash: e68c14e1ab872598cd67158ffd7d86f951606604
relatedPages:
  - platform/dev/6.6/guides/plugins/plugins/plugin-base-guide.md
  - platform/dev/6.6/guides/plugins/plugins/administration/services-utilities/add-filter.md
keywords: ["filter", "$options.filters", "twig filter pipe", "administration filter", "v-bind filter", "example filter", "using filter", "twig template", "filter arguments", "administration", "$tc"]
summary: How to call a registered Administration filter from component JavaScript via $options.filters and from Twig templates with the pipe operator.
lastBuilt: "2026-09-15"
---
## What it is

This page explains how to use a filter that has already been registered in the Shopware Administration, both from a component's JavaScript and from its Twig templates. It builds directly on the add filter guide, reusing the `example` filter defined there.

## When to use

Use this once a filter such as `example` has been registered and needs to actually format a value — either inside a component's script logic or inside a template, including inside a `v-bind` expression.

## Key steps / config

To use the filter in a component's JavaScript, access it through `this.$options.filters` with the filter's name:

```javascript
this.$options.filters.example('firstArgument')
```

To use it in a Twig template, apply it with the pipe operator `|` followed by the filter name; this also works inside `v-bind` expressions such as `:name` or `:title`:

```twig
{% block my_custom_block %}
    <p>
       {{ $tc('swag-example.general.myCustomText')|example }}
    </p>
{% endblock %}
```

```html
<example-component :name="$tc('swag-example.general.myCustomText')|example"></example-component>
```

When the filter takes multiple arguments, they are passed as extra arguments to the pipe call:

```twig
{% block my_custom_block %}
    <p>
       {{ $tc('swag-example.general.myCustomText')|example('secondArgument', 'thirdArgument') }}
    </p>
{% endblock %}
```

```html
<example-component :title="$tc('swag-example.general.myCustomText')|example('secondArgument', 'thirdArgument')"></example-component>
```

## Essential identifiers

- `this.$options.filters.<name>(value)` — calling a registered filter from component JavaScript.
- `|<name>` — the Twig pipe syntax used to apply a filter in a template.
- `example` — the filter name reused throughout, registered in the companion add filter guide.

## Gotchas

The single-argument pipe syntax (`|example`) and the multi-argument call syntax (`|example('secondArgument', 'thirdArgument')`) both work identically inside plain Twig output and inside `v-bind`-style attribute expressions, so the same filter call can be reused in either context without a different syntax.
