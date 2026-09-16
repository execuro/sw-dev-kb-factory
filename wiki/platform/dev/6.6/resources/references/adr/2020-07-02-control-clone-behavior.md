---
id: platform/dev/6.6/resources/references/adr/2020-07-02-control-clone-behavior.md
title: Get control of association clone behavior as developer
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/resources/references/adr/2020-07-02-control-clone-behavior.html
sourceHash: 9f1c20f4babce9111730e15e4d4f6de37cfbd5f6
keywords: ["cascadedelete", "clone behavior", "entity cloning", "association", "clonerelevant", "onetomanyassociationfield", "data abstraction layer", "adr", "product associations"]
summary: "ADR on controlling entity clone behavior per association via the CascadeDelete flag's cloneRelevant parameter (Shopware 6.3+)."
lastBuilt: 2026-09-15
---
## What it is

This ADR documents how developers get control over entity clone behavior for associations, via the `Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete` flag.

## When to use

Consult when defining an entity association and deciding whether it should be considered or skipped when the parent entity is cloned.

## Key steps / config

- Associations flagged with `CascadeDelete` are considered during the entity clone process.
- The flag constructor accepts an optional parameter to disable this behavior:
  ```php
  (new OneToManyAssociationField('searchKeywords', ProductSearchKeywordDefinition::class, 'product_id'))
      ->addFlags(new CascadeDelete(false)),
  ```
- At the time of the decision the flag was added to these associations:
  - `product.productReviews` — already overwritten by the administration
  - `product.searchKeywords` — indexed by the product indexer, so it can be skipped during cloning
  - `product.categoriesRo` — indexed by the product indexer, so it can be skipped during cloning
- After the Shopware 6.3 release, developers control this behavior by setting `\Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete::$cloneRelevant` to `false`.

## Essential identifiers

`Shopware\Core\Framework\DataAbstractionLayer\Field\Flag\CascadeDelete`, `CascadeDelete::$cloneRelevant`, `OneToManyAssociationField`

## Version notes

Developer control of `$cloneRelevant` is available after the Shopware 6.3 release, per the ADR's Consequences section.
