---
id: platform/dev/6.7/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md
title: 'Fetching data from "entity selection" custom field'
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.html
sourceHash: beed0cd38b139dbe3893e2c6f7be5d6a4936b49e
codeCheckedAgainst: "6.7.15.1"
keywords: ["ProductEvents::PRODUCT_LOADED_EVENT", "EntityLoadedEvent", "product.repository", "addExtension", "getCustomFields", "kernel.event_subscriber", "Criteria", "custom_linked_product", "entity selection custom field", "resolve custom field id", "entity extension", "product subscriber"]
summary: Resolve the ID stored by an entity-selection custom field to a full entity via a product.loaded subscriber, product.repository and addExtension.
lastBuilt: 2026-10-21
---
## What it is

An entity-selection custom field (e.g. `custom_linked_product` on products, typed as a product) stores only the `id` of the selected entity. This guide resolves that id to the real entity with an event subscriber that runs whenever products are loaded and attaches the result as an entity extension.

## When to use

You configured a custom field of type entity selection in the Administration and need the linked entity object (not just its id) wherever the owning entity is loaded.

## Key steps / config

1. Create `Swag\BasicExample\Subscriber\ProductSubscriber` implementing `Symfony\Component\EventDispatcher\EventSubscriberInterface`, subscribing `ProductEvents::PRODUCT_LOADED_EVENT` (`product.loaded`) to `onProductLoaded(EntityLoadedEvent $event)`.
2. Register it in `<plugin root>/src/Resources/config/services.php`, injecting the product repository:

```php
$services->set(ProductSubscriber::class)
    ->args([service('product.repository')])
    ->tag('kernel.event_subscriber');
```

3. Constructor takes `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository $productRepository`.
4. In `onProductLoaded`: collect the custom-field values of all `$event->getEntities()` (`$entity->getCustomFields()['<field>'] ?? null`), `array_filter` them, then load all linked products in one call: `$this->productRepository->search(new Criteria($ids), $event->getContext())`. One search for the whole batch instead of one per product.
5. Loop the loaded entities again; for each with a set id, attach the result: `$entity->addExtension('my_custom_demo_product', $products->get($id))`.

## Essential identifiers

- `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent` (`getEntities()`, `getContext()`)
- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository::search()`
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- `product.repository`, `kernel.event_subscriber`
- `Entity::addExtension()`, `getCustomFields()` / `setCustomFields()`

## Gotchas

- The source is inconsistent: the intro uses the field name `custom_linked_product`, the final implementation reads `custom_demo_test`. Use your actual custom field's technical name in both places.
- `addExtension()` is typed `addExtension(string $name, Struct $extension)`; `$products->get($id)` returns null when the linked product no longer exists, which would throw a `TypeError`. Check the result before adding it.
- `getCustomFields()` returns `?array`; the intermediate loop in the source (`foreach ($customFields ...)`) fails on products without custom fields.
- `Criteria` drops empty ids itself (`array_filter`), but if no product has the field set the id list is empty; skip the search in that case.
- The subscriber runs on every product load, so keep it to one repository call per event.

## Code check (6.7.15.1)
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — constant with value `product.loaded` — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `EntityLoadedEvent::getEntities()` — returns the loaded entity array — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:42
- confirmed `EntityLoadedEvent::getContext()` — returns the `Context` passed to the repository — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:52
- confirmed `ExtendableTrait::addExtension()` — signature `(string $name, Struct $extension)`, not nullable — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- confirmed `EntityCustomFieldsTrait::getCustomFields()` — returns `?array` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:21
- confirmed `EntityCustomFieldsTrait::setCustomFields()` — accepts `?array` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:82
- confirmed `EntityRepository::search()` — `(Criteria $criteria, Context $context)` — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:66
- confirmed `Criteria::__construct()` — accepts `?array $ids` and filters empty values — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:133
- confirmed `product.repository` — service id used by core service definitions — vendor/shopware/core/Content/DependencyInjection/cms.php:101
- unverified `kernel.event_subscriber` — Symfony tag, vendor/symfony out of scope
