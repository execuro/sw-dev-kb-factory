---
id: platform/dev/6.6/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.md
title: Fetching data from "entity selection" custom field
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/custom-field/fetching-data-from-entity-selection.html
sourceHash: 6876c300aa68e065d7d1a94336e12cac5084ecb5
keywords: ["ProductSubscriber", "ProductEvents::PRODUCT_LOADED_EVENT", "EntityLoadedEvent", "getCustomFields", "addExtension", "custom_linked_product", "entity selection", "product.repository", "kernel.event_subscriber", "EntityRepository"]
summary: "Resolve an entity-selection custom field's stored ID into a full entity by subscribing to ProductEvents::PRODUCT_LOADED_EVENT."
lastBuilt: "2026-09-15"
---
## What it is

Guide for resolving the ID stored by an "entity selection" custom field (here `custom_linked_product`) into the actual linked entity when the owning product is loaded.

## When to use

When a custom field of type entity selection only stores the selected entity's `id`, and code needs access to the full linked entity object.

## Key steps / config

1. Create a subscriber for `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT`:

```php
class ProductSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [ProductEvents::PRODUCT_LOADED_EVENT => 'onProductLoaded'];
    }
}
```

2. Register it in `services.xml` with `<tag name="kernel.event_subscriber"/>`.
3. In `onProductLoaded(EntityLoadedEvent $event)`, loop `$event->getEntities()`, read each product's custom field value via `getCustomFields()`, collect the IDs, then batch-load them in one request:

```php
$ids = array_map(fn (ProductEntity $entity) => $entity->getCustomFields()['custom_demo_test'] ?? null, $event->getEntities());
$ids = array_filter($ids);
$products = $this->productRepository->search(new Criteria($ids), $event->getContext());
```

4. Attach the resolved entity back to the loaded product: `$entity->addExtension('my_custom_demo_product', $products->get($id));`
5. Inject the `product.repository` service into the subscriber via `services.xml` to perform the lookup.

## Essential identifiers

- `Shopware\Core\Content\Product\ProductEvents::PRODUCT_LOADED_EVENT`
- `Shopware\Core\Framework\DataAbstractionLayer\Event\EntityLoadedEvent`
- `EntityLoadedEvent::getEntities()`, `ProductEntity::getCustomFields()`
- `EntityRepository::search()`, `EntityCollection::get()`, `addExtension()`
- `product.repository` service id

## Gotchas

Loading all linked products in a single batched `search()` call (rather than one request per product) is called out explicitly as a significant performance improvement.
