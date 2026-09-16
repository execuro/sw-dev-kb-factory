---
id: platform/func/settings/system/sharing-data.md
title: Sharing Data
docType: functional
version: "6.5"
versions:
  - "6.5"
  - "6.6"
  - "6.7"
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/system/sharing-data
sourceHash: dd5a6323cc0a5dac81588d4ba32f353f025e3524d0b1ec22123dd9e6261f6ca6
revision:
  current: true
  range: "6.5.7.0 - 6.7.8.2"
  swMin: "6.5.7.0"
  swMax: "6.7.8.2"
keywords: ["sharing data", "privacy settings", "consent workflow", "store data", "usage data", "GDPR", "anonymized data", "share store data", "share usage data", "GMV tracking", "Fair Usage Policy", "Settings > System > Privacy"]
summary: "GDPR-compliant consent workflow letting admins independently enable/disable anonymized store data and usage data sharing."
lastBuilt: "2026-09-15"
---

## What it is

Sharing Data is the consent workflow for GDPR-compliant sharing of two independent data categories from the Administration: anonymized store data and admin usage data, used to improve Shopware's analytics and features.

## When to use

Use it to grant, review, or revoke consent for anonymized data sharing, or to understand how consent relates to mandatory GMV (Gross Merchandise Volume) reporting.

## Key steps / config

- On first login, a privacy-settings modal appears with two independently toggleable options:
  - **"Share store data (anonymous)"**: anonymized usage data (e.g. orders, diagnostic data, general store data).
  - **"Share Usage data"**: data about admin usage behavior (features used, navigation), used to improve usability.
- Modal actions: "Reject all", "Accept all", or enable one option and click "Save selection".
- If only "Usage data" is shown, either shop-data consent was already given by another admin, or the current user lacks permission to manage shop-data consent.
- Change later: store data via **Settings > System > Privacy** ("Share store data (anonymous)" toggle); usage data via the user's own profile > Privacy settings ("Share Usage data" toggle).

## Essential identifiers

- Menu path: **Settings > System > Privacy**
- Toggles: "Share store data (anonymous)", "Share Usage data"

## Gotchas

GMV (Gross Merchandise Volume) tracking is independent of the consent dialog — it is a mandatory part of using Shopware under the Fair Usage Policy and applies to both Community Edition and paid plans; the Community Edition requires an upgrade once GMV reaches €1 million. Store data is fully anonymized; usage data does not store entered content or sensitive information.
