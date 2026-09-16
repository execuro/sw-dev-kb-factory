---
id: platform/dev/6.7/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md
title: 'Fetching data from "entity selection" custom field'
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.html
sourceHash: beed0cd38b139dbe3893e2c6f7be5d6a4936b49e
codeCheckedAgainst: "6.7.13.0"
keywords: ["entity selection", "custom field", "custom_linked_product", "ProductSubscriber", "ProductEvents::PRODUCT_LOADED_EVENT", "EntityLoadedEvent", "product.repository", "EntityRepository", "Criteria", "addExtension", "getCustomFields", "resolve custom field id", "entity extension"]
summary: Resolve the entity ID stored by an entity-selection custom field into an entity via a product.loaded subscriber, one batched repository search, addExtension.
lastBuilt: 2026-09-15
---
## What it is

An entity-selection custom field (set up in the Administration) stores only the `id` of the selected entity in the custom field JSON. This page shows how to turn that ID into a loaded entity object by subscribing to the product loaded event, loading all referenced entities with one repository search, and attaching them to each product as an entity extension.

## When to use

You have a custom field such as `custom_linked_product` (type: product) assigned to products, and Storefront/API code needs the linked product entity rather than its raw ID.

## Key steps / config

1. Create `Swag\BasicExample\Subscriber\ProductSubscriber` as a Symfony event subscriber whose `getSubscribedEvents()` maps `ProductEvents::PRODUCT_LOADED_EVENT` (value `product.loaded`) to a handler `onProductLoaded(EntityLoadedEvent $event): void`.
2. Register it in `src/Resources/config/services.php`, injecting the product repository and tagging it:

```php
$services->set(ProductSubscriber::class)
    ->args([service('product.repository')])
    ->tag('kernel.event_subscriber');
```

3. Accept `EntityRepository $productRepository` in the constructor.
4. In `onProductLoaded`, collect the custom-field IDs from `$event->getEntities()` (an array of entities), drop empty values, search once, then attach results:

```php
$ids = array_filter(array_map(
    fn (ProductEntity $e) => $e->getCustomFields()['custom_linked_product'] ?? null,
    $event->getEntities()
));
$products = $this->productRepository->search(new Criteria($ids), $event->getContext())->getEntities();
foreach ($event->getEntities() as $entity) {
    $id = $entity->getCustomFields()['custom_linked_product'] ?? null;
    if ($id && $linked = $products->get($id)) {
        $entity->addExtension('my_custom_demo_product', $linked);
    }
}
```

Loading all IDs in one `Criteria` avoids one query per product (the source calls this a big performance boost).

## Essential identifiers

- `Shopware\Core\Content\Product\ProductEvents` / `ProductEvents::PRODUCT_LOADED_EVENT`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent` (`getEntities()`, `getContext()`)
- `Shopware\Core\Framework\DataAbstractionLayer\EntityRepository` (`search()`)
- `Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria`
- `Shopware\Core\Content\Product\ProductEntity` (`getCustomFields()`, `addExtension()`)
- Service id `product.repository`, tag `kernel.event_subscriber`

## Gotchas

- The source's final example reads the key `custom_demo_test` while the prose uses `custom_linked_product` — use your actual custom field name consistently.
- The source calls `$products->get($id)` directly on the search result; in 6.7.13.0 `EntitySearchResult::get()` is deprecated (removed in 6.8, use `getEntities()->get()`).
- `addExtension()` requires a `Struct` argument, not `null`; the source passes the lookup result unchecked, so an ID pointing at a missing product fails. Guard the value as above.
- An intermediate source snippet loops over custom fields and calls `setCustomFields()` without changing anything; only the final batched version is needed.

## Code check (6.7.13.0)
- confirmed `ProductEvents::PRODUCT_LOADED_EVENT` — constant with value product.loaded — vendor/shopware/core/Content/Product/ProductEvents.php:35
- confirmed `EntityLoadedEvent::getEntities()` — returns an array of loaded entities — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:42
- confirmed `EntityLoadedEvent::getContext()` — provides the Context for the follow-up search — vendor/shopware/core/Framework/DataAbstractionLayer/Event/EntityLoadedEvent.php:52
- confirmed `EntityRepository::search()` — takes Criteria and Context — vendor/shopware/core/Framework/DataAbstractionLayer/EntityRepository.php:62
- confirmed `Criteria::__construct()` — accepts an optional array of IDs — vendor/shopware/core/Framework/DataAbstractionLayer/Search/Criteria.php:129
- corrected `EntitySearchResult::getEntities()` — docs: call get() directly on the search result — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:109
- deprecated `EntitySearchResult::get()` — removed in v6.8.0, use getEntities()->get() — vendor/shopware/core/Framework/DataAbstractionLayer/Search/EntitySearchResult.php:254
- confirmed `EntityCustomFieldsTrait::getCustomFields()` — returns nullable array — vendor/shopware/core/Framework/DataAbstractionLayer/EntityCustomFieldsTrait.php:21
- confirmed `ExtendableTrait::addExtension()` — signature requires a Struct argument — vendor/shopware/core/Framework/Struct/ExtendableTrait.php:21
- unverified `EventSubscriberInterface` — vendor/symfony, out of scope
