---
id: platform/func/tutorials-and-faq/payment-methods-for-several-countries.md
title: "Payment Methods For Several Countries"
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/tutorials-and-faq/payment-methods-for-several-countries"
sourceHash: "eb490f32b6ac46c8f10cf8c16909150fc1e0100383fae908dda640a7cf0c4e86"
revision:
  current: true
  range: "current"
  swMin: null
  swMax: null
keywords: ["rule builder", "payment methods", "billing country", "Is one of", "Is none of", "availability rule", "geoblocking", "country-specific payment", "invoice payment method", "multi-country shop"]
summary: "How-to: use the Rule Builder's billing country condition and Availability rule field to enable or block a payment method per country."
lastBuilt: "2026-09-15"
---
## What it is

This how-to explains how to offer or block a payment method per country when multiple countries are activated in the shop, using the Rule Builder instead of configuring each country/payment-method combination individually.

## When to use

Use this when you need a payment method (e.g. invoice) available only for specific billing countries, or available everywhere except specific billing countries.

## Key steps / config

- Prerequisite: the payment methods and countries involved must already be created and active.
- Step 1 — Create a rule in the Rule Builder:
  - Example: payment method for UK only — Name "Invoice only for UK", Priority 1 (adjust if prioritizing among several rules), Type (optional) "Payment type", Condition: billing country | Is one of | "United Kingdom".
  - Example: payment method for all countries except UK — same Name/Priority/Type, Condition: billing country | Is none of | "United Kingdom".
- Step 2 — Store the rule in the payment method: open the payment method and set the newly created rule as its **Availability rule** (this works for any payment method, not just invoice).
- Step 3 — Verify in the storefront: with "Is one of | United Kingdom" the payment method only appears for UK billing addresses; with "Is none of | United Kingdom" it appears for every billing country except the UK.

## Essential identifiers

- Rule Builder
- Condition: billing country
- Operators: Is one of / Is none of
- Availability rule (payment method field)

## Gotchas

Because of EU-wide geoblocking regulation, it's recommended to consult a legal advisor and have your project checked once if you're in doubt about compliance for sales within the EU before restricting payment method availability by country.
