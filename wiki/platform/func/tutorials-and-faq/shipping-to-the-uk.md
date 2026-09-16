---
id: platform/func/tutorials-and-faq/shipping-to-the-uk.md
title: Shipping To The Uk
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/shipping-to-the-uk"
sourceHash: "b52190a5bb60b4ba496e06d0daec4e1d0055ec57d20739d89c7ecbb318e86180"
revision:
  current: true
  range: "current"
  swMax: null
  swMin: null
keywords: ["uk shipping", "brexit", "export delivery", "vat", "customs", "cn22", "cn23", "cp71", "eori", "import duty", "hmrc", "customs declaration", "royal mail"]
summary: "Explains VAT, customs duty and customs-declaration rules (CN22/CN23/EORI) for shipping goods from the EU to the UK."
lastBuilt: "2026-09-15"
---

## What it is

An overview of the VAT, customs-duty and customs-declaration rules a merchant must handle
when shipping goods from the EU to the UK, including thresholds by goods value and the
paperwork required per shipment.

## When to use

When a store needs to ship products to UK customers, either directly, via a UK
fulfilment centre, or through a marketplace (e.g. Amazon, eBay), and must determine VAT
liability and required customs forms.

## Key steps / config

- **Direct EU-to-UK delivery**: an export delivery, always VAT-exempt regardless of
  whether the customer is a consumer or business.
- **Goods routed via a UK fulfilment centre**: from an EU perspective, a non-taxable
  transaction not recorded for VAT purposes.
- **Value up to £135**: direct EU-to-UK deliveries are exempt from customs duty and
  import VAT.
- **Value over £135**: VAT arises at import, not at point of sale; registering for VAT
  lets a seller declare and pay import VAT collectively the following month instead of
  at import time; otherwise a logistics provider or customs agent can declare and pay it.
- **Marketplace sales (Amazon, eBay) up to £135**: UK VAT law treats the marketplace as
  making a taxable supply to the end consumer, so the trader has no UK VAT registration
  obligation for this transaction type alone.
- **Marketplace sales over £135**: same import-VAT rule as direct sales over £135
  applies.
- **Customs clearance**: every UK-bound package is checked against the UK's list of
  banned/restricted goods; listed items are seized.
- **VAT and duties on receipt**: for gifts over £39 and goods over £135, Royal Mail may
  collect VAT/duties on behalf of HMRC before delivery; documents and letters are
  usually exempt. VAT applies to all online purchases, gifts over £39, and alcohol,
  tobacco or perfume regardless of value.
- **Customs declarations**: required for any parcel leaving the EU. Use a
  **CN22** form for packages up to 2 kg and up to €425 in value; use **CN23** plus a
  **CP71** dispatch form for packages from 2-20 kg or €425+. Inaccurate declarations can
  incur a fine of up to 100% of the goods' value.
- **CN22 mandatory fields**: Description, Value, Country of origin, Total Value, Date
  and signature.
- **CN23/CP71 fields**: Description, Quantity, Weight, Total weight, Value, HS tariff
  number, Country of origin, Postal charges/fees, Category, Comments, Licence,
  Certificate, Invoice, Signature.
- **EORI number**: required since 1 January 2021 to move goods between the EU and UK;
  it must start with `GB`; shipments to Northern Ireland require a separate number.

## Essential identifiers

- CN22 customs declaration (packages ≤ 2 kg, value ≤ €425)
- CN23 customs declaration + CP71 dispatch form (packages 2-20 kg, value ≥ €425)
- EORI (Economic Operators Registration and Identification) number

## Gotchas

- CN22/CN23 declarations are read by scanners; a description like "spare parts" or
  "samples" is not permitted — a specific description (e.g. "men's cotton shirts") is
  required.
- An EORI number must start with `GB` for UK shipments; Northern Ireland shipments need
  a separate number.
- This is general guidance, not legal advice — the source explicitly recommends checking
  local authorities for current export law, since rules can change.
