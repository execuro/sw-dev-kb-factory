---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/test-data-service.md
title: Test Data Service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test-data-service.html
sourceHash: 3dff5f638afb64b9d2531b5278c570ab33b6f88b
codeCheckedAgainst: "6.7.13.0"
keywords: ["TestDataService", "@shopware-ag/acceptance-test-suite", "addCreatedRecord", "setCleanUp", "cleanUp", "priorityDeleteOperations", "createBasicProduct", "AdminApiContext", "playwright fixture", "test data", "acceptance tests", "e2e cleanup"]
summary: TestDataService of the Shopware Playwright acceptance test suite - create*/assign*/get* helpers, automatic cleanup, extending it via a custom fixture.
lastBuilt: 2026-09-15
---
## What it is

`TestDataService` is a service in the Shopware Acceptance Test Suite (`@shopware-ag/acceptance-test-suite`, TypeScript/Playwright) that creates, assigns and fetches test data through the Admin API and deletes everything it created after each test. Method docs live in the suite's `src/services/TestDataService.ts` (https://github.com/shopware/acceptance-test-suite/blob/trunk/src/services/TestDataService.ts).

## When to use

- A Playwright acceptance/API test needs a basic product, customer, order, category, media, promotion, rule, payment or shipping method.
- You need to link entities (product to category/manufacturer/media) or fetch existing ones (currency, country, payment method).
- A project/plugin adds new entity types or special creation/cleanup logic that should be reused across tests — extend the service.

## Key steps / config

Use in a test (injected as a Playwright fixture):

```typescript
test('...', async ({ TestDataService }) => {
    const product = await TestDataService.createBasicProduct();
    const customer = await TestDataService.createCustomer();
});
```

Common methods (more exist; use IDE auto-completion):
- `create*`: `createBasicProduct(): Promise<Product>`, `createVariantProducts(parentProduct, propertyGroups)`, `createCustomer()`, `createCustomerGroup()`, `createOrder(lineItems: SimpleLineItem[], customer)`, `createCategory()`, `createColorPropertyGroup()`, `createBasicPaymentMethod()`, `createBasicShippingMethod()`
- `assign*`: `assignProductCategory(productId, categoryIds[])`, `assignProductManufacturer(productId, manufacturerId)`, `assignProductMedia(productId, mediaId)`
- `get*`: `getCountry(iso2)`, `getCurrency(isoCode)`, `getCustomerGroups()`, `getPaymentMethod(name = 'Invoice')`

Writing a new method: decide create/assign/get; call the Admin API via `AdminApiContext`; name it `createBasic*` (defaults), `create*With*` (variations), `assign*`, `get*`; always declare a `Promise<...>` return type; register the entity for cleanup with `this.addCreatedRecord('<entity>', id)`; add a test in `/tests/TestDataService.spec.ts`.

Extending in an external project:

```typescript
import { TestDataService } from '@shopware-ag/acceptance-test-suite';
export class CustomTestDataService extends TestDataService {
    async createCustomCustomerGroup(data: Partial<CustomerGroup>) {
        const response = await this.adminApi.post('customer-group?_response=true', { data: { /* ... */ } });
        const { data: createdGroup } = await response.json();
        this.addCreatedRecord('customer-group', createdGroup.id);
        return createdGroup;
    }
}
```

Override the fixture (e.g. in `AcceptanceTest.ts`):

```typescript
export const test = base.extend<FixtureTypes & CustomTestDataServiceType>({
    TestDataService: async ({ AdminApiContext, DefaultSalesChannel }, use) => {
        const service = new CustomTestDataService(AdminApiContext, DefaultSalesChannel.salesChannel);
        await use(service);
        await service.cleanUp();
    },
});
```

## Essential identifiers

- `TestDataService`, `@shopware-ag/acceptance-test-suite`
- `addCreatedRecord()`, `cleanUp()`, `setCleanUp(false)`
- `priorityDeleteOperations`, `deleteOperations`
- `AdminApiContext`, `DefaultSalesChannel`

## Gotchas

- Cleanup runs at the end of each test: records in `priorityDeleteOperations` (entities with dependents such as orders, customers) are deleted first, then modified system config is reset, then `deleteOperations`. To add an entity to the priority list, add it to the `priorityDeleteOperations` array in the class.
- Entities created without `addCreatedRecord()` are not cleaned up.
- `TestDataService.setCleanUp(false)` skips cleanup (debugging, performance tests).
- The source text calls the cleanup method both `cleanup()` and `cleanUp()`; the fixture example uses `service.cleanUp()`.
- Entity names passed to the Admin API and `addCreatedRecord` are kebab-case (`customer-group`), derived from core entity names like `customer_group`.

## Code check (6.7.13.0)
- unverified `TestDataService` — lives in the external npm package @shopware-ag/acceptance-test-suite, out of scope
- unverified `addCreatedRecord()` — acceptance-test-suite package, out of scope
- unverified `priorityDeleteOperations` — acceptance-test-suite package, out of scope
- unverified `setCleanUp()` — acceptance-test-suite package, out of scope
- confirmed `customer_group` — core entity behind the `customer-group` Admin API route — vendor/shopware/core/Checkout/Customer/Aggregate/CustomerGroup/CustomerGroupDefinition.php:27
- confirmed `_response` — Admin API write returns the entity only when the `_response` query parameter is present — vendor/shopware/core/Framework/Api/Controller/ApiController.php:637
- confirmed `product` — entity created by `createBasicProduct` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `rule` — entity registered in the `createBasicRule` cleanup example — vendor/shopware/core/Content/Rule/RuleDefinition.php:49
- confirmed `shipping_method` — entity created by `createBasicShippingMethod` — vendor/shopware/core/Checkout/Shipping/ShippingMethodDefinition.php:41
