---
id: platform/dev/6.7/resources/references/adr/2025-05-12-implement-measurement-system.md
title: Implement measurement system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-05-12-implement-measurement-system.html
sourceHash: 2dd528fc4adc443a638a815a4813a39e112bd881
codeCheckedAgainst: "6.7.13.0"
keywords: ["MeasurementUnits", "AbstractMeasurementUnitConverter", "MeasurementUnitConverter", "ProductMeasurementUnitBuilder", "sw-measurement-length-unit", "sw-measurement-weight-unit", "sw_convert_unit", "product.measurements", "measurement system", "metric", "imperial", "unit conversion", "product dimensions"]
summary: "ADR: metric/imperial measurement system per sales channel domain; product unit conversion, sw-measurement-*-unit API headers and sw_convert_unit Twig filter."
lastBuilt: 2026-09-15
---
## What it is

Architecture decision record (area inventory) introducing a configurable measurement system (Metric or Imperial) per sales channel domain, with runtime conversion of product dimensions/weight in Storefront, Store API and Admin API. Default stays Metric with `mm` for length and `kg` for weight.

## When to use

- Displaying product width/height/length/weight in the unit configured for the domain instead of hard-coded `mm`/`kg`.
- Reading or writing product measurements through the API in non-metric units.
- Converting values in Twig templates.

## Key steps / config

**Context:** the resolved units live on the `SalesChannelContext` as a `Shopware\Core\Content\MeasurementSystem\MeasurementUnits` struct (`getMeasurementSystem()` / `setMeasurementSystem()`), initialized in `SalesChannelContextFactory::create` from the current domain. Installed API of the struct:

```php
$units = MeasurementUnits::createDefaultUnits(); // system 'metric', ['length' => 'mm', 'weight' => 'kg']
$units->getUnit('length');       // throws for unknown type
$units->setUnit('volume', 'm3'); // adds or overwrites a type
$units->getUnits(); $units->getSystem();
```

It is exposed in `/store-api/context` roughly as `"measurementUnits": { "system": "metric", "units": { "length": "mm", "weight": "kg" } }`.

**Product runtime field:** on sales-channel product load, `ProductSubscriber` assigns `measurements` via `ProductMeasurementUnitBuilder::buildFromContext($product, $salesChannelContext)`, converting stored `width`, `height`, `length`, `weight` into the configured units. Listeners on `SalesChannelEntityLoadedEvent` can add further entries (e.g. volume or custom fields). Each entry has `value` and `unit`.

**Converter:** extend/decorate `AbstractMeasurementUnitConverter`:

```php
abstract public function getDecorated(): AbstractMeasurementUnitConverter;
abstract public function convert(float $value, string $fromUnit, string $toUnit, ?int $precision = null): ConvertedUnit;
```

**API headers** (`PlatformRequest::HEADER_MEASUREMENT_LENGTH_UNIT`, `PlatformRequest::HEADER_MEASUREMENT_WEIGHT_UNIT`):
- `sw-measurement-length-unit`
- `sw-measurement-weight-unit`

When reading, product values are converted to the header units; when writing, values are converted back to `mm`/`kg` before persisting. Stored measurements are always metric.

**Storefront Twig:**

```twig
{{ product.measurements.type('width').value }} {{ product.measurements.type('width').unit }}
{{ 1500|sw_convert_unit(from: 'mm') }}
{{ 100|sw_convert_unit(from: 'kg', to: 'lb', precision: 1) }}
```

Without `to`, `sw_convert_unit` converts to the sales channel's configured unit for the type of `from`; output is `"<value> <unit>"`.

## Essential identifiers

- `Shopware\Core\Content\MeasurementSystem\MeasurementUnits`
- `Shopware\Core\Content\MeasurementSystem\Unit\AbstractMeasurementUnitConverter`, `MeasurementUnitConverter`, `ConvertedUnit`
- `ProductMeasurementUnitBuilder`
- `SalesChannelContext::getMeasurementSystem()`
- Headers `sw-measurement-length-unit`, `sw-measurement-weight-unit`
- Twig filter `sw_convert_unit`; product field `measurements`

## Gotchas

- The ADR's `MeasurementUnits` sketch shows `addMeasurementType()` and a `setUnit()` that throws for existing types; the installed struct has no `addMeasurementType()` and `setUnit()` simply sets the unit.
- The ADR names the product runtime field `measurementUnits` and a `ProductPackageMeasurementBuilder`; in code the assigned field is `measurements`, built by `ProductMeasurementUnitBuilder`.
- The ADR converter signature has defaults (`'mm'`, `'in'`, `float $precision = 3`); the abstract method has no unit defaults and `?int $precision = null`, plus a required `getDecorated()`.
- Twig filter output includes a space between value and unit.
- Runtime conversion adds overhead on large datasets/high-traffic APIs; API consumers may need to adapt.

## Version notes

Backward compatible: default units `mm`/`kg` remain unchanged, so existing functionality does not break.

## Code check (6.7.13.0)
- absent `addMeasurementType` — not in installed code; use `MeasurementUnits::setUnit()`
- corrected `MeasurementUnits::setUnit()` — docs: throws when type already exists — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:33
- confirmed `MeasurementUnits::createDefaultUnits()` — metric, mm, kg — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:46
- confirmed `SalesChannelContext::getMeasurementSystem()` — returns MeasurementUnits — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:480
- corrected `ProductMeasurementUnitBuilder::buildFromContext()` — docs: ProductPackageMeasurementBuilder assigning measurementUnits; code assigns measurements — vendor/shopware/core/Content/Product/Subscriber/ProductSubscriber.php:117
- corrected `AbstractMeasurementUnitConverter::convert()` — docs: defaults 'mm'/'in', float precision 3 — vendor/shopware/core/Content/MeasurementSystem/Unit/AbstractMeasurementUnitConverter.php:12
- confirmed `sw-measurement-length-unit` — PlatformRequest::HEADER_MEASUREMENT_LENGTH_UNIT — vendor/shopware/core/PlatformRequest.php:36
- confirmed `sw-measurement-weight-unit` — PlatformRequest::HEADER_MEASUREMENT_WEIGHT_UNIT — vendor/shopware/core/PlatformRequest.php:34
- confirmed `sw_convert_unit` — Twig filter, to defaults to context unit — vendor/shopware/core/Content/MeasurementSystem/TwigExtension/MeasurementConvertUnitTwigFilter.php:28
