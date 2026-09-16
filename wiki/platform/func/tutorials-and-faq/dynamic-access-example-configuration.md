---
id: platform/func/tutorials-and-faq/dynamic-access-example-configuration.md
title: Dynamic Access Example Configuration
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/dynamic-access-example-configuration
sourceHash: 99cfb4983889a2462ca9270b419a18c7d57f9e75438a0712f4693ba334db1f7e
revision: {current: true, range: "current", swMax: null, swMin: null}
keywords: ["Dynamic Access", "Rule Builder", "Billing country", "category visibility", "product visibility", "customer segmentation", "Count of orders", "visibility & structure", "6.4.6.0", "logged-in customer rules", "VIP category"]
summary: "Two worked examples of using the Dynamic Access extension with Rule Builder to restrict category/product visibility by billing country or order count."
lastBuilt: "2026-09-15"
---
## What it is
Two example configurations showing how the Dynamic Access extension, combined with the Rule Builder, hides or shows categories and products based on customer rules.

## When to use
When you need to restrict store content (categories, products) to specific customer segments, such as by country or purchase history, available since Shopware 6.4.6.0.

## Key steps / config
Example 1 — restrict categories/products by billing country:
1. Create rules under **Settings > Rule Builder** (e.g. "Customers from Germany") using the condition **Billing country > Is one of**.
2. Create categories under **Catalogues > Categories** (e.g. "Specialties from Germany").
3. On each category's **General** tab, set the **Dynamic Access** field to the rules that should grant access (e.g. assign "Customers from Austria" and "Customers from Switzerland" rules to the "Specialties from Germany" category so only those customers see it).
4. To also restrict search visibility, assign the same **Dynamic Access** rules to the individual products under **Catalogues > Products > General > Visibility & structure > Dynamic Access** — otherwise products remain findable via search regardless of category rules.
5. A category with no Dynamic Access rule assigned remains visible to non-logged-in customers.

Example 2 — restrict by order count/customer group:
1. Create a rule in **Rule Builder**, e.g. condition **Count of orders > Is greater than/equal to > 100**.
2. Assign this rule to a category or product's **Dynamic Access** field as in Example 1, e.g. to build a VIP category visible only to customers meeting the condition.

## Essential identifiers
Admin fields: category **General > Dynamic Access**, product **General > Visibility & structure > Dynamic Access**, Rule Builder conditions **Billing country > Is one of** and **Count of orders > Is greater than/equal to**.

## Gotchas
Assigning a Dynamic Access rule only to a category does not restrict search results — the same rule must also be assigned to each product for full visibility control.

## Version notes
Dynamic Access, used with the Rule Builder, is available from Shopware version 6.4.6.0.
