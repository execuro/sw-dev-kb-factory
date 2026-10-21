---
id: platform/dev/6.7/resources/references/adr/2025-05-12-implement-measurement-system.md
title: Implement measurement system
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/references/adr/2025-05-12-implement-measurement-system.html
sourceHash: 2dd528fc4adc443a638a815a4813a39e112bd881
codeCheckedAgainst: "6.7.15.1"
keywords: ["measurement system", "MeasurementUnits", "AbstractMeasurementUnitConverter", "MeasurementUnitConverter", "ProductMeasurementUnitBuilder", "sw_convert_unit", "sw-measurement-length-unit", "sw-measurement-weight-unit", "metric", "imperial", "unit conversion", "product dimensions", "weight unit", "length unit"]
summary: "ADR: metric/imperial units per sales channel domain via MeasurementUnits, sw-measurement-* headers and the sw_convert_unit Twig filter."
lastBuilt: 2026-10-21
---
## What it is

Architecture decision record (area: inventory, 2025-05-14) introducing a measurement system for product dimensions and weight. Two systems exist, Metric and Imperial; the default is Metric with millimeters for length and kilograms for weight, matching the previous fixed units. The configured units are resolved per sales channel domain (falling back to the sales channel) and used for storefront display and Store API responses; API consumers can override them per request via headers.

## When to use

- Displaying product width/height/length/weight in the units configured for the current sales channel domain.
- Sending or reading product measurements over the API in non-metric units.
- Converting values in Twig templates on the fly.
- Extending the converter or reading the active units in a plugin.

## Key steps / config

1. **Context units.** `SalesChannelContext` carries a `Shopware\Core\Content\MeasurementSystem\MeasurementUnits` struct (`getMeasurementSystem()` / `setMeasurementSystem()`). It is filled in `SalesChannelContextFactory::create` from the domain's `measurementUnits` field, or the sales channel's if no domain is given. Only the types `length` and `weight` exist by default (`MeasurementUnitTypeEnum`); `getUnit($type)` throws for an unknown type, `setUnit($type, $unit)` sets one.
   ```php
   $units = new MeasurementUnits('metric', ['length' => 'mm', 'weight' => 'kg']);
   $salesChannelContext->setMeasurementSystem($units);
   $lengthUnit = $salesChannelContext->getMeasurementSystem()->getUnit('length');
   ```
2. **Product runtime field.** `ProductSubscriber` assigns a `measurements` runtime value on sales channel product load, built by `ProductMeasurementUnitBuilder::buildFromContext()` as a `ConvertedUnitSet` of `width`, `height`, `length`, `weight`. Stored values are always converted from `mm`/`kg`. Response shape:
   ```json
   "measurements": {
     "width":  { "value": 1.5, "unit": "m" },
     "weight": { "value": 1.2, "unit": "kg" }
   }
   ```
3. **Converter.** `Shopware\Core\Content\MeasurementSystem\Unit\AbstractMeasurementUnitConverter` (decoratable) declares `getDecorated()` and `convert(float $value, string $fromUnit, string $toUnit, ?int $precision = null): ConvertedUnit`; `MeasurementUnitConverter` is the implementation.
4. **Request headers** (constants in `PlatformRequest`): `sw-measurement-length-unit` (`HEADER_MEASUREMENT_LENGTH_UNIT`) and `sw-measurement-weight-unit` (`HEADER_MEASUREMENT_WEIGHT_UNIT`). On read, product values are converted to these units; on write, values are converted back to `mm`/`kg` before persisting. Without headers, `mm`/`kg` apply. The Administration sends these headers too.
5. **Storefront.** Replace fixed units (`{{ product.width }} mm`) with the runtime field or the `sw_convert_unit` filter:
   ```twig
   {{ 1500|sw_convert_unit(from: 'mm') }}
   {{ 100|sw_convert_unit(from: 'kg', to: 'lb', precision: 1) }}
   ```
   Without `to`, the filter uses the unit configured in the sales channel context for the type of `from`.

## Essential identifiers

- `Shopware\Core\Content\MeasurementSystem\MeasurementUnits` (`DEFAULT_MEASUREMENT_SYSTEM`, `DEFAULT_LENGTH_UNIT`, `DEFAULT_WEIGHT_UNIT`, `getUnit()`, `setUnit()`, `getUnits()`, `getSystem()`)
- `SalesChannelContext::getMeasurementSystem()` / `setMeasurementSystem()`
- `MeasurementUnitTypeEnum`, `ProductMeasurementEnum`
- `AbstractMeasurementUnitConverter`, `MeasurementUnitConverter`, `ConvertedUnit`, `ConvertedUnitSet`
- `ProductMeasurementUnitBuilder` (`@internal`)
- `sw-measurement-length-unit`, `sw-measurement-weight-unit`
- Twig filter `sw_convert_unit`

## Gotchas

- The ADR's sketch of `MeasurementUnits` includes `addMeasurementType()`, which does not exist in the installed code; use `setUnit()`. Installed `setUnit()` also performs no unsupported-unit check.
- The ADR names the builder `ProductPackageMeasurementBuilder` and the runtime field `measurementUnits`; the installed code uses `ProductMeasurementUnitBuilder` and assigns `measurements` (matching the ADR's Twig example `product.measurements`).
- Converted values exist only in API requests/responses; the database always stores metric (`mm`, `kg`).
- The ADR notes conversion adds runtime cost for large result sets and high-traffic APIs.

## Version notes

- The `measurementUnits` fields on `sales_channel` and `sales_channel_domain` carry `Since('6.7.1.0')`. No existing behaviour breaks; default units remain `mm` and `kg`.

## Code check (6.7.15.1)
- absent `addMeasurementType` — not present in the installed code; `MeasurementUnits::setUnit()` sets a unit instead
- confirmed `MeasurementUnits::setUnit()` — sets a unit without validation — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:33
- confirmed `MeasurementUnits::DEFAULT_LENGTH_UNIT` — default `mm`, weight `kg`, system `metric` — vendor/shopware/core/Content/MeasurementSystem/MeasurementUnits.php:13
- confirmed `SalesChannelContext::setMeasurementSystem()` — context holder for MeasurementUnits — vendor/shopware/core/System/SalesChannel/SalesChannelContext.php:487
- confirmed `BaseSalesChannelContext::getMeasurementSystemInfo()` — SalesChannelContextFactory copies domain/channel units into the context — vendor/shopware/core/System/SalesChannel/Context/SalesChannelContextFactory.php:129
- corrected `ProductMeasurementUnitBuilder` — docs: ProductPackageMeasurementBuilder — vendor/shopware/core/Content/MeasurementSystem/ProductMeasurement/ProductMeasurementUnitBuilder.php:19
- corrected `measurements` — docs: runtime field `measurementUnits` — vendor/shopware/core/Content/Product/Subscriber/ProductSubscriber.php:120
- corrected `AbstractMeasurementUnitConverter::convert()` — docs: defaults 'mm'/'in', float precision 3; code has no unit defaults, `?int $precision = null` — vendor/shopware/core/Content/MeasurementSystem/Unit/AbstractMeasurementUnitConverter.php:12
- confirmed `sw-measurement-length-unit` — PlatformRequest::HEADER_MEASUREMENT_LENGTH_UNIT — vendor/shopware/core/PlatformRequest.php:36
- confirmed `sw_convert_unit` — Twig filter with from/to/precision arguments — vendor/shopware/core/Content/MeasurementSystem/TwigExtension/MeasurementConvertUnitTwigFilter.php:28
