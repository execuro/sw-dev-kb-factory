---
id: platform/func/extensions/error-messages.md
title: Error Messages
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/error-messages
sourceHash: 18167c81de473c468a607624bd308af36d274a24b931c1a7b1a0f49ba718436c
revision:
  current: true
  range: "6.0.0"
  swMax: null
  swMin: null
keywords: ["Plugin Manager", "error messages", "Internal Error", "Unauthorized", "Wrong Password", "Account is banned", "Email not verified", "No license", "Shop domain unknown", "Insufficient balance", "Payment failed"]
summary: "Reference of Plugin Manager / plugin-installation error messages, their causes, and how to resolve or escalate each one."
lastBuilt: "2026-09-15"
---

## What it is

A reference list of error messages the Shopware Plugin Manager (or plugin installation/licensing flow) can show, with their causes and recommended remediation.

## When to use

When troubleshooting an error shown while opening the Plugin Manager, installing/activating a plugin, or licensing/purchasing an extension.

## Key steps / config

- Authentication/account errors (`Unauthorized`, `Wrong Password`, `Wrong Shopware ID`, `Account is banned`, `Email not verified`, `Login data not complete`, `Master data missing`): re-check or reset the Shopware ID credentials via the account recovery page, verify the account email, or complete account master data.
- Request/transmission errors (`Request data invalid`, `Request parameter language not given`, `Request parameter domain not given`, `Request parameter Shopware version not given`, `Request parameter future Shopware version not given`, `Request parameter market not given`, `Request parameter category not given`, `Deserialization failure`, `Invalid order position`): indicate malformed or incomplete data sent to Shopware — verify the submitted fields; on a headless sales channel this points to a misconfigured API integration.
- Version/plugin recognition errors (`Shopware version not supported`, `Shopware version unknown`, `Request plugin unknown`, `Version not found`): the running Shopware version or the plugin itself is not recognized/supported.
- Domain/licensing errors (`Download not allowed for domain`, `Shop domain unknown`, `Wrong Shopware generation of licensing host`, `No license`, `Shop domain not verified`, `Shop domain verification failed`, `Invalid shop domain format`, `Parent shop not found`, `Missing company shop relation`, `Shop has no company`, `Company banned`, `License shop can not be staging`, `Invalid company`): the shop domain, licensing host, or company record in the Shopware account does not match or is incomplete — check the licensing host in settings against the domain registered in the Shopware account.
- Order/payment errors (`Insufficient balance`, `Not owning booking shop`, `Not owning license shop`, `Order number invalid`, `Payment failed`, `Multiple license`, `Invalid order`): check the account balance, order ownership, or retry the order via the Shopware store.
- General/system errors (`Internal Error`, `Forbidden`, `Incorrect plugin data`, `Error getting license list`): retry the action, reload the Administration, or open a support ticket if an active maintenance contract exists.
- Extension-license lifecycle errors (`Test extension license cannot be cancelled`, `Extension license is already cancelled`, `Extension license must be rent or support`, `Reactivation of extension license not allowed`): describe cancellation/reactivation constraints on rental vs. support licenses.

## Essential identifiers

`Internal Error`, `Unauthorized`, `Wrong Password`, `Wrong Shopware ID`, `Account is banned`, `Email not verified`, `Shop domain unknown`, `No license`, `Insufficient balance`, `Payment failed`, `Multiple license`

## Gotchas

- Many of these errors share the same remediation (reset the Shopware ID password, or contact Shopware support/forum) — match the exact message text against this list before escalating.
- `Company banned` and `Payment failed` direct the merchant to contact Shopware's financial services team directly rather than the general support forum.
