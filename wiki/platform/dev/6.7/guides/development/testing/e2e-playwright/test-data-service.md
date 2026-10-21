---
id: platform/dev/6.7/guides/development/testing/e2e-playwright/test-data-service.md
title: Test Data Service
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/development/testing/e2e-playwright/test-data-service.html
sourceHash: 3dff5f638afb64b9d2531b5278c570ab33b6f88b
codeCheckedAgainst: "6.7.15.1"
keywords: ["TestDataService", "createBasicProduct", "addCreatedRecord", "cleanUp", "setCleanUp", "priorityDeleteOperations", "AdminApiContext", "CustomTestDataService", "test data", "fixtures", "test cleanup", "acceptance test suite"]
summary: ATS TestDataService - create*/assign*/get* helpers, automatic cleanup via addCreatedRecord, and extending it as a custom Playwright fixture.
lastBuilt: 2026-10-21
---
## What it is

`TestDataService` is the Acceptance Test Suite (ATS) service that creates, links, fetches and afterwards deletes Shopware test data through the Admin API, keeping acceptance/API tests isolated. Method docs live in the ATS class `src/services/TestDataService.ts`.

## When to use

- A test needs common entities: products, customers, orders, categories, media, promotions, rules, payment/shipping methods.
- You need helper lookups (`getCurrency()`, `getShippingMethod()`) or relations (product to category).
- Extend it when a project adds new entity types, needs specialised creation logic, reusable setups, or special cleanup.

## Key steps / config

### Common methods

- `create*`: `createBasicProduct(): Promise<Product>`, `createVariantProducts(parentProduct, propertyGroups)`, `createCustomer()`, `createCustomerGroup()`, `createOrder(lineItems: SimpleLineItem[], customer)`, `createCategory()`, `createColorPropertyGroup()`, `createBasicPaymentMethod()`, `createBasicShippingMethod()`
- `assign*`: `assignProductCategory(productId, categoryIds[])`, `assignProductManufacturer(productId, manufacturerId)`, `assignProductMedia(productId, mediaId)`
- `get*`: `getCountry(iso2)`, `getCurrency(isoCode)`, `getCustomerGroups()`, `getPaymentMethod(name = 'Invoice')`

```typescript
const product = await TestDataService.createBasicProduct();
```

### Writing a new method

1. Decide the pattern: `create*`, `assign*` or `get*`.
2. Implement it with `AdminApiContext` against the Admin API.
3. Naming: `createBasic*` for default setups, `create*With*` for variations (e.g. `createProductWithImage`), `assign*`, `get*`.
4. Always declare a return type (`Promise<...>`).
5. Register cleanup: `this.addCreatedRecord('rule', rule.id);` — the first argument is the entity name.
6. Test it in `/tests/TestDataService.spec.ts`.

### Cleanup

Each `create*` call registers the entity via `addCreatedRecord()`; the queue is processed at the end of each test. Deletion runs `priorityDeleteOperations` first (dependent entities such as orders, customers), then system config changes are reset, then `deleteOperations`. Add entities to the `priorityDeleteOperations` array when they must be deleted first. Skip cleanup with `TestDataService.setCleanUp(false)`.

### Extending in an external project

Subclass the service:

```typescript
export class CustomTestDataService extends TestDataService {
    async createCustomCustomerGroup(data: Partial<CustomerGroup>) {
        const response = await this.adminApi.post('customer-group?_response=true', { data: { /* ... */ } });
        const { data: createdGroup } = await response.json();
        this.addCreatedRecord('customer-group', createdGroup.id);
        return createdGroup;
    }
}
```

Then override the fixture (e.g. in `AcceptanceTest.ts`):

```typescript
export const test = base.extend<FixtureTypes & CustomTestDataServiceType>({
    TestDataService: async ({ AdminApiContext, DefaultSalesChannel }, use) => {
        const service = new CustomTestDataService(AdminApiContext, DefaultSalesChannel.salesChannel);
        await use(service);
        await service.cleanUp();
    },
});
```

All tests using `TestDataService` then get the base plus your methods, with cleanup intact.

## Essential identifiers

- `TestDataService`, `CustomTestDataService`, `AdminApiContext`, `DefaultSalesChannel`
- `addCreatedRecord()`, `cleanUp()`, `setCleanUp(false)`
- `priorityDeleteOperations`, `deleteOperations`
- `customer-group?_response=true`

## Gotchas

- The prose calls the method `cleanup()`, but the fixture example calls `service.cleanUp()`.
- Admin API paths use hyphenated entity names (`customer-group` for `customer_group`); `_response` makes write calls return the entity body.

## Code check (6.7.15.1)
- unverified `TestDataService` — ATS class in an external npm package, outside vendor/shopware
- unverified `TestDataService::setCleanUp()` — ATS API, out of scope
- unverified `priorityDeleteOperations` — ATS property, out of scope
- confirmed `customer_group` — entity behind the `customer-group` Admin API resource — vendor/shopware/core/Checkout/Customer/Aggregate/CustomerGroup/CustomerGroupDefinition.php:30
- confirmed `str_replace('_', '-'` — Admin API route names hyphenate entity names — vendor/shopware/core/Framework/Api/Route/ApiRouteLoader.php:69
- confirmed `_response` — write requests return content only when this query param is present — vendor/shopware/core/Framework/Api/Controller/ApiController.php:637
- confirmed `rule` — entity name used in `addCreatedRecord('rule', ...)` — vendor/shopware/core/Content/Rule/RuleDefinition.php:52
- confirmed `product` — entity name used in `addCreatedRecord('product', ...)` — vendor/shopware/core/Content/Product/ProductDefinition.php:85
- confirmed `order` — priority-deleted dependent entity — vendor/shopware/core/Checkout/Order/OrderDefinition.php:58
- confirmed `system_config` — system config entries reset by cleanup — vendor/shopware/core/System/SystemConfig/SystemConfigDefinition.php:24
